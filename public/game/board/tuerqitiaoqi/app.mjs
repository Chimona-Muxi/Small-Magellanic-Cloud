import {
  applyAction,
  cellName,
  createInitialState,
  getLegalActions,
  mustCapture,
  pieceAt,
  scoreSummary
} from "./engine.mjs";
import { chooseAiAction } from "./ai.mjs";

const els = {
  board: document.querySelector("#board"),
  modeCaption: document.querySelector("#modeCaption"),
  modeButtons: [...document.querySelectorAll(".mode-button")],
  aiPanel: document.querySelector("#aiPanel"),
  localPanel: document.querySelector("#localPanel"),
  onlinePanel: document.querySelector("#onlinePanel"),
  difficultySelect: document.querySelector("#difficultySelect"),
  newGameButton: document.querySelector("#newGameButton"),
  newLocalButton: document.querySelector("#newLocalButton"),
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
  maxPill: document.querySelector("#maxPill"),
  chainPill: document.querySelector("#chainPill"),
  metrics: document.querySelector("#metrics"),
  logList: document.querySelector("#logList"),
  toast: document.querySelector("#toast")
};

let mode = "ai";
let difficulty = "steady";
let game = createGame();
let selectedPieceId = "";
let aiThinking = false;
let toastTimer = 0;
let onlineRoom = null;
let onlineStep = "home";
let eventSource = null;
let clientId = getClientId();

function getClientId() {
  const key = "turkish-draughts-client-id";
  let value = localStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    localStorage.setItem(key, value);
  }
  return value;
}

function activeRoomKey() {
  return "turkish-draughts-active-room";
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
    names: mode === "ai"
      ? [tr("player.you", "你"), tr("player.ai", "AI")]
      : mode === "online"
        ? [tr("player.one", "玩家 1"), tr("player.two", "玩家 2")]
        : [tr("player.south", "南方"), tr("player.north", "北方")]
  });
}

function tr(key, fallback = "") {
  return window.SMC_PREFS?.t(key, fallback) || fallback || key;
}

function fmt(key, vars = {}, fallback = "") {
  return Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), tr(key, fallback));
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
  eventSource = new EventSource(`/api/tuerqitiaoqi/rooms/${code}/events?clientId=${encodeURIComponent(clientId)}`);
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
    const room = await api(`/api/tuerqitiaoqi/rooms/${saved.code}?clientId=${encodeURIComponent(clientId)}`);
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
  queueAiMove();
}

function setMode(nextMode) {
  if (mode === nextMode) return;
  mode = nextMode;
  selectedPieceId = "";
  closeEvents();
  onlineRoom = null;
  onlineStep = "home";
  if (mode !== "online") clearActiveRoom();
  game = createGame();
  render();
  queueAiMove();
}

function currentPlayer() {
  return game.players[game.current];
}

function localizedPieceLabel(owner) {
  const fallback = game.players[owner]?.label || "";
  return window.SMC_PREFS?.pieceLabel("tuerqitiaoqi", owner, fallback) || fallback;
}

function displayPlayerName(player) {
  if (!player) return "";
  if (mode === "ai") return player.id === 0 ? tr("player.you", "你") : tr("player.ai", "AI");
  if (mode === "online") return player.id === 0 ? tr("player.one", "玩家 1") : tr("player.two", "玩家 2");
  return player.id === 0 ? tr("player.south", "南方") : tr("player.north", "北方");
}

function myOnlineSeat() {
  return onlineRoom?.mySeat ?? -1;
}

function actionLockedReason() {
  if (game.winner !== null) return tr("status.gameOver", "本局已经结束");
  if (mode === "ai" && game.current === 1) return tr("status.aiThinking", "AI 思考中");
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
  return actionsForSelected().find((candidate) => candidate.to.row === row && candidate.to.col === col) || null;
}

function selectPiece(piece) {
  if (!piece || piece.owner !== game.current) return false;
  if (!canAct()) return false;
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
      const room = await api(`/api/tuerqitiaoqi/rooms/${onlineRoom.code}/action`, { clientId, action });
      withRoom(room);
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
  selectedPieceId = game.chain?.pieceId || "";
  render();
  queueAiMove();
}

function onSquareClick(row, col) {
  const reason = actionLockedReason();
  if (reason) {
    showToast(reason);
    return;
  }

  const piece = pieceAt(game, row, col);
  if (piece?.owner === game.current && selectPiece(piece)) return;

  const action = findActionTo(row, col);
  if (action) {
    submitAction(action);
    return;
  }

  if (mustCapture(game)) showToast(tr("status.mustCapture", "这一手必须吃子"));
  else showToast(tr("status.selectPiece", "请选择可移动的棋子"));
}

function pieceClass(piece) {
  return piece.owner === 0 ? "south" : "north";
}

