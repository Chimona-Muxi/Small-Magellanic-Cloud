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
const mailDialogTitle = document.querySelector("[data-mail-dialog-title]");
const mailIdInput = document.querySelector("[data-mail-id]");
const mailProviderInput = document.querySelector("[data-mail-provider]");
const mailAddressInput = document.querySelector("[data-mail-address]");
const mailSecretTypeInput = document.querySelector("[data-mail-secret-type]");
const mailSecretInput = document.querySelector("[data-mail-secret]");
const mailNoteInput = document.querySelector("[data-mail-note]");
const mailClearButton = document.querySelector("[data-mail-clear]");
const mailDeleteButton = document.querySelector("[data-mail-delete]");
const mailSaveButton = document.querySelector("[data-mail-save]");
const mailFormStatus = document.querySelector("[data-mail-form-status]");
const mailAccountList = document.querySelector("[data-mail-account-list]");
const mailActiveAccount = document.querySelector("[data-mail-active-account]");
const mailComposeFrom = document.querySelector("[data-mail-compose-from]");
const mailVaultNote = document.querySelector("[data-mail-vault-note]");
const mailThreadEmpty = document.querySelector("[data-mail-thread-empty]");
const mailViewButtons = [...document.querySelectorAll("[data-mail-view]")];
const mailViewPanels = [...document.querySelectorAll("[data-mail-view-panel]")];
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
const mailMessageDialog = document.querySelector("[data-mail-message-dialog]");
const mailMessageCard = document.querySelector("[data-mail-message-card]");
const mailMessageCloseButton = document.querySelector("[data-mail-message-close]");
const mailMessageSubject = document.querySelector("[data-mail-message-subject]");
const mailMessageStatus = document.querySelector("[data-mail-message-status]");
const mailMessageContent = document.querySelector("[data-mail-message-content]");
const mailMessageFrom = document.querySelector("[data-mail-message-from]");
const mailMessageDate = document.querySelector("[data-mail-message-date]");
const mailMessageBody = document.querySelector("[data-mail-message-body]");
const mailInsightsScanButton = document.querySelector("[data-mail-insights-scan]");
const mailInsightsClearButton = document.querySelector("[data-mail-insights-clear]");
const mailInsightsSummary = document.querySelector("[data-mail-insights-summary]");
const mailInsightsStatus = document.querySelector("[data-mail-insights-status]");
const mailInsightsResults = document.querySelector("[data-mail-insights-results]");
const mailInsightsDisclaimer = document.querySelector("[data-mail-insights-disclaimer]");
const mailKeyManageButtons = [...document.querySelectorAll("[data-mail-key-manage]")];
const mailKeyDialog = document.querySelector("[data-mail-key-dialog]");
const mailKeyForm = document.querySelector("[data-mail-key-form]");
const mailKeyCloseButton = document.querySelector("[data-mail-key-close]");
const mailKeyInput = document.querySelector("[data-mail-key-input]");
const mailKeyField = mailKeyInput.closest("label");
const mailKeyResetButton = document.querySelector("[data-mail-key-reset]");
const mailKeyCopyButton = document.querySelector("[data-mail-key-copy]");
const mailKeyStatus = document.querySelector("[data-mail-key-status]");
const mailKeyDialogCopy = document.querySelector("[data-mail-key-dialog-copy]");
const phoneAddButton = document.querySelector("[data-phone-add]");
const phoneList = document.querySelector("[data-phone-list]");
const phoneStatus = document.querySelector("[data-phone-status]");
const phoneDialog = document.querySelector("[data-phone-dialog]");
const phoneForm = document.querySelector("[data-phone-form]");
const phoneDialogTitle = document.querySelector("[data-phone-dialog-title]");
const phoneIdInput = document.querySelector("[data-phone-id]");
const phoneLabelInput = document.querySelector("[data-phone-label]");
const phoneNumberInput = document.querySelector("[data-phone-number]");
const phoneCarrierInput = document.querySelector("[data-phone-carrier]");
const phonePurposeInput = document.querySelector("[data-phone-purpose]");
const phoneStatusInput = document.querySelector("[data-phone-status-input]");
const phoneNoteInput = document.querySelector("[data-phone-note]");
const phoneCloseButton = document.querySelector("[data-phone-close]");
const phoneCancelButton = document.querySelector("[data-phone-cancel]");
const phoneDeleteButton = document.querySelector("[data-phone-delete]");
const phoneDialogStatus = document.querySelector("[data-phone-dialog-status]");
const ledgerAddButton = document.querySelector("[data-ledger-add]");
const ledgerList = document.querySelector("[data-ledger-list]");
const ledgerStatus = document.querySelector("[data-ledger-status]");
const ledgerSummary = document.querySelector("[data-ledger-summary]");
const ledgerMonthFilter = document.querySelector("[data-ledger-month-filter]");
const ledgerAllMonthsButton = document.querySelector("[data-ledger-all-months]");
const ledgerFilterCount = document.querySelector("[data-ledger-filter-count]");
const ledgerDialog = document.querySelector("[data-ledger-dialog]");
const ledgerForm = document.querySelector("[data-ledger-form]");
const ledgerDialogTitle = document.querySelector("[data-ledger-dialog-title]");
const ledgerIdInput = document.querySelector("[data-ledger-id]");
const ledgerDateInput = document.querySelector("[data-ledger-date]");
const ledgerTypeInput = document.querySelector("[data-ledger-type]");
const ledgerCategoryInput = document.querySelector("[data-ledger-category]");
const ledgerAmountInput = document.querySelector("[data-ledger-amount]");
const ledgerCurrencyInput = document.querySelector("[data-ledger-currency]");
const ledgerMerchantInput = document.querySelector("[data-ledger-merchant]");
const ledgerNoteInput = document.querySelector("[data-ledger-note]");
const ledgerRecurringInput = document.querySelector("[data-ledger-recurring]");
const ledgerCloseButton = document.querySelector("[data-ledger-close]");
const ledgerCancelButton = document.querySelector("[data-ledger-cancel]");
const ledgerDeleteButton = document.querySelector("[data-ledger-delete]");
const ledgerDialogStatus = document.querySelector("[data-ledger-dialog-status]");
const privateContextMenu = document.querySelector("[data-private-context-menu]");

let activeProfile = { ...defaultProfile };
let activeMailVault = null;
let activeMailAccounts = [];
let mailUnlocked = false;
let selectedMailAccountId = "";
let mailDialogReturnFocus = null;
let mailMessageReturnFocus = null;
let mailMessageAbortController = null;
let mailInsightAbortController = null;
let mailSmtpAvailable = true;
let mailCapabilitiesLoaded = false;
let mailSyncKey = "";
let mailActiveKey = "";
let mailKeyMismatch = false;
let activePhones = [];
let activeLedger = [];
let mailVaultLoaded = false;
let mailVaultLoadPromise = null;
let recordDialogReturnFocus = null;
let activeMailView = "inbox";
let activeMailMessages = [];
let activeMailInsights = [];
let activeMailInsightScope = null;
let activeMailInsightDisclaimer = "";
let contextMenuReturnFocus = null;

const mailKeyStorage = "smc-mail-vault-key";
const mailSyncKeyStorage = "smc-mail-vault-sync-key-v1";
const mailVaultIterations = 240000;
const phoneLimit = 20;
const ledgerLimit = 1000;
const phoneStatuses = new Set(["active", "spare", "inactive"]);
const ledgerTypes = new Set(["expense", "income"]);
const ledgerCategories = new Set(["subscription", "food", "transport", "housing", "shopping", "health", "education", "entertainment", "salary", "transfer", "other"]);
const ledgerCurrencies = new Set(["CNY", "USD", "EUR", "JPY", "GBP"]);
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
const mailInsightCategories = ["recurring", "account", "purchase", "newsletter"];
const mailInsightStatuses = new Set(["active", "failed", "cancelled", "completed", "possible"]);

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

async function deriveMailSyncPassphrase(password) {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(String(password || "")),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = new Uint8Array(await crypto.subtle.deriveBits({
    name: "PBKDF2",
    salt: encoder.encode("Small-Magellanic-Cloud/private-vault-sync/v1"),
    iterations: 180000,
    hash: "SHA-256"
  }, baseKey, 256));
  const encoded = bytesToBase64(bits)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  return `SMC-MAIL-SYNC-${encoded.match(/.{1,8}/g).join("-")}`;
}

function normalizePhones(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, phoneLimit).map((phone) => ({
    id: String(phone?.id || `phone-${Date.now()}-${randomBase64Url(8)}`).slice(0, 120),
    label: String(phone?.label || "").slice(0, 80),
    number: String(phone?.number || "").slice(0, 40),
    carrier: String(phone?.carrier || "").slice(0, 80),
    purpose: String(phone?.purpose || "").slice(0, 120),
    status: phoneStatuses.has(phone?.status) ? phone.status : "active",
    note: String(phone?.note || "").slice(0, 600),
    updatedAt: String(phone?.updatedAt || "").slice(0, 40)
  }));
}

