import {
  applyAction,
  cellName,
  createInitialState,
  getLegalActions,
  mustCapture,
  pieceAt,
  scoreSummary
} from "./engine.mjs";
import { chooseAiAction, explainDifficulty } from "./ai.mjs";

const els = {
  board: document.querySelector("#board"),
  modeCaption: document.querySelector("#modeCaption"),
  modeButtons: [...document.querySelectorAll(".mode-button")],
  aiPanel: document.querySelector("#aiPanel"),
  localPanel: document.querySelector("#localPanel"),
  onlinePanel: document.querySelector("#onlinePanel"),
  difficulty: document.querySelector("#difficultySelect"),
  newGame: document.querySelector("#newGameButton"),
  newLocal: document.querySelector("#newLocalButton"),
  onlineName: document.querySelector("#onlineNameInput"),
  createRoom: document.querySelector("#createRoomButton"),
  showJoin: document.querySelector("#showJoinButton"),
  joinBack: document.querySelector("#joinBackButton"),
  joinCode: document.querySelector("#joinCodeInput"),
  joinRoom: document.querySelector("#joinRoomButton"),
  onlineHome: document.querySelector("#onlineHomeStep"),
  onlineJoin: document.querySelector("#onlineJoinStep"),
  onlineRoom: document.querySelector("#onlineRoomStep"),
  roomCode: document.querySelector("#roomCodeText"),
  copyRoom: document.querySelector("#copyRoomButton"),
  leaveRoom: document.querySelector("#leaveRoomButton"),
  playerCards: document.querySelector("#playerCards"),
  turnMeta: document.querySelector("#turnMeta"),
  statusTitle: document.querySelector("#statusTitle"),
  capturePill: document.querySelector("#capturePill"),
  chainPill: document.querySelector("#chainPill"),
  metrics: document.querySelector("#metrics"),
  logList: document.querySelector("#logList"),
  toast: document.querySelector("#toast")
};

let mode = "ai";
let game = createGame();
let selectedPieceId = "";
let aiTimer = 0;
let toastTimer = 0;
let onlineRoom = null;
let onlineStep = "home";
let eventSource = null;
let clientId = getClientId();

function getClientId() {
  const key = "checkers-client-id";
  let value = localStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    localStorage.setItem(key, value);
  }
  return value;
}

function activeRoomKey() {
  return "checkers-active-room";
}

function saveActiveRoom(room) {
  localStorage.setItem(activeRoomKey(), JSON.stringify({ code: room.code }));
}

function clearActiveRoom() {
  localStorage.removeItem(activeRoomKey());
}

function createGame() {
  return createInitialState({
    mode,
    aiDifficulty: els.difficulty?.value || "steady",
    aiSlots: mode === "ai" ? [1] : [],
    names: mode === "ai"
      ? [tr("player.you", "你"), tr("player.ai", "AI")]
      : mode === "online"
        ? [tr("player.one", "玩家 1"), tr("player.two", "玩家 2")]
        : [tr("player.black", "墨方"), tr("player.red", "朱方")]
  });
}

function tr(key, fallback = "") {
  return window.SMC_PREFS?.t(key, fallback) || fallback || key;
}

function fmt(key, vars = {}, fallback = "") {
  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    tr(key, fallback)
  );
}

async function api(path, body = null, options = {}) {
  const response = await fetch(path, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || tr("status.illegalMove", "请求失败"));
  return data;
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 1800);
}

function closeEvents() {
  if (eventSource) eventSource.close();
  eventSource = null;
}

function withRoom(room) {
  onlineRoom = room;
  game = room.state;
  selectedPieceId = game.chain?.pieceId || "";
  render();
}

function connectRoom(code) {
  closeEvents();
  eventSource = new EventSource(`/api/xiyangtiaoqi/rooms/${code}/events?clientId=${encodeURIComponent(clientId)}`);
  eventSource.onmessage = (event) => {
    const room = JSON.parse(event.data);
    withRoom(room);
  };
  eventSource.onerror = () => {
    closeEvents();
  };
}

async function restoreRoom() {
  const saved = JSON.parse(localStorage.getItem(activeRoomKey()) || "null");
  if (!saved?.code) return;
  try {
    const room = await api(`/api/xiyangtiaoqi/rooms/${saved.code}?clientId=${encodeURIComponent(clientId)}`);
    mode = "online";
    onlineStep = "room";
    withRoom(room);
    connectRoom(room.code);
  } catch {
    clearActiveRoom();
  }
}

function resetOfflineGame() {
  closeEvents();
  onlineRoom = null;
  selectedPieceId = "";
  game = createGame();
  render();
  queueAi();
}

