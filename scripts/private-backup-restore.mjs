#!/usr/bin/env node

import {
  constants,
  createDecipheriv,
  createHash,
  createPrivateKey,
  privateDecrypt,
  timingSafeEqual
} from "node:crypto";
import { chmod, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { promptHidden } from "./private-backup-keygen.mjs";

const backupPayloadMagic = Buffer.from("SMC-BACKUP-PAYLOAD-V1\0", "utf8");

function decodeBase64(value, label, expectedLength = null) {
  const text = String(value || "");
  if (!text || !/^[A-Za-z0-9+/]+={0,2}$/.test(text)) throw new Error(`${label} 格式无效`);
  const buffer = Buffer.from(text, "base64");
  if (!buffer.length || buffer.toString("base64").replace(/=+$/, "") !== text.replace(/=+$/, "")) {
    throw new Error(`${label} 格式无效`);
  }
  if (expectedLength !== null && buffer.length !== expectedLength) throw new Error(`${label} 长度无效`);
  return buffer;
}

export function decryptBackupContainer(containerInput, privatePem, passphrase) {
  const container = typeof containerInput === "string" ? JSON.parse(containerInput) : containerInput;
  if (!container || container.format !== "smc.encrypted.private-backup" || Number(container.version) !== 1) {
    throw new Error("不是受支持的 .smcbackup 文件");
  }
  if (container.encryption?.cipher !== "AES-256-GCM" || container.encryption?.keyWrap !== "RSA-OAEP-SHA256") {
    throw new Error("不支持的加密算法");
  }
  if (
    container.archive?.format !== "zip"
    || !Number.isSafeInteger(container.archive?.bytes)
    || container.archive.bytes < 1
    || container.archive.bytes > 12 * 1024 * 1024
    || container.archive.sha256Location !== "encrypted-payload"
  ) {
    throw new Error("备份 ZIP 元数据无效");
  }
  if (!/^[a-f0-9]{64}$/.test(String(container.sourceFingerprintHmacSha256 || ""))
    || !/^SHA256:[A-Za-z0-9_-]{43}$/.test(String(container.recipientFingerprintSha256 || ""))) {
    throw new Error("备份指纹无效");
  }
  const privateKey = createPrivateKey({ key: privatePem, format: "pem", passphrase });
  const modulusLength = Number(privateKey.asymmetricKeyDetails?.modulusLength || 0);
  if (
    privateKey.asymmetricKeyType !== "rsa"
    || modulusLength < 3072
    || privateKey.asymmetricKeyDetails?.publicExponent !== 65537n
  ) {
    throw new Error("私钥必须是至少 3072 位、公开指数为 65537 的 RSA 密钥");
  }
  const wrappedKey = decodeBase64(container.encryption.wrappedKeyB64, "封装密钥");
  if (wrappedKey.length !== modulusLength / 8) throw new Error("封装密钥长度与 RSA 私钥不匹配");
  const aesKey = privateDecrypt({
    key: privateKey,
    padding: constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256"
  }, wrappedKey);
  let decryptedPayload = null;
  try {
    if (aesKey.length !== 32) throw new Error("解封装得到的密钥长度无效");
    const iv = decodeBase64(container.encryption.ivB64, "IV", 12);
    const tag = decodeBase64(container.encryption.authTagB64, "认证标签", 16);
    const ciphertext = decodeBase64(container.ciphertextB64, "密文");
    if (ciphertext.length > 12 * 1024 * 1024) throw new Error("备份密文过大");
    if (ciphertext.length !== container.archive.bytes + backupPayloadMagic.length + 32) {
      throw new Error("备份密文长度与 ZIP 元数据不一致");
    }
    const authenticatedMetadata = {
      format: container.format,
      version: container.version,
      createdAt: container.createdAt,
      sourceFingerprintHmacSha256: container.sourceFingerprintHmacSha256,
      recipientFingerprintSha256: container.recipientFingerprintSha256,
      archive: {
        format: container.archive?.format,
        fileName: container.archive?.fileName,
        bytes: container.archive?.bytes,
        sha256Location: container.archive?.sha256Location
      }
    };
    const decipher = createDecipheriv("aes-256-gcm", aesKey, iv);
    decipher.setAAD(Buffer.from(JSON.stringify(authenticatedMetadata), "utf8"));
    decipher.setAuthTag(tag);
    decryptedPayload = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    if (!decryptedPayload.subarray(0, backupPayloadMagic.length).equals(backupPayloadMagic)) throw new Error("备份载荷标识无效");
    const expectedSha256 = decryptedPayload.subarray(backupPayloadMagic.length, backupPayloadMagic.length + 32);
    const archive = Buffer.from(decryptedPayload.subarray(backupPayloadMagic.length + 32));
    const actualSha256 = createHash("sha256").update(archive).digest();
    if (expectedSha256.length !== actualSha256.length || !timingSafeEqual(expectedSha256, actualSha256)) {
      throw new Error("ZIP 的 SHA-256 校验失败");
    }
    if (Number(container.archive?.bytes) !== archive.length) throw new Error("ZIP 长度校验失败");
    const endSignature = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
    const endOffset = archive.lastIndexOf(endSignature);
    if (archive.length < 22 || archive.readUInt32LE(0) !== 0x04034b50 || endOffset < Math.max(0, archive.length - 65557)) {
      throw new Error("解密内容不是有效的 ZIP 容器");
    }
    return { archive, sha256: actualSha256.toString("hex"), createdAt: String(container.createdAt || "") };
  } finally {
    aesKey.fill(0);
    decryptedPayload?.fill(0);
  }
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--input" || value === "-i") options.input = resolve(argv[++index] || "");
    else if (value === "--private" || value === "-k") options.privatePath = resolve(argv[++index] || "");
    else if (value === "--output" || value === "-o") options.output = resolve(argv[++index] || "");
    else if (value === "--force") options.force = true;
    else if (value === "--help" || value === "-h") options.help = true;
    else if (!options.input) options.input = resolve(value);
    else throw new Error(`未知参数：${value}`);
  }
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help || !options.input) {
    console.log("用法：npm run backup:restore -- --input 备份.smcbackup --private smc-backup-private.pem [--output 恢复.zip]");
    console.log("      默认不会覆盖已有 ZIP；明确需要时可追加 --force。");
    console.log("      未指定 --private 时读取 ~/.smc-backup-keys/smc-backup-private.pem。");
    console.log("      未指定 --output 时写入 ~/.smc-backup-restores/，避免明文 ZIP 落入项目仓库。");
    if (!options.help) process.exitCode = 1;
    return;
  }
  const privatePath = options.privatePath || join(homedir(), ".smc-backup-keys", "smc-backup-private.pem");
  const output = options.output || join(homedir(), ".smc-backup-restores", `${basename(options.input, ".smcbackup")}.zip`);
  const [containerStat, privateKeyStat] = await Promise.all([stat(options.input), stat(privatePath)]);
  if (containerStat.size > 16 * 1024 * 1024) throw new Error(".smcbackup 文件过大");
  if (privateKeyStat.size > 32 * 1024) throw new Error("私钥文件过大");
  const [containerText, privatePem] = await Promise.all([
    readFile(options.input, "utf8"),
    readFile(privatePath, "utf8")
  ]);
  const passphrase = await promptHidden("请输入私钥保护口令：");
  const result = decryptBackupContainer(containerText, privatePem, passphrase);
  await mkdir(dirname(output), { recursive: true, mode: 0o700 });
  await writeFile(output, result.archive, { mode: 0o600, flag: options.force ? "w" : "wx" });
  await chmod(output, 0o600);
  console.log(`恢复完成：${output}`);
  console.log(`SHA-256：${result.sha256}`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(`恢复失败：${error.message}`);
    process.exitCode = 1;
  });
}
