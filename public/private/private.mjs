import { t } from "../preferences.mjs?v=20260712a";

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
const dataActionButtons = [...document.querySelectorAll("[data-data-action]")];
const dataStatus = document.querySelector("[data-data-status]");
const dataImportFile = document.querySelector("[data-data-import-file]");
const mailRefreshButton = document.querySelector("[data-mail-refresh]");
const mailAddButton = document.querySelector("[data-mail-add]");
const mailAddDialog = document.querySelector("[data-mail-add-dialog]");
const mailCloseButton = document.querySelector("[data-mail-close]");
const mailProviderChoices = [...document.querySelectorAll("[data-provider-choice]")];
const mailProviderHint = document.querySelector("[data-mail-provider-hint]");
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
const mailComposeCloseButton = document.querySelector("[data-mail-compose-close]");
const mailClientGrid = document.querySelector("[data-mail-client-grid]");
const mailToInput = document.querySelector("[data-mail-to]");
const mailSubjectInput = document.querySelector("[data-mail-subject]");
const mailBodyInput = document.querySelector("[data-mail-body]");
const mailWebmailLink = document.querySelector("[data-mail-webmail]");
const mailStatus = document.querySelector("[data-mail-status]");
const mailTransportNote = document.querySelector("[data-mail-transport-note]");
const mailKeyManageButtons = [...document.querySelectorAll("[data-mail-key-manage]")];
const mailKeyDialog = document.querySelector("[data-mail-key-dialog]");
const mailKeyForm = document.querySelector("[data-mail-key-form]");
const mailKeyCloseButton = document.querySelector("[data-mail-key-close]");
const mailKeyInput = document.querySelector("[data-mail-key-input]");
const mailKeyCopyButton = document.querySelector("[data-mail-key-copy]");
const mailKeyStatus = document.querySelector("[data-mail-key-status]");

let activeProfile = { ...defaultProfile };
let activeMailVault = null;
let activeMailAccounts = [];
let mailUnlocked = false;
let selectedMailAccountId = "";
let mailDialogReturnFocus = null;
let mailSmtpAvailable = true;
let mailCapabilitiesLoaded = false;

const mailKeyStorage = "smc-mail-vault-key";
const mailVaultIterations = 240000;
const mailProviders = {
  gmail: { label: "Gmail", hint: "App Password" },
  qq: { label: "QQ", hint: "IMAP/SMTP" },
  "163": { label: "163", hint: "IMAP/SMTP" },
  icloud: { label: "iCloud", hint: "App Password" },
  hrbeu: { label: "HRBEU", hint: "School Mail" },
  custom: { label: "Custom", hint: "Manual" }
};
const mailProviderGuideKeys = {
  gmail: "private.mail.guide.gmail",
  qq: "private.mail.guide.qq",
  "163": "private.mail.guide.163",
  icloud: "private.mail.guide.icloud",
  hrbeu: "private.mail.guide.hrbeu",
  custom: "private.mail.guide.custom"
};
const mailProviderWebmail = {
  gmail: "https://mail.google.com/",
  qq: "https://mail.qq.com/",
  "163": "https://mail.163.com/",
  icloud: "https://www.icloud.com/mail/"
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
  const guideKey = mailProviderGuideKeys[provider];
  mailProviderHint.textContent = guideKey ? t(guideKey, "") : "";
  const auth = provider === "gmail" || provider === "icloud" ? "app-password" : "imap-smtp";
  mailSecretTypeInput.value = auth;
}

function clearMailForm() {
  mailIdInput.value = "";
  setMailProvider("gmail");
  mailAddressInput.value = "";
  mailSecretInput.value = "";
  mailNoteInput.value = "";
}

function openMailDialog(account = null) {
  clearMailForm();
  if (account) {
    mailIdInput.value = account.id;
    setMailProvider(account.provider || "custom");
    mailAddressInput.value = account.address || "";
    mailSecretTypeInput.value = account.secretType || "app-password";
    mailSecretInput.value = account.secret || "";
    mailNoteInput.value = account.note || "";
  }
  mailDialogReturnFocus = document.activeElement;
  mailAddDialog.hidden = false;
  mailAddressInput.focus();
}