function setMode(nextMode) {
  if (mode === nextMode) return;
  mode = nextMode;
  selectedPieceId = "";
  clearTimeout(aiTimer);
  closeEvents();
  onlineRoom = null;
  onlineStep = "home";
  if (mode !== "online") clearActiveRoom();
  game = createGame();
  render();
  queueAi();
}

function currentPlayer() {
  return game.players[game.current];
}

function localizedPieceLabel(owner) {
  const fallback = game.players[owner]?.label || "";
  return window.SMC_PREFS?.pieceLabel("xiyangtiaoqi", owner, fallback) || fallback;
}

function displayPlayerName(player) {
  const seat = onlineRoom?.seats?.[player.id];
  if (mode === "online" && seat?.name) return seat.name;
  if (mode === "ai") return player.id === 0 ? tr("player.you", "你") : tr("player.ai", "AI");
  if (mode === "online") return player.id === 0 ? tr("player.one", "玩家 1") : tr("player.two", "玩家 2");
  return player.id === 0 ? tr("player.black", "墨方") : tr("player.red", "朱方");
}

function myOnlineSeat() {
  return onlineRoom?.mySeat ?? -1;
}

function actionLockedReason() {
  if (game.winner !== null) return tr("status.gameOver", "本局已经结束");
  if (mode === "ai" && currentPlayer()?.kind === "ai") return tr("status.aiThinking", "AI 思考中");
  if (mode === "online") {
    if (!onlineRoom?.started) return tr("status.waitingSeat", "等待对手入座");
    if (myOnlineSeat() !== game.current) return tr("status.notYourTurn", "还没轮到你");
  }
  return "";
}

function canAct() {
  return !actionLockedReason();
}

function actionsForSelected() {
  if (!selectedPieceId) return [];
  return getLegalActions(game).filter((action) => action.pieceId === selectedPieceId);
}

function findActionTo(row, col) {
  return actionsForSelected().find((action) => action.to.row === row && action.to.col === col) || null;
}

function selectPiece(piece) {
  if (!piece || piece.owner !== game.current) return false;
  const actions = getLegalActions(game).filter((action) => action.pieceId === piece.id);
  if (!actions.length) return false;
  selectedPieceId = piece.id;
  render();
  return true;
}

async function submitAction(action) {
  if (!action) return;
  if (mode === "online") {
    try {
      const room = await api(`/api/xiyangtiaoqi/rooms/${onlineRoom.code}/action`, { clientId, action });
      withRoom(room);
    } catch (error) {
      showToast(error.message);
    }
    return;
  }

  const result = applyAction(game, action);
  if (!result.ok) return showToast(result.reason || tr("status.illegalMove", "这步不合法"));
  game = result.state;
  selectedPieceId = game.chain?.pieceId || "";
  render();
  queueAi();
}

function onSquareClick(row, col) {
  const reason = actionLockedReason();
  if (reason) return showToast(reason);

  const piece = pieceAt(game, row, col);
  if (piece?.owner === game.current && selectPiece(piece)) return;

  const action = findActionTo(row, col);
  if (action) return submitAction(action);

  if (mustCapture(game)) showToast(tr("status.mustCapture", "这一手必须吃子"));
  else showToast(tr("status.selectPiece", "请选择可移动的棋子"));
}

function queueAi() {
  clearTimeout(aiTimer);
  if (mode !== "ai" || game.winner !== null || currentPlayer()?.kind !== "ai") return;
  aiTimer = setTimeout(() => {
    const action = chooseAiAction(game, game.aiDifficulty);
    if (!action) return;
    const result = applyAction(game, action);
    if (result.ok) {
      game = result.state;
      selectedPieceId = game.chain?.pieceId || "";
      render();
      queueAi();
    }
  }, 420);
}

async function createOnlineRoom() {
  try {
    const room = await api("/api/xiyangtiaoqi/rooms", { clientId, name: els.onlineName.value });
    onlineStep = "room";
    withRoom(room);
    saveActiveRoom(room);
    connectRoom(room.code);
    showToast(tr("status.roomCreated", "房间已创建"));
  } catch (error) {
    showToast(error.message);
  }
}

async function joinOnlineRoom() {
  const code = els.joinCode.value.trim().toUpperCase();
  if (!code) return showToast(tr("status.enterRoomCode", "请输入房间码"));
  try {
    const room = await api(`/api/xiyangtiaoqi/rooms/${code}/join`, { clientId, name: els.onlineName.value });
    onlineStep = "room";
    withRoom(room);
    saveActiveRoom(room);
    connectRoom(room.code);
    showToast(tr("status.roomJoined", "已加入房间"));
  } catch (error) {
    showToast(error.message);
  }
}