function normalizeLedger(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, ledgerLimit).map((entry) => ({
    id: String(entry?.id || `ledger-${Date.now()}-${randomBase64Url(8)}`).slice(0, 120),
    date: String(entry?.date || "").slice(0, 10),
    type: ledgerTypes.has(entry?.type) ? entry.type : "expense",
    category: ledgerCategories.has(entry?.category) ? entry.category : "other",
    amount: typeof entry?.amount === "number" && Number.isInteger(entry.amount)
      ? (entry.amount / 100).toFixed(2)
      : String(entry?.amount || "0").slice(0, 14),
    currency: ledgerCurrencies.has(entry?.currency) ? entry.currency : "CNY",
    merchant: String(entry?.merchant || "").slice(0, 120),
    note: String(entry?.note || "").slice(0, 600),
    recurring: Boolean(entry?.recurring),
    updatedAt: String(entry?.updatedAt || "").slice(0, 40)
  }));
}

async function encryptMailAccounts(accounts, phones, ledger, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveMailKey(passphrase, salt);
  const payload = new TextEncoder().encode(JSON.stringify({
    version: 2,
    savedAt: new Date().toISOString(),
    accounts,
    phones,
    ledger
  }));
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, payload));
  return {
    vaultVersion: 2,
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
  if (!vault?.ciphertext) return { accounts: [], phones: [], ledger: [] };
  const salt = base64ToBytes(vault.salt || "");
  const iv = base64ToBytes(vault.iv || "");
  const encrypted = base64ToBytes(vault.ciphertext || "");
  const key = await deriveMailKey(passphrase, salt, Number(vault.iterations) || mailVaultIterations);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
  const payload = JSON.parse(new TextDecoder().decode(decrypted));
  return {
    accounts: Array.isArray(payload.accounts) ? payload.accounts : [],
    phones: normalizePhones(payload.phones),
    ledger: normalizeLedger(payload.ledger)
  };
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
  let key = mailSyncKey
    || localStorage.getItem(mailSyncKeyStorage)
    || mailActiveKey
    || localStorage.getItem(mailKeyStorage);
  if (!key) {
    key = `SMC-MAIL-${randomBase64Url(32).match(/.{1,7}/g).join("-")}`;
  }
  mailActiveKey = key;
  if (key.startsWith("SMC-MAIL-SYNC-")) {
    localStorage.setItem(mailSyncKeyStorage, key);
    localStorage.removeItem(mailKeyStorage);
  } else {
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
  mailDeleteButton.hidden = true;
  mailDialogTitle.textContent = t("private.mail.addTitle", "添加邮箱");
  mailSaveButton.textContent = t("private.mail.saveAccount", "添加邮箱");
  setMailFormStatus();
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
    mailDeleteButton.hidden = false;
    mailDialogTitle.textContent = t("private.mail.editTitle", "编辑邮箱");
    mailSaveButton.textContent = t("private.mail.updateAccount", "保存修改");
  }
  mailDialogReturnFocus = document.activeElement;
  mailAddDialog.hidden = false;
  mailAddressInput.focus();
}

function closeMailDialog() {
  mailAddDialog.hidden = true;
  setMailFormStatus();
  if (mailDialogReturnFocus instanceof HTMLElement) mailDialogReturnFocus.focus();
  mailDialogReturnFocus = null;
}

function setMailFormStatus(text = "", tone = "") {
  mailFormStatus.textContent = text;
  mailFormStatus.dataset.tone = tone;
}

function setMailKeyStatus(text = "", tone = "") {
  mailKeyStatus.textContent = text;
  mailKeyStatus.dataset.tone = tone;
}

function openMailKeyDialog() {
  const storedKey = mailActiveKey
    || localStorage.getItem(mailSyncKeyStorage)
    || localStorage.getItem(mailKeyStorage)
    || "";
  const canCopy = Boolean(storedKey && mailUnlocked);
  mailDialogReturnFocus = document.activeElement;
  mailKeyInput.value = canCopy ? storedKey : "";
  mailKeyInput.readOnly = canCopy;
  mailKeyField.hidden = canCopy;
  mailKeyResetButton.hidden = canCopy || !mailSyncKey;
  mailKeyCopyButton.hidden = !canCopy;
  mailKeyForm.querySelector("button[type='submit']").hidden = canCopy;
  mailKeyDialogCopy.textContent = canCopy
    ? t("private.mail.autoSyncCopy", "在其他设备登录私人空间后会自动解锁。只有迁移旧数据或恢复到其他服务器时，才需要保存恢复钥匙。")
    : t("private.mail.manualUnlockCopy", "这是一份尚未完成自动同步的旧邮箱库。请从仍能打开它的设备复制恢复钥匙。");
  setMailKeyStatus(mailKeyMismatch
    ? t("private.mail.savedKeyMismatch", "本设备原先保存的钥匙与当前邮箱库不匹配。")
    : "", mailKeyMismatch ? "pending" : "");
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

function setMailView(view, focus = false) {
  const nextView = view === "insights" ? "insights" : "inbox";
  activeMailView = nextView;
  if (nextView === "insights") setComposeOpen(false);
  mailClientGrid.classList.toggle("insights-open", nextView === "insights");
  for (const button of mailViewButtons) {
    const active = button.dataset.mailView === nextView;
    button.setAttribute("aria-selected", active ? "true" : "false");
    button.tabIndex = active ? 0 : -1;
    if (focus && active) button.focus();
  }
  for (const panel of mailViewPanels) {
    panel.hidden = panel.dataset.mailViewPanel !== nextView;
  }
}

function renderMailClient() {
  const account = currentMailAccount();
  const accountLabel = account?.address || t("private.mail.noAccount", "未选择邮箱");
  mailActiveAccount.textContent = accountLabel;
  mailComposeFrom.textContent = accountLabel;
  mailSyncButton.disabled = !account;
  mailComposeButton.disabled = !account;
  mailInsightsScanButton.disabled = !account || Boolean(mailInsightAbortController);
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
  setMailView(activeMailView);
}

function renderMailMessages(messages = []) {
  activeMailMessages = Array.isArray(messages)
    ? messages.map((message) => ({
      ...message,
      uid: String(message?.uid ?? message?.id ?? "").trim(),
      from: String(message?.from || ""),
      subject: String(message?.subject || ""),
      date: String(message?.date || "")
    })).filter((message) => message.uid)
    : [];
  if (!activeMailMessages.length) {
    mailThreadEmpty.className = "mail-thread-empty";
    mailThreadEmpty.replaceChildren(
      recordText("strong", "", t("private.mail.noMessages", "暂无邮件")),
      recordText("span", "", t("private.mail.noMessagesCopy", "邮箱连接成功，但当前没有可显示的收件。"))
    );
    return;
  }
  mailThreadEmpty.className = "mail-message-list";
  mailThreadEmpty.replaceChildren(...activeMailMessages.map((message) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "mail-message-row";
    row.dataset.contextKind = "mail-message";
    row.dataset.contextId = message.uid;
    row.setAttribute("aria-haspopup", "dialog");
    row.setAttribute("aria-controls", "mail-message-dialog");
    const title = document.createElement("strong");
    title.textContent = message.subject || t("private.mail.noSubject", "无主题");
    const meta = document.createElement("span");
    meta.textContent = `${message.from || ""} ${message.date ? `· ${message.date}` : ""}`.trim();
    row.append(title, meta);
    row.addEventListener("click", () => openMailMessage(message, row));
    return row;
  }));
}

function mailInsightCategoryLabel(value) {
  const labels = {
    recurring: t("private.mail.insightCategoryRecurring", "周期订阅"),
    account: t("private.mail.insightCategoryAccount", "注册账号"),
    purchase: t("private.mail.insightCategoryPurchase", "购买记录"),
    newsletter: t("private.mail.insightCategoryNewsletter", "邮件简报")
  };
  return labels[value] || t("private.mail.insightCategoryOther", "其他线索");
}

function mailInsightStatusLabel(value) {
  const labels = {
    active: t("private.mail.insightStatusActive", "可能仍在续费"),
    failed: t("private.mail.insightStatusFailed", "付款可能失败"),
    cancelled: t("private.mail.insightStatusCancelled", "可能已取消"),
    completed: t("private.mail.insightStatusCompleted", "购买可能完成"),
    possible: t("private.mail.insightStatusPossible", "有相关线索")
  };
  return labels[value] || labels.possible;
}

function mailInsightConfidenceLabel(value) {
  const confidence = Math.max(0, Math.min(1, Number(value) || 0));
  const level = confidence >= 0.86
    ? t("private.mail.confidenceHigh", "较高")
    : confidence >= 0.7
      ? t("private.mail.confidenceMedium", "中等")
      : t("private.mail.confidenceLow", "较低");
  return `${t("private.mail.confidence", "置信度")} ${Math.round(confidence * 100)}% · ${level}`;
}