function closeMailDialog() {
  mailAddDialog.hidden = true;
  if (mailDialogReturnFocus instanceof HTMLElement) mailDialogReturnFocus.focus();
  mailDialogReturnFocus = null;
}

function setMailKeyStatus(text = "", tone = "") {
  mailKeyStatus.textContent = text;
  mailKeyStatus.dataset.tone = tone;
}

function openMailKeyDialog() {
  const storedKey = localStorage.getItem(mailKeyStorage) || "";
  const canCopy = Boolean(storedKey && mailUnlocked);
  mailDialogReturnFocus = document.activeElement;
  mailKeyInput.value = storedKey;
  mailKeyInput.readOnly = canCopy;
  mailKeyCopyButton.hidden = !canCopy;
  mailKeyForm.querySelector("button[type='submit']").hidden = canCopy;
  setMailKeyStatus();
  mailKeyDialog.hidden = false;
  if (canCopy) mailKeyCopyButton.focus();
  else mailKeyInput.focus();
}

function closeMailKeyDialog() {
  mailKeyDialog.hidden = true;
  mailKeyInput.value = "";
  setMailKeyStatus();
  if (mailDialogReturnFocus instanceof HTMLElement) mailDialogReturnFocus.focus();
  mailDialogReturnFocus = null;
}

function setComposeOpen(open) {
  const shouldOpen = Boolean(open && currentMailAccount());
  mailComposeForm.hidden = !shouldOpen;
  mailClientGrid.classList.toggle("compose-open", shouldOpen);
  mailComposeButton.setAttribute("aria-pressed", shouldOpen ? "true" : "false");
  if (shouldOpen) mailToInput.focus();
}