function leaveRoom() {
  clearActiveRoom();
  closeEvents();
  onlineRoom = null;
  onlineStep = "home";
  game = createGame();
  render();
}

function pieceClass(piece) {
  return piece.owner === 0 ? "black" : "red";
}

function renderBoard() {
  const actions = actionsForSelected();
  const targetMap = new Map(actions.map((action) => [`${action.to.row},${action.to.col}`, action]));
  els.board.innerHTML = "";

  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const square = document.createElement("button");
      square.type = "button";
      square.className = `square ${(row + col) % 2 ? "dark" : "light"}`;
      square.dataset.cell = cellName(row, col);
      square.setAttribute("aria-label", cellName(row, col));
      square.addEventListener("click", () => onSquareClick(row, col));

      const action = targetMap.get(`${row},${col}`);
      if (action) square.classList.add(action.type === "jump" ? "capture-target" : "target");

      const piece = pieceAt(game, row, col);
      if (piece) {
        const pieceEl = document.createElement("div");
        pieceEl.className = `piece ${pieceClass(piece)}${piece.king ? " king" : ""}`;
        pieceEl.textContent = piece.king ? "" : localizedPieceLabel(piece.owner);
        square.append(pieceEl);
        if (piece.id === selectedPieceId) square.classList.add("selected");
      }

      els.board.append(square);
    }
  }
}

function renderPlayers() {
  els.playerCards.replaceChildren();
  for (const player of game.players) {
    const seat = onlineRoom?.seats?.[player.id];
    const suffix = mode === "online"
      ? seat?.occupied ? (seat.connected ? tr("status.online", "在线") : tr("status.seated", "已入座")) : tr("status.waiting", "等待")
      : player.kind === "ai" ? tr("player.ai", "AI") : tr("status.player", "玩家");

    const card = document.createElement("div");
    card.className = "player-card";
    if (game.current === player.id && game.winner === null) card.classList.add("active");

    const dot = document.createElement("span");
    dot.className = "player-dot";
    dot.style.background = player.color;

    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = displayPlayerName(player);
    const meta = document.createElement("small");
    meta.textContent = `${localizedPieceLabel(player.id)} · ${suffix}`;
    info.append(name, meta);

    const order = document.createElement("small");
    order.textContent = player.id === 0 ? tr("status.first", "先手") : tr("status.second", "后手");

    card.append(dot, info, order);
    els.playerCards.append(card);
  }
}

function renderMetrics() {
  els.metrics.replaceChildren();
  for (const item of scoreSummary(game)) {
    const metric = document.createElement("div");
    metric.className = "metric";
    const name = document.createElement("span");
    name.textContent = displayPlayerName(game.players[item.id]);
    const score = document.createElement("strong");
    score.textContent = `${item.pieces} / ${item.kings}`;
    metric.append(name, score);
    els.metrics.append(metric);
  }
}

function renderLog() {
  const logs = game.log || [];
  els.logList.replaceChildren();
  const entries = logs.length ? logs.map((entry) => entry.text) : [tr("status.noLog", "暂无记录")];
  for (const text of entries) {
    const item = document.createElement("div");
    item.className = "log-item";
    item.textContent = text;
    els.logList.append(item);
  }
}

