import { t } from "../preferences.mjs?v=20260709b";

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
const mailRefreshButton = document.querySelector("[data-mail-refresh]");
const mailAddButton = document.querySelector("[data-mail-add]");
const mailAddDialog = document.querySelector("[data-mail-add-dialog]");
const mailCloseButton = document.querySelector("[data-mail-close]");
const mailProviderChoices = [...document.querySelectorAll("[data-provider-choice]")];
const mailForm = document.querySelector("[data-mail-form]");
const mailIdInput = document.querySelector("[data-mail-id]");
const mailProviderInput = document.querySelector("[data-mail-provider]");
const mailAddressInput = document.querySelector("[data-mail-address]");
const mailSecretTypeInput = document.querySelector("[data-mail-secret-type]");
const mailSecretInput = document.querySelector("[data-mail-secret]");
const mailNoteInput = document.querySelector("[data-mail-note]");
const mailClearButton = document.querySelector("[data-mail-clear]");
const mailAccountList = document.querySelector("[data-mail-account-list]");
const mailActiveAccount = document.querySelector("[data-mail-active-account]");
const mailComposeFrom = document.querySelector("[data-mail-compose-from]");
const mailVaultNote = document.querySelector("[data-mail-vault-note]");
const mailThreadEmpty = document.querySelector("[data-mail-thread-empty]");
const mailSyncButton = document.querySelector("[data-mail-sync]");
const mailComposeButton = document.querySelector("[data-mail-compose]");
const mailComposeForm = document.querySelector("[data-mail-compose-form]");
const mailToInput = document.querySelector("[data-mail-to]");
const mailSubjectInput = document.querySelector("[data-mail-subject]");
const mailBodyInput = document.querySelector("[data-mail-body]");
const mailStatus = document.querySelector("[data-mail-status]");

let activeProfile = { ...defaultProfile };
let activeMailVault = null;
let activeMailAccounts = [];
let mailUnlocked = false;
let selectedMailAccountId = "";

const mailKeyStorage = "smc-mail-vault-key";
const mailVaultIterations = 240000;
const mailProviders = {
  gmail: { label: "Gmail", hint: "OAuth / App Password" },
  qq: { label: "QQ", hint: "IMAP/SMTP" },
  "163": { label: "163", hint: "IMAP/SMTP" },
  icloud: { label: "iCloud", hint: "App Password" },
  hrbeu: { label: "HRBEU", hint: "School Mail" },
  custom: { label: "Custom", hint: "Manual" }
};

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

