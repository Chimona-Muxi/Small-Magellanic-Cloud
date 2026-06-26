import {
  BOARD_SIZE,
  applyAction,
  cellName,
  createInitialState,
  getValidMoves,
  isLegalWall,
  shortestPath
} from "./engine.mjs";
import { chooseAiAction } from "./ai.mjs";

const CELL = 54;
const GAP = 12;
const STEP = CELL + GAP;
const TOTAL = CELL * BOARD_SIZE + GAP * (BOARD_SIZE - 1);
const SVG = "http://www.w3.org/2000/svg";

const els = {
  board: document.querySelector("#boardSvg"),
  modeTabs: document.querySelector("#modeTabs"),
  gameSubtitle: document.querySelector("#gameSubtitle"),
  setupPanel: document.querySelector("#setupPanel"),
  onlinePanel: document.querySelector("#onlinePanel"),
  playerCountField: document.querySelector("#playerCountField"),
  difficultyField: document.querySelector("#difficultyField"),
  playerCount: document.querySelector("#playerCountSelect"),
  difficulty: document.querySelector("#difficultySelect"),
  onlinePlayerCount: document.querySelector("#onlinePlayerCountSelect"),
  newGame: document.querySelector("#newGameButton"),
  toolbox: document.querySelector("#toolbox"),
  statusTitle: document.querySelector("#statusTitle"),
  turnEyebrow: document.querySelector("#turnEyebrow"),
  players: document.querySelector("#playersList"),
  log: document.querySelector("#logList"),
  pathMetric: document.querySelector("#pathMetric"),
  wallMetric: document.querySelector("#wallMetric"),
  onlineName: document.querySelector("#onlineNameInput"),
  onlineHomeStep: document.querySelector("#onlineHomeStep"),
  onlineJoinStep: document.querySelector("#onlineJoinStep"),
  onlineRoomStep: document.querySelector("#onlineRoomStep"),
  createRoom: document.querySelector("#createRoomButton"),
  chooseJoin: document.querySelector("#chooseJoinButton"),
  joinCode: document.querySelector("#joinCodeInput"),
  joinRoom: document.querySelector("#joinRoomButton"),
  joinBack: document.querySelector("#joinBackButton"),
  roomBack: document.querySelector("#roomBackButton"),
  roomCard: document.querySelector("#roomCard"),
  roomStepTitle: document.querySelector("#roomStepTitle"),
  roomState: document.querySelector("#roomStateText"),
  roomCode: document.querySelector("#roomCodeText"),
  copyRoom: document.querySelector("#copyRoomButton"),
  toast: document.querySelector("#toast")
};

let mode = "ai";
let tool = "move";
let onlineRoom = null;
let onlineStep = "home";
let onlineRoomRole = "host";
let eventSource = null;
let game = createGame();
let aiTimer = null;
let aiRequestId = 0;
let toastTimer = null;

const activeRoomKey = "qiangluqi-active-room";
const clientId = getClientId();

function getClientId() {
  const key = "qiangluqi-client-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function createGame() {
  const onlineCount = Number(els.onlinePlayerCount?.value || els.playerCount?.value || 2);
  const playerCount = mode === "ai" ? 2 : mode === "online" ? onlineCount : Number(els.playerCount?.value || 2);
  const state = createInitialState({
    playerCount,
    mode,
    aiDifficulty: els.difficulty?.value || "steady",
    aiEngine: "builtin",
    aiSlots: mode === "ai" ? [1] : [],
    names: mode === "ai"
      ? [tr("player.you", "你"), tr("player.ai", "AI")]
      : Array.from({ length: playerCount }, (_, index) => defaultPlayerName(index))
  });
  state.aiEngine = "builtin";
  return state;
}

function tr(key, fallback = "") {
  return window.SMC_PREFS?.t(key, fallback) || fallback || key;
}

function fmt(key, vars = {}, fallback = "") {
  return Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), tr(key, fallback));
}

function defaultPlayerName(index) {
  if (index === 0) return tr("player.one", "玩家 1");
  if (index === 1) return tr("player.two", "玩家 2");
  return `${tr("status.player", "玩家")} ${index + 1}`;
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 1900);
}