function normalizeMailInsightItems(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 100).map((item) => {
    const category = mailInsightCategories.includes(item?.category) ? item.category : "account";
    const evidence = Array.isArray(item?.evidence)
      ? item.evidence.slice(0, 5).map((message) => ({
        uid: String(message?.uid ?? message?.id ?? "").trim(),
        subject: String(message?.subject || "").slice(0, 300),
        date: String(message?.date || "").slice(0, 160),
        signals: Array.isArray(message?.signals) ? message.signals.map(String).slice(0, 5) : []
      })).filter((message) => message.uid)
      : [];
    return {
      service: String(item?.service || item?.domain || "").slice(0, 253),
      name: String(item?.name || item?.service || item?.domain || t("private.mail.unknownService", "未知服务")).slice(0, 120),
      domain: String(item?.domain || item?.service || "").slice(0, 253),
      category,
      status: mailInsightStatuses.has(item?.status) ? item.status : "possible",
      confidence: Math.max(0, Math.min(1, Number(item?.confidence) || 0)),
      inferred: item?.inferred !== false,
      evidence
    };
  });
}

function renderMailInsightSummary() {
  if (!activeMailInsightScope) {
    mailInsightsSummary.hidden = true;
    mailInsightsSummary.replaceChildren();
    return;
  }
  const counts = Object.fromEntries(mailInsightCategories.map((category) => [category, 0]));
  for (const item of activeMailInsights) counts[item.category] += 1;
  const scanned = Number(activeMailInsightScope.scannedMessages) || 0;
  const scope = recordText("span", "mail-insights-scope", `${t("private.mail.scannedHeaders", "已分析邮件头")} ${scanned}`);
  mailInsightsSummary.replaceChildren(
    scope,
    ...mailInsightCategories.map((category) => {
      const chip = recordText("span", "mail-insights-summary-chip", `${mailInsightCategoryLabel(category)} ${counts[category]}`);
      chip.dataset.category = category;
      return chip;
    })
  );
  mailInsightsSummary.hidden = false;
}

function renderMailInsights() {
  renderMailInsightSummary();
  mailInsightsClearButton.hidden = !activeMailInsightScope;
  mailInsightsDisclaimer.textContent = activeMailInsightDisclaimer
    || t("private.mail.insightsDisclaimer", "结果可能遗漏或误判；营销邮件订阅不等于付费订阅，请以服务商账户和账单为准。");
  if (!activeMailInsightScope) {
    const empty = document.createElement("div");
    empty.className = "mail-insights-empty";
    empty.append(
      recordText("strong", "", t("private.mail.insightsEmptyTitle", "尚未扫描此邮箱")),
      recordText("span", "", t("private.mail.insightsEmptyCopy", "扫描结果是邮件线索推断，不代表你仍持有账号或正在付费。"))
    );
    mailInsightsResults.replaceChildren(empty);
    return;
  }
  if (!activeMailInsights.length) {
    const empty = document.createElement("div");
    empty.className = "mail-insights-empty";
    empty.append(
      recordText("strong", "", t("private.mail.noInsightsTitle", "没有发现明确线索")),
      recordText("span", "", t("private.mail.noInsightsCopy", "这不代表没有注册账号或订阅；当前扫描只覆盖收件箱邮件头。"))
    );
    mailInsightsResults.replaceChildren(empty);
    return;
  }

  const groups = mailInsightCategories.map((category) => {
    const items = activeMailInsights.filter((item) => item.category === category);
    if (!items.length) return null;
    const section = document.createElement("section");
    section.className = "mail-insight-group";
    section.dataset.category = category;
    const heading = document.createElement("div");
    heading.className = "mail-insight-group-head";
    heading.append(
      recordText("h4", "", mailInsightCategoryLabel(category)),
      recordText("span", "", `${items.length} ${t("private.mail.insightItems", "项")}`)
    );
    const list = document.createElement("div");
    list.className = "mail-insight-card-list";
    list.replaceChildren(...items.map((item) => {
      const index = activeMailInsights.indexOf(item);
      const card = document.createElement("article");
      card.className = "mail-insight-card";
      card.dataset.contextKind = "mail-insight";
      card.dataset.contextId = String(index);
      card.tabIndex = 0;
      card.setAttribute("aria-label", `${item.name}，${mailInsightCategoryLabel(item.category)}，${mailInsightStatusLabel(item.status)}`);

      const head = document.createElement("div");
      head.className = "mail-insight-card-head";
      const mark = recordText("span", "mail-insight-mark", (item.name || item.domain || "?").trim().slice(0, 1).toUpperCase() || "?");
      mark.setAttribute("aria-hidden", "true");
      const identity = document.createElement("div");
      identity.className = "mail-insight-identity";
      identity.append(
        recordText("strong", "", item.name),
        recordText("span", "", item.domain || item.service)
      );
      const status = recordText("span", "mail-insight-status-badge", mailInsightStatusLabel(item.status));
      status.dataset.status = item.status;
      head.append(mark, identity, status);

      const facts = document.createElement("div");
      facts.className = "mail-insight-facts";
      facts.append(
        recordText("span", "", t("private.mail.inferredFromMail", "邮件推断")),
        recordText("span", "", mailInsightConfidenceLabel(item.confidence)),
        recordText("span", "", `${item.evidence.length} ${t("private.mail.evidenceMessages", "封证据邮件")}`)
      );
      card.append(head, facts);

      if (item.evidence.length) {
        const evidence = document.createElement("div");
        evidence.className = "mail-insight-evidence";
        const title = recordText("strong", "", t("private.mail.evidence", "证据邮件"));
        evidence.append(title);
        for (const message of item.evidence) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "mail-insight-evidence-button";
          const subject = recordText("span", "", message.subject || t("private.mail.noSubject", "无主题"));
          const date = recordText("small", "", message.date ? formatTime(message.date) || message.date : t("private.mail.unknownDate", "时间未知"));
          button.append(subject, date);
          button.addEventListener("click", () => openMailMessage({
            uid: message.uid,
            subject: message.subject,
            date: message.date,
            from: item.name
          }, button));
          evidence.append(button);
        }
        card.append(evidence);
      }
      return card;
    }));
    section.append(heading, list);
    return section;
  }).filter(Boolean);
  mailInsightsResults.replaceChildren(...groups);
}

function clearMailInsights({ keepStatus = false } = {}) {
  mailInsightAbortController?.abort();
  mailInsightAbortController = null;
  activeMailInsights = [];
  activeMailInsightScope = null;
  activeMailInsightDisclaimer = "";
  if (!keepStatus) {
    mailInsightsStatus.textContent = "";
    mailInsightsStatus.dataset.tone = "";
  }
  renderMailInsights();
  renderMailClient();
}

async function scanCurrentMailInsights() {
  const account = currentMailAccount();
  setMailView("insights");
  if (!account) {
    mailInsightsStatus.textContent = t("private.mail.noAccount", "未选择邮箱");
    mailInsightsStatus.dataset.tone = "error";
    return;
  }
  mailInsightAbortController?.abort();
  const controller = new AbortController();
  mailInsightAbortController = controller;
  activeMailInsights = [];
  activeMailInsightScope = null;
  activeMailInsightDisclaimer = "";
  mailInsightsStatus.textContent = t("private.mail.scanningInsights", "正在扫描此邮箱的邮件头…");
  mailInsightsStatus.dataset.tone = "pending";
  const loading = document.createElement("div");
  loading.className = "mail-insights-empty loading";
  loading.append(
    recordText("strong", "", t("private.mail.scanningInsightsTitle", "正在寻找账号与订阅线索")),
    recordText("span", "", t("private.mail.scanningInsightsCopy", "只读取发件人、主题、日期和邮件列表标记，不读取正文。"))
  );
  mailInsightsResults.replaceChildren(loading);
  mailInsightsSummary.hidden = true;
  mailInsightsClearButton.hidden = true;
  renderMailClient();
  try {
    const data = await api("/api/private/mail/insights", {
      method: "POST",
      body: JSON.stringify({ account, sinceDays: 365, maxMessages: 500 }),
      signal: controller.signal
    });
    if (controller !== mailInsightAbortController) return;
    activeMailInsights = normalizeMailInsightItems(data.items);
    activeMailInsightScope = data.scope && typeof data.scope === "object" ? data.scope : {
      sinceDays: 365,
      maxMessages: 500,
      scannedMessages: 0,
      headerOnly: true
    };
    activeMailInsightDisclaimer = "";
    const scanned = Number(activeMailInsightScope.scannedMessages) || 0;
    mailInsightsStatus.textContent = `${t("private.mail.insightsScanned", "扫描完成")}：${scanned} ${t("private.mail.messageHeaders", "封邮件头")}，${activeMailInsights.length} ${t("private.mail.clues", "项线索")}`;
    mailInsightsStatus.dataset.tone = "ok";
    renderMailInsights();
  } catch (insightError) {
    if (insightError.name === "AbortError" || controller !== mailInsightAbortController) return;
    activeMailInsights = [];
    activeMailInsightScope = null;
    mailInsightsStatus.textContent = `${t("private.mail.insightsFailed", "扫描失败")}：${insightError.message}`;
    mailInsightsStatus.dataset.tone = "error";
    renderMailInsights();
  } finally {
    if (controller === mailInsightAbortController) mailInsightAbortController = null;
    renderMailClient();
  }
}