function renderMailClient() {
  const account = currentMailAccount();
  const accountLabel = account?.address || t("private.mail.noAccount", "未选择邮箱");
  mailActiveAccount.textContent = accountLabel;
  mailComposeFrom.textContent = accountLabel;
  mailSyncButton.disabled = !account;
  mailComposeButton.disabled = !account;
  mailComposeForm.querySelector("button[type='submit']").disabled = !account || !mailSmtpAvailable;
  mailTransportNote.hidden = mailSmtpAvailable;
  const webmailUrl = account ? mailProviderWebmail[account.provider] : "";
  mailWebmailLink.hidden = !webmailUrl;
  mailWebmailLink.href = webmailUrl || "#";
  if (!account) setComposeOpen(false);
  if (!mailUnlocked) {
    mailVaultNote.textContent = t("private.mail.lockedHint", "此设备尚未解锁邮箱库，请使用恢复钥匙解锁。");
  } else if (!activeMailAccounts.length) {
    mailVaultNote.textContent = t("private.mail.emptyHint", "添加第一个邮箱后即可开始收件。");
  } else {
    mailVaultNote.textContent = `${t("private.mail.selected", "当前邮箱")}: ${accountLabel}`;
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
    const row = document.createElement("article");
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
    const empty = document.createElement("div");
    empty.className = "mail-rail-empty";
    const title = document.createElement("strong");
    title.textContent = t("private.mail.locked", "邮箱库未解锁");
    const copy = document.createElement("span");
    copy.textContent = t("private.mail.unlockCopy", "用另一台设备提供的恢复钥匙解锁。");
    const unlock = document.createElement("button");
    unlock.type = "button";
    unlock.className = "button";
    unlock.textContent = t("private.mail.unlockDevice", "在此设备解锁");
    unlock.addEventListener("click", openMailKeyDialog);
    empty.append(title, copy, unlock);
    mailAccountList.replaceChildren(empty);
    renderMailClient();
    return;
  }
  if (!activeMailAccounts.length) {
    const empty = document.createElement("div");
    empty.className = "mail-rail-empty";
    const title = document.createElement("strong");
    title.textContent = t("private.mail.empty", "暂无邮箱账号");
    const copy = document.createElement("span");
    copy.textContent = t("private.mail.emptyCopy", "添加邮箱后可在这里切换账号。");
    const add = document.createElement("button");
    add.type = "button";
    add.className = "button";
    add.textContent = t("private.mail.addFirst", "添加第一个邮箱");
    add.addEventListener("click", () => openMailDialog());
    empty.append(title, copy, add);
    mailAccountList.replaceChildren(empty);
    renderMailClient();
    return;
  }
  if (!currentMailAccount()) selectedMailAccountId = activeMailAccounts[0].id;
  mailAccountList.replaceChildren(...activeMailAccounts.map((account) => {
    const row = document.createElement("div");
    row.className = "mail-account-row";
    row.classList.toggle("active", account.id === selectedMailAccountId);
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
      renderMailMessages([]);
      renderMailAccounts();
    });
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "mail-account-edit";
    edit.setAttribute("aria-label", `${t("private.mail.edit", "编辑邮箱")} ${account.address || ""}`.trim());
    edit.textContent = t("private.mail.edit", "编辑");
    edit.addEventListener("click", () => openMailDialog(account));
    row.append(button, edit);
    return row;
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
  if (name === "mail" && !mailCapabilitiesLoaded) loadMailCapabilities().catch(() => {});
  if (name !== "mail") setComposeOpen(false);
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
    setMailStatus(t("private.mail.noVault", "还没有邮箱，请添加第一个邮箱"), "pending");
    return;
  }
  if (!storedKey) {
    mailUnlocked = false;
    activeMailAccounts = [];
    renderMailAccounts();
    setMailStatus(t("private.mail.needsUnlock", "此设备没有邮箱库恢复钥匙，请从已解锁设备复制后在这里解锁"), "pending");
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

async function loadMailCapabilities() {
  const data = await api("/api/private/mail/capabilities");
  mailSmtpAvailable = data.smtpAvailable !== false;
  mailCapabilitiesLoaded = true;
  renderMailClient();
}

async function unlockMailVaultWithKey(passphrase) {
  const key = String(passphrase || "").trim();
  if (key.length < 24) throw new Error("Mail key too short");
  if (activeMailVault?.ciphertext) {
    activeMailAccounts = await decryptMailVault(activeMailVault, key);
  } else {
    activeMailAccounts = [];
  }
  localStorage.setItem(mailKeyStorage, key);
  mailUnlocked = true;
  selectedMailAccountId = activeMailAccounts[0]?.id || "";
  renderMailAccounts();
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
  if (mailKeyDialog) closeMailKeyDialog();
  setComposeOpen(false);
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

for (const button of dataActionButtons) {
  button.addEventListener("click", async () => {
    const action = button.dataset.dataAction;
    if (action === "import-local") {
      dataImportFile.click();
      return;
    }
    try {
      button.disabled = true;
      if (action === "export-local") {
        setDataStatus(t("private.data.preparing", "正在准备备份文件"), "pending");
        const response = await fetch("/api/private/data/export/local", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: "{}"
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || response.statusText || "Local export failed");
        }
        const blob = await response.blob();
        const disposition = response.headers.get("Content-Disposition") || "";
        const match = disposition.match(/filename="?([^";]+)"?/i);
        const fileName = match?.[1] || `smc-private-data-${Date.now()}.zip`;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.append(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        setDataStatus(`${t("private.data.savedLocal", "备份已下载：")}${fileName}`, "ok");
      } else {
        const endpoint = action === "export-subsite"
          ? "/api/private/data/export/subsite"
          : "/api/private/data/import/subsite";
        await api(endpoint, { method: "POST", body: "{}" });
      }
    } catch (dataError) {
      if (dataError.message === "Subsite transfer not configured") {
        setDataStatus(t("private.data.subsitePending", "子网站接口已预留"), "pending");
      } else {
        setDataStatus(t("private.data.failed", "操作失败，请稍后再试"), "error");
      }
    } finally {
      button.disabled = false;
    }
  });
}

dataImportFile.addEventListener("change", async () => {
  const file = dataImportFile.files?.[0];
  if (!file) return;
  try {
    setDataStatus(t("private.data.importing", "正在检查并恢复备份"), "pending");
    const response = await fetch("/api/private/data/import/local", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/zip",
        "X-Archive-Filename": encodeURIComponent(file.name)
      },
      body: file
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || response.statusText || "Local import failed");
    renderProfile(data.profile);
    activeMailVault = data.mailVault || null;
    mailUnlocked = false;
    activeMailAccounts = [];
    selectedMailAccountId = "";
    await loadMailVault();
    setEditing(false);
    setDataStatus(`${t("private.data.importedLocal", "已从备份恢复：")}${data.fileName || file.name}`, "ok");
  } catch (dataError) {
    const key = dataError.message === "Archive too large"
      ? "private.data.tooLarge"
      : dataError.message === "Unsupported archive" || dataError.message === "Invalid archive"
        ? "private.data.invalidArchive"
        : "private.data.failed";
    setDataStatus(t(key, "无法恢复这个备份文件"), "error");
  } finally {
    dataImportFile.value = "";
  }
});

mailAddButton.addEventListener("click", () => openMailDialog());

mailCloseButton.addEventListener("click", closeMailDialog);

mailAddDialog.addEventListener("click", (event) => {
  if (event.target === mailAddDialog) closeMailDialog();
});

for (const button of mailKeyManageButtons) {
  button.addEventListener("click", openMailKeyDialog);
}

mailKeyCloseButton.addEventListener("click", closeMailKeyDialog);

mailKeyDialog.addEventListener("click", (event) => {
  if (event.target === mailKeyDialog) closeMailKeyDialog();
});

mailKeyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const key = mailKeyInput.value.trim();
  try {
    setMailKeyStatus(t("private.mail.unlocking", "正在解锁邮箱库"), "pending");
    await unlockMailVaultWithKey(key);
    closeMailKeyDialog();
    setMailStatus(t("private.mail.deviceUnlocked", "邮箱库已在此设备解锁"), "ok");
  } catch (unlockError) {
    const statusKey = unlockError.message === "Mail key too short"
      ? "private.mail.keyTooShort"
      : "private.mail.unlockFailed";
    setMailKeyStatus(t(statusKey, "恢复钥匙不正确，无法解开邮箱库"), "error");
    mailKeyInput.select();
  }
});

