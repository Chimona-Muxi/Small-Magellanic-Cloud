import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { access, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { delimiter, dirname, extname, join, normalize } from "node:path";
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
const privateDir = join(__dirname, ".private");
const privateSessionsFile = join(privateDir, "sessions.json");
const privateProfileFile = join(privateDir, "profile.json");
const privateMailVaultFile = join(privateDir, "mail-vault.json");
const privateExportDir = process.env.SMC_PRIVATE_EXPORT_DIR || join(__dirname, "myproject.smallmagellaniccloud");
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
const privateArchiveVersion = 1;
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
    vaultVersion: 1,
    updatedAt: String(vault.updatedAt || new Date().toISOString()).slice(0, 40),
    algorithm: "AES-GCM",
    kdf: "PBKDF2-SHA-256",
    iterations: Math.min(600000, Math.max(120000, Number(vault.iterations) || 240000)),
    salt: String(vault.salt || "").slice(0, 256),
    iv: String(vault.iv || "").slice(0, 256),
    ciphertext: String(vault.ciphertext || "").slice(0, 256 * 1024)
  };
}

async function readPrivateJsonFile(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

async function writePrivateJsonFile(filePath, data) {
  await mkdir(privateDir, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
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
  const endSig = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
  const endOffset = buffer.lastIndexOf(endSig);
  if (endOffset < 0) throw new Error("Invalid archive");

  const count = buffer.readUInt16LE(endOffset + 10);
  let cursor = buffer.readUInt32LE(endOffset + 16);
  const entries = new Map();

  for (let i = 0; i < count; i += 1) {
    if (buffer.readUInt32LE(cursor) !== 0x02014b50) throw new Error("Invalid archive");
    const method = buffer.readUInt16LE(cursor + 10);
    const expectedCrc = buffer.readUInt32LE(cursor + 16);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.subarray(cursor + 46, cursor + 46 + nameLength).toString("utf8");

    if (buffer.readUInt32LE(localOffset) !== 0x04034b50) throw new Error("Invalid archive");
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);
    const data = method === 0 ? compressed : method === 8 ? inflateRawSync(compressed) : null;
    if (!data) throw new Error("Unsupported archive compression");
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
  const store = await loadPrivateSessions();
  const manifest = {
    archiveType: privateArchiveType,
    archiveVersion: privateArchiveVersion,
    createdAt,
    source: "Small Magellanic Cloud",
    modules: ["profile", "security-devices", "mail-vault"],
    compatibility: {
      profile: 1,
      securityDevices: 1,
      mailVault: 1,
      reserved: ["temporary-files", "subsite-transfer"]
    }
  };
  const devices = store.sessions.map((session) => publicPrivateSession(session));
  return {
    createdAt,
    buffer: makeZip([
      { name: "manifest.json", data: `${JSON.stringify(manifest, null, 2)}\n` },
      { name: "data/profile.json", data: `${JSON.stringify(profile, null, 2)}\n` },
      { name: "data/security-devices.json", data: `${JSON.stringify({ devices }, null, 2)}\n` },
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

async function exportPrivateArchiveLocal() {
  await mkdir(privateExportDir, { recursive: true });
  const { buffer, createdAt } = await makePrivateArchive();
  const stamp = createdAt.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z").replace("T", "-").replace("Z", "");
  const fileName = `smc-private-data-${stamp}.zip`;
  const filePath = join(privateExportDir, fileName);
  await writeFile(filePath, buffer);
  return { fileName, path: filePath, createdAt };
}

async function latestPrivateArchivePath() {
  let items = [];
  try {
    items = await readdir(privateExportDir, { withFileTypes: true });
  } catch {
    throw new Error("No local archive");
  }

  const archives = await Promise.all(items
    .filter((item) => item.isFile() && /^smc-private-data-.+\.zip$/i.test(item.name))
    .map(async (item) => {
      const filePath = join(privateExportDir, item.name);
      const info = await stat(filePath);
      return { fileName: item.name, filePath, mtimeMs: info.mtimeMs };
    }));
  archives.sort((a, b) => b.mtimeMs - a.mtimeMs);
  if (!archives[0]) throw new Error("No local archive");
  return archives[0];
}

async function importPrivateArchiveLocal() {
  const archive = await latestPrivateArchivePath();
  const entries = readZipEntries(await readFile(archive.filePath));
  const manifest = JSON.parse(entries.get("manifest.json")?.toString("utf8") || "{}");
  if (manifest.archiveType !== privateArchiveType) throw new Error("Unsupported archive");
  if (Number(manifest.archiveVersion) > privateArchiveVersion) throw new Error("Archive version is newer");

  const profile = JSON.parse(entries.get("data/profile.json")?.toString("utf8") || "{}");
  const savedProfile = await savePrivateProfile(profile);
  const mailVaultEntry = entries.get("data/mail-vault.json");
  const savedMailVault = mailVaultEntry
    ? await savePrivateMailVault(JSON.parse(mailVaultEntry.toString("utf8") || "{}"))
    : await loadPrivateMailVault();
  return {
    fileName: archive.fileName,
    imported: mailVaultEntry ? ["profile", "mail-vault"] : ["profile"],
    profile: savedProfile,
    mailVault: savedMailVault
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
        const body = await readBody(req);
        const vault = await savePrivateMailVault(body.vault || body);
        privateJson(res, 200, { vault });
      } catch {
        privateJson(res, 500, { error: "Mail vault save failed" });
      }
      return true;
    }
    privateJson(res, 405, { error: "Method not allowed" });
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
      const archive = await exportPrivateArchiveLocal();
      privateJson(res, 200, {
        ok: true,
        archiveVersion: privateArchiveVersion,
        modules: ["profile", "security-devices", "mail-vault"],
        ...archive
      });
    } catch {
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
      privateJson(res, 200, { ok: true, ...(await importPrivateArchiveLocal()) });
    } catch (error) {
      const status = error.message === "No local archive" ? 404 : 500;
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