function renderBoard() {
  const actions = actionsForSelected();
  const targetMap = new Map(actions.map((action) => [`${action.to.row},${action.to.col}`, action]));
  els.board.innerHTML = "";

  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const square = document.createElement("button");
      square.type = "button";
      square.className = `square ${(row + col) % 2 ? "cool" : "warm"}`;
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
  els.playerCards.innerHTML = game.players.map((player) => {
    const active = game.current === player.id && game.winner === null;
    const seat = onlineRoom?.seats?.[player.id];
    const turnLabel = mode === "online"
      ? seat?.occupied ? (seat.connected ? tr("status.online", "在线") : tr("status.seated", "已入座")) : tr("status.waiting", "等待")
      : mode === "ai" ? (player.id === 0 ? tr("status.player", "玩家") : tr("player.ai", "AI")) : (player.id === 0 ? tr("status.first", "先手") : tr("status.second", "后手"));
    return `
      <div class="player-card ${active ? "active" : ""}">
        <span class="player-dot" style="background:${player.color}"></span>
        <div>
          <strong>${displayPlayerName(player)}</strong>
          <small>${localizedPieceLabel(player.id)} · ${turnLabel}</small>
        </div>
        <span>${active ? tr("status.active", "行动") : ""}</span>
      </div>
    `;
  }).join("");
}

function renderTopBar() {
  els.turnMeta.textContent = game.winner === null ? fmt("status.round", { turn: game.turn }, `第 ${game.turn} 手`) : tr("status.final", "终局");
  if (game.winner !== null) {
    els.statusTitle.textContent = fmt("status.win", { name: displayPlayerName(game.players[game.winner]) }, `${displayPlayerName(game.players[game.winner])} 获胜`);
  } else if (mode === "online" && !onlineRoom?.started) {
    els.statusTitle.textContent = tr("status.waitingSeat", "等待对手");
  } else if (mode === "online" && myOnlineSeat() !== game.current) {
    els.statusTitle.textContent = fmt("status.turn", { name: displayPlayerName(currentPlayer()) }, `轮到 ${displayPlayerName(currentPlayer())}`);
  } else if (mode === "ai" && game.current === 1) {
    els.statusTitle.textContent = tr("status.aiThinking", "AI 思考中");
  } else {
    els.statusTitle.textContent = fmt("status.turn", { name: displayPlayerName(currentPlayer()) }, `轮到 ${displayPlayerName(currentPlayer())}`);
  }

  const capture = mustCapture(game);
  els.capturePill.classList.toggle("active", capture);
  els.maxPill.classList.toggle("active", capture);
  els.chainPill.classList.toggle("active", Boolean(game.chain));
}

function renderMetrics() {
  els.metrics.innerHTML = scoreSummary(game).map((item) => `
    <div class="metric">
      <span>${item.name}</span>
      <strong>${item.pieces} / ${item.kings}</strong>
    </div>
  `).join("");
}

function renderLog() {
  els.logList.innerHTML = (game.log || []).length
    ? game.log.slice(0, 16).map((item) => `<div class="log-item">${item}</div>`).join("")
    : `<div class="log-item">${tr("status.noLog", "暂无记录")}</div>`;
}

function renderPanels() {
  els.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  els.modeCaption.textContent = tr(`common.caption.${mode}`, mode);
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
  renderBoard();
  renderPlayers();
  renderTopBar();
  renderMetrics();
  renderLog();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function queueAiMove() {
  if (aiThinking || mode !== "ai" || game.winner !== null || game.current !== 1) return;
  aiThinking = true;
  render();
  await delay(320);

  while (mode === "ai" && game.current === 1 && game.winner === null) {
    const action = chooseAiAction(game, difficulty, 1);
    if (!action) break;
    const result = applyAction(game, action);
    if (!result.ok) break;
    game = result.state;
    selectedPieceId = game.chain?.pieceId || "";
    render();
    if (game.current !== 1 || game.winner !== null) break;
    await delay(260);
  }

  selectedPieceId = "";
  aiThinking = false;
  render();
}

async function createOnlineRoom() {
  try {
    const room = await api("/api/tuerqitiaoqi/rooms", { clientId, name: els.onlineName.value });
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
  if (!code) {
    showToast(tr("status.enterRoomCode", "请输入房间码"));
    return;
  }

  try {
    const room = await api(`/api/tuerqitiaoqi/rooms/${code}/join`, { clientId, name: els.onlineName.value });
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

els.modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

els.difficultySelect.addEventListener("change", () => {
  difficulty = els.difficultySelect.value;
  resetOfflineGame();
});

els.newGameButton.addEventListener("click", resetOfflineGame);
els.newLocalButton.addEventListener("click", resetOfflineGame);
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

render();
restoreRoom();
queueAiMove();

window.addEventListener("beforeunload", closeEvents);
window.addEventListener("smc:languagechange", render);
