import { t } from "../preferences.mjs?v=20260706b";

const defaultProfile = {
  name: "",
  birthday: "",
  note: ""
};

const gate = document.querySelector("[data-private-gate]");
const space = document.querySelector("[data-private-space]");
const form = document.querySelector("[data-private-form]");
const passwordInput = document.querySelector("[data-private-password]");
const rememberInput = document.querySelector("[data-private-remember]");
const error = document.querySelector("[data-private-error]");
const lockButton = document.querySelector("[data-private-lock]");

const profileName = document.querySelector("[data-profile-name]");
const profileNameSide = document.querySelector("[data-profile-name-side]");
const profileBirthday = document.querySelector("[data-profile-birthday]");
const profileNameCopy = document.querySelector("[data-profile-name-copy]");
const profileBirthdayCopy = document.querySelector("[data-profile-birthday-copy]");
const profileNote = document.querySelector("[data-profile-note]");
const profileView = document.querySelector("[data-profile-view]");
const profileEditor = document.querySelector("[data-profile-editor]");
const editButton = document.querySelector("[data-profile-edit]");
const saveButton = document.querySelector("[data-profile-save]");
const nameInput = document.querySelector("[data-profile-name-input]");
const birthdayInput = document.querySelector("[data-profile-birthday-input]");
const noteInput = document.querySelector("[data-profile-note-input]");
const saveStatus = document.querySelector("[data-profile-save-status]");
const devicesList = document.querySelector("[data-devices-list]");
const refreshDevicesButton = document.querySelector("[data-devices-refresh]");
const revokeOthersButton = document.querySelector("[data-devices-revoke-others]");
const navButtons = [...document.querySelectorAll("[data-private-nav]")];
const panels = [...document.querySelectorAll("[data-private-panel]")];
const dataMenuButtons = [...document.querySelectorAll("[data-data-menu]")];
const dataMenuPanels = [...document.querySelectorAll("[data-data-menu-panel]")];
const dataActionButtons = [...document.querySelectorAll("[data-data-action]")];
const dataStatus = document.querySelector("[data-data-status]");

let activeProfile = { ...defaultProfile };

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || response.statusText || "Request failed";
    throw new Error(message);
  }
  return data;
}

function showError(key, fallback) {
  error.textContent = t(key, fallback);
}

function clearError() {
  error.textContent = "";
}

function setSaveStatus(text = "", tone = "") {
  saveStatus.textContent = text;
  saveStatus.dataset.tone = tone;
}

function setDataStatus(text = "", tone = "") {
  dataStatus.textContent = text;
  dataStatus.dataset.tone = tone;
}

function renderProfile(profile = activeProfile) {
  activeProfile = { ...defaultProfile, ...profile };
  profileName.textContent = activeProfile.name;
  profileNameSide.textContent = activeProfile.name;
  profileBirthday.textContent = activeProfile.birthday;
  profileNameCopy.textContent = activeProfile.name;
  profileBirthdayCopy.textContent = activeProfile.birthday;
  profileNote.textContent = activeProfile.note;
}

function setEditing(editing) {
  if (editing) {
    nameInput.value = activeProfile.name;
    birthdayInput.value = activeProfile.birthday;
    noteInput.value = activeProfile.note;
  }
  profileView.hidden = editing;
  profileEditor.hidden = !editing;
  editButton.hidden = editing;
  saveButton.hidden = !editing;
  if (editing) setSaveStatus();
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(document.documentElement.lang || "zh-CN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function renderDevices(devices = []) {
  if (!devices.length) {
    devicesList.innerHTML = `<p class="devices-empty">${t("private.devices.empty", "暂无登录设备")}</p>`;
    return;
  }
  devicesList.replaceChildren(...devices.map((device) => {
    const row = document.createElement("div");
    row.className = "device-row";

    const body = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = device.current
      ? `${device.label} · ${t("private.devices.current", "当前设备")}`
      : device.label;
    const meta = document.createElement("span");
    meta.textContent = `${t("private.devices.lastSeen", "最近活动")} ${formatTime(device.lastSeenAt)} · ${t("private.devices.expires", "到期")} ${formatTime(device.expiresAt)}`;
    body.append(title, meta);

    const action = document.createElement("button");
    action.type = "button";
    action.className = "button";
    action.textContent = t("private.devices.revoke", "移除");
    action.disabled = device.current;
    action.addEventListener("click", async () => {
      await api("/api/private/devices/revoke", {
        method: "POST",
        body: JSON.stringify({ id: device.id })
      });
      await loadDevices();
    });

    row.append(body, action);
    return row;
  }));
}

function setActivePanel(name) {
  for (const button of navButtons) {
    const active = button.dataset.privateNav === name;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  }
  for (const panel of panels) {
    panel.hidden = panel.dataset.privatePanel !== name;
  }
  if (name === "security") loadDevices().catch(() => {});
}

function setDataMenu(name) {
  for (const button of dataMenuButtons) {
    const active = button.dataset.dataMenu === name;
    button.setAttribute("aria-expanded", active ? "true" : "false");
  }
  for (const panel of dataMenuPanels) {
    panel.hidden = panel.dataset.dataMenuPanel !== name;
  }
}

async function loadProfile() {
  const data = await api("/api/private/profile");
  renderProfile(data.profile);
}

async function loadDevices() {
  const data = await api("/api/private/devices");
  renderDevices(data.devices);
}

async function showSpace() {
  gate.hidden = true;
  space.hidden = false;
  clearError();
  setEditing(false);
  await loadProfile();
  await loadDevices().catch(() => {});
  setActivePanel("profile");
  for (const item of space.querySelectorAll("[data-reveal]")) item.classList.add("visible");
}

function showGate() {
  gate.hidden = false;
  space.hidden = true;
  passwordInput.value = "";
  passwordInput.focus();
}

for (const item of document.querySelectorAll("[data-reveal]")) item.classList.add("visible");

api("/api/private/status")
  .then((data) => {
    if (data.authenticated) return showSpace();
    showGate();
  })
  .catch(showGate);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await api("/api/private/login", {
      method: "POST",
      body: JSON.stringify({
        password: passwordInput.value,
        remember: rememberInput.checked
      })
    });
    await showSpace();
  } catch (loginError) {
    const key = loginError.message === "Too many attempts"
      ? "private.password.rateLimited"
      : "private.password.error";
    const fallback = loginError.message === "Too many attempts" ? "尝试次数过多，请稍后再试" : "密码不正确";
    showError(key, fallback);
    passwordInput.select();
  }
});