function recordLines() {
  const playerLines = game.players.map((player) => `${displayPlayerName(player)}: ${player.label || player.color || ""}`);
  const logs = game.log?.length
    ? [...game.log].reverse().map((entry, index) => `${index + 1}. ${entry.text || String(entry)}`)
    : [tr("export.empty", "暂无记录")];
  return [
    tr("xiyangtiaoqi.title", "西洋跳棋"),
    new Date().toLocaleString(),
    `${tr("common.record", "记录")}: ${tr(`common.caption.${mode}`, mode)}`,
    `${els.turnMeta.textContent} / ${els.statusTitle.textContent}`,
    "",
    ...playerLines,
    "",
    ...logs
  ];
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function openPrintableRecord(title, text) {
  const popup = window.open("", "_blank", "width=720,height=900");
  if (!popup) {
    showToast(tr("export.popupBlocked", "浏览器拦截了 PDF 窗口"));
    return;
  }
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:36px;color:#17211e;}h1{font-size:26px;margin:0 0 18px;}pre{white-space:pre-wrap;line-height:1.7;font-size:13px;}</style></head><body><h1>${escapeHtml(title)}</h1><pre>${escapeHtml(text)}</pre></body></html>`);
  popup.document.close();
  popup.focus();
  setTimeout(() => popup.print(), 180);
}

function exportGameRecord(format) {
  const title = tr("xiyangtiaoqi.title", "西洋跳棋");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const text = recordLines().join("\n");
  if (format === "pdf") {
    openPrintableRecord(title, text);
    return;
  }
  downloadText(`xiyangtiaoqi-${stamp}.pdn`, text);
  showToast(tr("export.saved", "已导出棋谱"));
}

function renderStatus() {
  els.modeCaption.textContent = tr(`common.caption.${mode}`, mode);
  els.turnMeta.textContent = game.winner !== null ? tr("status.final", "终局") : fmt("status.round", { turn: game.turn }, `第 ${game.turn} 手`);

  if (game.winner !== null) {
    els.statusTitle.textContent = fmt("status.win", { name: displayPlayerName(game.players[game.winner]) }, `${displayPlayerName(game.players[game.winner])} 获胜`);
  } else if (mode === "online" && !onlineRoom?.started) {
    els.statusTitle.textContent = tr("status.waitingSeat", "等待对手");
  } else if (mode === "online" && myOnlineSeat() !== game.current) {
    els.statusTitle.textContent = fmt("status.turn", { name: displayPlayerName(currentPlayer()) }, `轮到 ${displayPlayerName(currentPlayer())}`);
  } else if (mode === "ai" && currentPlayer()?.kind === "ai") {
    els.statusTitle.textContent = tr("status.aiThinking", "AI 思考中");
  } else {
    els.statusTitle.textContent = fmt("status.turn", { name: displayPlayerName(currentPlayer()) }, `轮到 ${displayPlayerName(currentPlayer())}`);
  }

  els.capturePill.classList.toggle("active", mustCapture(game));
  els.chainPill.classList.toggle("active", Boolean(game.chain));
}

function renderPanels() {
  els.modeButtons.forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  els.aiPanel.classList.toggle("hidden", mode !== "ai");
  els.localPanel.classList.toggle("hidden", mode !== "local");
  els.onlinePanel.classList.toggle("hidden", mode !== "online");
  els.onlineHome.classList.toggle("hidden", onlineStep !== "home");
  els.onlineJoin.classList.toggle("hidden", onlineStep !== "join");
  els.onlineRoom.classList.toggle("hidden", onlineStep !== "room");
  if (onlineRoom) els.roomCode.textContent = onlineRoom.code;
}

function render() {
  if (game.chain?.pieceId && !selectedPieceId) selectedPieceId = game.chain.pieceId;
  renderPanels();
  renderStatus();
  renderBoard();
  renderPlayers();
  renderMetrics();
  renderLog();
}

els.modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

els.difficulty.addEventListener("change", resetOfflineGame);
els.newGame.addEventListener("click", resetOfflineGame);
els.newLocal.addEventListener("click", resetOfflineGame);
els.createRoom.addEventListener("click", createOnlineRoom);
els.showJoin.addEventListener("click", () => {
  onlineStep = "join";
  render();
  els.joinCode.focus();
});
els.joinBack.addEventListener("click", () => {
  onlineStep = "home";
  render();
});
els.joinRoom.addEventListener("click", joinOnlineRoom);
els.leaveRoom.addEventListener("click", leaveRoom);
els.copyRoom.addEventListener("click", async () => {
  await navigator.clipboard?.writeText(onlineRoom?.code || "");
  showToast(tr("status.roomCodeCopied", "房间码已复制"));
});
els.joinCode.addEventListener("input", () => {
  els.joinCode.value = els.joinCode.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
});

function setExportMenuOpen(menu, open) {
  menu.classList.toggle("open", open);
  const button = menu.querySelector("[data-export-menu-toggle]");
  if (button) button.setAttribute("aria-expanded", open ? "true" : "false");
}

function initExportMenus() {
  const menus = [...document.querySelectorAll("[data-export-menu-root]")];
  for (const menu of menus) {
    const toggle = menu.querySelector("[data-export-menu-toggle]");
    if (!toggle) continue;
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !menu.classList.contains("open");
      for (const other of menus) setExportMenuOpen(other, false);
      setExportMenuOpen(menu, willOpen);
    });
    menu.addEventListener("click", (event) => event.stopPropagation());
  }
  document.addEventListener("click", () => {
    for (const menu of menus) setExportMenuOpen(menu, false);
  });
  document.querySelectorAll("[data-export]").forEach((button) => {
    button.addEventListener("click", () => {
      exportGameRecord(button.dataset.export);
      for (const menu of menus) setExportMenuOpen(menu, false);
    });
  });
}

initExportMenus();

render();
restoreRoom();
queueAi();

window.addEventListener("beforeunload", closeEvents);
window.addEventListener("smc:languagechange", render);

console.info(explainDifficulty(els.difficulty.value));
