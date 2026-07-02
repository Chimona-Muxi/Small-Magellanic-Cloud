const form = document.querySelector("[data-padic-form]");
const input = document.querySelector("[data-padic-input]");
const output = document.querySelector("[data-padic-output]");

async function evaluatePadic(command) {
  const response = await fetch("/api/padic/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "p-adic 计算失败");
  return data.output || "";
}

async function submit(command) {
  const text = command.trim();
  if (!text) {
    output.textContent = "p-adic> 请输入指令";
    return;
  }

  output.textContent = "p-adic> 计算中...";
  try {
    output.textContent = await evaluatePadic(text);
  } catch (error) {
    output.textContent = `p-adic> ${error.message}`;
  }
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  submit(input.value);
});

for (const button of document.querySelectorAll("[data-example]")) {
  button.addEventListener("click", () => {
    input.value = button.dataset.example || "";
    submit(input.value);
    input.focus();
  });
}

submit(input?.value || "help");