function svgEl(name, attrs = {}) {
  const node = document.createElementNS(SVG, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
}

function cellCenter(row, col) {
  return {
    x: col * STEP + CELL / 2,
    y: row * STEP + CELL / 2
  };
}

function currentPlayer() {
  return game.players[game.current];
}

function localizedPieceLabel(player) {
  return window.SMC_PREFS?.pieceLabel("luqiangqi", player.id, player.label) || player.label;
}

function displayPlayerName(player) {
  if (!player) return "";
  if (mode === "ai") return player.id === 0 ? tr("player.you", "你") : tr("player.ai", "AI");
  if (mode === "online") {
    const seat = onlineRoom?.seats?.[player.id];
    if (seat?.name) return seat.name;
  }
  return defaultPlayerName(player.id);
}

function goalText(player) {
  if (player.goal.edge === "row") {
    return tr(player.goal.value === 0 ? "luqiangqi.goalNorth" : "luqiangqi.goalSouth", player.goal.value === 0 ? "目标 北线" : "目标 南线");
  }
  return tr(player.goal.value === 0 ? "luqiangqi.goalWest" : "luqiangqi.goalEast", player.goal.value === 0 ? "目标 西线" : "目标 东线");
}

function canAct() {
  if (game.winner !== null) return false;
  if (mode === "online") return onlineRoom?.started && onlineRoom.mySeat === game.current;
  if (mode === "ai") return currentPlayer()?.kind !== "ai";
  return true;
}

function actionLockedReason() {
  if (game.winner !== null) return tr("status.gameOver", "对局已结束");
  if (mode === "online" && !onlineRoom?.started) return tr("status.waitingSeat", "等待玩家入座");
  if (mode === "online" && onlineRoom?.mySeat !== game.current) return tr("status.notYourTurn", "还没轮到你");
  if (mode === "ai" && currentPlayer()?.kind === "ai") return tr("status.aiThinking", "AI 思考中");
  return "";
}

function resetOfflineGame() {
  aiRequestId += 1;
  closeEvents();
  onlineRoom = null;
  onlineStep = "home";
  game = createGame();
  tool = "move";
  render();
  queueAi();
}

function closeEvents() {
  if (eventSource) eventSource.close();
  eventSource = null;
}

function readActiveRoom() {
  try {
    return JSON.parse(localStorage.getItem(activeRoomKey) || "null");
  } catch {
    return null;
  }
}

function saveActiveRoom(room, role = onlineRoomRole) {
  if (!room?.code || mode !== "online" || room.mySeat < 0) return;
  localStorage.setItem(activeRoomKey, JSON.stringify({
    code: room.code,
    role,
    savedAt: Date.now()
  }));
}

function clearActiveRoom() {
  localStorage.removeItem(activeRoomKey);
}

function resetOnlineLobby() {
  aiRequestId += 1;
  closeEvents();
  onlineRoom = null;
  onlineStep = "home";
  onlineRoomRole = "host";
  clearActiveRoom();
  game = createInitialState({
    playerCount: Number(els.onlinePlayerCount?.value || 2),
    mode: "online"
  });
  tool = "move";
  render();
}

function withRoomState(room) {
  onlineRoom = room;
  game = room.state;
  saveActiveRoom(room);
  render();
}

async function api(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || tr("status.illegalMove", "请求失败"));
  return data;
}

