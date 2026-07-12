#!/usr/bin/env node

import { createHash, generateKeyPairSync } from "node:crypto";
import { chmod, mkdir, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

function parseArgs(argv) {
  const defaultDirectory = join(homedir(), ".smc-backup-keys");
  const options = {
    bits: 4096,
    privatePath: join(defaultDirectory, "smc-backup-private.pem"),
    publicPath: join(defaultDirectory, "smc-backup-public.json")
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--bits") options.bits = Number(argv[++index]);
    else if (value === "--private") options.privatePath = resolve(argv[++index] || "");
    else if (value === "--public") options.publicPath = resolve(argv[++index] || "");
    else if (value === "--out-dir") {
      const directory = resolve(argv[++index] || "");
      options.privatePath = join(directory, "smc-backup-private.pem");
      options.publicPath = join(directory, "smc-backup-public.json");
    } else if (value === "--help" || value === "-h") options.help = true;
    else throw new Error(`未知参数：${value}`);
  }
  if (![3072, 4096].includes(options.bits)) throw new Error("--bits 只能是 3072 或 4096");
  return options;
}

export async function promptHidden(label) {
  if (!process.stdin.isTTY || !process.stdout.isTTY || typeof process.stdin.setRawMode !== "function") {
    throw new Error("此命令必须在可交互终端中运行，口令不会从环境变量或命令行读取");
  }
  process.stdout.write(label);
  process.stdin.setEncoding("utf8");
  process.stdin.resume();
  process.stdin.setRawMode(true);
  let value = "";
  let escapeState = 0;
  try {
    return await new Promise((resolvePromise, rejectPromise) => {
      const onData = (chunk) => {
        for (const character of chunk) {
          if (escapeState === 1) {
            escapeState = character === "[" || character === "O" ? 2 : 0;
            continue;
          }
          if (escapeState === 2) {
            if (/[@-~]/.test(character)) escapeState = 0;
            continue;
          }
          if (character === "\u001b") {
            escapeState = 1;
            continue;
          }
          if (character === "\u0003") {
            cleanup();
            rejectPromise(new Error("操作已取消"));
            return;
          }
          if (character === "\r" || character === "\n") {
            cleanup();
            resolvePromise(value);
            return;
          }
          if (character === "\u007f" || character === "\b") {
            value = Array.from(value).slice(0, -1).join("");
            continue;
          }
          if (character >= " " && character !== "\u007f") value += character;
        }
      };
      const cleanup = () => {
        process.stdin.off("data", onData);
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write("\n");
      };
      process.stdin.on("data", onData);
    });
  } finally {
    if (process.stdin.isRaw) process.stdin.setRawMode(false);
  }
}

export function publicKeyFingerprint(spkiDer) {
  return `SHA256:${createHash("sha256").update(spkiDer).digest("base64url")}`;
}

export async function generateBackupKeyFiles({
  bits = 4096,
  privatePath,
  publicPath,
  passphrase,
  quiet = false
}) {
  if (![3072, 4096].includes(bits)) throw new Error("RSA 位数只能是 3072 或 4096");
  if (String(passphrase || "").length < 12) throw new Error("口令至少需要 12 个字符");
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: bits,
    publicExponent: 0x10001
  });
  const privatePem = privateKey.export({
    format: "pem",
    type: "pkcs8",
    cipher: "aes-256-cbc",
    passphrase
  });
  const publicDer = publicKey.export({ format: "der", type: "spki" });
  const publicDocument = {
    format: "smc.backup.public-key",
    version: 1,
    algorithm: `RSA-OAEP-${bits}-SHA256`,
    publicKeyB64: publicDer.toString("base64"),
    fingerprintSha256: publicKeyFingerprint(publicDer)
  };

  await Promise.all([
    mkdir(dirname(privatePath), { recursive: true, mode: 0o700 }),
    mkdir(dirname(publicPath), { recursive: true })
  ]);
  await writeFile(privatePath, privatePem, { encoding: "utf8", mode: 0o600, flag: "wx" });
  await chmod(privatePath, 0o600);
  try {
    await writeFile(publicPath, `${JSON.stringify(publicDocument, null, 2)}\n`, { encoding: "utf8", mode: 0o644, flag: "wx" });
  } catch (error) {
    await rm(privatePath, { force: true });
    throw error;
  }

  if (!quiet) {
    console.log(`私钥已保存：${privatePath}（已加密，权限 600）`);
    console.log(`公钥配置已保存：${publicPath}`);
    console.log(`公钥指纹：${publicDocument.fingerprintSha256}`);
    console.log("请离线保管私钥和口令；服务端只需要 publicKeyB64。私钥内容不会显示。");
  }
  return publicDocument;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log("用法：npm run backup:keygen -- [--bits 3072|4096] [--out-dir 目录]");
    console.log("      可用 --private 和 --public 分别指定输出路径；已有文件不会被覆盖。");
    console.log("      默认写入 ~/.smc-backup-keys/，避免私钥落入项目仓库。");
    return;
  }
  const passphrase = await promptHidden("请输入私钥保护口令（至少 12 个字符）：");
  const confirmation = await promptHidden("请再次输入口令：");
  if (passphrase !== confirmation) throw new Error("两次口令不一致");
  await generateBackupKeyFiles({ ...options, passphrase });
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(`生成失败：${error.message}`);
    process.exitCode = 1;
  });
}