mailKeyCopyButton.addEventListener("click", async () => {
  const key = localStorage.getItem(mailKeyStorage) || "";
  if (!key) return;
  try {
    await navigator.clipboard.writeText(key);
    setMailKeyStatus(t("private.mail.keyCopied", "恢复钥匙已复制"), "ok");
  } catch {
    mailKeyInput.readOnly = false;
    mailKeyInput.select();
    setMailKeyStatus(t("private.mail.copyKeyFallback", "请手动复制已选中的恢复钥匙"), "pending");
  }
});

document.addEventListener("keydown", (event) => {
  const openDialog = !mailAddDialog.hidden ? mailAddDialog : !mailKeyDialog.hidden ? mailKeyDialog : null;
  if (event.key === "Escape") {
    if (openDialog === mailAddDialog) closeMailDialog();
    else if (openDialog === mailKeyDialog) closeMailKeyDialog();
    else if (!mailComposeForm.hidden) setComposeOpen(false);
    return;
  }
  if (event.key !== "Tab" || !openDialog) return;
  const focusable = [...openDialog.querySelectorAll("button, input, select, textarea, a[href]")]
    .filter((element) => !element.hidden && !element.disabled && element.getClientRects().length);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
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
  let id = mailIdInput.value || "";
  if (!id) {
    const existing = activeMailAccounts.find((item) =>
      item.provider === mailProviderInput.value
      && String(item.address || "").toLowerCase() === address.toLowerCase()
    );
    id = existing?.id || `mail-${Date.now()}-${randomBase64Url(8)}`;
  }
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
  setComposeOpen(mailComposeForm.hidden);
});

mailComposeCloseButton.addEventListener("click", () => setComposeOpen(false));

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
    setComposeOpen(false);
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
  const guideKey = mailProviderGuideKeys[mailProviderInput.value];
  mailProviderHint.textContent = guideKey ? t(guideKey, "") : "";
  renderMailAccounts();
  if (!mailUnlocked) {
    setMailStatus(t("private.mail.needsUnlock", "此设备没有邮箱库恢复钥匙"), "pending");
  } else if (!activeMailAccounts.length) {
    setMailStatus(t("private.mail.noVault", "还没有邮箱，请添加第一个邮箱"), "pending");
  } else {
    setMailStatus(t("private.mail.unlocked", "邮箱库已解锁"), "ok");
  }
  loadDevices().catch(() => {});
});
