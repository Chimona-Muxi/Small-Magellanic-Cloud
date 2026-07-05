import { t } from "../preferences.mjs?v=20260706a";

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
const devicesList = document.querySelector("[data-devices-list]");
const refreshDevicesButton = document.querySelector("[data-devices-refresh]");
const revokeOthersButton = document.querySelector("[data-devices-revoke-others]");

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

function renderProfile(profile = activeProfile) {
  activeProfile = { ...defaultProfile, ...profile };
  profileName.textContent = activeProfile.name;
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
  await Promise.all([loadProfile(), loadDevices()]);
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
  const data = await api("/api/private/profile", {
    method: "PUT",
    body: JSON.stringify({ profile })
  });
  renderProfile(data.profile);
  setEditing(false);
});

lockButton.addEventListener("click", async () => {
  await api("/api/private/logout", { method: "POST", body: "{}" }).catch(() => {});
  setEditing(false);
  showGate();
});

refreshDevicesButton.addEventListener("click", loadDevices);

revokeOthersButton.addEventListener("click", async () => {
  await api("/api/private/devices/revoke", {
    method: "POST",
    body: JSON.stringify({ allOthers: true })
  });
  await loadDevices();
});

window.addEventListener("smc:languagechange", () => {
  if (error.textContent) showError("private.password.error", "密码不正确");
  loadDevices().catch(() => {});
});