editButton.addEventListener("click", () => setEditing(true));

saveButton.addEventListener("click", async () => {
  const profile = {
    name: nameInput.value,
    birthday: birthdayInput.value,
    note: noteInput.value
  };
  try {
    saveButton.disabled = true;
    const data = await api("/api/private/profile", {
      method: "PUT",
      body: JSON.stringify({ profile })
    });
    renderProfile(data.profile);
    setEditing(false);
    setSaveStatus(t("private.profile.saved", "已保存"), "ok");
  } catch {
    setSaveStatus(t("private.profile.saveError", "保存失败，请稍后再试"), "error");
  } finally {
    saveButton.disabled = false;
  }
});

lockButton.addEventListener("click", async () => {
  await api("/api/private/logout", { method: "POST", body: "{}" }).catch(() => {});
  setEditing(false);
  showGate();
});

refreshDevicesButton.addEventListener("click", loadDevices);

for (const button of navButtons) {
  button.addEventListener("click", () => setActivePanel(button.dataset.privateNav));
}

for (const button of dataMenuButtons) {
  button.addEventListener("click", () => {
    const name = button.getAttribute("aria-expanded") === "true" ? "" : button.dataset.dataMenu;
    setDataMenu(name);
  });
}

for (const button of dataActionButtons) {
  button.addEventListener("click", async () => {
    const action = button.dataset.dataAction;
    const endpoints = {
      "export-local": "/api/private/data/export/local",
      "export-subsite": "/api/private/data/export/subsite",
      "import-local": "/api/private/data/import/local",
      "import-subsite": "/api/private/data/import/subsite"
    };
    try {
      button.disabled = true;
      const data = await api(endpoints[action], { method: "POST", body: "{}" });
      if (action === "export-local") {
        setDataStatus(`${t("private.data.savedLocal", "已保存到本地：")}${data.fileName}`, "ok");
      } else if (action === "import-local") {
        renderProfile(data.profile);
        setEditing(false);
        setDataStatus(`${t("private.data.importedLocal", "已从本地导入：")}${data.fileName}`, "ok");
      }
    } catch (dataError) {
      if (dataError.message === "Subsite transfer not configured") {
        setDataStatus(t("private.data.subsitePending", "子网站接口已预留"), "pending");
      } else if (dataError.message === "No local archive") {
        setDataStatus(t("private.data.noArchive", "没有找到本地归档"), "error");
      } else {
        setDataStatus(t("private.data.failed", "操作失败，请稍后再试"), "error");
      }
    } finally {
      button.disabled = false;
    }
  });
}

revokeOthersButton.addEventListener("click", async () => {
  await api("/api/private/devices/revoke", {
    method: "POST",
    body: JSON.stringify({ allOthers: true })
  });
  await loadDevices();
});

window.addEventListener("smc:languagechange", () => {
  if (error.textContent) showError("private.password.error", "密码不正确");
  if (saveStatus.dataset.tone === "ok") setSaveStatus(t("private.profile.saved", "已保存"), "ok");
  if (saveStatus.dataset.tone === "error") setSaveStatus(t("private.profile.saveError", "保存失败，请稍后再试"), "error");
  loadDevices().catch(() => {});
});