function setMailStatus(text = "", tone = "") {
  mailStatus.textContent = text;
  mailStatus.dataset.tone = tone;
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

function randomBase64Url(length = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function bytesToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value = "") {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveMailKey(passphrase, salt, iterations = mailVaultIterations) {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptMailAccounts(accounts, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveMailKey(passphrase, salt);
  const payload = new TextEncoder().encode(JSON.stringify({
    version: 1,
    savedAt: new Date().toISOString(),
    accounts
  }));
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, payload));
  return {
    vaultVersion: 1,
    updatedAt: new Date().toISOString(),
    algorithm: "AES-GCM",
    kdf: "PBKDF2-SHA-256",
    iterations: mailVaultIterations,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(encrypted)
  };
}

async function decryptMailVault(vault, passphrase) {
  if (!vault?.ciphertext) return [];
  const salt = base64ToBytes(vault.salt || "");
  const iv = base64ToBytes(vault.iv || "");
  const encrypted = base64ToBytes(vault.ciphertext || "");
  const key = await deriveMailKey(passphrase, salt, Number(vault.iterations) || mailVaultIterations);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
  const payload = JSON.parse(new TextDecoder().decode(decrypted));
  return Array.isArray(payload.accounts) ? payload.accounts : [];
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

function mailProviderLabel(value) {
  return mailProviders[value]?.label || value || t("private.mail.providerCustom", "自定义");
}

function secretTypeLabel(value) {
  const labels = {
    oauth: t("private.mail.secretOauth", "OAuth 授权令牌"),
    "app-password": t("private.mail.secretAppPassword", "应用专用密码"),
    "imap-smtp": t("private.mail.secretImapSmtp", "IMAP/SMTP 密钥")
  };
  return labels[value] || value || "";
}

function ensureMailVaultKey() {
  let key = localStorage.getItem(mailKeyStorage);
  if (!key) {
    key = `SMC-MAIL-${randomBase64Url(32).match(/.{1,7}/g).join("-")}`;
    localStorage.setItem(mailKeyStorage, key);
  }
  return key;
}

function currentMailAccount() {
  return activeMailAccounts.find((account) => account.id === selectedMailAccountId) || activeMailAccounts[0] || null;
}

function setMailProvider(provider) {
  mailProviderInput.value = provider;
  for (const choice of mailProviderChoices) {
    const active = choice.dataset.providerChoice === provider;
    choice.classList.toggle("active", active);
    choice.setAttribute("aria-pressed", active ? "true" : "false");
  }
  const auth = provider === "gmail" ? "oauth" : "app-password";
  if (!mailSecretTypeInput.value) mailSecretTypeInput.value = auth;
}

function clearMailForm() {
  mailIdInput.value = "";
  setMailProvider("gmail");
  mailAddressInput.value = "";
  mailSecretTypeInput.value = "oauth";
  mailSecretInput.value = "";
  mailNoteInput.value = "";
}

function openMailDialog(account = null) {
  clearMailForm();
  if (account) {
    mailIdInput.value = account.id;
    setMailProvider(account.provider || "custom");
    mailAddressInput.value = account.address || "";
    mailSecretTypeInput.value = account.secretType || "oauth";
    mailSecretInput.value = account.secret || "";
    mailNoteInput.value = account.note || "";
  }
  mailAddDialog.hidden = false;
  mailAddressInput.focus();
}

function closeMailDialog() {
  mailAddDialog.hidden = true;
}

function renderMailClient() {
  const account = currentMailAccount();
  const accountLabel = account?.address || t("private.mail.noAccount", "未选择邮箱");
  mailActiveAccount.textContent = accountLabel;
  mailComposeFrom.textContent = accountLabel;
  mailSyncButton.disabled = !account;
  mailComposeButton.disabled = !account;
  mailComposeForm.querySelector("button[type='submit']").disabled = !account;
  if (!mailUnlocked) {
    mailVaultNote.textContent = t("private.mail.lockedHint", "此设备没有邮箱库钥匙。请重新添加邮箱或导入恢复钥匙。");
  } else if (!activeMailAccounts.length) {
    mailVaultNote.textContent = t("private.mail.hubCopy", "一次进入私人空间后，在这里切换多个邮箱、查看收件和写邮件。邮箱密钥会二次加密后保存。");
  } else {
    mailVaultNote.textContent = `${t("private.mail.selected", "当前邮箱")}：${accountLabel}`;
  }
}

function renderMailMessages(messages = []) {
  if (!messages.length) {
    mailThreadEmpty.className = "mail-thread-empty";
    mailThreadEmpty.innerHTML = `<strong>${t("private.mail.noMessages", "暂无邮件")}</strong><span>${t("private.mail.noMessagesCopy", "邮箱连接成功，但当前没有可显示的收件。")}</span>`;
    return;
  }
  mailThreadEmpty.className = "mail-message-list";
  mailThreadEmpty.replaceChildren(...messages.map((message) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "mail-message-row";
    const title = document.createElement("strong");
    title.textContent = message.subject || t("private.mail.noSubject", "无主题");
    const meta = document.createElement("span");
    meta.textContent = `${message.from || ""} ${message.date ? `· ${message.date}` : ""}`.trim();
    row.append(title, meta);
    return row;
  }));
}

function renderMailAccounts() {
  if (!mailUnlocked) {
    mailAccountList.innerHTML = `<p class="mail-empty">${t("private.mail.locked", "邮箱库未解锁")}</p>`;
    renderMailClient();
    return;
  }
  if (!activeMailAccounts.length) {
    mailAccountList.innerHTML = `<p class="mail-empty">${t("private.mail.empty", "暂无邮箱账号")}</p>`;
    renderMailClient();
    return;
  }
  if (!currentMailAccount()) selectedMailAccountId = activeMailAccounts[0].id;
  mailAccountList.replaceChildren(...activeMailAccounts.map((account) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mail-account-button";
    button.classList.toggle("active", account.id === selectedMailAccountId);
    button.setAttribute("aria-pressed", account.id === selectedMailAccountId ? "true" : "false");

    const mark = document.createElement("span");
    mark.className = "mail-account-mark";
    mark.textContent = mailProviderLabel(account.provider).slice(0, 1).toUpperCase();
    const body = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = account.address || t("private.mail.noAddress", "未填写账号");
    const meta = document.createElement("small");
    meta.textContent = `${mailProviderLabel(account.provider)} · ${secretTypeLabel(account.secretType)}`;
    body.append(title, meta);
    button.append(mark, body);
    button.addEventListener("click", () => {
      selectedMailAccountId = account.id;
      renderMailAccounts();
    });
    button.addEventListener("dblclick", () => openMailDialog(account));
    return button;
  }));
  renderMailClient();
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
  if (name === "mail" && !activeMailVault) loadMailVault().catch(() => {
    setMailStatus(t("private.mail.loadFailed", "邮箱库读取失败"), "error");
  });
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

async function loadMailVault() {
  const data = await api("/api/private/mail-vault");
  activeMailVault = data.vault || null;
  const storedKey = localStorage.getItem(mailKeyStorage);
  if (!activeMailVault?.ciphertext) {
    ensureMailVaultKey();
    mailUnlocked = true;
    activeMailAccounts = [];
    renderMailAccounts();
    setMailStatus(t("private.mail.noVault", "还没有邮箱，请点左下角 + 添加"), "pending");
    return;
  }
  if (!storedKey) {
    mailUnlocked = false;
    activeMailAccounts = [];
    renderMailAccounts();
    setMailStatus(t("private.mail.needsUnlock", "此设备没有邮箱库钥匙，请重新添加或导入恢复钥匙"), "error");
    return;
  }
  try {
    activeMailAccounts = await decryptMailVault(activeMailVault, storedKey);
    mailUnlocked = true;
    if (!selectedMailAccountId && activeMailAccounts[0]) selectedMailAccountId = activeMailAccounts[0].id;
    renderMailAccounts();
    setMailStatus(t("private.mail.unlocked", "邮箱总站已解锁"), "ok");
  } catch {
    mailUnlocked = false;
    activeMailAccounts = [];
    renderMailAccounts();
    setMailStatus(t("private.mail.unlockFailed", "本设备钥匙无法解开邮箱库"), "error");
  }
}

async function saveMailVault() {
  const passphrase = ensureMailVaultKey();
  const vault = await encryptMailAccounts(activeMailAccounts, passphrase);
  const data = await api("/api/private/mail-vault", {
    method: "PUT",
    body: JSON.stringify({ vault })
  });
  activeMailVault = data.vault;
  mailUnlocked = true;
  return activeMailVault;
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
  activeMailVault = null;
  activeMailAccounts = [];
  mailUnlocked = false;
  selectedMailAccountId = "";
  if (mailAccountList) mailAccountList.replaceChildren();
  if (mailStatus) setMailStatus();
  if (mailAddDialog) closeMailDialog();
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
        activeMailVault = data.mailVault || activeMailVault;
        mailUnlocked = false;
        activeMailAccounts = [];
        renderMailAccounts();
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

mailAddButton.addEventListener("click", () => openMailDialog());

mailCloseButton.addEventListener("click", closeMailDialog);

mailAddDialog.addEventListener("click", (event) => {
  if (event.target === mailAddDialog) closeMailDialog();
});

for (const choice of mailProviderChoices) {
  choice.addEventListener("click", () => setMailProvider(choice.dataset.providerChoice));
}

mailRefreshButton.addEventListener("click", async () => {
  await loadMailVault().catch(() => {
    setMailStatus(t("private.mail.loadFailed", "邮箱库读取失败"), "error");
  });
});

mailClearButton.addEventListener("click", () => {
  clearMailForm();
  setMailStatus();
});

mailForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!mailUnlocked) {
    setMailStatus(t("private.mail.unlockFirst", "邮箱库未解锁"), "error");
    return;
  }
  const address = mailAddressInput.value.trim();
  const secret = mailSecretInput.value.trim();
  if (!address || !secret) {
    setMailStatus(t("private.mail.required", "请填写邮箱账号和加密保存内容"), "error");
    return;
  }
  const now = new Date().toISOString();
  const id = mailIdInput.value || `mail-${Date.now()}-${randomBase64Url(8)}`;
  const account = {
    id,
    provider: mailProviderInput.value,
    address: address.slice(0, 160),
    secretType: mailSecretTypeInput.value,
    secret: secret.slice(0, 4000),
    note: mailNoteInput.value.trim().slice(0, 1200),
    updatedAt: now
  };
  try {
    const index = activeMailAccounts.findIndex((item) => item.id === id);
    if (index >= 0) activeMailAccounts.splice(index, 1, account);
    else activeMailAccounts.push(account);
    selectedMailAccountId = id;
    await saveMailVault();
    renderMailAccounts();
    clearMailForm();
    closeMailDialog();
    setMailStatus(t("private.mail.saved", "邮箱已加入总站并加密保存"), "ok");
  } catch (mailError) {
    const key = mailError.message === "Mail key too short" ? "private.mail.keyTooShort" : "private.mail.saveFailed";
    const fallback = mailError.message === "Mail key too short" ? "私钥至少需要 24 个字符" : "邮箱库保存失败";
    setMailStatus(t(key, fallback), "error");
  }
});

