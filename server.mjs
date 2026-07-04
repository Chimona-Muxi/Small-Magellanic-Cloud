import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { delimiter, dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
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
    timeoutMs: 15000,
    args(filePath, body) {
      return ["--lang", body.lang === "en" ? "en" : "zh", filePath];
    },
    env: {}
  },
  analysis: {
    script: join(studyDir, "analysis", "src", "cas_parser.py"),
    cwd: join(studyDir, "analysis"),
    extension: ".ma",
    timeoutMs: 30000,
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
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`${command} timed out`));
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
    ...extra
  };
}

async function ensureStudyPythonDependencies() {
  try {
    await runProcess(pythonCommand, ["-c", "import sympy, numpy"], {
      env: studyPythonEnv(),
      timeoutMs: 8000
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
        maxStdout: 512 * 1024,
        timeoutMs: 120000
      }))
      .finally(() => {
        studyDepsPromise = null;
      });
  }
  await studyDepsPromise;

  await runProcess(pythonCommand, ["-c", "import sympy, numpy"], {
    env: studyPythonEnv(),
    timeoutMs: 8000
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
  const columns = Math.max(48, Math.min(132, Number(body.columns) || 88));
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