async function syncCurrentMail() {
  const account = currentMailAccount();
  setMailView("inbox");
  if (!account) {
    setMailStatus(t("private.mail.noAccount", "未选择邮箱"), "error");
    return;
  }
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
}

function closeMailMessage() {
  if (mailMessageDialog.hidden) return;
  mailMessageAbortController?.abort();
  mailMessageAbortController = null;
  mailMessageDialog.hidden = true;
  mailMessageCard.setAttribute("aria-busy", "false");
  if (mailMessageReturnFocus instanceof HTMLElement && mailMessageReturnFocus.isConnected) {
    mailMessageReturnFocus.focus();
  }
  mailMessageReturnFocus = null;
}

async function openMailMessage(summary = {}, trigger = null) {
  const account = currentMailAccount();
  const uid = String(summary.uid ?? summary.id ?? "").trim();
  if (!account || !uid) {
    setMailStatus(t("private.mail.messageUnavailable", "无法确定要读取的邮件，请重新收取。"), "error");
    return;
  }

  mailMessageAbortController?.abort();
  const controller = new AbortController();
  mailMessageAbortController = controller;
  mailMessageReturnFocus = trigger instanceof HTMLElement ? trigger : document.activeElement;
  mailMessageSubject.textContent = summary.subject || t("private.mail.noSubject", "无主题");
  mailMessageFrom.textContent = "";
  mailMessageDate.textContent = "";
  mailMessageBody.textContent = "";
  mailMessageContent.hidden = true;
  mailMessageStatus.textContent = t("private.mail.loadingMessage", "正在读取邮件…");
  mailMessageStatus.dataset.tone = "pending";
  mailMessageCard.setAttribute("aria-busy", "true");
  mailMessageDialog.hidden = false;
  mailMessageCloseButton.focus();

  try {
    const data = await api("/api/private/mail/message", {
      method: "POST",
      body: JSON.stringify({ account, uid }),
      signal: controller.signal
    });
    if (controller !== mailMessageAbortController || mailMessageDialog.hidden) return;
    const message = data.message && typeof data.message === "object" ? data.message : data;
    const subject = String(message.subject || summary.subject || t("private.mail.noSubject", "无主题"));
    const from = String(message.from || summary.from || t("private.mail.unknownSender", "未知发件人"));
    const rawDate = String(message.date || summary.date || "");
    const body = String(message.body ?? message.text ?? "");
    mailMessageSubject.textContent = subject;
    mailMessageFrom.textContent = from;
    mailMessageDate.textContent = rawDate ? formatTime(rawDate) || rawDate : t("private.mail.unknownDate", "时间未知");
    mailMessageBody.textContent = body || t("private.mail.emptyMessageBody", "这封邮件没有可显示的纯文本正文。");
    mailMessageContent.hidden = false;
    mailMessageStatus.textContent = message.truncated
      ? t("private.mail.messageTruncated", "邮件过长，仅显示前一部分。附件不会在这里下载。")
      : "";
    mailMessageStatus.dataset.tone = message.truncated ? "pending" : "";
    mailMessageCard.setAttribute("aria-busy", "false");
  } catch (messageError) {
    if (messageError.name === "AbortError" || controller !== mailMessageAbortController) return;
    mailMessageStatus.textContent = `${t("private.mail.messageLoadFailed", "邮件读取失败")}：${messageError.message}`;
    mailMessageStatus.dataset.tone = "error";
    mailMessageCard.setAttribute("aria-busy", "false");
  }
}