mailSyncButton.addEventListener("click", async () => {
  const account = currentMailAccount();
  if (!account) return setMailStatus(t("private.mail.noAccount", "未选择邮箱"), "error");
  try {
    mailSyncButton.disabled = true;
    setMailStatus(t("private.mail.fetching", "正在收取邮件"), "pending");
    const data = await api("/api/private/mail/inbox", {
      method: "POST",
      body: JSON.stringify({ account })
    });
    renderMailMessages(data.messages || []);
    setMailStatus(t("private.mail.fetched", "邮件已收取"), "ok");
  } catch (syncError) {
    setMailStatus(`${t("private.mail.fetchFailed", "收取失败")}：${syncError.message}`, "error");
  } finally {
    renderMailClient();
  }
});

mailComposeButton.addEventListener("click", () => {
  mailToInput.focus();
});

mailComposeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const account = currentMailAccount();
  if (!account) return setMailStatus(t("private.mail.noAccount", "未选择邮箱"), "error");
  if (!mailToInput.value.trim() || !mailSubjectInput.value.trim()) {
    return setMailStatus(t("private.mail.composeRequired", "请填写收件人和主题"), "error");
  }
  try {
    const submit = mailComposeForm.querySelector("button[type='submit']");
    submit.disabled = true;
    setMailStatus(t("private.mail.sending", "正在发送邮件"), "pending");
    await api("/api/private/mail/send", {
      method: "POST",
      body: JSON.stringify({
        account,
        message: {
          to: mailToInput.value,
          subject: mailSubjectInput.value,
          body: mailBodyInput.value
        }
      })
    });
    mailToInput.value = "";
    mailSubjectInput.value = "";
    mailBodyInput.value = "";
    setMailStatus(t("private.mail.sent", "邮件已发送"), "ok");
  } catch (sendError) {
    setMailStatus(`${t("private.mail.sendFailed", "发送失败")}：${sendError.message}`, "error");
  } finally {
    renderMailClient();
  }
});

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
  renderMailAccounts();
  loadDevices().catch(() => {});
});
