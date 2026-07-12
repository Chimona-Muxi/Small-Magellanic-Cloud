import { createServer } from "node:http";
import { spawn } from "node:child_process";
import {
  constants as cryptoConstants,
  createCipheriv,
  createHash,
  createHmac,
  createPublicKey,
  publicEncrypt,
  randomBytes,
  scryptSync,
  timingSafeEqual
} from "node:crypto";
import { access, mkdir, mkdtemp, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { connect as netConnect } from "node:net";
import { tmpdir } from "node:os";
import { delimiter, dirname, extname, join, normalize } from "node:path";
import { connect as tlsConnect } from "node:tls";
import { fileURLToPath } from "node:url";
import { deflateRawSync, inflateRawSync } from "node:zlib";
import {
  createInitialState as createLuqiangqiState,
  applyAction as applyLuqiangqiAction
} from "./public/game/board/luqiangqi/engine.mjs";
import {
  createInitialState as createCheckersState,
  applyAction as applyCheckersAction
} from "./public/game/board/xiyangtiaoqi/engine.mjs";
import {
  createInitialState as createTurkishState,
  applyAction as applyTurkishAction
} from "./public/game/board/tuerqitiaoqi/engine.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "public");
const padicDir = join(__dirname, "tools", "padic", "p_adic_pro");
const padicBinary = join(padicDir, process.platform === "win32" ? "padic_converter.exe" : "padic_converter");
const padicRuntimeHome = join(__dirname, "tools", "padic", "runtime-home");
const studyDir = join(__dirname, "tools", "study");
const studyPythonPackages = join(studyDir, "python-packages");
const studyRequirements = join(studyDir, "requirements.txt");
const privateDir = process.env.SMC_PRIVATE_DATA_DIR || join(__dirname, ".private");
const privateSessionsFile = join(privateDir, "sessions.json");
const privateProfileFile = join(privateDir, "profile.json");
const privateMailVaultFile = join(privateDir, "mail-vault.json");
const pythonCommand = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const matplotlibConfigDir = join(tmpdir(), "smc-matplotlib");
const port = Number(process.env.PORT || 5226);
const host = process.env.HOST || (process.env.PORT ? "0.0.0.0" : "127.0.0.1");
const roomTtlMs = 1000 * 60 * 60 * 6;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".sh": "application/octet-stream",
  ".command": "application/octet-stream",
  ".bat": "application/octet-stream",
  ".zip": "application/zip"
};

const gameConfigs = {
  luqiangqi: {
    maxPlayers: 4,
    defaultPlayers: 2,
    names: ["玩家 1", "玩家 2", "玩家 3", "玩家 4"],
    create(playerCount) {
      return createLuqiangqiState({
        playerCount,
        mode: "online",
        aiSlots: [],
        names: this.names.slice(0, playerCount)
      });
    },
    apply: applyLuqiangqiAction
  },
  xiyangtiaoqi: {
    maxPlayers: 2,
    defaultPlayers: 2,
    names: ["玩家 1", "玩家 2"],
    create() {
      return createCheckersState({
        mode: "online",
        aiSlots: [],
        names: this.names
      });
    },
    apply: applyCheckersAction
  },
  tuerqitiaoqi: {
    maxPlayers: 2,
    defaultPlayers: 2,
    names: ["玩家 1", "玩家 2"],
    create() {
      return createTurkishState({
        mode: "online",
        names: this.names
      });
    },
    apply: applyTurkishAction
  }
};

const studyTools = {
  algebra: {
    script: join(studyDir, "algebra", "src", "parser.py"),
    cwd: join(studyDir, "algebra"),
    extension: ".txt",
    timeoutMs: 45000,
    args(filePath, body) {
      return ["--lang", body.lang === "en" ? "en" : "zh", filePath];
    },
    env: {}
  },
  analysis: {
    script: join(studyDir, "analysis", "src", "cas_parser.py"),
    cwd: join(studyDir, "analysis"),
    extension: ".ma",
    timeoutMs: 75000,
    args(filePath) {
      return [filePath];
    },
    env: {
      MPLBACKEND: "Agg",
      MPLCONFIGDIR: matplotlibConfigDir,
      SMC_WEB_RUN: "1"
    }
  }
};

const roomStores = new Map(Object.keys(gameConfigs).map((key) => [key, new Map()]));
let padicBuildPromise = null;
let studyDepsPromise = null;
let privateSessionStore = null;
let privateProfileStore = null;
let privateMailVaultStore = null;

const privatePasswordHash = process.env.SMC_PRIVATE_PASSWORD_HASH
  || "955aefbb1af2de242be0c35809425a88:f87bc55914323ebcd10c82004d708d3427273c5bbbe2fe704497a29907f1109e107b842c301607611687dfa8daa0925ea7548a580f5c8c2115447865d4a531a1";
const privateCookieName = "smc_private_session";
const privateSessionMs = 1000 * 60 * 60 * 8;
const privateRememberMs = 1000 * 60 * 60 * 24 * 90;
const privateLoginWindowMs = 1000 * 60 * 10;
const privateLoginBlockMs = 1000 * 60 * 5;
const privateLoginMaxFailures = 6;
const privateLoginAttempts = new Map();
const privateDefaultProfile = privateProfileSeed();
const privateArchiveType = "smc.private.archive";
const privateArchiveVersion = 2;
const privateBackupRepo = String(process.env.SMC_BACKUP_GITHUB_REPO || "").trim();
const privateBackupToken = String(process.env.SMC_BACKUP_GITHUB_TOKEN || "").trim();
const privateBackupPublicKeyB64 = String(process.env.SMC_BACKUP_PUBLIC_KEY_B64 || "").trim();
const privateBackupBranch = String(process.env.SMC_BACKUP_GITHUB_BRANCH || "smc-private-backup").trim();
const privateBackupDebounceMinutes = Math.min(1440, Math.max(1, Number(process.env.SMC_BACKUP_DEBOUNCE_MINUTES) || 15));
const privateBackupRetentionCount = Math.min(365, Math.max(1, Number(process.env.SMC_BACKUP_RETENTION_DAYS) || 30));
const privateBackupFormat = "smc.encrypted.private-backup";
const privateBackupVersion = 1;
const privateBackupPayloadMagic = Buffer.from("SMC-BACKUP-PAYLOAD-V1\0", "utf8");
let privateBackupTimer = null;
let privateBackupScheduledForAt = null;
let privateBackupPromise = null;
let privateBackupState = {
  lastAttemptAt: null,
  lastSuccessAt: null,
  lastResult: null,
  lastError: null
};
let zipCrcTable = null;

function cleanPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  return normalize(decoded).replace(/^(\.\.[/\\])+/, "");
}

function json(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, max-age=0",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  });
  res.end(JSON.stringify(data));
}

function privateJson(res, status, data, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin",
    ...headers
  });
  res.end(JSON.stringify(data));
}