function renderMailAccounts() {
  if (!mailUnlocked) {
    const empty = document.createElement("div");
    empty.className = "mail-rail-empty";
    const title = document.createElement("strong");
    title.textContent = t("private.mail.locked", "邮箱库未解锁");
    const copy = document.createElement("span");
    copy.textContent = mailSyncKey
      ? t("private.mail.unlockCopy", "这份旧资料尚未自动迁移；可使用高级恢复或回到原设备打开一次。")
      : t("private.mail.reloginSyncCopy", "重新登录一次私人空间，即可启用自动设备同步。");
    const unlock = document.createElement("button");
    unlock.type = "button";
    unlock.className = "button";
    unlock.textContent = mailSyncKey
      ? t("private.mail.recoveryOptions", "高级恢复")
      : t("private.mail.reloginSync", "重新登录并同步");
    unlock.addEventListener("click", async () => {
      if (mailSyncKey) {
        openMailKeyDialog();
        return;
      }
      await api("/api/private/logout", { method: "POST", body: "{}" }).catch(() => {});
      showGate();
      showError("private.mail.reloginPrompt", "请重新登录一次，以自动解锁邮箱、手机号和账目资料。");
    });
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
    row.dataset.contextKind = "mail-account";
    row.dataset.contextId = account.id;
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
    button.addEventListener("click", () => selectMailAccount(account.id));
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

function selectMailAccount(id) {
  const account = activeMailAccounts.find((item) => item.id === id);
  if (!account) return null;
  if (selectedMailAccountId !== account.id) {
    clearMailInsights();
    renderMailMessages([]);
  }
  selectedMailAccountId = account.id;
  renderMailAccounts();
  return account;
}

function setRecordStatus(element, text = "", tone = "") {
  element.textContent = text;
  element.dataset.tone = tone;
}

function recordText(tagName, className, value) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = value;
  return element;
}

function phoneStatusLabel(value) {
  const labels = {
    active: t("private.phones.statusActive", "使用中"),
    spare: t("private.phones.statusSpare", "备用"),
    inactive: t("private.phones.statusInactive", "已停用")
  };
  return labels[value] || labels.active;
}

function renderPhones() {
  phoneAddButton.disabled = !mailUnlocked || activePhones.length >= phoneLimit;
  if (!mailUnlocked) {
    const empty = recordText("div", "record-empty", t("private.common.vaultLocked", "加密资料库尚未解锁。请先在邮箱管理中完成解锁。"));
    phoneList.replaceChildren(empty);
    return;
  }
  if (!activePhones.length) {
    const empty = recordText("div", "record-empty", t("private.phones.empty", "暂无手机号。添加后可按用途和状态集中管理。"));
    phoneList.replaceChildren(empty);
    return;
  }
  phoneList.replaceChildren(...activePhones.map((phone) => {
    const card = document.createElement("article");
    card.className = "record-card phone-card";
    card.dataset.contextKind = "phone";
    card.dataset.contextId = phone.id;
    card.tabIndex = 0;
    card.setAttribute("aria-label", `${phone.label || t("private.phones.unnamed", "未命名号码")}，${phone.number || t("private.phones.noNumber", "未填写号码")}`);
    const head = document.createElement("div");
    head.className = "record-card-head";
    const identity = document.createElement("div");
    identity.className = "record-card-identity";
    identity.append(
      recordText("strong", "", phone.label || t("private.phones.unnamed", "未命名号码")),
      recordText("span", "record-primary-value", phone.number || t("private.phones.noNumber", "未填写号码"))
    );
    const badge = recordText("span", "record-badge", phoneStatusLabel(phone.status));
    badge.dataset.status = phone.status;
    head.append(identity, badge);
    const meta = document.createElement("div");
    meta.className = "record-meta";
    if (phone.carrier) meta.append(recordText("span", "", phone.carrier));
    if (phone.purpose) meta.append(recordText("span", "", phone.purpose));
    if (!meta.childElementCount) meta.append(recordText("span", "", t("private.phones.noDetails", "尚未填写运营商或用途")));
    if (phone.note) card.append(head, meta, recordText("p", "record-note", phone.note));
    else card.append(head, meta);
    const edit = recordText("button", "record-edit-button", t("private.common.edit", "编辑"));
    edit.type = "button";
    edit.setAttribute("aria-label", `${t("private.phones.edit", "编辑手机号")} ${phone.label || phone.number}`.trim());
    edit.addEventListener("click", () => openPhoneDialog(phone));
    card.append(edit);
    return card;
  }));
}

function openPhoneDialog(phone = null) {
  if (!mailUnlocked) {
    setRecordStatus(phoneStatus, t("private.common.vaultLocked", "加密资料库尚未解锁。请先在邮箱管理中完成解锁。"), "error");
    return;
  }
  if (!phone && activePhones.length >= phoneLimit) {
    setRecordStatus(phoneStatus, t("private.phones.limit", "最多可保存 20 个手机号。"), "error");
    return;
  }
  phoneForm.reset();
  phoneIdInput.value = phone?.id || "";
  phoneLabelInput.value = phone?.label || "";
  phoneNumberInput.value = phone?.number || "";
  phoneCarrierInput.value = phone?.carrier || "";
  phonePurposeInput.value = phone?.purpose || "";
  phoneStatusInput.value = phoneStatuses.has(phone?.status) ? phone.status : "active";
  phoneNoteInput.value = phone?.note || "";
  phoneDeleteButton.hidden = !phone;
  phoneDialogTitle.textContent = phone
    ? t("private.phones.editTitle", "编辑手机号")
    : t("private.phones.addTitle", "添加手机号");
  setRecordStatus(phoneDialogStatus);
  recordDialogReturnFocus = document.activeElement;
  phoneDialog.hidden = false;
  phoneLabelInput.focus();
}

function closePhoneDialog() {
  if (phoneDialog.hidden) return;
  phoneDialog.hidden = true;
  setRecordStatus(phoneDialogStatus);
  if (recordDialogReturnFocus instanceof HTMLElement && recordDialogReturnFocus.isConnected) recordDialogReturnFocus.focus();
  recordDialogReturnFocus = null;
}

function ledgerTypeLabel(value) {
  return value === "income"
    ? t("private.ledger.typeIncome", "收入")
    : t("private.ledger.typeExpense", "支出");
}

function ledgerCategoryLabel(value) {
  const labels = {
    subscription: t("private.ledger.categorySubscription", "订阅服务"),
    food: t("private.ledger.categoryFood", "餐饮"),
    transport: t("private.ledger.categoryTransport", "交通"),
    housing: t("private.ledger.categoryHousing", "居住"),
    shopping: t("private.ledger.categoryShopping", "购物"),
    health: t("private.ledger.categoryHealth", "健康"),
    education: t("private.ledger.categoryEducation", "教育"),
    entertainment: t("private.ledger.categoryEntertainment", "娱乐"),
    salary: t("private.ledger.categorySalary", "工资"),
    transfer: t("private.ledger.categoryTransfer", "转账"),
    other: t("private.ledger.categoryOther", "其他")
  };
  return labels[value] || labels.other;
}

function parseLedgerAmount(value, currency) {
  const text = String(value || "").trim();
  const decimals = currency === "JPY" ? 0 : 2;
  const pattern = decimals ? /^\d{1,8}(?:\.\d{1,2})?$/ : /^\d{1,8}$/;
  if (!pattern.test(text)) return null;
  const [wholeRaw, decimalRaw = ""] = text.split(".");
  const whole = String(Number(wholeRaw));
  const normalized = decimals ? `${whole}.${decimalRaw.padEnd(2, "0")}` : whole;
  if (!Number.isFinite(Number(normalized)) || Number(normalized) <= 0) return null;
  return normalized;
}

function ledgerMinorAmount(entry) {
  const normalized = parseLedgerAmount(entry.amount, entry.currency);
  if (!normalized) return 0;
  if (entry.currency === "JPY") return Number(normalized);
  const [whole, decimal = "00"] = normalized.split(".");
  return (Number(whole) * 100) + Number(decimal.padEnd(2, "0"));
}

function formatLedgerMinor(amount, currency) {
  const number = currency === "JPY" ? amount : amount / 100;
  try {
    return new Intl.NumberFormat(document.documentElement.lang || "zh-CN", {
      style: "currency",
      currency,
      currencyDisplay: "symbol"
    }).format(number);
  } catch {
    return `${currency} ${number}`;
  }
}

function filteredLedgerEntries() {
  const month = ledgerMonthFilter.value;
  return activeLedger
    .filter((entry) => !month || entry.date.startsWith(month))
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

function renderLedgerSummary(entries) {
  const totals = new Map();
  for (const entry of entries) {
    const total = totals.get(entry.currency) || { income: 0, expense: 0 };
    total[entry.type] += ledgerMinorAmount(entry);
    totals.set(entry.currency, total);
  }
  if (!totals.size) {
    ledgerSummary.replaceChildren(recordText("div", "record-empty compact", t("private.ledger.noSummary", "当前月份暂无可统计账目。")));
    return;
  }
  ledgerSummary.replaceChildren(...[...totals.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([currency, total]) => {
    const card = document.createElement("section");
    card.className = "ledger-summary-card";
    card.append(recordText("h3", "", currency));
    const list = document.createElement("dl");
    const rows = [
      [t("private.ledger.income", "收入"), formatLedgerMinor(total.income, currency), "income"],
      [t("private.ledger.expense", "支出"), formatLedgerMinor(total.expense, currency), "expense"],
      [t("private.ledger.balance", "结余"), formatLedgerMinor(total.income - total.expense, currency), "balance"]
    ];
    for (const [label, value, tone] of rows) {
      const row = document.createElement("div");
      row.dataset.tone = tone;
      row.append(recordText("dt", "", label), recordText("dd", "", value));
      list.append(row);
    }
    card.append(list);
    return card;
  }));
}

function renderLedger() {
  ledgerAddButton.disabled = !mailUnlocked || activeLedger.length >= ledgerLimit;
  if (!ledgerMonthFilter.dataset.initialized) {
    ledgerMonthFilter.value = new Date().toISOString().slice(0, 7);
    ledgerMonthFilter.dataset.initialized = "true";
  }
  if (!mailUnlocked) {
    ledgerFilterCount.textContent = "";
    ledgerSummary.replaceChildren();
    ledgerList.replaceChildren(recordText("div", "record-empty", t("private.common.vaultLocked", "加密资料库尚未解锁。请先在邮箱管理中完成解锁。")));
    return;
  }
  const entries = filteredLedgerEntries();
  ledgerFilterCount.textContent = `${entries.length} ${t("private.ledger.entries", "笔")}`;
  renderLedgerSummary(entries);
  if (!entries.length) {
    ledgerList.replaceChildren(recordText("div", "record-empty", t("private.ledger.empty", "当前筛选范围暂无账目。")));
    return;
  }
  ledgerList.replaceChildren(...entries.map((entry) => {
    const card = document.createElement("article");
    card.className = "record-card ledger-entry-card";
    card.dataset.type = entry.type;
    card.dataset.contextKind = "ledger";
    card.dataset.contextId = entry.id;
    card.tabIndex = 0;
    card.setAttribute("aria-label", `${entry.merchant || ledgerCategoryLabel(entry.category)}，${formatLedgerMinor(ledgerMinorAmount(entry), entry.currency)}`);
    const head = document.createElement("div");
    head.className = "record-card-head";
    const identity = document.createElement("div");
    identity.className = "record-card-identity";
    identity.append(
      recordText("strong", "", entry.merchant || ledgerCategoryLabel(entry.category)),
      recordText("span", "", `${entry.date} · ${ledgerCategoryLabel(entry.category)}`)
    );
    const amount = recordText("strong", "ledger-entry-amount", `${entry.type === "expense" ? "−" : "+"}${formatLedgerMinor(ledgerMinorAmount(entry), entry.currency)}`);
    head.append(identity, amount);
    const meta = document.createElement("div");
    meta.className = "record-meta";
    meta.append(recordText("span", "record-badge", ledgerTypeLabel(entry.type)));
    if (entry.recurring) meta.append(recordText("span", "record-badge recurring", t("private.ledger.recurringShort", "周期性")));
    card.append(head, meta);
    if (entry.note) card.append(recordText("p", "record-note", entry.note));
    const edit = recordText("button", "record-edit-button", t("private.common.edit", "编辑"));
    edit.type = "button";
    edit.setAttribute("aria-label", `${t("private.ledger.edit", "编辑账目")} ${entry.merchant || entry.date}`.trim());
    edit.addEventListener("click", () => openLedgerDialog(entry));
    card.append(edit);
    return card;
  }));
}

function openLedgerDialog(entry = null, options = {}) {
  const duplicate = Boolean(options.duplicate);
  if (!mailUnlocked) {
    setRecordStatus(ledgerStatus, t("private.common.vaultLocked", "加密资料库尚未解锁。请先在邮箱管理中完成解锁。"), "error");
    return;
  }
  if ((!entry || duplicate) && activeLedger.length >= ledgerLimit) {
    setRecordStatus(ledgerStatus, t("private.ledger.limit", "最多可保存 1000 笔账目。"), "error");
    return;
  }
  ledgerForm.reset();
  ledgerIdInput.value = duplicate ? "" : entry?.id || "";
  ledgerDateInput.value = entry?.date || new Date().toISOString().slice(0, 10);
  ledgerTypeInput.value = ledgerTypes.has(entry?.type) ? entry.type : "expense";
  ledgerCategoryInput.value = ledgerCategories.has(entry?.category) ? entry.category : "subscription";
  ledgerAmountInput.value = entry?.amount || "";
  ledgerCurrencyInput.value = ledgerCurrencies.has(entry?.currency) ? entry.currency : "CNY";
  ledgerMerchantInput.value = entry?.merchant || "";
  ledgerNoteInput.value = entry?.note || "";
  ledgerRecurringInput.checked = Boolean(entry?.recurring);
  ledgerDeleteButton.hidden = !entry || duplicate;
  ledgerDialogTitle.textContent = duplicate
    ? t(options.fromInsight ? "private.ledger.addFromInsightTitle" : "private.ledger.copyTitle", options.fromInsight ? "从邮件线索添加订阅" : "复制账目")
    : entry
      ? t("private.ledger.editTitle", "编辑账目")
      : t("private.ledger.addTitle", "记录账目");
  setRecordStatus(ledgerDialogStatus);
  recordDialogReturnFocus = options.returnFocus instanceof HTMLElement ? options.returnFocus : document.activeElement;
  ledgerDialog.hidden = false;
  ledgerDateInput.focus();
}

function closeLedgerDialog() {
  if (ledgerDialog.hidden) return;
  ledgerDialog.hidden = true;
  setRecordStatus(ledgerDialogStatus);
  if (recordDialogReturnFocus instanceof HTMLElement && recordDialogReturnFocus.isConnected) recordDialogReturnFocus.focus();
  recordDialogReturnFocus = null;
}

function copyLedgerEntry(entry) {
  if (!entry) return;
  openLedgerDialog({ ...entry, id: "" }, { duplicate: true });
}

function openLedgerFromInsight(item) {
  if (!item) return;
  setActivePanel("ledger");
  const source = item.domain || item.service || item.name;
  const note = [
    t("private.mail.inferredFromMail", "邮件推断"),
    source,
    mailInsightCategoryLabel(item.category),
    mailInsightConfidenceLabel(item.confidence)
  ].filter(Boolean).join(" · ").slice(0, 600);
  openLedgerDialog({
    id: "",
    date: new Date().toISOString().slice(0, 10),
    type: "expense",
    category: "subscription",
    amount: "",
    currency: "CNY",
    merchant: item.name || source,
    note,
    recurring: true
  }, { duplicate: true, fromInsight: true, returnFocus: ledgerAddButton });
}

async function deletePhoneById(id) {
  const phone = activePhones.find((item) => item.id === id);
  if (!phone || !window.confirm(t("private.phones.deleteConfirm", "确定删除这个手机号吗？此操作会立即保存。"))) return false;
  const previous = activePhones;
  activePhones = previous.filter((item) => item.id !== id);
  try {
    phoneDeleteButton.disabled = true;
    await saveMailVault();
    renderPhones();
    if (!phoneDialog.hidden && phoneIdInput.value === id) closePhoneDialog();
    setRecordStatus(phoneStatus, t("private.phones.deleted", "手机号已删除。"), "ok");
    return true;
  } catch {
    activePhones = previous;
    renderPhones();
    const target = !phoneDialog.hidden && phoneIdInput.value === id ? phoneDialogStatus : phoneStatus;
    setRecordStatus(target, t("private.phones.saveFailed", "手机号保存失败，请稍后再试。"), "error");
    return false;
  } finally {
    phoneDeleteButton.disabled = false;
  }
}

async function deleteLedgerById(id) {
  const entry = activeLedger.find((item) => item.id === id);
  if (!entry || !window.confirm(t("private.ledger.deleteConfirm", "确定删除这笔账目吗？此操作会立即保存。"))) return false;
  const previous = activeLedger;
  activeLedger = previous.filter((item) => item.id !== id);
  try {
    ledgerDeleteButton.disabled = true;
    await saveMailVault();
    renderLedger();
    if (!ledgerDialog.hidden && ledgerIdInput.value === id) closeLedgerDialog();
    setRecordStatus(ledgerStatus, t("private.ledger.deleted", "账目已删除。"), "ok");
    return true;
  } catch {
    activeLedger = previous;
    renderLedger();
    const target = !ledgerDialog.hidden && ledgerIdInput.value === id ? ledgerDialogStatus : ledgerStatus;
    setRecordStatus(target, t("private.ledger.saveFailed", "账目保存失败，请稍后再试。"), "error");
    return false;
  } finally {
    ledgerDeleteButton.disabled = false;
  }
}

function setContextStatus(kind, text, tone = "ok") {
  if (kind === "phone") setRecordStatus(phoneStatus, text, tone);
  else if (kind === "ledger") setRecordStatus(ledgerStatus, text, tone);
  else setMailStatus(text, tone);
}

async function copyContextText(value, kind) {
  try {
    await navigator.clipboard.writeText(String(value || ""));
    setContextStatus(kind, t("private.context.copied", "已复制"), "ok");
  } catch {
    setContextStatus(kind, t("private.context.copyFailed", "复制失败，请使用系统复制功能。"), "error");
  }
}

function closePrivateContextMenu(restoreFocus = true) {
  if (privateContextMenu.hidden) return;
  privateContextMenu.hidden = true;
  privateContextMenu.replaceChildren();
  if (restoreFocus && contextMenuReturnFocus instanceof HTMLElement && contextMenuReturnFocus.isConnected) {
    contextMenuReturnFocus.focus();
  }
  contextMenuReturnFocus = null;
}

function contextMenuItems(target) {
  const kind = target.dataset.contextKind;
  const id = target.dataset.contextId || "";
  if (kind === "mail-message") {
    const message = activeMailMessages.find((item) => item.uid === id);
    if (!message) return [];
    return [
      { label: t("private.context.openMessage", "打开邮件"), action: () => openMailMessage(message, target) },
      { label: t("private.context.copySender", "复制发件人"), action: () => copyContextText(message.from, kind) },
      { label: t("private.context.copySubject", "复制主题"), action: () => copyContextText(message.subject || t("private.mail.noSubject", "无主题"), kind) }
    ];
  }
  if (kind === "mail-account") {
    const account = activeMailAccounts.find((item) => item.id === id);
    if (!account) return [];
    return [
      { label: t("private.context.fetchMail", "收取邮件"), action: () => { selectMailAccount(id); return syncCurrentMail(); } },
      { label: t("private.context.scanMailbox", "扫描账号与订阅"), action: () => { selectMailAccount(id); return scanCurrentMailInsights(); } },
      { label: t("private.context.editMailbox", "编辑邮箱"), action: () => openMailDialog(account) },
      { label: t("private.context.copyAddress", "复制邮箱地址"), action: () => copyContextText(account.address, kind) }
    ];
  }
  if (kind === "phone") {
    const phone = activePhones.find((item) => item.id === id);
    if (!phone) return [];
    return [
      { label: t("private.context.copyPhone", "复制号码"), action: () => copyContextText(phone.number, kind) },
      { label: t("private.context.editPhone", "编辑手机号"), action: () => openPhoneDialog(phone) },
      { label: t("private.context.deletePhone", "删除手机号"), danger: true, action: () => deletePhoneById(id) }
    ];
  }
  if (kind === "ledger") {
    const entry = activeLedger.find((item) => item.id === id);
    if (!entry) return [];
    return [
      { label: t("private.context.editLedger", "编辑账目"), action: () => openLedgerDialog(entry) },
      { label: t("private.context.copyLedger", "复制一笔"), action: () => copyLedgerEntry(entry) },
      { label: t("private.context.deleteLedger", "删除账目"), danger: true, action: () => deleteLedgerById(id) }
    ];
  }
  if (kind === "mail-insight") {
    const item = activeMailInsights[Number(id)];
    if (!item) return [];
    const details = [
      item.name,
      item.domain || item.service,
      mailInsightCategoryLabel(item.category),
      mailInsightStatusLabel(item.status),
      mailInsightConfidenceLabel(item.confidence)
    ].filter(Boolean).join("\n");
    const actions = [
      { label: t("private.context.copyService", "复制服务信息"), action: () => copyContextText(details, kind) }
    ];
    const evidence = item.evidence[0];
    if (evidence) {
      actions.push({
        label: t("private.context.openEvidence", "打开证据邮件"),
        action: () => openMailMessage({ uid: evidence.uid, subject: evidence.subject, date: evidence.date, from: item.name }, target)
      });
    }
    actions.push({ label: t("private.context.toSubscriptionLedger", "转为订阅账目"), action: () => openLedgerFromInsight(item) });
    return actions;
  }
  return [];
}

function openPrivateContextMenu(target, point = null) {
  const items = contextMenuItems(target);
  if (!items.length) return;
  closePrivateContextMenu(false);
  contextMenuReturnFocus = target;
  privateContextMenu.replaceChildren(...items.map((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.role = "menuitem";
    button.textContent = item.label;
    if (item.danger) button.classList.add("danger");
    button.addEventListener("click", () => {
      closePrivateContextMenu(true);
      Promise.resolve(item.action()).catch(() => {});
    });
    return button;
  }));
  privateContextMenu.hidden = false;
  const anchor = target.getBoundingClientRect();
  const preferredX = point?.x ?? anchor.left;
  const preferredY = point?.y ?? anchor.bottom + 4;
  const bounds = privateContextMenu.getBoundingClientRect();
  privateContextMenu.style.left = `${Math.max(8, Math.min(preferredX, window.innerWidth - bounds.width - 8))}px`;
  privateContextMenu.style.top = `${Math.max(8, Math.min(preferredY, window.innerHeight - bounds.height - 8))}px`;
  privateContextMenu.querySelector("button")?.focus();
}

async function ensureMailVaultLoaded() {
  if (mailVaultLoaded) return;
  if (!mailVaultLoadPromise) {
    mailVaultLoadPromise = loadMailVault().finally(() => {
      mailVaultLoadPromise = null;
    });
  }
  return mailVaultLoadPromise;
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
  if (["mail", "phones", "ledger"].includes(name) && !mailVaultLoaded) {
    ensureMailVaultLoaded().catch(() => {
      if (name === "mail") setMailStatus(t("private.mail.loadFailed", "邮箱库读取失败"), "error");
      if (name === "phones") setRecordStatus(phoneStatus, t("private.common.vaultLoadFailed", "加密资料库读取失败。"), "error");
      if (name === "ledger") setRecordStatus(ledgerStatus, t("private.common.vaultLoadFailed", "加密资料库读取失败。"), "error");
    });
  }
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
  mailVaultLoaded = true;
  mailSyncKey = mailSyncKey || localStorage.getItem(mailSyncKeyStorage) || "";
  const storedKey = localStorage.getItem(mailKeyStorage);
  if (!activeMailVault?.ciphertext) {
    const key = ensureMailVaultKey();
    mailUnlocked = true;
    mailKeyMismatch = false;
    activeMailAccounts = [];
    activePhones = [];
    activeLedger = [];
    renderMailAccounts();
    renderPhones();
    renderLedger();
    setMailStatus(t("private.mail.noVault", "还没有邮箱，请添加第一个邮箱"), "pending");
    return;
  }
  const candidates = [...new Set([mailSyncKey, storedKey].filter(Boolean))];
  let unlockedWith = "";
  for (const candidate of candidates) {
    try {
      const payload = await decryptMailVault(activeMailVault, candidate);
      activeMailAccounts = payload.accounts;
      activePhones = payload.phones;
      activeLedger = payload.ledger;
      unlockedWith = candidate;
      break;
    } catch {
      // Try the next compatible key. Older vaults used a per-browser key.
    }
  }
  if (!unlockedWith) {
    mailUnlocked = false;
    mailKeyMismatch = Boolean(storedKey);
    activeMailAccounts = [];
    activePhones = [];
    activeLedger = [];
    renderMailAccounts();
    renderPhones();
    renderLedger();
    setMailStatus(t("private.mail.needsUnlock", "这份旧邮箱库尚未完成自动同步，请在原设备打开一次，或使用高级恢复。"), "pending");
    return;
  }

  mailUnlocked = true;
  mailKeyMismatch = false;
  mailActiveKey = unlockedWith;
  if (unlockedWith.startsWith("SMC-MAIL-SYNC-")) {
    localStorage.setItem(mailSyncKeyStorage, unlockedWith);
    localStorage.removeItem(mailKeyStorage);
  } else {
    localStorage.setItem(mailKeyStorage, unlockedWith);
  }
  if (!selectedMailAccountId && activeMailAccounts[0]) selectedMailAccountId = activeMailAccounts[0].id;
  let migrated = false;
  if (mailSyncKey && unlockedWith !== mailSyncKey) {
    try {
      await saveMailVaultWithKey(mailSyncKey);
      migrated = true;
    } catch {
      mailActiveKey = unlockedWith;
      localStorage.setItem(mailKeyStorage, unlockedWith);
    }
  }
  renderMailAccounts();
  renderPhones();
  renderLedger();
  setMailStatus(t(migrated ? "private.mail.autoSyncEnabled" : "private.mail.unlocked",
    migrated ? "邮箱库已解锁，并已启用自动设备同步" : "邮箱库已解锁"), "ok");
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
    const payload = await decryptMailVault(activeMailVault, key);
    activeMailAccounts = payload.accounts;
    activePhones = payload.phones;
    activeLedger = payload.ledger;
  } else {
    activeMailAccounts = [];
    activePhones = [];
    activeLedger = [];
  }
  mailUnlocked = true;
  mailKeyMismatch = false;
  selectedMailAccountId = activeMailAccounts[0]?.id || "";
  if (mailSyncKey && key !== mailSyncKey) {
    try {
      await saveMailVaultWithKey(mailSyncKey);
    } catch {
      mailActiveKey = key;
      localStorage.setItem(mailKeyStorage, key);
    }
  } else {
    mailActiveKey = key;
    localStorage.setItem(mailKeyStorage, key);
  }
  renderMailAccounts();
  renderPhones();
  renderLedger();
}

async function saveMailVaultWithKey(passphrase) {
  const vault = await encryptMailAccounts(activeMailAccounts, activePhones, activeLedger, passphrase);
  const data = await api("/api/private/mail-vault", {
    method: "PUT",
    body: JSON.stringify({ vault })
  });
  activeMailVault = data.vault;
  mailActiveKey = passphrase;
  if (passphrase.startsWith("SMC-MAIL-SYNC-")) {
    mailSyncKey = passphrase;
    localStorage.setItem(mailSyncKeyStorage, passphrase);
    localStorage.removeItem(mailKeyStorage);
  } else {
    localStorage.setItem(mailKeyStorage, passphrase);
  }
  mailUnlocked = true;
  mailVaultLoaded = true;
  mailKeyMismatch = false;
  return activeMailVault;
}

async function saveMailVault() {
  return saveMailVaultWithKey(ensureMailVaultKey());
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
  activePhones = [];
  activeLedger = [];
  mailVaultLoaded = false;
  mailVaultLoadPromise = null;
  mailUnlocked = false;
  mailSyncKey = "";
  mailActiveKey = "";
  mailKeyMismatch = false;
  selectedMailAccountId = "";
  activeMailMessages = [];
  activeMailInsights = [];
  activeMailInsightScope = null;
  activeMailInsightDisclaimer = "";
  activeMailView = "inbox";
  mailInsightAbortController?.abort();
  mailInsightAbortController = null;
  closePrivateContextMenu(false);
  if (mailAccountList) mailAccountList.replaceChildren();
  if (mailStatus) setMailStatus();
  if (mailMessageDialog) closeMailMessage();
  if (mailAddDialog) closeMailDialog();
  if (mailKeyDialog) closeMailKeyDialog();
  if (phoneDialog) closePhoneDialog();
  if (ledgerDialog) closeLedgerDialog();
  setComposeOpen(false);
  renderMailInsights();
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
  const password = passwordInput.value;
  try {
    await api("/api/private/login", {
      method: "POST",
      body: JSON.stringify({
        password,
        remember: rememberInput.checked
      })
    });
    try {
      mailSyncKey = await deriveMailSyncPassphrase(password);
      localStorage.setItem(mailSyncKeyStorage, mailSyncKey);
    } catch {
      mailSyncKey = "";
    }
    passwordInput.value = "";
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

phoneAddButton.addEventListener("click", () => openPhoneDialog());
phoneCloseButton.addEventListener("click", closePhoneDialog);
phoneCancelButton.addEventListener("click", closePhoneDialog);
phoneDialog.addEventListener("click", (event) => {
  if (event.target === phoneDialog) closePhoneDialog();
});

phoneForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = phoneIdInput.value || `phone-${Date.now()}-${randomBase64Url(8)}`;
  const label = phoneLabelInput.value.trim();
  const number = phoneNumberInput.value.trim();
  if (!label || !number) {
    setRecordStatus(phoneDialogStatus, t("private.phones.required", "请填写名称和手机号。"), "error");
    return;
  }
  if (!/^[0-9+()\-\s.]{3,40}$/.test(number)) {
    setRecordStatus(phoneDialogStatus, t("private.phones.invalidNumber", "手机号只能包含数字、空格及 + ( ) - .。"), "error");
    phoneNumberInput.focus();
    return;
  }
  const comparable = number.replace(/[^0-9+]/g, "");
  if (activePhones.some((phone) => phone.id !== id && phone.number.replace(/[^0-9+]/g, "") === comparable)) {
    setRecordStatus(phoneDialogStatus, t("private.phones.duplicate", "这个手机号已经存在。"), "error");
    return;
  }
  const previous = activePhones;
  const phone = {
    id,
    label: label.slice(0, 80),
    number,
    carrier: phoneCarrierInput.value.trim().slice(0, 80),
    purpose: phonePurposeInput.value.trim().slice(0, 120),
    status: phoneStatuses.has(phoneStatusInput.value) ? phoneStatusInput.value : "active",
    note: phoneNoteInput.value.trim().slice(0, 600),
    updatedAt: new Date().toISOString()
  };
  activePhones = previous.some((item) => item.id === id)
    ? previous.map((item) => item.id === id ? phone : item)
    : [...previous, phone];
  try {
    phoneForm.querySelector("button[type='submit']").disabled = true;
    await saveMailVault();
    renderPhones();
    closePhoneDialog();
    setRecordStatus(phoneStatus, t("private.phones.saved", "手机号已加密保存。"), "ok");
  } catch {
    activePhones = previous;
    setRecordStatus(phoneDialogStatus, t("private.phones.saveFailed", "手机号保存失败，请稍后再试。"), "error");
  } finally {
    phoneForm.querySelector("button[type='submit']").disabled = false;
  }
});

phoneDeleteButton.addEventListener("click", async () => {
  await deletePhoneById(phoneIdInput.value);
});

ledgerAddButton.addEventListener("click", () => openLedgerDialog());
ledgerCloseButton.addEventListener("click", closeLedgerDialog);
ledgerCancelButton.addEventListener("click", closeLedgerDialog);
ledgerDialog.addEventListener("click", (event) => {
  if (event.target === ledgerDialog) closeLedgerDialog();
});
ledgerMonthFilter.addEventListener("change", renderLedger);
ledgerAllMonthsButton.addEventListener("click", () => {
  ledgerMonthFilter.value = "";
  renderLedger();
});
ledgerCurrencyInput.addEventListener("change", () => {
  ledgerAmountInput.placeholder = ledgerCurrencyInput.value === "JPY" ? "0" : "0.00";
});

ledgerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = ledgerIdInput.value || `ledger-${Date.now()}-${randomBase64Url(8)}`;
  const currency = ledgerCurrencies.has(ledgerCurrencyInput.value) ? ledgerCurrencyInput.value : "CNY";
  const amount = parseLedgerAmount(ledgerAmountInput.value, currency);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ledgerDateInput.value) || !amount) {
    setRecordStatus(ledgerDialogStatus, currency === "JPY"
      ? t("private.ledger.invalidAmountJpy", "请填写日期和大于 0 的整数金额。")
      : t("private.ledger.invalidAmount", "请填写日期和大于 0 的金额，最多保留两位小数。"), "error");
    return;
  }
  const previous = activeLedger;
  const entry = {
    id,
    date: ledgerDateInput.value,
    type: ledgerTypes.has(ledgerTypeInput.value) ? ledgerTypeInput.value : "expense",
    category: ledgerCategories.has(ledgerCategoryInput.value) ? ledgerCategoryInput.value : "other",
    amount,
    currency,
    merchant: ledgerMerchantInput.value.trim().slice(0, 120),
    note: ledgerNoteInput.value.trim().slice(0, 600),
    recurring: ledgerRecurringInput.checked,
    updatedAt: new Date().toISOString()
  };
  activeLedger = previous.some((item) => item.id === id)
    ? previous.map((item) => item.id === id ? entry : item)
    : [...previous, entry];
  try {
    ledgerForm.querySelector("button[type='submit']").disabled = true;
    await saveMailVault();
    renderLedger();
    closeLedgerDialog();
    setRecordStatus(ledgerStatus, t("private.ledger.saved", "账目已加密保存。"), "ok");
  } catch {
    activeLedger = previous;
    setRecordStatus(ledgerDialogStatus, t("private.ledger.saveFailed", "账目保存失败，请稍后再试。"), "error");
  } finally {
    ledgerForm.querySelector("button[type='submit']").disabled = false;
  }
});