async function fetchRoom(code) {
  const response = await fetch(`/api/luqiangqi/rooms/${code}?clientId=${encodeURIComponent(clientId)}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || tr("status.enterRoomCode", "房间不存在"));
  return data;
}

function connectRoomEvents(code) {
  closeEvents();
  eventSource = new EventSource(`/api/luqiangqi/rooms/${code}/events?clientId=${encodeURIComponent(clientId)}`);
  eventSource.onmessage = (event) => withRoomState(JSON.parse(event.data));
  eventSource.onerror = () => showToast(tr("status.waiting", "联机同步正在重连"));
}

async function restoreActiveRoom({ quiet = false } = {}) {
  const saved = readActiveRoom();
  if (!saved?.code) return false;

  try {
    const room = await fetchRoom(saved.code);
    if (room.mySeat < 0) throw new Error("座位已失效");
    mode = "online";
    onlineRoomRole = saved.role || (room.mySeat === 0 ? "host" : "guest");
    onlineStep = "room";
    withRoomState(room);
    connectRoomEvents(room.code);
    if (!quiet) showToast(tr("status.roomJoined", "已回到房间"));
    return true;
  } catch {
    clearActiveRoom();
    if (!quiet) showToast(tr("status.enterRoomCode", "原房间已失效"));
    return false;
  }
}

async function createRoom() {
  try {
    const room = await api("/api/luqiangqi/rooms", {
      clientId,
      name: els.onlineName.value,
      playerCount: Number(els.onlinePlayerCount.value)
    });
    onlineRoomRole = "host";
    onlineStep = "room";
    withRoomState(room);
    saveActiveRoom(room, onlineRoomRole);
    connectRoomEvents(room.code);
    showToast(tr("status.roomCreated", "房间已创建"));
  } catch (error) {
    showToast(error.message.includes("Failed") ? "请先用启动脚本打开游戏" : error.message);
  }
}

async function joinRoom() {
  const code = els.joinCode.value.trim().toUpperCase();
  if (!code) return showToast(tr("status.enterRoomCode", "请输入房间码"));
  try {
    const room = await api(`/api/luqiangqi/rooms/${code}/join`, {
      clientId,
      name: els.onlineName.value
    });
    onlineRoomRole = "guest";
    onlineStep = "room";
    withRoomState(room);
    saveActiveRoom(room, onlineRoomRole);
    connectRoomEvents(room.code);
    showToast(tr("status.roomJoined", "已加入房间"));
  } catch (error) {
    showToast(error.message.includes("Failed") ? "请先用启动脚本打开游戏" : error.message);
  }
}

async function sendAction(action) {
  if (!canAct()) {
    const reason = actionLockedReason();
    if (reason) showToast(reason);
    return;
  }

  if (mode === "online") {
    try {
      const room = await api(`/api/luqiangqi/rooms/${onlineRoom.code}/action`, { clientId, action });
      withRoomState(room);
    } catch (error) {
      showToast(error.message);
    }
    return;
  }

  const result = applyAction(game, action);
  if (!result.ok) {
    showToast(result.reason || tr("status.illegalMove", "这步不合法"));
    return;
  }
  game = result.state;
  if (game.winner !== null) tool = "move";
  render();
  queueAi();
}

function queueAi() {
  clearTimeout(aiTimer);
  if (mode !== "ai" || game.winner !== null || currentPlayer()?.kind !== "ai") return;
  const requestId = aiRequestId + 1;
  aiRequestId = requestId;
  aiTimer = setTimeout(() => {
    const snapshot = JSON.parse(JSON.stringify(game));
    const action = chooseAiAction(snapshot, snapshot.aiDifficulty);
    if (requestId !== aiRequestId || mode !== "ai" || game.winner !== null || currentPlayer()?.kind !== "ai") return;
    if (!action) return;
    const result = applyAction(game, action);
    if (result.ok) {
      game = result.state;
      render();
    }
  }, 520);
}

function renderGoals(svg) {
  for (const player of game.players) {
    const attrs = {
      class: "goal-band",
      fill: player.color,
      rx: 6,
      ry: 6
    };
    if (player.goal.edge === "row") {
      attrs.x = 0;
      attrs.y = player.goal.value === 0 ? -10 : TOTAL;
      attrs.width = TOTAL;
      attrs.height = 7;
    } else {
      attrs.x = player.goal.value === 0 ? -10 : TOTAL;
      attrs.y = 0;
      attrs.width = 7;
      attrs.height = TOTAL;
    }
    svg.appendChild(svgEl("rect", attrs));
  }
}

function renderCells(svg) {
  const moveSet = new Set(getValidMoves(game).map((cell) => `${cell.row},${cell.col}`));
  const actionable = canAct() && tool === "move";

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const target = actionable && moveSet.has(`${row},${col}`);
      const rect = svgEl("rect", {
        x: col * STEP,
        y: row * STEP,
        width: CELL,
        height: CELL,
        rx: 8,
        ry: 8,
        class: `cell ${(row + col) % 2 ? "alt" : ""} ${target ? "target" : ""}`
      });
      if (target) rect.addEventListener("click", () => sendAction({ type: "move", row, col }));
      svg.appendChild(rect);
    }
  }
}

function renderWallSlots(svg) {
  if (!canAct() || tool === "move") return;
  const orientation = tool;

  for (let row = 0; row < BOARD_SIZE - 1; row += 1) {
    for (let col = 0; col < BOARD_SIZE - 1; col += 1) {
      const wall = { type: "wall", orientation, row, col };
      const legal = isLegalWall(game, wall);
      const attrs = orientation === "h"
        ? { x: col * STEP, y: row * STEP + CELL, width: CELL * 2 + GAP, height: GAP }
        : { x: col * STEP + CELL, y: row * STEP, width: GAP, height: CELL * 2 + GAP };
      const rect = svgEl("rect", {
        ...attrs,
        rx: 5,
        ry: 5,
        class: `wall-slot ${legal ? "legal" : "illegal"}`
      });
      rect.addEventListener("click", () => sendAction(wall));
      svg.appendChild(rect);
    }
  }
}

function renderPlacedWalls(svg) {
  for (const orientation of ["h", "v"]) {
    for (const wall of game.walls[orientation] || []) {
      const attrs = orientation === "h"
        ? { x: wall.col * STEP, y: wall.row * STEP + CELL, width: CELL * 2 + GAP, height: GAP }
        : { x: wall.col * STEP + CELL, y: wall.row * STEP, width: GAP, height: CELL * 2 + GAP };
      svg.appendChild(svgEl("rect", {
        ...attrs,
        rx: 5,
        ry: 5,
        class: "wall-placed"
      }));
    }
  }
}

function renderPawns(svg) {
  for (const player of game.players) {
    const center = cellCenter(player.row, player.col);
    const group = svgEl("g", {
      class: `pawn ${player.id === game.current && game.winner === null ? "current" : ""}`
    });
    group.appendChild(svgEl("circle", {
      cx: center.x,
      cy: center.y,
      r: 26,
      class: "pawn-ring"
    }));
    group.appendChild(svgEl("circle", {
      cx: center.x,
      cy: center.y,
      r: 18,
      fill: player.color
    }));
    const label = svgEl("text", {
      x: center.x,
      y: center.y + 0.5,
      class: "pawn-label"
    });
    label.textContent = localizedPieceLabel(player);
    group.appendChild(label);
    svg.appendChild(group);
  }
}

function renderBoard() {
  els.board.setAttribute("viewBox", `-14 -14 ${TOTAL + 28} ${TOTAL + 28}`);
  els.board.replaceChildren();
  const bg = svgEl("rect", {
    x: -14,
    y: -14,
    width: TOTAL + 28,
    height: TOTAL + 28,
    rx: 14,
    fill: "rgba(255,255,255,0.38)"
  });
  els.board.appendChild(bg);
  renderGoals(els.board);
  renderCells(els.board);
  renderWallSlots(els.board);
  renderPlacedWalls(els.board);
  renderPawns(els.board);
}

function renderPlayers() {
  els.players.replaceChildren();
  const seats = onlineRoom?.seats || [];

  for (const player of game.players) {
    const card = document.createElement("article");
    card.className = `player-card ${player.id === game.current && game.winner === null ? "current" : ""}`;

    const dot = document.createElement("span");
    dot.className = "player-dot";
    dot.style.background = player.color;

    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = displayPlayerName(player);
    const meta = document.createElement("small");
    const seatText = mode === "online" && !seats[player.id]?.occupied ? tr("status.emptySeat", "空位") : goalText(player);
    meta.textContent = `${localizedPieceLabel(player)} · ${seatText}`;
    info.append(name, meta);

    const walls = document.createElement("span");
    walls.className = "wall-pill";
    walls.textContent = `${player.walls} ${tr("luqiangqi.wallUnit", "墙")}`;

    card.append(dot, info, walls);
    els.players.appendChild(card);
  }
}

function renderLog() {
  els.log.replaceChildren();
  const startText = mode === "online" && !onlineRoom?.started
    ? tr("status.waitingRoomFull", "等待房间满员")
    : tr("status.gameStarted", "棋局开始");
  const entries = game.log?.length ? game.log : [{ text: startText }];
  for (const entry of entries.slice(0, 18)) {
    const item = document.createElement("li");
    item.textContent = entry.text;
    els.log.appendChild(item);
  }
}

function renderStatus() {
  const player = currentPlayer();
  els.gameSubtitle.textContent = tr(`common.caption.${mode}`, mode);
  els.turnEyebrow.textContent = game.winner !== null ? tr("status.final", "终局") : fmt("status.round", { turn: game.turn }, `第 ${game.turn} 手`);

  if (game.winner !== null) {
    els.statusTitle.textContent = fmt("status.win", { name: displayPlayerName(game.players[game.winner]) }, `${displayPlayerName(game.players[game.winner])} 获胜`);
  } else if (mode === "online" && !onlineRoom?.started) {
    const occupied = onlineRoom?.seats?.filter((seat) => seat.occupied).length || 0;
    els.statusTitle.textContent = fmt("status.waitingPlayers", { count: occupied, total: game.playerCount }, `等待玩家 ${occupied}/${game.playerCount}`);
  } else {
    els.statusTitle.textContent = fmt("status.turn", { name: displayPlayerName(player) }, `轮到 ${displayPlayerName(player)}`);
  }

  els.pathMetric.textContent = game.players.map((item) => shortestPath(game, item.id)).join(" / ");
  els.wallMetric.textContent = game.players.map((item) => item.walls).join(" / ");

  const occupied = onlineRoom?.seats?.filter((seat) => seat.occupied).length || 0;
  els.onlineHomeStep.classList.toggle("hidden", onlineStep !== "home");
  els.onlineJoinStep.classList.toggle("hidden", onlineStep !== "join");
  els.onlineRoomStep.classList.toggle("hidden", onlineStep !== "room");
  els.roomCard.classList.toggle("hidden", !onlineRoom || onlineStep !== "room");
  els.roomStepTitle.textContent = onlineRoomRole === "guest" ? tr("status.roomJoined", "已加入房间") : tr("status.roomCreated", "房间已创建");
  els.roomState.textContent = onlineRoom
    ? onlineRoom.started
      ? tr("status.gameStarted", "对局进行中")
      : fmt("status.waitingPlayers", { count: occupied, total: onlineRoom.playerCount }, `等待玩家 ${occupied}/${onlineRoom.playerCount}`)
    : tr("common.waitingPlayers", "等待玩家");
  els.roomCode.textContent = onlineRoom?.code || "-----";
  els.setupPanel.classList.toggle("hidden", mode === "online");
  els.onlinePanel.classList.toggle("hidden", mode !== "online");
  els.playerCountField.classList.toggle("hidden", mode === "ai");
  els.difficultyField.classList.toggle("hidden", mode !== "ai");
}

function renderControls() {
  els.modeTabs.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  els.toolbox.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === tool);
  });
}

function render() {
  if (currentPlayer()?.walls <= 0 && tool !== "move") tool = "move";
  renderControls();
  renderStatus();
  renderPlayers();
  renderLog();
  renderBoard();
}

els.modeTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-mode]");
  if (!button) return;
  mode = button.dataset.mode;
  if (mode === "online") {
    aiRequestId += 1;
    restoreActiveRoom({ quiet: true }).then((restored) => {
      if (restored) return;
      game = createInitialState({ playerCount: Number(els.onlinePlayerCount.value), mode: "online" });
      onlineRoom = null;
      onlineStep = "home";
      closeEvents();
      render();
    });
    return;
  }
  resetOfflineGame();
});

els.toolbox.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-tool]");
  if (!button) return;
  tool = button.dataset.tool;
  render();
});

els.newGame.addEventListener("click", resetOfflineGame);
els.playerCount.addEventListener("change", () => {
  if (mode === "local") resetOfflineGame();
  if (mode === "online" && !onlineRoom) {
    game = createInitialState({ playerCount: Number(els.playerCount.value), mode: "online" });
    render();
  }
});
els.onlinePlayerCount.addEventListener("change", () => {
  if (mode === "online" && !onlineRoom) {
    game = createInitialState({ playerCount: Number(els.onlinePlayerCount.value), mode: "online" });
    render();
  }
});
els.difficulty.addEventListener("change", resetOfflineGame);
els.createRoom.addEventListener("click", createRoom);
els.chooseJoin.addEventListener("click", () => {
  onlineStep = "join";
  onlineRoom = null;
  closeEvents();
  render();
  els.joinCode.focus();
});
els.joinRoom.addEventListener("click", joinRoom);
els.joinBack.addEventListener("click", resetOnlineLobby);
els.roomBack.addEventListener("click", resetOnlineLobby);
els.joinCode.addEventListener("input", () => {
  els.joinCode.value = els.joinCode.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
});
els.copyRoom.addEventListener("click", async () => {
  if (!onlineRoom) return;
  await navigator.clipboard?.writeText(onlineRoom.code);
  showToast(tr("status.roomCodeCopied", "房间码已复制"));
});

restoreActiveRoom({ quiet: true }).then((restored) => {
  if (!restored) render();
});

window.addEventListener("smc:languagechange", render);