function parseCookies(header = "") {
  const cookies = {};
  for (const item of header.split(";")) {
    const index = item.indexOf("=");
    if (index === -1) continue;
    const key = item.slice(0, index).trim();
    const value = item.slice(index + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

function privateCookie(value, req, maxAgeSeconds) {
  const secure = req.headers["x-forwarded-proto"] === "https" || String(req.headers.host || "").startsWith("localhost:") === false && String(req.headers.host || "").startsWith("127.0.0.1:") === false;
  return [
    `${privateCookieName}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    secure ? "Secure" : "",
    Number.isFinite(maxAgeSeconds) ? `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}` : ""
  ].filter(Boolean).join("; ");
}

function privateCookieClear(req) {
  return privateCookie("", req, 0);
}

function hashPrivateToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket.remoteAddress || "unknown";
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function verifyPrivatePassword(password) {
  const [salt, expectedHex] = privatePasswordHash.split(":");
  if (!salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const actual = scryptSync(String(password || ""), salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function privateProfileSeed() {
  try {
    if (process.env.SMC_PRIVATE_PROFILE_JSON) {
      const profile = JSON.parse(process.env.SMC_PRIVATE_PROFILE_JSON);
      return {
        name: String(profile.name || "张墨霖").trim().slice(0, 80) || "张墨霖",
        birthday: String(profile.birthday || "2006/09/17").trim().slice(0, 80) || "2006/09/17",
        note: String(profile.note || "").trim().slice(0, 1200)
      };
    }
  } catch {
    // Fall back to individual fields below.
  }
  return {
    name: process.env.SMC_PRIVATE_PROFILE_NAME || "张墨霖",
    birthday: process.env.SMC_PRIVATE_PROFILE_BIRTHDAY || "2006/09/17",
    note: process.env.SMC_PRIVATE_PROFILE_NOTE || ""
  };
}

function cleanPrivateProfile(profile = {}) {
  const name = String(profile.name ?? privateDefaultProfile?.name ?? "").trim().slice(0, 80);
  const birthday = String(profile.birthday ?? privateDefaultProfile?.birthday ?? "").trim().slice(0, 80);
  const note = String(profile.note ?? privateDefaultProfile?.note ?? "").trim().slice(0, 1200);
  return {
    name: name || privateDefaultProfile?.name || "",
    birthday: birthday || privateDefaultProfile?.birthday || "",
    note
  };
}

function cleanPrivateMailVault(vault = {}) {
  const hasPayload = vault && typeof vault === "object" && String(vault.ciphertext || "").trim();
  if (!hasPayload) {
    return {
      vaultVersion: 1,
      updatedAt: new Date().toISOString(),
      algorithm: "AES-GCM",
      kdf: "PBKDF2-SHA-256",
      iterations: 240000,
      salt: "",
      iv: "",
      ciphertext: ""
    };
  }
  return {
    vaultVersion: Math.min(2, Math.max(1, Number(vault.vaultVersion) || 1)),
    updatedAt: String(vault.updatedAt || new Date().toISOString()).slice(0, 40),
    algorithm: "AES-GCM",
    kdf: "PBKDF2-SHA-256",
    iterations: Math.min(600000, Math.max(120000, Number(vault.iterations) || 240000)),
    salt: String(vault.salt || "").slice(0, 256),
    iv: String(vault.iv || "").slice(0, 256),
    ciphertext: String(vault.ciphertext || "").slice(0, 3 * 1024 * 1024)
  };
}

async function readPrivateJsonFile(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT") console.error(`Private data read failed: ${filePath}`, error);
    return fallback;
  }
}

async function writePrivateJsonFile(filePath, data) {
  await mkdir(privateDir, { recursive: true });
  const tempPath = `${filePath}.${randomBytes(8).toString("hex")}.tmp`;
  try {
    await writeFile(tempPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    await rename(tempPath, filePath);
  } finally {
    await rm(tempPath, { force: true }).catch(() => {});
  }
}

async function loadPrivateSessions() {
  if (privateSessionStore) return privateSessionStore;
  const data = await readPrivateJsonFile(privateSessionsFile, { sessions: [] });
  privateSessionStore = {
    sessions: Array.isArray(data.sessions) ? data.sessions : []
  };
  return privateSessionStore;
}

async function savePrivateSessions() {
  if (!privateSessionStore) return;
  await writePrivateJsonFile(privateSessionsFile, privateSessionStore);
}

async function loadPrivateProfile() {
  if (privateProfileStore) return privateProfileStore;
  privateProfileStore = cleanPrivateProfile(await readPrivateJsonFile(privateProfileFile, privateDefaultProfile));
  return privateProfileStore;
}

async function savePrivateProfile(profile) {
  privateProfileStore = cleanPrivateProfile(profile);
  await writePrivateJsonFile(privateProfileFile, privateProfileStore);
  schedulePrivateBackup();
  return privateProfileStore;
}

async function loadPrivateMailVault() {
  if (privateMailVaultStore) return privateMailVaultStore;
  privateMailVaultStore = cleanPrivateMailVault(await readPrivateJsonFile(privateMailVaultFile, {}));
  return privateMailVaultStore;
}

async function savePrivateMailVault(vault) {
  privateMailVaultStore = cleanPrivateMailVault(vault);
  await writePrivateJsonFile(privateMailVaultFile, privateMailVaultStore);
  schedulePrivateBackup();
  return privateMailVaultStore;
}

function crcTable() {
  if (zipCrcTable) return zipCrcTable;
  zipCrcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let value = i;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    zipCrcTable[i] = value >>> 0;
  }
  return zipCrcTable;
}

function crc32(buffer) {
  const table = crcTable();
  let crc = 0xffffffff;
  for (const byte of buffer) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function zipDateParts(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  };
}

function makeZip(entries) {
  const chunks = [];
  const centralChunks = [];
  let offset = 0;
  const now = zipDateParts();

  for (const entry of entries) {
    const name = Buffer.from(entry.name.replace(/^\/+/, ""), "utf8");
    const source = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(String(entry.data), "utf8");
    const compressed = deflateRawSync(source);
    const checksum = crc32(source);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(now.time, 10);
    local.writeUInt16LE(now.date, 12);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(source.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(now.time, 12);
    central.writeUInt16LE(now.date, 14);
    central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(source.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);

    chunks.push(local, name, compressed);
    centralChunks.push(central, name);
    offset += local.length + name.length + compressed.length;
  }

  const centralSize = centralChunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...chunks, ...centralChunks, end]);
}

function readZipEntries(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 22 || buffer.length > 4 * 1024 * 1024) {
    throw new Error(buffer?.length > 4 * 1024 * 1024 ? "Archive too large" : "Invalid archive");
  }
  const endSig = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
  const endOffset = buffer.lastIndexOf(endSig);
  if (endOffset < 0) throw new Error("Invalid archive");

  const count = buffer.readUInt16LE(endOffset + 10);
  if (!count || count > 24) throw new Error("Invalid archive");
  let cursor = buffer.readUInt32LE(endOffset + 16);
  const entries = new Map();
  let totalUncompressed = 0;

  for (let i = 0; i < count; i += 1) {
    if (cursor < 0 || cursor + 46 > buffer.length) throw new Error("Invalid archive");
    if (buffer.readUInt32LE(cursor) !== 0x02014b50) throw new Error("Invalid archive");
    const method = buffer.readUInt16LE(cursor + 10);
    const expectedCrc = buffer.readUInt32LE(cursor + 16);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const uncompressedSize = buffer.readUInt32LE(cursor + 24);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.subarray(cursor + 46, cursor + 46 + nameLength).toString("utf8");
    if (!name || name.includes("..") || name.startsWith("/") || name.includes("\\")) throw new Error("Invalid archive");
    if (uncompressedSize > Math.floor(3.5 * 1024 * 1024)) throw new Error("Archive too large");
    totalUncompressed += uncompressedSize;
    if (totalUncompressed > 4 * 1024 * 1024) throw new Error("Archive too large");

    if (localOffset < 0 || localOffset + 30 > buffer.length) throw new Error("Invalid archive");
    if (buffer.readUInt32LE(localOffset) !== 0x04034b50) throw new Error("Invalid archive");
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    if (dataOffset < 0 || dataOffset + compressedSize > buffer.length) throw new Error("Invalid archive");
    const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);
    const data = method === 0
      ? compressed
      : method === 8
        ? inflateRawSync(compressed, { maxOutputLength: Math.floor(3.5 * 1024 * 1024) })
        : null;
    if (!data) throw new Error("Unsupported archive compression");
    if (data.length !== uncompressedSize) throw new Error("Invalid archive");
    if (crc32(data) !== expectedCrc) throw new Error("Archive checksum mismatch");
    entries.set(name, data);

    cursor += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

async function makePrivateArchive() {
  const createdAt = new Date().toISOString();
  const profile = await loadPrivateProfile();
  const mailVault = await loadPrivateMailVault();
  const manifest = {
    archiveType: privateArchiveType,
    archiveVersion: privateArchiveVersion,
    createdAt,
    source: "Small Magellanic Cloud",
    modules: ["profile", "encrypted-private-vault"],
    compatibility: {
      profile: 1,
      encryptedPrivateVault: 2,
      legacyMailVaultPath: "data/mail-vault.json",
      encryptedPrivateVaultModules: ["mail-accounts", "phone-accounts", "ledger"],
      reserved: ["temporary-files", "subsite-transfer"]
    }
  };
  return {
    createdAt,
    buffer: makeZip([
      { name: "manifest.json", data: `${JSON.stringify(manifest, null, 2)}\n` },
      { name: "data/profile.json", data: `${JSON.stringify(profile, null, 2)}\n` },
      { name: "data/mail-vault.json", data: `${JSON.stringify(mailVault, null, 2)}\n` },
      {
        name: "data/reserved.json",
        data: `${JSON.stringify({
          modules: ["temporary-files", "subsite-transfer"],
          note: "Future data modules can be added under data/ without changing the archive container."
        }, null, 2)}\n`
      }
    ])
  };
}

function privateArchiveFileName(createdAt) {
  const stamp = createdAt.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z").replace("T", "-").replace("Z", "");
  return `smc-private-data-${stamp}.zip`;
}

class PrivateBackupError extends Error {
  constructor(message, code = "BACKUP_FAILED", httpStatus = 502) {
    super(message);
    this.name = "PrivateBackupError";
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

function safePrivateBackupError(error) {
  let message = String(typeof error === "string" ? error : error?.message || "Encrypted backup failed");
  for (const secret of [privateBackupToken, privateBackupPublicKeyB64]) {
    if (secret && message.includes(secret)) message = message.split(secret).join("[redacted]");
  }
  return message.replace(/[\r\n\t]+/g, " ").slice(0, 280);
}

function privateBackupConfiguration() {
  const missing = [];
  if (!privateBackupRepo) missing.push("SMC_BACKUP_GITHUB_REPO");
  if (!privateBackupToken) missing.push("SMC_BACKUP_GITHUB_TOKEN");
  if (!privateBackupPublicKeyB64) missing.push("SMC_BACKUP_PUBLIC_KEY_B64");
  if (missing.length) {
    return {
      configured: false,
      error: missing.length === 3 ? "Encrypted GitHub backup is not configured" : `Missing configuration: ${missing.join(", ")}`
    };
  }

  const repoMatch = privateBackupRepo.match(/^([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9_.-]{1,100})$/);
  if (!repoMatch || repoMatch[2] === "." || repoMatch[2] === "..") {
    return { configured: false, error: "SMC_BACKUP_GITHUB_REPO must use owner/repository format" };
  }
  if (
    !/^[A-Za-z0-9][A-Za-z0-9._/-]{0,199}$/.test(privateBackupBranch)
    || privateBackupBranch.includes("..")
    || privateBackupBranch.includes("//")
    || privateBackupBranch.endsWith("/")
    || privateBackupBranch.split("/").some((part) => part.startsWith(".") || part.endsWith(".") || part.endsWith(".lock"))
  ) {
    return { configured: false, error: "SMC_BACKUP_GITHUB_BRANCH is invalid" };
  }

  try {
    const compact = privateBackupPublicKeyB64.replace(/\s+/g, "");
    if (compact.length > 4096 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compact)) throw new Error("invalid base64");
    const publicDer = Buffer.from(compact, "base64");
    if (!publicDer.length || publicDer.toString("base64").replace(/=+$/, "") !== compact.replace(/=+$/, "")) {
      throw new Error("invalid base64");
    }
    const publicKey = createPublicKey({ key: publicDer, format: "der", type: "spki" });
    const modulusLength = Number(publicKey.asymmetricKeyDetails?.modulusLength || 0);
    if (publicKey.asymmetricKeyType !== "rsa" || modulusLength < 3072 || publicKey.asymmetricKeyDetails?.publicExponent !== 65537n) {
      throw new Error("RSA key must be at least 3072 bits and use public exponent 65537");
    }
    return {
      configured: true,
      owner: repoMatch[1],
      repositoryName: repoMatch[2],
      publicDer,
      publicKey,
      publicKeyFingerprint: `SHA256:${createHash("sha256").update(publicDer).digest("base64url")}`
    };
  } catch (error) {
    return { configured: false, error: `SMC_BACKUP_PUBLIC_KEY_B64 is invalid: ${safePrivateBackupError(error)}` };
  }
}

function privateBackupSourceFingerprint(archiveBuffer) {
  const entries = readZipEntries(archiveBuffer);
  const dedupKey = createHash("sha256").update("smc-private-backup-dedup-key-v1\0", "utf8").update(privateBackupToken, "utf8").digest();
  try {
    const hash = createHmac("sha256", dedupKey);
    hash.update(`smc-private-backup-source-v1:archive-${privateArchiveVersion}\0`, "utf8");
    hash.update(entries.get("data/profile.json") || Buffer.alloc(0));
    hash.update("\0", "utf8");
    hash.update(entries.get("data/mail-vault.json") || Buffer.alloc(0));
    return hash.digest("hex");
  } finally {
    dedupKey.fill(0);
  }
}

function encryptPrivateArchive(archive, sourceFingerprintHmacSha256, configuration) {
  const aesKey = randomBytes(32);
  const iv = randomBytes(12);
  try {
    const metadata = {
      format: privateBackupFormat,
      version: privateBackupVersion,
      createdAt: archive.createdAt,
      sourceFingerprintHmacSha256,
      recipientFingerprintSha256: configuration.publicKeyFingerprint,
      archive: {
        format: "zip",
        fileName: privateArchiveFileName(archive.createdAt),
        bytes: archive.buffer.length,
        sha256Location: "encrypted-payload"
      }
    };
    const cipher = createCipheriv("aes-256-gcm", aesKey, iv);
    cipher.setAAD(Buffer.from(JSON.stringify(metadata), "utf8"));
    const archiveSha256 = createHash("sha256").update(archive.buffer).digest();
    const payload = Buffer.concat([privateBackupPayloadMagic, archiveSha256, archive.buffer]);
    let ciphertext;
    try {
      ciphertext = Buffer.concat([cipher.update(payload), cipher.final()]);
    } finally {
      archiveSha256.fill(0);
      payload.fill(0);
    }
    const authTag = cipher.getAuthTag();
    const wrappedKey = publicEncrypt({
      key: configuration.publicKey,
      padding: cryptoConstants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256"
    }, aesKey);
    const document = {
      ...metadata,
      encryption: {
        cipher: "AES-256-GCM",
        keyWrap: "RSA-OAEP-SHA256",
        ivB64: iv.toString("base64"),
        authTagB64: authTag.toString("base64"),
        wrappedKeyB64: wrappedKey.toString("base64")
      },
      ciphertextB64: ciphertext.toString("base64")
    };
    return Buffer.from(`${JSON.stringify(document)}\n`, "utf8");
  } finally {
    aesKey.fill(0);
  }
}

async function readPrivateBackupGithubResponse(response, maxBytes = 12 * 1024 * 1024) {
  const declaredLength = Number(response.headers.get("content-length") || 0);
  if (declaredLength > maxBytes) throw new PrivateBackupError("GitHub API response was too large");
  const chunks = [];
  let size = 0;
  if (response.body) {
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel().catch(() => {});
        throw new PrivateBackupError("GitHub API response was too large");
      }
      chunks.push(Buffer.from(value));
    }
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new PrivateBackupError("GitHub API returned invalid JSON");
  }
}

async function privateBackupGithubRequest(configuration, path, { method = "GET", body, allow404 = false } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(`https://api.github.com${path}`, {
      method,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${privateBackupToken}`,
        "Content-Type": "application/json",
        "User-Agent": "Small-Magellanic-Cloud-private-backup",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal
    });
    const data = await readPrivateBackupGithubResponse(response);
    if (allow404 && response.status === 404) return null;
    if (!response.ok) {
      const detail = safePrivateBackupError(data?.message || response.statusText || "request failed").slice(0, 180);
      throw new PrivateBackupError(`GitHub API ${response.status}: ${detail}`, "GITHUB_API_ERROR", response.status === 401 || response.status === 403 ? 503 : 502);
    }
    return data;
  } catch (error) {
    if (error instanceof PrivateBackupError) throw error;
    const message = error?.name === "AbortError" ? "GitHub API request timed out" : `GitHub API request failed: ${safePrivateBackupError(error)}`;
    throw new PrivateBackupError(message);
  } finally {
    clearTimeout(timeout);
  }
}

function privateBackupRepoPath(configuration) {
  return `/repos/${encodeURIComponent(configuration.owner)}/${encodeURIComponent(configuration.repositoryName)}`;
}

async function loadPrivateBackupBranch(configuration) {
  const repoPath = privateBackupRepoPath(configuration);
  const branchPath = privateBackupBranch.split("/").map(encodeURIComponent).join("/");
  const ref = await privateBackupGithubRequest(configuration, `${repoPath}/git/ref/heads/${branchPath}`, { allow404: true });
  if (!ref) return { ref: null, entries: [] };
  const commitSha = String(ref.object?.sha || "");
  if (ref.object?.type !== "commit" || !/^[a-f0-9]{40,64}$/i.test(commitSha)) {
    throw new PrivateBackupError("Backup branch does not point to a valid commit", "BACKUP_BRANCH_NOT_DEDICATED", 409);
  }
  const commit = await privateBackupGithubRequest(configuration, `${repoPath}/git/commits/${encodeURIComponent(commitSha)}`);
  const treeSha = String(commit.tree?.sha || "");
  if (!/^[a-f0-9]{40,64}$/i.test(treeSha)) throw new PrivateBackupError("Backup branch commit has no valid tree");
  const tree = await privateBackupGithubRequest(configuration, `${repoPath}/git/trees/${encodeURIComponent(treeSha)}?recursive=1`);
  if (!Array.isArray(tree.tree)) throw new PrivateBackupError("GitHub returned an invalid backup branch tree");
  if (tree.truncated) throw new PrivateBackupError("Backup branch tree is too large to verify safely", "BACKUP_BRANCH_NOT_DEDICATED", 409);
  const allEntries = tree.tree.filter((entry) => typeof entry?.path === "string");
  if (allEntries.length !== tree.tree.length) throw new PrivateBackupError("GitHub returned malformed backup branch entries");
  const unsafeEntry = allEntries.find((entry) => {
    if (entry.type === "tree") return entry.path !== "daily" || entry.mode !== "040000";
    if (entry.type === "blob") return entry.mode !== "100644";
    return true;
  });
  if (unsafeEntry) {
    throw new PrivateBackupError("Refusing backup: the configured branch contains unsupported Git entries", "BACKUP_BRANCH_NOT_DEDICATED", 409);
  }
  const entries = allEntries.filter((entry) => entry.type === "blob");
  if (entries.some((entry) => !/^[a-f0-9]{40,64}$/i.test(String(entry.sha || "")))) {
    throw new PrivateBackupError("GitHub returned an invalid backup branch blob SHA");
  }
  const unexpected = entries.find((entry) => entry.path !== "latest.smcbackup" && !/^daily\/\d{4}-\d{2}-\d{2}\.smcbackup$/.test(entry.path));
  if (unexpected) {
    throw new PrivateBackupError("Refusing backup: the configured branch contains non-backup files", "BACKUP_BRANCH_NOT_DEDICATED", 409);
  }
  return { ref, entries };
}

async function remotePrivateBackupFingerprint(configuration, entries) {
  const latest = entries.find((entry) => entry.path === "latest.smcbackup" && /^[a-f0-9]{40,64}$/i.test(String(entry.sha || "")));
  if (!latest) return null;
  try {
    const blob = await privateBackupGithubRequest(configuration, `${privateBackupRepoPath(configuration)}/git/blobs/${encodeURIComponent(latest.sha)}`);
    if (blob.encoding !== "base64" || typeof blob.content !== "string") return null;
    const raw = Buffer.from(blob.content.replace(/\s+/g, ""), "base64");
    const document = JSON.parse(raw.toString("utf8"));
    if (document.format !== privateBackupFormat || Number(document.version) !== privateBackupVersion) return null;
    const fingerprint = String(document.sourceFingerprintHmacSha256 || "");
    const recipientFingerprint = String(document.recipientFingerprintSha256 || "");
    return /^[a-f0-9]{64}$/.test(fingerprint) && /^SHA256:[A-Za-z0-9_-]{43}$/.test(recipientFingerprint)
      ? { source: fingerprint, recipient: recipientFingerprint }
      : null;
  } catch (error) {
    if (error instanceof PrivateBackupError) throw error;
    return null;
  }
}

async function updatePrivateBackupBranch(configuration, branch, treeEntries, message) {
  const repoPath = privateBackupRepoPath(configuration);
  const tree = await privateBackupGithubRequest(configuration, `${repoPath}/git/trees`, {
    method: "POST",
    body: { tree: treeEntries }
  });
  if (!/^[a-f0-9]{40,64}$/i.test(String(tree.sha || ""))) throw new PrivateBackupError("GitHub did not return a valid backup tree SHA");
  const commit = await privateBackupGithubRequest(configuration, `${repoPath}/git/commits`, {
    method: "POST",
    body: {
      message,
      tree: tree.sha,
      parents: []
    }
  });
  if (!/^[a-f0-9]{40,64}$/i.test(String(commit.sha || ""))) throw new PrivateBackupError("GitHub did not return a valid backup commit SHA");
  const branchPath = privateBackupBranch.split("/").map(encodeURIComponent).join("/");
  if (branch.ref) {
    await privateBackupGithubRequest(configuration, `${repoPath}/git/refs/heads/${branchPath}`, {
      method: "PATCH",
      body: { sha: commit.sha, force: true }
    });
  } else {
    await privateBackupGithubRequest(configuration, `${repoPath}/git/refs`, {
      method: "POST",
      body: { ref: `refs/heads/${privateBackupBranch}`, sha: commit.sha }
    });
  }
  return commit.sha;
}

async function performPrivateBackup() {
  const configuration = privateBackupConfiguration();
  if (!configuration.configured) throw new PrivateBackupError(configuration.error, "BACKUP_NOT_CONFIGURED", 503);
  const repoPath = privateBackupRepoPath(configuration);

  const repository = await privateBackupGithubRequest(configuration, repoPath);
  if (repository.private !== true) {
    throw new PrivateBackupError("Refusing backup: the configured GitHub repository is not private", "PRIVATE_REPOSITORY_REQUIRED", 409);
  }

  const branch = await loadPrivateBackupBranch(configuration);
  const remoteFingerprint = await remotePrivateBackupFingerprint(configuration, branch.entries);
  const archive = await makePrivateArchive();
  try {
    const sourceFingerprintHmacSha256 = privateBackupSourceFingerprint(archive.buffer);
    const dailyEntries = branch.entries
      .filter((entry) => /^daily\/\d{4}-\d{2}-\d{2}\.smcbackup$/.test(entry.path))
      .sort((a, b) => b.path.localeCompare(a.path));
    if (remoteFingerprint?.source === sourceFingerprintHmacSha256 && remoteFingerprint.recipient === configuration.publicKeyFingerprint) {
      if (dailyEntries.length > privateBackupRetentionCount) {
        const latest = branch.entries.find((entry) => entry.path === "latest.smcbackup");
        await updatePrivateBackupBranch(configuration, branch, [
          { path: "latest.smcbackup", mode: "100644", type: "blob", sha: latest.sha },
          ...dailyEntries.slice(0, privateBackupRetentionCount).map((entry) => ({ path: entry.path, mode: "100644", type: "blob", sha: entry.sha }))
        ], `Prune encrypted private backups ${archive.createdAt}`);
        return { result: "pruned", uploaded: false, removed: dailyEntries.length - privateBackupRetentionCount };
      }
      return { result: "unchanged", uploaded: false };
    }
    const encrypted = encryptPrivateArchive(archive, sourceFingerprintHmacSha256, configuration);
    const blob = await privateBackupGithubRequest(configuration, `${repoPath}/git/blobs`, {
      method: "POST",
      body: { content: encrypted.toString("base64"), encoding: "base64" }
    });
    if (!/^[a-f0-9]{40,64}$/i.test(String(blob.sha || ""))) throw new PrivateBackupError("GitHub did not return a valid backup blob SHA");
    const todayPath = `daily/${archive.createdAt.slice(0, 10)}.smcbackup`;
    const priorDaily = branch.entries
      .filter((entry) => /^daily\/\d{4}-\d{2}-\d{2}\.smcbackup$/.test(entry.path) && entry.path !== todayPath && /^[a-f0-9]{40,64}$/i.test(String(entry.sha || "")))
      .sort((a, b) => b.path.localeCompare(a.path))
      .slice(0, Math.max(0, privateBackupRetentionCount - 1));
    await updatePrivateBackupBranch(configuration, branch, [
      { path: "latest.smcbackup", mode: "100644", type: "blob", sha: blob.sha },
      { path: todayPath, mode: "100644", type: "blob", sha: blob.sha },
      ...priorDaily.map((entry) => ({ path: entry.path, mode: "100644", type: "blob", sha: entry.sha }))
    ], `Encrypted private backup ${archive.createdAt}`);
    return { result: "uploaded", uploaded: true, createdAt: archive.createdAt };
  } finally {
    archive.buffer.fill(0);
  }
}

async function runPrivateBackup() {
  if (privateBackupPromise) return privateBackupPromise;
  if (privateBackupTimer) clearTimeout(privateBackupTimer);
  privateBackupTimer = null;
  privateBackupScheduledForAt = null;
  privateBackupState.lastAttemptAt = new Date().toISOString();
  privateBackupState.lastError = null;
  privateBackupPromise = performPrivateBackup()
    .then((result) => {
      const now = new Date().toISOString();
      privateBackupState = { ...privateBackupState, lastSuccessAt: now, lastResult: result.result, lastError: null };
      return result;
    })
    .catch((error) => {
      privateBackupState = { ...privateBackupState, lastResult: "failed", lastError: safePrivateBackupError(error) };
      throw error;
    })
    .finally(() => {
      privateBackupPromise = null;
    });
  return privateBackupPromise;
}

function schedulePrivateBackup() {
  try {
    if (!privateBackupConfiguration().configured) return;
    if (privateBackupTimer) clearTimeout(privateBackupTimer);
    privateBackupScheduledForAt = new Date(Date.now() + privateBackupDebounceMinutes * 60 * 1000).toISOString();
    privateBackupTimer = setTimeout(() => {
      privateBackupTimer = null;
      privateBackupScheduledForAt = null;
      runPrivateBackup().catch((error) => {
        console.error(`[private-backup] ${safePrivateBackupError(error)}`);
      });
    }, privateBackupDebounceMinutes * 60 * 1000);
    privateBackupTimer.unref?.();
  } catch (error) {
    privateBackupScheduledForAt = null;
    privateBackupState = { ...privateBackupState, lastResult: "failed", lastError: safePrivateBackupError(error) };
    console.error(`[private-backup] scheduling failed: ${safePrivateBackupError(error)}`);
  }
}

function publicPrivateBackupStatus() {
  const configuration = privateBackupConfiguration();
  return {
    configured: configuration.configured,
    configurationError: configuration.configured ? null : configuration.error,
    repository: privateBackupRepo || null,
    branch: privateBackupBranch,
    retentionDailyCopies: privateBackupRetentionCount,
    debounceMinutes: privateBackupDebounceMinutes,
    recipientFingerprintSha256: configuration.configured ? configuration.publicKeyFingerprint : null,
    scheduled: Boolean(privateBackupTimer),
    scheduledForAt: privateBackupScheduledForAt,
    running: Boolean(privateBackupPromise),
    ...privateBackupState
  };
}

async function importPrivateArchiveBuffer(buffer, fileName = "smc-private-data.zip") {
  const entries = readZipEntries(buffer);
  const manifest = JSON.parse(entries.get("manifest.json")?.toString("utf8") || "{}");
  if (manifest.archiveType !== privateArchiveType) throw new Error("Unsupported archive");
  const archiveVersion = Number(manifest.archiveVersion);
  if (!Number.isInteger(archiveVersion) || archiveVersion < 1) throw new Error("Unsupported archive version");
  if (archiveVersion > privateArchiveVersion) throw new Error("Archive version is newer");

  const profile = cleanPrivateProfile(JSON.parse(entries.get("data/profile.json")?.toString("utf8") || "{}"));
  const mailVaultEntry = entries.get("data/mail-vault.json");
  const parsedMailVault = mailVaultEntry
    ? cleanPrivateMailVault(JSON.parse(mailVaultEntry.toString("utf8") || "{}"))
    : null;
  const previousProfile = { ...(await loadPrivateProfile()) };
  const previousMailVault = { ...(await loadPrivateMailVault()) };
  try {
    await writePrivateJsonFile(privateProfileFile, profile);
    if (parsedMailVault) await writePrivateJsonFile(privateMailVaultFile, parsedMailVault);
    privateProfileStore = profile;
    if (parsedMailVault) privateMailVaultStore = parsedMailVault;
    schedulePrivateBackup();
  } catch (error) {
    await Promise.allSettled([
      writePrivateJsonFile(privateProfileFile, previousProfile),
      writePrivateJsonFile(privateMailVaultFile, previousMailVault)
    ]);
    privateProfileStore = previousProfile;
    privateMailVaultStore = previousMailVault;
    throw error;
  }
  return {
    fileName: String(fileName || "smc-private-data.zip").replace(/[^\w.-]+/g, "_").slice(0, 160),
    imported: mailVaultEntry ? ["profile", "mail-vault"] : ["profile"],
    profile,
    mailVault: parsedMailVault || previousMailVault
  };
}

function publicPrivateSession(session, currentId = "") {
  return {
    id: session.id,
    current: session.id === currentId,
    remember: Boolean(session.remember),
    label: session.label || "Unknown device",
    createdAt: session.createdAt,
    lastSeenAt: session.lastSeenAt,
    expiresAt: session.expiresAt
  };
}

async function currentPrivateSession(req) {
  const cookie = parseCookies(req.headers.cookie || "")[privateCookieName] || "";
  const [id, token] = cookie.split(".");
  if (!id || !token) return null;

  const store = await loadPrivateSessions();
  const now = Date.now();
  let changed = false;
  store.sessions = store.sessions.filter((session) => {
    const keep = Date.parse(session.expiresAt) > now;
    changed ||= !keep;
    return keep;
  });

  const session = store.sessions.find((item) => item.id === id);
  if (!session || session.tokenHash !== hashPrivateToken(token)) {
    if (changed) await savePrivateSessions();
    return null;
  }

  session.lastSeenAt = new Date(now).toISOString();
  await savePrivateSessions();
  return session;
}

function loginBlocked(req) {
  const ip = clientIp(req);
  const now = Date.now();
  const attempt = privateLoginAttempts.get(ip);
  if (!attempt) return false;
  if (attempt.blockUntil && attempt.blockUntil > now) return true;
  if (now - attempt.firstAt > privateLoginWindowMs) privateLoginAttempts.delete(ip);
  return false;
}

function recordLoginFailure(req) {
  const ip = clientIp(req);
  const now = Date.now();
  const attempt = privateLoginAttempts.get(ip) || { count: 0, firstAt: now, blockUntil: 0 };
  if (now - attempt.firstAt > privateLoginWindowMs) {
    attempt.count = 0;
    attempt.firstAt = now;
    attempt.blockUntil = 0;
  }
  attempt.count += 1;
  if (attempt.count >= privateLoginMaxFailures) attempt.blockUntil = now + privateLoginBlockMs;
  privateLoginAttempts.set(ip, attempt);
}

function clearLoginFailures(req) {
  privateLoginAttempts.delete(clientIp(req));
}

function sanitizeName(value, fallback) {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  return text ? text.slice(0, 18) : fallback;
}

function makeRoomCode(store) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 20; attempt += 1) {
    let code = "";
    for (let i = 0; i < 5; i += 1) code += alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!store.has(code)) return code;
  }
  return String(Date.now()).slice(-5).toUpperCase();
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 128 * 1024) req.destroy();
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

function readBufferBody(req, maxBytes = 4 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const declaredSize = Number(req.headers["content-length"] || 0);
    if (Number.isFinite(declaredSize) && declaredSize > maxBytes) {
      reject(new Error("Archive too large"));
      req.resume();
      return;
    }
    const chunks = [];
    let size = 0;
    let failed = false;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        failed = true;
        chunks.length = 0;
        return;
      }
      if (!failed) chunks.push(chunk);
    });
    req.on("end", () => {
      if (failed) reject(new Error("Archive too large"));
      else resolve(Buffer.concat(chunks));
    });
    req.on("error", reject);
  });
}

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env || process.env,
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    let didTimeout = false;
    const timer = setTimeout(() => {
      didTimeout = true;
      child.kill("SIGKILL");
      reject(new Error(`${options.label || command} timed out after ${Math.round((options.timeoutMs || 8000) / 1000)}s`));
    }, options.timeoutMs || 8000);
    const maxStdout = options.maxStdout || 64 * 1024;

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
      if (stdout.length > maxStdout) child.kill("SIGKILL");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (didTimeout) return;
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(stderr.trim() || `${command} exited with code ${code}`));
    });

    if (options.input) child.stdin.end(options.input);
    else child.stdin.end();
  });
}

function studyPythonEnv(extra = {}) {
  const pythonPath = [studyPythonPackages, process.env.PYTHONPATH].filter(Boolean).join(delimiter);
  return {
    ...process.env,
    PYTHONPATH: pythonPath,
    PYTHONUNBUFFERED: "1",
    PYTHONDONTWRITEBYTECODE: "1",
    ...extra
  };
}

async function ensureStudyPythonDependencies() {
  try {
    await runProcess(pythonCommand, ["-c", "import sympy"], {
      env: studyPythonEnv(),
      label: "study dependency check",
      timeoutMs: 20000
    });
    return;
  } catch {
    // Install below.
  }

  if (process.env.SMC_SKIP_RUNTIME_PIP === "1") {
    throw new Error("学习工具 Python 依赖缺失：请在部署构建阶段运行 npm install 或 npm run install:study");
  }

  if (!studyDepsPromise) {
    studyDepsPromise = mkdir(studyPythonPackages, { recursive: true })
      .then(() => runProcess(pythonCommand, [
        "-m",
        "pip",
        "install",
        "--disable-pip-version-check",
        "--target",
        studyPythonPackages,
        "-r",
        studyRequirements
      ], {
        cwd: __dirname,
        env: process.env,
        label: "study dependency install",
        maxStdout: 512 * 1024,
        timeoutMs: 180000
      }))
      .finally(() => {
        studyDepsPromise = null;
      });
  }
  await studyDepsPromise;

  await runProcess(pythonCommand, ["-c", "import sympy"], {
    env: studyPythonEnv(),
    label: "study dependency check",
    timeoutMs: 20000
  });
}

async function ensurePadicBinary() {
  try {
    await access(padicBinary);
    return;
  } catch {
    // Build below.
  }

  if (!padicBuildPromise) {
    padicBuildPromise = runProcess("make", ["clean", "all"], {
      cwd: padicDir,
      timeoutMs: 20000
    }).finally(() => {
      padicBuildPromise = null;
    });
  }
  await padicBuildPromise;
}

function privateDeviceLabel(req) {
  const ua = String(req.headers["user-agent"] || "Unknown device");
  if (/iPhone|iPad|Android/i.test(ua)) return "Mobile browser";
  if (/Macintosh|Mac OS X/i.test(ua)) return "Mac browser";
  if (/Windows/i.test(ua)) return "Windows browser";
  if (/Linux/i.test(ua)) return "Linux browser";
  return "Browser";
}

const mailProviderConfigs = {
  gmail: { imapHost: "imap.gmail.com", imapPort: 993, smtpHost: "smtp.gmail.com", smtpPort: 465, smtpSecure: true },
  qq: { imapHost: "imap.qq.com", imapPort: 993, smtpHost: "smtp.qq.com", smtpPort: 465, smtpSecure: true },
  "163": { imapHost: "imap.163.com", imapPort: 993, smtpHost: "smtp.163.com", smtpPort: 465, smtpSecure: true },
  icloud: { imapHost: "imap.mail.me.com", imapPort: 993, smtpHost: "smtp.mail.me.com", smtpPort: 587, smtpSecure: false, startTls: true }
};
const mailSmtpBlockedReason = String(process.env.SMC_MAIL_SMTP_BLOCKED || "").trim();
const mailEhloHost = String(process.env.SMC_MAIL_EHLO_HOST || "smallmagellaniccloud.cyou")
  .trim()
  .replace(/[^a-z0-9.-]/gi, "") || "smallmagellaniccloud.cyou";

function mailProviderConfig(provider) {
  const config = mailProviderConfigs[String(provider || "").toLowerCase()];
  if (!config) throw new Error("Mail provider not configured");
  return config;
}

function cleanMailAccount(account = {}) {
  const provider = String(account.provider || "").trim().toLowerCase();
  const address = String(account.address || "").trim().slice(0, 180);
  const secretType = String(account.secretType || "app-password").trim().toLowerCase();
  const rawSecret = String(account.secret || "").trim().slice(0, 6000);
  const secret = secretType === "oauth" ? rawSecret : rawSecret.replace(/\s+/g, "");
  if (!address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) throw new Error("Invalid mail account");
  if (!secret) throw new Error("Missing mail secret");
  return {
    provider,
    address,
    secret,
    secretType
  };
}

function mailFriendlyError(error, account = {}, action = "mail") {
  const provider = String(account?.provider || "").toLowerCase();
  const raw = String(error?.message || error || "").trim();
  const lower = raw.toLowerCase();
  if (lower.includes("smtp blocked by hosting")) {
    return "当前 Render 免费实例禁止连接 SMTP 发件端口（QQ 使用 465）；IMAP 993 收件不受影响。若要在本站发信，请升级为付费实例或配置 HTTPS 邮件中继。";
  }
  if (provider === "qq" && (lower.includes("login fail") || lower.includes("account is abnormal") || lower.includes("password is incorrect") || lower.includes("535") || lower.includes("auth"))) {
    return "QQ 邮箱登录失败：请确认已在 QQ 邮箱网页版开启 IMAP/SMTP 服务，并填写“授权码”而不是 QQ 登录密码。若刚失败多次，请等几分钟后再试。";
  }
  if (provider === "gmail" && (lower.includes("auth") || lower.includes("535") || lower.includes("invalid") || lower.includes("mail send failed"))) {
    return "Gmail 认证失败：当前实现需要 Gmail 应用专用密码，不能直接使用网页登录密码；请确认已开启两步验证并使用 16 位应用专用密码。";
  }
  if (provider === "icloud" && (lower.includes("auth") || lower.includes("535") || lower.includes("login"))) {
    return "iCloud 认证失败：请使用 Apple ID 的应用专用密码，不要使用 Apple ID 登录密码。";
  }
  if (provider === "163" && (lower.includes("auth") || lower.includes("login") || lower.includes("password"))) {
    return "163 邮箱登录失败：请确认已开启 IMAP/SMTP，并使用客户端授权密码。";
  }
  if (lower.includes("provider not configured")) {
    return "这个邮箱类型还没有服务器配置；HRBEU 或自定义邮箱需要先补 IMAP/SMTP 主机和端口。";
  }
  if (action === "send" && (lower.includes("timed out") || lower.includes("econnrefused") || lower.includes("enetunreach") || lower.includes("ehostunreach"))) {
    return "无法连接 SMTP 发件服务器；收件与发件使用不同端口，因此收件正常并不代表发件连接可用。";
  }
  if (lower.includes("timed out")) {
    return "邮箱服务器连接超时：请稍后再试，或确认该邮箱已开启 IMAP/SMTP 服务。";
  }
  return raw || (action === "send" ? "Mail send failed" : "Mail fetch failed");
}

function mailLoginIdentities(account) {
  const address = String(account.address || "").trim();
  const local = address.split("@")[0];
  if (account.provider === "qq" && local && local !== address) return [address, local];
  return [address];
}

function encodeMailHeader(value = "") {
  const text = String(value || "").replace(/[\r\n]+/g, " ").trim();
  if (/^[\x20-\x7e]*$/.test(text)) return text;
  return `=?UTF-8?B?${Buffer.from(text, "utf8").toString("base64")}?=`;
}

function normalizeMailBody(value = "") {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.startsWith(".") ? `.${line}` : line)
    .join("\r\n");
}

function socketLineClient(socket, timeoutMs = 25000) {
  let buffer = Buffer.alloc(0);
  const maxBufferedBytes = 8 * 1024 * 1024;
  const waiters = [];
  const takeLine = () => {
    const index = buffer.indexOf(0x0a);
    if (index < 0) return null;
    const raw = buffer.subarray(0, index + 1);
    buffer = buffer.subarray(index + 1);
    return raw.toString("utf8").replace(/\r?\n$/, "");
  };
  const pump = () => {
    while (waiters.length) {
      const waiter = waiters[0];
      if (waiter.type === "line") {
        const line = takeLine();
        if (line === null) return;
        waiters.shift();
        waiter.resolve(line);
        continue;
      }
      if (buffer.length < waiter.length) return;
      const bytes = buffer.subarray(0, waiter.length);
      buffer = buffer.subarray(waiter.length);
      waiters.shift();
      waiter.resolve(bytes);
    }
  };
  const fail = (error) => {
    while (waiters.length) waiters.shift().reject(error);
  };
  socket.on("data", (chunk) => {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    buffer = buffer.length ? Buffer.concat([buffer, bytes]) : bytes;
    if (buffer.length > maxBufferedBytes) {
      socket.destroy(new Error("Mail response buffer exceeded"));
      return;
    }
    pump();
  });
  socket.on("error", fail);
  socket.on("close", () => fail(new Error("Mail connection closed")));
  return {
    socket,
    readLine() {
      const line = takeLine();
      if (line !== null) return Promise.resolve(line);
      return new Promise((resolve, reject) => {
        const waiter = {
          type: "line",
          resolve(line) {
            clearTimeout(timer);
            resolve(line);
          },
          reject(error) {
            clearTimeout(timer);
            reject(error);
          }
        };
        const timer = setTimeout(() => {
          const index = waiters.indexOf(waiter);
          if (index >= 0) waiters.splice(index, 1);
          reject(new Error("Mail connection timed out"));
        }, timeoutMs);
        waiters.push(waiter);
      });
    },
    readBytes(length) {
      if (!Number.isSafeInteger(length) || length < 0) return Promise.reject(new Error("Invalid mail literal length"));
      if (buffer.length >= length) {
        const bytes = buffer.subarray(0, length);
        buffer = buffer.subarray(length);
        return Promise.resolve(bytes);
      }
      return new Promise((resolve, reject) => {
        const waiter = {
          type: "bytes",
          length,
          resolve(bytes) {
            clearTimeout(timer);
            resolve(bytes);
          },
          reject(error) {
            clearTimeout(timer);
            reject(error);
          }
        };
        const timer = setTimeout(() => {
          const index = waiters.indexOf(waiter);
          if (index >= 0) waiters.splice(index, 1);
          reject(new Error("Mail connection timed out"));
        }, timeoutMs);
        waiters.push(waiter);
      });
    },
    writeLine(line) {
      socket.write(`${line}\r\n`);
    },
    end() {
      socket.end();
    }
  };
}

function openMailSocket(config, mode = "imap") {
  return new Promise((resolve, reject) => {
    const secure = mode === "imap" || config.smtpSecure;
    const host = mode === "imap" ? config.imapHost : config.smtpHost;
    const port = mode === "imap" ? config.imapPort : config.smtpPort;
    const socket = secure
      ? tlsConnect({ host, port, servername: host }, () => resolve(socketLineClient(socket)))
      : netConnect({ host, port }, () => resolve(socketLineClient(socket)));
    socket.setTimeout(25000, () => {
      socket.destroy(new Error("Mail connection timed out"));
    });
    socket.once("error", reject);
  });
}

async function readSmtpResponse(client) {
  const lines = [];
  while (true) {
    const line = await client.readLine();
    lines.push(line);
    if (/^\d{3} /.test(line)) break;
  }
  const code = Number(lines[0]?.slice(0, 3));
  return { code, text: lines.join("\n") };
}

async function smtpCommand(client, command, ok = [250]) {
  if (command) client.writeLine(command);
  const response = await readSmtpResponse(client);
  if (!ok.includes(response.code)) throw new Error(response.text || "SMTP command failed");
  return response;
}

async function smtpAuth(client, account) {
  if (account.secretType === "oauth") {
    const token = Buffer.from(`user=${account.address}\x01auth=Bearer ${account.secret}\x01\x01`, "utf8").toString("base64");
    const response = await smtpCommand(client, `AUTH XOAUTH2 ${token}`, [235, 334]);
    if (response.code === 334) await smtpCommand(client, "", [235]);
    return;
  }
  let lastError = null;
  for (const identity of mailLoginIdentities(account)) {
    try {
      await smtpCommand(client, "AUTH LOGIN", [334]);
      await smtpCommand(client, Buffer.from(identity, "utf8").toString("base64"), [334]);
      await smtpCommand(client, Buffer.from(account.secret, "utf8").toString("base64"), [235]);
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("SMTP authentication failed");
}

async function upgradeSmtpStartTls(client, host) {
  await smtpCommand(client, "STARTTLS", [220]);
  const oldSocket = client.socket;
  oldSocket.removeAllListeners("data");
  return new Promise((resolve, reject) => {
    const secureSocket = tlsConnect({ socket: oldSocket, servername: host }, () => resolve(socketLineClient(secureSocket)));
    secureSocket.once("error", reject);
  });
}

async function sendProviderMail(accountInput, message = {}) {
  const account = cleanMailAccount(accountInput);
  const config = mailProviderConfig(account.provider);
  const to = String(message.to || "").trim().slice(0, 260);
  const subject = String(message.subject || "").trim().slice(0, 240);
  const body = String(message.body || "").slice(0, 100000);
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) throw new Error("Invalid recipient");
  if (!subject) throw new Error("Missing subject");
  if (mailSmtpBlockedReason) throw new Error(`SMTP blocked by hosting: ${mailSmtpBlockedReason}`);

  let client = await openMailSocket(config, "smtp");
  try {
    await smtpCommand(client, null, [220]);
    await smtpCommand(client, `EHLO ${mailEhloHost}`);
    if (config.startTls) {
      client = await upgradeSmtpStartTls(client, config.smtpHost);
      await smtpCommand(client, `EHLO ${mailEhloHost}`);
    }
    await smtpAuth(client, account);
    await smtpCommand(client, `MAIL FROM:<${account.address}>`);
    await smtpCommand(client, `RCPT TO:<${to}>`, [250, 251]);
    await smtpCommand(client, "DATA", [354]);
    const headers = [
      `From: <${account.address}>`,
      `To: <${to}>`,
      `Subject: ${encodeMailHeader(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${randomBytes(18).toString("hex")}@${mailEhloHost}>`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit"
    ].join("\r\n");
    client.writeLine(`${headers}\r\n\r\n${normalizeMailBody(body)}\r\n.`);
    await smtpCommand(client, null);
    client.writeLine("QUIT");
    return { ok: true, sentAt: new Date().toISOString() };
  } finally {
    client.end();
  }
}

function quoteImap(value = "") {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

async function imapCommand(client, tag, command) {
  client.writeLine(`${tag} ${command}`);
  const lines = [];
  let responseBytes = 0;
  while (true) {
    const line = await client.readLine();
    responseBytes += Buffer.byteLength(line, "utf8");
    if (lines.length >= 10000 || responseBytes > 4 * 1024 * 1024) throw new Error("IMAP response too large");
    lines.push(line);
    if (line.startsWith(`${tag} `)) break;
  }
  if (!new RegExp(`^${tag} OK`, "i").test(lines.at(-1) || "")) throw new Error(lines.at(-1) || "IMAP command failed");
  return lines;
}

const mailMessageFetchBytes = 512 * 1024;
const mailMessageTextChars = 120000;
const mailInsightHeaderBytes = 2 * 1024 * 1024;
const mailInsightDefaultDays = 180;
const mailInsightDefaultMessages = 200;
const mailInsightMaxDays = 365;
const mailInsightMaxMessages = 500;
const mailInsightMaxItems = 200;
const mailInsightPublicSuffix2 = new Set([
  "com.cn", "net.cn", "org.cn", "gov.cn", "co.uk", "org.uk", "me.uk", "co.jp", "ne.jp",
  "com.au", "net.au", "org.au", "co.nz", "com.sg", "com.hk", "com.tw", "com.br", "com.mx"
]);

function cleanMailUid(value) {
  const uid = String(value ?? "").trim();
  if (!/^[1-9]\d{0,9}$/.test(uid) || Number(uid) > 0xffffffff) throw new Error("Invalid mail UID");
  return uid;
}

async function imapLiteralCommand(client, tag, command, maxLiteralBytes = mailMessageFetchBytes) {
  client.writeLine(`${tag} ${command}`);
  const lines = [];
  const literals = [];
  let metadataBytes = 0;
  let literalBytes = 0;
  while (true) {
    const line = await client.readLine();
    metadataBytes += Buffer.byteLength(line, "utf8");
    if (lines.length >= 2000 || metadataBytes > 256 * 1024) throw new Error("IMAP response too large");
    lines.push(line);
    const literalMatch = line.match(/\{(\d+)\+?\}$/);
    if (literalMatch) {
      const length = Number(literalMatch[1]);
      if (!Number.isSafeInteger(length) || length < 0 || length > maxLiteralBytes || literalBytes + length > maxLiteralBytes) {
        throw new Error("Mail message is too large");
      }
      const bytes = await client.readBytes(length);
      literalBytes += bytes.length;
      literals.push({ prefix: line, bytes });
    }
    if (line.startsWith(`${tag} `)) {
      if (!new RegExp(`^${tag} OK`, "i").test(line)) throw new Error(line || "IMAP command failed");
      break;
    }
  }
  return { lines, literals };
}

async function imapAuth(client, account) {
  if (account.secretType === "oauth") {
    const token = Buffer.from(`user=${account.address}\x01auth=Bearer ${account.secret}\x01\x01`, "utf8").toString("base64");
    await imapCommand(client, "A1", `AUTHENTICATE XOAUTH2 ${token}`);
    return;
  }
  let lastError = null;
  let index = 1;
  for (const identity of mailLoginIdentities(account)) {
    try {
      await imapCommand(client, `A${index}`, `LOGIN ${quoteImap(identity)} ${quoteImap(account.secret)}`);
      return;
    } catch (error) {
      lastError = error;
      index += 1;
    }
  }
  throw lastError || new Error("IMAP authentication failed");
}

function decodeMailBytes(bytes, charset = "utf-8") {
  const label = String(charset || "utf-8").trim().replace(/^['"]|['"]$/g, "").toLowerCase();
  try {
    return new TextDecoder(label || "utf-8", { fatal: false }).decode(bytes);
  } catch {
    return bytes.toString(label === "iso-8859-1" || label === "latin1" ? "latin1" : "utf8");
  }
}

function decodeQuotedPrintable(bytes, mimeWord = false) {
  const source = bytes.toString("latin1").replace(mimeWord ? /_/g : /$^/, " ");
  const output = [];
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === "=" && (source.slice(index + 1, index + 3) === "\r\n" || source[index + 1] === "\n")) {
      index += source[index + 1] === "\r" ? 2 : 1;
      continue;
    }
    const hex = source.slice(index + 1, index + 3);
    if (source[index] === "=" && /^[0-9a-f]{2}$/i.test(hex)) {
      output.push(Number.parseInt(hex, 16));
      index += 2;
    } else {
      output.push(source.charCodeAt(index) & 0xff);
    }
  }
  return Buffer.from(output);
}

function decodeMailHeader(value = "") {
  const input = String(value || "").replace(/\r?\n[ \t]+/g, " ");
  return input.replace(/=\?([^?]+)\?([bq])\?([^?]*)\?=(?:\s+(?==\?))?/ig, (match, charset, encoding, encoded) => {
    try {
      const bytes = encoding.toLowerCase() === "b"
        ? Buffer.from(encoded.replace(/\s+/g, ""), "base64")
        : decodeQuotedPrintable(Buffer.from(encoded, "latin1"), true);
      return decodeMailBytes(bytes, charset);
    } catch {
      return match;
    }
  }).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
}

function parseMailHeaders(bytes) {
  let splitAt = bytes.indexOf(Buffer.from("\r\n\r\n"));
  let separatorLength = 4;
  if (splitAt < 0) {
    splitAt = bytes.indexOf(Buffer.from("\n\n"));
    separatorLength = 2;
  }
  if (splitAt < 0 || splitAt > 128 * 1024) return { headers: new Map(), body: Buffer.alloc(0) };
  const headers = new Map();
  const unfolded = bytes.subarray(0, splitAt).toString("latin1").replace(/\r?\n[ \t]+/g, " ");
  for (const line of unfolded.split(/\r?\n/)) {
    const match = line.match(/^([^:\s]+):\s*(.*)$/);
    if (!match) continue;
    const key = match[1].toLowerCase();
    headers.set(key, headers.has(key) ? `${headers.get(key)}, ${match[2]}` : match[2]);
  }
  return { headers, body: bytes.subarray(splitAt + separatorLength) };
}

function parseMailContentType(value = "text/plain") {
  const source = String(value || "text/plain");
  const type = source.split(";", 1)[0].trim().toLowerCase() || "text/plain";
  const params = new Map();
  const pattern = /;\s*([^=;\s]+)\s*=\s*(?:"([^"]*)"|([^;\s]*))/g;
  let match;
  while ((match = pattern.exec(source))) params.set(match[1].toLowerCase(), match[2] ?? match[3] ?? "");
  return { type, params };
}

function splitMailMultipart(body, boundary) {
  if (!boundary || boundary.length > 200 || /[\r\n\0]/.test(boundary)) return [];
  const marker = `--${boundary}`;
  const parts = [];
  let current = null;
  for (const line of body.toString("latin1").replace(/\r\n/g, "\n").split("\n")) {
    if (line === marker || line === `${marker}--`) {
      if (current) parts.push(Buffer.from(current.join("\n"), "latin1"));
      current = line.endsWith("--") ? null : [];
      if (line.endsWith("--")) break;
    } else if (current) {
      current.push(line);
    }
  }
  if (current?.length) parts.push(Buffer.from(current.join("\n"), "latin1"));
  return parts.slice(0, 60);
}

function mailHtmlToText(html = "") {
  const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return String(html)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|noscript|template|svg|object)[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(br|\/p|\/div|\/li|\/tr|\/h[1-6])\s*\/?>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, entity) => {
      if (entity[0] !== "#") return entities[entity.toLowerCase()] ?? "";
      const code = Number.parseInt(entity.slice(entity[1]?.toLowerCase() === "x" ? 2 : 1), entity[1]?.toLowerCase() === "x" ? 16 : 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "";
    });
}

function normalizeMailText(text = "") {
  return String(text).replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/[ \t]+\n/g, "\n").replace(/\n{4,}/g, "\n\n\n").trim();
}

function decodeMailPart(body, transferEncoding, charset) {
  const encoding = String(transferEncoding || "").trim().toLowerCase();
  let bytes = body;
  if (encoding === "base64") bytes = Buffer.from(body.toString("latin1").replace(/[^a-z0-9+/=]/gi, ""), "base64");
  if (encoding === "quoted-printable") bytes = decodeQuotedPrintable(body);
  return decodeMailBytes(bytes, charset);
}

function parseMailMimeEntity(bytes, depth = 0, state = { parts: 0 }) {
  if (depth > 8 || state.parts >= 60) return [];
  state.parts += 1;
  const { headers, body } = parseMailHeaders(bytes);
  const contentType = parseMailContentType(headers.get("content-type") || "text/plain; charset=utf-8");
  const disposition = parseMailContentType(headers.get("content-disposition") || "");
  if (disposition.type === "attachment" || disposition.params.has("filename") || contentType.params.has("name")) return [];
  if (contentType.type.startsWith("multipart/")) {
    const children = splitMailMultipart(body, contentType.params.get("boundary"))
      .flatMap((part) => parseMailMimeEntity(part, depth + 1, state));
    if (contentType.type === "multipart/alternative") {
      const plain = children.filter((item) => item.kind === "plain");
      return plain.length ? plain : children.filter((item) => item.kind === "html").slice(0, 1);
    }
    return children;
  }
  if (contentType.type !== "text/plain" && contentType.type !== "text/html") return [];
  const decoded = decodeMailPart(body, headers.get("content-transfer-encoding"), contentType.params.get("charset") || "utf-8");
  const text = normalizeMailText(contentType.type === "text/html" ? mailHtmlToText(decoded) : decoded);
  return text ? [{ kind: contentType.type === "text/html" ? "html" : "plain", text }] : [];
}

function parseFetchedMessage(bytes, uid, declaredSize = bytes.length) {
  const { headers } = parseMailHeaders(bytes);
  const parts = parseMailMimeEntity(bytes);
  const combined = normalizeMailText(parts.map((part) => part.text).join("\n\n"));
  const bodyWasCut = combined.length > mailMessageTextChars;
  return {
    id: uid,
    from: decodeMailHeader(headers.get("from") || "").slice(0, 500),
    subject: decodeMailHeader(headers.get("subject") || "").slice(0, 500),
    date: decodeMailHeader(headers.get("date") || "").slice(0, 160),
    body: combined.slice(0, mailMessageTextChars),
    bodyFormat: "plain",
    truncated: declaredSize > bytes.length || bodyWasCut
  };
}

function parseFetchedHeaders(lines) {
  const messages = [];
  let current = null;
  for (const line of lines) {
    const uidMatch = line.match(/UID\s+(\d+)/i);
    if (uidMatch) {
      current = { id: uidMatch[1], from: "", subject: "", date: "" };
      messages.push(current);
    }
    if (!current) continue;
    const header = line.match(/^(From|Subject|Date):\s*(.*)$/i);
    if (!header) continue;
    const key = header[1].toLowerCase();
    current[key] = decodeMailHeader(header[2].trim()).slice(0, 260);
  }
  return messages.filter((item) => item.id).slice(-20).reverse();
}

function cleanMailInsightOptions(input = {}) {
  const readInteger = (value, fallback, max, label) => {
    if (value === undefined || value === null || value === "") return fallback;
    const number = Number(value);
    if (!Number.isInteger(number) || number < 1 || number > max) throw new Error(`Invalid ${label}`);
    return number;
  };
  return {
    sinceDays: readInteger(input.sinceDays, mailInsightDefaultDays, mailInsightMaxDays, "sinceDays"),
    maxMessages: readInteger(input.maxMessages, mailInsightDefaultMessages, mailInsightMaxMessages, "maxMessages")
  };
}

function safeMailInsightText(value = "", maxLength = 240) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function mailInsightBaseDomain(hostname = "") {
  const domain = String(hostname || "").trim().toLowerCase().replace(/^\.+|\.+$/g, "");
  if (!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain)) return "";
  const labels = domain.split(".");
  const suffix = labels.slice(-2).join(".");
  const count = mailInsightPublicSuffix2.has(suffix) ? 3 : 2;
  return labels.slice(-Math.min(count, labels.length)).join(".");
}

function mailInsightSender(fromHeader = "") {
  const from = safeMailInsightText(decodeMailHeader(fromHeader), 500);
  const addresses = [...from.matchAll(/(?:^|[^a-z0-9.!#$%&'*+/=?^_`{|}~-])([a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@([a-z0-9.-]{1,253}\.[a-z]{2,63}))/ig)];
  const match = addresses.at(-1);
  const domain = mailInsightBaseDomain(match?.[2] || "");
  if (!domain) return null;
  let name = safeMailInsightText(from.replace(/<[^>]*>/g, "").replace(match?.[1] || "", "").replace(/^['\"]+|['\"]+$/g, ""), 120);
  if (!name || /^(?:no[._ -]?reply|do[._ -]?not[._ -]?reply|mailer|mail|support|service|team|notification|notifications|account|billing)$/i.test(name)) {
    const root = domain.split(".")[0].replace(/[-_]+/g, " ");
    name = root.replace(/\b[a-z]/g, (letter) => letter.toUpperCase()).slice(0, 120);
  }
  return { service: domain, name, domain };
}

function mailInsightEvidence(uid, headers) {
  const subject = safeMailInsightText(decodeMailHeader(headers.get("subject") || ""), 300);
  const normalized = subject.toLowerCase();
  const has = (pattern) => pattern.test(normalized);
  const listSignals = [];
  if (headers.get("list-id")) listSignals.push("list-id");
  if (headers.get("list-unsubscribe")) listSignals.push("list-unsubscribe");

  const failed = has(/\b(?:payment|renewal|charge|billing|card)\s+(?:has\s+)?(?:failed|declined|unsuccessful)\b|\b(?:past due|billing problem|payment issue)\b|(?:付款|支付|扣款|续费|账单)(?:失败|未成功|被拒)|付款方式(?:失效|有问题)|逾期/iu);
  const cancelled = has(/\b(?:subscription|membership|plan|auto[ -]?renew(?:al)?)\s+(?:has\s+been\s+)?(?:cancelled|canceled|ended|expired|disabled|turned off)\b|\b(?:cancelled|canceled)\s+(?:subscription|membership|plan)\b|(?:订阅|会员|套餐)(?:已)?(?:取消|终止|到期)|自动续费(?:已)?(?:关闭|取消)/iu);
  const recurringStrong = has(/\b(?:auto[ -]?renew(?:al|ed|ing)?|recurring (?:payment|charge|billing)|next billing|renews? (?:on|soon)|renewal (?:confirmation|notice|receipt)|subscription (?:renewed|renewal|payment|receipt)|membership (?:renewed|renewal))\b|自动续费|续费(?:成功|确认|通知|收据)|周期(?:扣款|账单)|下次扣款|订阅(?:续订|扣款|账单)/iu);
  const recurringContext = has(/\b(?:subscription|membership|premium|paid plan|billing cycle|renewal)\b|订阅|会员|付费套餐|续费|自动续费/iu);
  const moneyContext = has(/\b(?:charged|payment|paid|billing|bill|invoice|receipt|price|amount)\b|(?:扣款|付款|支付|账单|发票|收据|金额)|[$¥￥€£]\s*\d|\b(?:usd|cny|rmb|eur|gbp)\b/iu);
  const purchaseStrong = has(/\b(?:order|purchase|payment) (?:confirmation|confirmed|complete|completed|successful|receipt)\b|\byour (?:order|receipt|invoice)\b|\binvoice\s*(?:#|no\.?|number)\b|订单(?:确认|已完成|成功)|购买(?:成功|确认)|(?:支付|付款)(?:成功|确认)|电子发票|付款收据/iu);
  const accountStrong = has(/\b(?:verify|confirm|activate) (?:your )?(?:email|account)\b|\b(?:account|registration) (?:created|confirmed|complete|activated)\b|\bwelcome to\b|验证(?:您的)?邮箱|确认(?:您的)?邮箱|激活(?:您的)?账户|账号(?:注册|创建)(?:成功|完成)|注册(?:成功|完成)|欢迎(?:加入|使用)/iu);
  const accountWeak = has(/\b(?:password reset|sign[ -]?in code|login code|security code|new (?:sign[ -]?in|login))\b|密码重置|登录验证码|安全验证码|新(?:设备)?登录/iu);
  const newsletterSubject = has(/\b(?:newsletter|weekly digest|daily digest|unsubscribe)\b|新闻简报|每周(?:摘要|速递)|每日(?:摘要|速递)|退订/iu);

  let category = "";
  let status = "possible";
  let confidence = 0;
  const signals = [];
  if (failed && (recurringContext || recurringStrong)) {
    category = "recurring";
    status = "failed";
    confidence = 0.94;
    signals.push("payment-failed", "subscription-context");
  } else if (cancelled && (recurringContext || recurringStrong)) {
    category = "recurring";
    status = "cancelled";
    confidence = 0.94;
    signals.push("subscription-cancelled");
  } else if (recurringStrong || (recurringContext && moneyContext)) {
    category = "recurring";
    status = failed ? "failed" : "active";
    confidence = recurringStrong && moneyContext ? 0.95 : 0.84;
    signals.push(recurringStrong ? "subscription-renewal" : "subscription-billing");
    if (moneyContext) signals.push("payment-language");
  } else if (failed && moneyContext) {
    category = "purchase";
    status = "failed";
    confidence = 0.88;
    signals.push("payment-failed");
  } else if (purchaseStrong) {
    category = "purchase";
    status = "completed";
    confidence = moneyContext ? 0.94 : 0.86;
    signals.push("purchase-confirmation");
    if (moneyContext) signals.push("payment-language");
  } else if (accountStrong || accountWeak) {
    category = "account";
    status = "possible";
    confidence = accountStrong ? 0.86 : 0.62;
    signals.push(accountStrong ? "account-registration" : "account-security-mail");
  } else if (listSignals.length || newsletterSubject) {
    category = "newsletter";
    status = /\b(?:unsubscribed|unsubscribe confirmation)\b|退订(?:成功|确认)/iu.test(normalized) ? "cancelled" : "possible";
    confidence = listSignals.length >= 2 ? 0.93 : listSignals.length ? 0.84 : 0.64;
    signals.push(...listSignals);
    if (newsletterSubject) signals.push("newsletter-subject");
  }
  if (!category) return null;

  const parsedDate = Date.parse(headers.get("date") || "");
  return {
    category,
    status,
    confidence,
    evidence: {
      uid: cleanMailUid(uid),
      date: Number.isFinite(parsedDate) ? new Date(parsedDate).toISOString() : safeMailInsightText(decodeMailHeader(headers.get("date") || ""), 100),
      subject,
      signals: [...new Set(signals)].slice(0, 5)
    },
    sortTime: Number.isFinite(parsedDate) ? parsedDate : Number(uid)
  };
}

function parseMailInsightHeaders(response) {
  const records = [];
  for (const literal of response.literals) {
    const uid = literal.prefix.match(/\bUID\s+(\d+)\b/i)?.[1];
    if (!uid) continue;
    const { headers } = parseMailHeaders(literal.bytes);
    if (headers.size) records.push({ uid, headers });
  }
  return records;
}

function aggregateMailInsights(records) {
  const groups = new Map();
  for (const record of records) {
    const sender = mailInsightSender(record.headers.get("from") || "");
    if (!sender) continue;
    const match = mailInsightEvidence(record.uid, record.headers);
    if (!match) continue;
    const key = `${sender.domain}|${match.category}`;
    let group = groups.get(key);
    if (!group) {
      group = { ...sender, category: match.category, matches: [] };
      groups.set(key, group);
    }
    group.matches.push(match);
    if (sender.name.length < group.name.length) group.name = sender.name;
  }

  const items = [];
  for (const group of groups.values()) {
    group.matches.sort((a, b) => b.sortTime - a.sortTime);
    const latest = group.matches[0];
    const evidence = group.matches.slice(0, 5).map((match) => match.evidence);
    const confidence = Math.min(0.99, Math.max(...group.matches.map((match) => match.confidence)) + Math.min(0.04, (group.matches.length - 1) * 0.01));
    items.push({
      service: group.service,
      name: group.name,
      domain: group.domain,
      category: group.category,
      status: latest.status,
      confidence: Number(confidence.toFixed(2)),
      inferred: true,
      evidence
    });
  }
  const categoryOrder = { recurring: 0, purchase: 1, account: 2, newsletter: 3 };
  const statusOrder = { failed: 0, cancelled: 1, active: 2, completed: 3, possible: 4 };
  return items.sort((a, b) => (categoryOrder[a.category] - categoryOrder[b.category])
    || (statusOrder[a.status] - statusOrder[b.status])
    || (b.confidence - a.confidence)
    || a.name.localeCompare(b.name)).slice(0, mailInsightMaxItems);
}

function mailInsightSearchDate(sinceDays) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - sinceDays);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getUTCDate()}-${months[date.getUTCMonth()]}-${date.getUTCFullYear()}`;
}

async function fetchProviderMailInsights(accountInput, optionsInput = {}) {
  const account = cleanMailAccount(accountInput);
  const options = cleanMailInsightOptions(optionsInput);
  const config = mailProviderConfig(account.provider);
  const client = await openMailSocket(config, "imap");
  try {
    await client.readLine();
    await imapAuth(client, account);
    await imapCommand(client, "A2", "SELECT INBOX");
    const searchLines = await imapCommand(client, "A3", `UID SEARCH SINCE ${mailInsightSearchDate(options.sinceDays)}`);
    const ids = searchLines
      .flatMap((line) => line.startsWith("* SEARCH") ? line.replace("* SEARCH", "").trim().split(/\s+/) : [])
      .filter((id) => /^[1-9]\d{0,9}$/.test(id) && Number(id) <= 0xffffffff)
      .slice(-options.maxMessages);
    if (!ids.length) {
      await imapCommand(client, "A5", "LOGOUT").catch(() => {});
      return {
        scope: { mailbox: "INBOX", ...options, scannedMessages: 0, headerOnly: true },
        summary: { account: 0, recurring: 0, purchase: 0, newsletter: 0 },
        items: []
      };
    }
    const response = await imapLiteralCommand(
      client,
      "A4",
      `UID FETCH ${ids.join(",")} (UID BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE LIST-ID LIST-UNSUBSCRIBE)])`,
      mailInsightHeaderBytes
    );
    await imapCommand(client, "A5", "LOGOUT").catch(() => {});
    const records = parseMailInsightHeaders(response);
    const items = aggregateMailInsights(records);
    const summary = items.reduce((counts, item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
      return counts;
    }, { account: 0, recurring: 0, purchase: 0, newsletter: 0 });
    return {
      scope: { mailbox: "INBOX", ...options, scannedMessages: records.length, headerOnly: true },
      summary,
      items
    };
  } finally {
    client.end();
  }
}

async function fetchProviderInbox(accountInput) {
  const account = cleanMailAccount(accountInput);
  const config = mailProviderConfig(account.provider);
  const client = await openMailSocket(config, "imap");
  try {
    await client.readLine();
    await imapAuth(client, account);
    await imapCommand(client, "A2", "SELECT INBOX");
    const searchLines = await imapCommand(client, "A3", "UID SEARCH ALL");
    const ids = searchLines
      .flatMap((line) => line.startsWith("* SEARCH") ? line.replace("* SEARCH", "").trim().split(/\s+/) : [])
      .filter(Boolean)
      .slice(-20);
    if (!ids.length) {
      await imapCommand(client, "A5", "LOGOUT").catch(() => {});
      return { messages: [] };
    }
    const fetchLines = await imapCommand(client, "A4", `UID FETCH ${ids.join(",")} (UID BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)])`);
    await imapCommand(client, "A5", "LOGOUT").catch(() => {});
    return { messages: parseFetchedHeaders(fetchLines) };
  } finally {
    client.end();
  }
}

async function fetchProviderMessage(accountInput, uidInput) {
  const account = cleanMailAccount(accountInput);
  const uid = cleanMailUid(uidInput);
  const config = mailProviderConfig(account.provider);
  const client = await openMailSocket(config, "imap");
  try {
    await client.readLine();
    await imapAuth(client, account);
    await imapCommand(client, "A2", "SELECT INBOX");
    const response = await imapLiteralCommand(
      client,
      "A3",
      `UID FETCH ${uid} (UID RFC822.SIZE BODY.PEEK[]<0.${mailMessageFetchBytes}>)`
    );
    const metadata = response.lines.join(" ");
    const returnedUid = metadata.match(/\bUID\s+(\d+)/i)?.[1];
    const literal = response.literals.length === 1 ? response.literals[0] : null;
    if (!literal || returnedUid !== uid) {
      const error = new Error("Mail message not found");
      error.code = "MAIL_NOT_FOUND";
      throw error;
    }
    const sizeMatch = metadata.match(/RFC822\.SIZE\s+(\d+)/i);
    const declaredSize = sizeMatch ? Number(sizeMatch[1]) : literal.bytes.length;
    await imapCommand(client, "A4", "LOGOUT").catch(() => {});
    return { message: parseFetchedMessage(literal.bytes, uid, declaredSize) };
  } finally {
    client.end();
  }
}

async function requirePrivateSession(req, res) {
  const session = await currentPrivateSession(req);
  if (session) return session;
  privateJson(res, 401, { authenticated: false, error: "Unauthorized" });
  return null;
}

async function handlePrivateApi(req, res, url) {
  if (!url.pathname.startsWith("/api/private/")) return false;
  if (req.method === "OPTIONS") {
    privateJson(res, 204, {});
    return true;
  }
  if (["POST", "PUT", "DELETE"].includes(req.method) && !sameOrigin(req)) {
    privateJson(res, 403, { error: "Forbidden" });
    return true;
  }

  const route = url.pathname.replace(/\/+$/, "");

  if (route === "/api/private/login") {
    if (req.method !== "POST") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    if (loginBlocked(req)) {
      privateJson(res, 429, { error: "Too many attempts" });
      return true;
    }

    const body = await readBody(req);
    if (!verifyPrivatePassword(body.password)) {
      recordLoginFailure(req);
      privateJson(res, 401, { authenticated: false, error: "Invalid password" });
      return true;
    }

    clearLoginFailures(req);
    const remember = Boolean(body.remember);
    const id = randomBytes(16).toString("hex");
    const token = randomBytes(32).toString("base64url");
    const now = Date.now();
    const expiresAt = now + (remember ? privateRememberMs : privateSessionMs);
    const session = {
      id,
      tokenHash: hashPrivateToken(token),
      remember,
      label: privateDeviceLabel(req),
      createdAt: new Date(now).toISOString(),
      lastSeenAt: new Date(now).toISOString(),
      expiresAt: new Date(expiresAt).toISOString()
    };

    const store = await loadPrivateSessions();
    store.sessions = store.sessions.filter((item) => Date.parse(item.expiresAt) > now);
    store.sessions.push(session);
    await savePrivateSessions();

    const maxAge = remember ? privateRememberMs / 1000 : undefined;
    privateJson(res, 200, {
      authenticated: true,
      session: publicPrivateSession(session, id)
    }, {
      "Set-Cookie": privateCookie(`${id}.${token}`, req, maxAge)
    });
    return true;
  }

  if (route === "/api/private/status") {
    if (req.method !== "GET") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    const session = await currentPrivateSession(req);
    privateJson(res, 200, {
      authenticated: Boolean(session),
      session: session ? publicPrivateSession(session, session.id) : null
    });
    return true;
  }

  if (route === "/api/private/logout") {
    if (req.method !== "POST") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    const session = await currentPrivateSession(req);
    if (session) {
      const store = await loadPrivateSessions();
      store.sessions = store.sessions.filter((item) => item.id !== session.id);
      await savePrivateSessions();
    }
    privateJson(res, 200, { authenticated: false }, {
      "Set-Cookie": privateCookieClear(req)
    });
    return true;
  }

  if (route === "/api/private/profile") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method === "GET") {
      try {
        privateJson(res, 200, { profile: await loadPrivateProfile() });
      } catch {
        privateJson(res, 500, { error: "Profile load failed" });
      }
      return true;
    }
    if (req.method === "PUT") {
      try {
        const body = await readBody(req);
        const profile = await savePrivateProfile(body.profile || body);
        privateJson(res, 200, { profile });
      } catch {
        privateJson(res, 500, { error: "Profile save failed" });
      }
      return true;
    }
    privateJson(res, 405, { error: "Method not allowed" });
    return true;
  }

  if (route === "/api/private/devices") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method !== "GET") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    const store = await loadPrivateSessions();
    const now = Date.now();
    store.sessions = store.sessions.filter((item) => Date.parse(item.expiresAt) > now);
    await savePrivateSessions();
    privateJson(res, 200, {
      devices: store.sessions
        .map((item) => publicPrivateSession(item, session.id))
        .sort((a, b) => Date.parse(b.lastSeenAt) - Date.parse(a.lastSeenAt))
    });
    return true;
  }

  if (route === "/api/private/devices/revoke") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method !== "POST") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    const body = await readBody(req);
    const store = await loadPrivateSessions();
    if (body.allOthers) {
      store.sessions = store.sessions.filter((item) => item.id === session.id);
    } else {
      const id = String(body.id || "");
      store.sessions = store.sessions.filter((item) => item.id !== id);
    }
    await savePrivateSessions();
    privateJson(res, 200, { ok: true });
    return true;
  }

  if (route === "/api/private/mail-vault") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method === "GET") {
      try {
        privateJson(res, 200, { vault: await loadPrivateMailVault() });
      } catch {
        privateJson(res, 500, { error: "Mail vault load failed" });
      }
      return true;
    }
    if (req.method === "PUT") {
      try {
        const contentType = String(req.headers["content-type"] || "").toLowerCase();
        if (!contentType.includes("application/json")) {
          privateJson(res, 415, { error: "Unsupported vault payload" });
          return true;
        }
        const buffer = await readBufferBody(req, 4 * 1024 * 1024);
        const body = JSON.parse(buffer.toString("utf8") || "{}");
        const vault = await savePrivateMailVault(body.vault || body);
        privateJson(res, 200, { vault });
      } catch (error) {
        const status = error.message === "Archive too large" ? 413 : error instanceof SyntaxError ? 400 : 500;
        privateJson(res, status, { error: status === 413 ? "Mail vault too large" : status === 400 ? "Invalid vault payload" : "Mail vault save failed" });
      }
      return true;
    }
    privateJson(res, 405, { error: "Method not allowed" });
    return true;
  }

  if (route === "/api/private/backup/status") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method !== "GET") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    privateJson(res, 200, { backup: publicPrivateBackupStatus() });
    return true;
  }

  if (route === "/api/private/backup/run") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method !== "POST") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    try {
      const result = await runPrivateBackup();
      privateJson(res, 200, { ok: true, ...result, backup: publicPrivateBackupStatus() });
    } catch (error) {
      const status = error instanceof PrivateBackupError ? error.httpStatus : 502;
      privateJson(res, status, {
        ok: false,
        code: error?.code || "BACKUP_FAILED",
        error: safePrivateBackupError(error),
        backup: publicPrivateBackupStatus()
      });
    }
    return true;
  }

  if (route === "/api/private/mail/capabilities") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method !== "GET") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    privateJson(res, 200, {
      receiveAvailable: true,
      smtpAvailable: !mailSmtpBlockedReason,
      smtpBlockedReason: mailSmtpBlockedReason || null,
      gmailAuth: "app-password",
      portableVaultKey: true,
      automaticVaultUnlock: true,
      mailInsights: "header-only"
    });
    return true;
  }

  if (route === "/api/private/mail/inbox") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method !== "POST") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    const body = await readBody(req);
    try {
      privateJson(res, 200, { ok: true, ...(await fetchProviderInbox(body.account)) });
    } catch (error) {
      privateJson(res, 502, { error: mailFriendlyError(error, body.account, "fetch") });
    }
    return true;
  }

  if (route === "/api/private/mail/message") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method !== "POST") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    const body = await readBody(req);
    let uid;
    try {
      uid = cleanMailUid(body.uid ?? body.id);
    } catch {
      privateJson(res, 400, { error: "Invalid mail UID" });
      return true;
    }
    try {
      privateJson(res, 200, { ok: true, ...(await fetchProviderMessage(body.account, uid)) });
    } catch (error) {
      if (error?.code === "MAIL_NOT_FOUND") {
        privateJson(res, 404, { error: "Mail message not found" });
      } else {
        privateJson(res, 502, { error: mailFriendlyError(error, body.account, "fetch") });
      }
    }
    return true;
  }

  if (route === "/api/private/mail/insights") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method !== "POST") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    const body = await readBody(req);
    let options;
    try {
      options = cleanMailInsightOptions(body);
    } catch (error) {
      privateJson(res, 400, { error: error.message || "Invalid insight options" });
      return true;
    }
    try {
      privateJson(res, 200, {
        ok: true,
        generatedAt: new Date().toISOString(),
        disclaimer: "结果仅由收件箱邮件头保守推断，可能遗漏或误判；营销邮件订阅不等于付费订阅，请以服务商账户和账单为准。",
        ...(await fetchProviderMailInsights(body.account, options))
      });
    } catch (error) {
      privateJson(res, 502, { error: mailFriendlyError(error, body.account, "fetch") });
    }
    return true;
  }

  if (route === "/api/private/mail/send") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method !== "POST") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    const body = await readBody(req);
    try {
      privateJson(res, 200, await sendProviderMail(body.account, body.message));
    } catch (error) {
      privateJson(res, 502, { error: mailFriendlyError(error, body.account, "send") });
    }
    return true;
  }

  if (route === "/api/private/data/export/local") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method !== "POST") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    try {
      const archive = await makePrivateArchive();
      const fileName = privateArchiveFileName(archive.createdAt);
      res.writeHead(200, {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": archive.buffer.length,
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "same-origin"
      });
      res.end(archive.buffer);
    } catch (error) {
      privateJson(res, 500, { error: "Local export failed" });
    }
    return true;
  }

  if (route === "/api/private/data/import/local") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method !== "POST") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    try {
      const contentType = String(req.headers["content-type"] || "").toLowerCase();
      if (!contentType.includes("application/zip") && !contentType.includes("application/octet-stream")) {
        privateJson(res, 415, { error: "Unsupported archive" });
        return true;
      }
      const buffer = await readBufferBody(req);
      let fileName = "smc-private-data.zip";
      try {
        fileName = decodeURIComponent(String(req.headers["x-archive-filename"] || fileName));
      } catch {
        // Keep the safe fallback file name.
      }
      privateJson(res, 200, { ok: true, ...(await importPrivateArchiveBuffer(buffer, fileName)) });
    } catch (error) {
      const status = error.message === "Archive too large" ? 413 : 400;
      privateJson(res, status, { error: error.message || "Local import failed" });
    }
    return true;
  }

  if (route === "/api/private/data/export/subsite" || route === "/api/private/data/import/subsite") {
    const session = await requirePrivateSession(req, res);
    if (!session) return true;
    if (req.method !== "POST") {
      privateJson(res, 405, { error: "Method not allowed" });
      return true;
    }
    privateJson(res, 501, { error: "Subsite transfer not configured" });
    return true;
  }

  privateJson(res, 404, { error: "接口不存在" });
  return true;
}

function cleanPadicOutput(text, command = "") {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/^p-adic> /, `p-adic> ${command}\n`)
    .replace(/\np-adic> (退出|再见！|Goodbye!)\s*$/u, "")
    .trimEnd();
}

async function handlePadicApi(req, res, url) {
  if (url.pathname !== "/api/padic/evaluate") return false;
  if (req.method === "OPTIONS") {
    json(res, 204, {});
    return true;
  }
  if (req.method !== "POST") {
    json(res, 405, { error: "Method not allowed" });
    return true;
  }

  try {
    const body = await readBody(req);
    const command = String(body.command || "").replace(/[\r\n]+/g, " ").trim();
    if (!command) {
      json(res, 400, { error: "请输入指令" });
      return true;
    }
    if (command.length > 400) {
      json(res, 400, { error: "指令过长" });
      return true;
    }

    await ensurePadicBinary();
    const result = await runProcess(padicBinary, [], {
      cwd: padicDir,
      env: { ...process.env, HOME: padicRuntimeHome },
      input: `${command}\nquit\n`,
      timeoutMs: 8000
    });
    json(res, 200, { output: cleanPadicOutput(result.stdout, command) });
    return true;
  } catch (error) {
    json(res, 500, { error: error.message || "p-adic 计算失败" });
    return true;
  }
}

async function runStudyTool(toolKey, body) {
  const tool = studyTools[toolKey];
  if (!tool) throw new Error("学习工具不存在");

  const source = String(body.source || body.command || "").replace(/\r\n/g, "\n").trim();
  const columns = Math.max(48, Math.min(1000, Number(body.columns) || 1000));
  if (!source) throw new Error("请输入要执行的内容");
  if (source.length > 40000) throw new Error("输入内容过长");

  if (tool.env.MPLCONFIGDIR) await mkdir(tool.env.MPLCONFIGDIR, { recursive: true });
  await ensureStudyPythonDependencies();

  const tempRoot = await mkdtemp(join(tmpdir(), "smc-study-"));
  const inputFile = join(tempRoot, `input${tool.extension}`);
  try {
    await writeFile(inputFile, `${source}\n`, "utf8");
    const result = await runProcess(pythonCommand, [tool.script, ...tool.args(inputFile, body)], {
      cwd: tool.cwd,
      env: studyPythonEnv({ ...tool.env, COLUMNS: String(columns) }),
      timeoutMs: tool.timeoutMs
    });
    return (result.stdout || result.stderr || "").trimEnd();
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

async function handleStudyApi(req, res, url) {
  const match = url.pathname.match(/^\/api\/study\/([^/]+)\/evaluate\/?$/);
  if (!match) return false;

  if (req.method === "OPTIONS") {
    json(res, 204, {});
    return true;
  }
  if (req.method !== "POST") {
    json(res, 405, { error: "Method not allowed" });
    return true;
  }

  try {
    const body = await readBody(req);
    const output = await runStudyTool(match[1], body);
    json(res, 200, { output });
    return true;
  } catch (error) {
    json(res, 500, { error: error.message || "学习工具执行失败" });
    return true;
  }
}

function syncPlayerNames(room) {
  for (const player of room.state.players || []) {
    const seat = room.seats[player.id];
    if (seat?.occupied) player.name = seat.name;
  }
}

function publicRoom(room, clientId = "") {
  syncPlayerNames(room);
  const mySeat = room.seats.findIndex((seat) => seat.clientId === clientId);
  return {
    code: room.code,
    game: room.game,
    playerCount: room.playerCount,
    started: room.started,
    mySeat,
    seats: room.seats.map(({ clientId: _clientId, ...seat }) => seat),
    state: room.state,
    updatedAt: room.updatedAt
  };
}

function broadcast(room) {
  for (const client of [...room.clients]) {
    try {
      client.res.write(`data: ${JSON.stringify(publicRoom(room, client.clientId))}\n\n`);
    } catch {
      room.clients.delete(client);
    }
  }
}

function cleanupRooms(store) {
  const now = Date.now();
  for (const [code, room] of store) {
    if (!room.clients.size && now - room.updatedAt > roomTtlMs) store.delete(code);
  }
}

function occupySeat(room, clientId, name) {
  const existing = room.seats.findIndex((seat) => seat.clientId === clientId);
  if (existing >= 0) {
    room.seats[existing].name = sanitizeName(name, room.seats[existing].name);
    room.seats[existing].occupied = true;
    return existing;
  }

  const index = room.seats.findIndex((seat) => !seat.occupied);
  if (index < 0) return -1;
  room.seats[index] = {
    occupied: true,
    connected: false,
    clientId,
    name: sanitizeName(name, `玩家 ${index + 1}`)
  };
  return index;
}

function createRoom(gameKey, cfg, store, body) {
  const playerCount = Math.max(2, Math.min(cfg.maxPlayers, Number(body.playerCount) || cfg.defaultPlayers));
  const code = makeRoomCode(store);
  const state = cfg.create(playerCount);
  const seats = Array.from({ length: playerCount }, (_, index) => ({
    occupied: false,
    connected: false,
    clientId: "",
    name: cfg.names[index] || `玩家 ${index + 1}`
  }));
  const room = {
    code,
    game: gameKey,
    playerCount,
    started: false,
    state,
    seats,
    clients: new Set(),
    updatedAt: Date.now()
  };
  const seat = occupySeat(room, String(body.clientId || ""), body.name);
  if (seat < 0) throw new Error("房间创建失败");
  syncPlayerNames(room);
  store.set(code, room);
  return room;
}

function sendSse(req, res, room, clientId) {
  const seatIndex = room.seats.findIndex((seat) => seat.clientId === clientId);
  if (seatIndex >= 0) room.seats[seatIndex].connected = true;

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  res.flushHeaders?.();

  const client = { clientId, res };
  room.clients.add(client);
  const heartbeat = setInterval(() => {
    try {
      res.write(": keep-alive\n\n");
    } catch {
      clearInterval(heartbeat);
      room.clients.delete(client);
    }
  }, 25000);

  res.write(`data: ${JSON.stringify(publicRoom(room, clientId))}\n\n`);
  broadcast(room);

  req.on("close", () => {
    clearInterval(heartbeat);
    room.clients.delete(client);
    const active = [...room.clients].some((item) => item.clientId === clientId);
    if (!active && seatIndex >= 0) {
      room.seats[seatIndex].connected = false;
      room.updatedAt = Date.now();
      broadcast(room);
    }
  });
}

async function handleApi(req, res, url) {
  if (req.method === "OPTIONS") {
    json(res, 204, {});
    return true;
  }

  const match = url.pathname.match(/^\/api\/([^/]+)\/rooms(?:\/([^/]+))?(?:\/([^/]+))?\/?$/);
  if (!match) return false;

  const [, gameKey, rawCode, action] = match;
  const cfg = gameConfigs[gameKey];
  const store = roomStores.get(gameKey);
  if (!cfg || !store) {
    json(res, 404, { error: "游戏不存在" });
    return true;
  }

  cleanupRooms(store);

  try {
    if (!rawCode && req.method === "POST") {
      const body = await readBody(req);
      const room = createRoom(gameKey, cfg, store, body);
      json(res, 200, publicRoom(room, String(body.clientId || "")));
      return true;
    }

    const code = String(rawCode || "").trim().toUpperCase();
    const room = store.get(code);
    if (!room) {
      json(res, 404, { error: "房间不存在" });
      return true;
    }

    if (!action && req.method === "GET") {
      const clientId = String(url.searchParams.get("clientId") || "");
      json(res, 200, publicRoom(room, clientId));
      return true;
    }

    if (action === "events" && req.method === "GET") {
      const clientId = String(url.searchParams.get("clientId") || "");
      sendSse(req, res, room, clientId);
      return true;
    }

    if (action === "join" && req.method === "POST") {
      const body = await readBody(req);
      const clientId = String(body.clientId || "");
      const seat = occupySeat(room, clientId, body.name);
      if (seat < 0) {
        json(res, 409, { error: "房间已满" });
        return true;
      }
      room.started = room.seats.every((item) => item.occupied);
      room.updatedAt = Date.now();
      syncPlayerNames(room);
      broadcast(room);
      json(res, 200, publicRoom(room, clientId));
      return true;
    }

    if (action === "action" && req.method === "POST") {
      const body = await readBody(req);
      const clientId = String(body.clientId || "");
      const seat = room.seats.findIndex((item) => item.clientId === clientId);
      if (seat < 0) {
        json(res, 403, { error: "你还没有入座" });
        return true;
      }
      if (!room.started) {
        json(res, 409, { error: "等待玩家入座" });
        return true;
      }
      if (room.state.current !== seat) {
        json(res, 409, { error: "还没轮到你" });
        return true;
      }
      const result = cfg.apply(room.state, body.action);
      if (!result.ok) {
        json(res, 400, { error: result.reason || "这步不合法" });
        return true;
      }
      room.state = result.state;
      room.updatedAt = Date.now();
      syncPlayerNames(room);
      broadcast(room);
      json(res, 200, publicRoom(room, clientId));
      return true;
    }

    json(res, 404, { error: "接口不存在" });
    return true;
  } catch (error) {
    json(res, 500, { error: error.message || "服务器错误" });
    return true;
  }
}

async function resolveFile(pathname) {
  const clean = cleanPath(pathname);
  let filePath = join(publicDir, clean);
  if (!filePath.startsWith(publicDir)) return null;

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) {
      filePath = join(filePath, "index.html");
    }
  } catch {
    if (!extname(filePath)) filePath = join(filePath, "index.html");
  }

  if (!filePath.startsWith(publicDir)) return null;
  return filePath;
}

function redirect(res, location) {
  res.writeHead(308, { Location: location });
  res.end();
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || `${host}:${port}`}`);

    if (await handlePrivateApi(req, res, url)) return;
    if (await handlePadicApi(req, res, url)) return;
    if (await handleStudyApi(req, res, url)) return;
    if (await handleApi(req, res, url)) return;

    if (url.pathname !== "/" && !extname(url.pathname) && !url.pathname.endsWith("/")) {
      return redirect(res, `${url.pathname}/${url.search}`);
    }

    const filePath = await resolveFile(url.pathname);
    if (!filePath) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const data = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mime[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store, max-age=0, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, host, () => {
  console.log("Small Magellanic Cloud 已启动：");
  console.log(`本机访问：http://localhost:${port}`);
});