ledgerDeleteButton.addEventListener("click", async () => {
  await deleteLedgerById(ledgerIdInput.value);
});

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
    mailVaultLoaded = false;
    mailUnlocked = false;
    activeMailAccounts = [];
    activePhones = [];
    activeLedger = [];
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

mailMessageCloseButton.addEventListener("click", closeMailMessage);

mailMessageDialog.addEventListener("click", (event) => {
  if (event.target === mailMessageDialog) closeMailMessage();
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
  const key = mailActiveKey
    || localStorage.getItem(mailSyncKeyStorage)
    || localStorage.getItem(mailKeyStorage)
    || "";
  if (!key) return;
  try {
    await navigator.clipboard.writeText(key);
    setMailKeyStatus(t("private.mail.keyCopied", "恢复钥匙已复制"), "ok");
  } catch {
    mailKeyField.hidden = false;
    mailKeyInput.value = key;
    mailKeyInput.readOnly = false;
    mailKeyInput.select();
    setMailKeyStatus(t("private.mail.copyKeyFallback", "请手动复制已选中的恢复钥匙"), "pending");
  }
});

mailKeyResetButton.addEventListener("click", async () => {
  if (!mailSyncKey || mailUnlocked) return;
  const confirmed = window.confirm(t(
    "private.mail.resetVaultConfirm",
    "确定清空无法解锁的旧资料库吗？邮箱账号、手机号和账目都会被删除；请先确认没有可用备份。"
  ));
  if (!confirmed) return;
  try {
    mailKeyResetButton.disabled = true;
    setMailKeyStatus(t("private.mail.resettingVault", "正在重建加密资料库…"), "pending");
    activeMailAccounts = [];
    activePhones = [];
    activeLedger = [];
    selectedMailAccountId = "";
    await saveMailVaultWithKey(mailSyncKey);
    renderMailAccounts();
    renderPhones();
    renderLedger();
    closeMailKeyDialog();
    setMailStatus(t("private.mail.vaultReset", "旧资料库已清空，可以重新添加资料。"), "ok");
  } catch {
    mailUnlocked = false;
    setMailKeyStatus(t("private.mail.vaultResetFailed", "资料库重建失败，请稍后再试。"), "error");
  } finally {
    mailKeyResetButton.disabled = false;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !privateContextMenu.hidden) {
    event.preventDefault();
    closePrivateContextMenu(true);
    return;
  }
  if ((event.key === "ContextMenu" || (event.shiftKey && event.key === "F10"))
    && event.target instanceof Element
    && !event.target.closest("input, textarea, select, [contenteditable='true']")) {
    const target = event.target.closest("[data-context-kind]");
    if (target) {
      event.preventDefault();
      openPrivateContextMenu(target);
      return;
    }
  }
  if (!privateContextMenu.hidden) {
    const items = [...privateContextMenu.querySelectorAll("button:not(:disabled)")];
    const index = items.indexOf(document.activeElement);
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) && items.length) {
      event.preventDefault();
      const next = event.key === "Home" ? 0
        : event.key === "End" ? items.length - 1
          : event.key === "ArrowDown" ? (index + 1 + items.length) % items.length
            : (index - 1 + items.length) % items.length;
      items[next].focus();
      return;
    }
    if (event.key === "Tab") closePrivateContextMenu(false);
  }
  const openDialog = !mailMessageDialog.hidden
    ? mailMessageDialog
    : !mailAddDialog.hidden
      ? mailAddDialog
      : !mailKeyDialog.hidden
        ? mailKeyDialog
        : !phoneDialog.hidden
          ? phoneDialog
          : !ledgerDialog.hidden
            ? ledgerDialog
            : null;
  if (event.key === "Escape") {
    if (openDialog === mailMessageDialog) closeMailMessage();
    else if (openDialog === mailAddDialog) closeMailDialog();
    else if (openDialog === mailKeyDialog) closeMailKeyDialog();
    else if (openDialog === phoneDialog) closePhoneDialog();
    else if (openDialog === ledgerDialog) closeLedgerDialog();
    else if (!mailComposeForm.hidden) setComposeOpen(false);
    return;
  }
  if (event.key !== "Tab" || !openDialog) return;
  const focusable = [...openDialog.querySelectorAll("button, input, select, textarea, a[href], [tabindex]:not([tabindex='-1'])")]
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

document.addEventListener("contextmenu", (event) => {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest("input, textarea, select, [contenteditable='true']")) return;
  const target = event.target.closest("[data-context-kind]");
  if (!target) return;
  event.preventDefault();
  openPrivateContextMenu(target, { x: event.clientX, y: event.clientY });
});

document.addEventListener("pointerdown", (event) => {
  if (!privateContextMenu.hidden && !privateContextMenu.contains(event.target)) closePrivateContextMenu(false);
}, true);

window.addEventListener("resize", () => closePrivateContextMenu(false));
window.addEventListener("scroll", () => closePrivateContextMenu(false), true);

for (const choice of mailProviderChoices) {
  choice.addEventListener("click", () => setMailProvider(choice.dataset.providerChoice));
}

for (const button of mailViewButtons) {
  button.addEventListener("click", () => setMailView(button.dataset.mailView));
  button.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setMailView(button.dataset.mailView === "inbox" ? "insights" : "inbox", true);
  });
}

mailInsightsScanButton.addEventListener("click", scanCurrentMailInsights);
mailInsightsClearButton.addEventListener("click", () => clearMailInsights());

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

mailSyncButton.addEventListener("click", syncCurrentMail);

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
  closePrivateContextMenu(false);
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
  renderPhones();
  renderLedger();
  renderMailInsights();
  loadDevices().catch(() => {});
});
