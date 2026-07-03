const samples = {
  algebra: {
    matrix: `x = symbols('x')
A = [[1;2];[3;4]]
print(A)
print(det(A))
print(rank(A))
print(inv(A))
print(charpoly(A))`,
    quadratic: `x = symbols('x')
y = symbols('y')
Q = [[2;1];[1;3]]
vec = Matrix([[x],[y]])
print(quadratic_form(Q, vec))
print(is_positive_definite(Q))
print(is_symmetric(Q))`,
    poly: `x = symbols('x')
p = x^2 + 3*x + 2
q = x^2 + 5*x + 6
print(poly_gcd(p, q))
print(poly_roots(p))
print(poly_mul(p, q))`
  },
  analysis: {
    cas: `Limit(sin(x)/x, x, 0)
Derivative(sin(x)*exp(x), x)
Integral(exp(-x), (x, 0, oo))
Series(sin(x), x, 0, 6)`,
    series: `Sum(1/k**2, (k, 1, oo))
FourierSeries(sin(x), x, -pi, pi, 3)
FourierTransform(exp(-x**2), x, k)`,
    ode: `Solve(Eq(x**2 - 3*x + 2, 0), x)
SolveODE(Eq(f(x).diff(x), f(x)), f(x))
CriticalPoints(x**2 + y**2, x, y)`
  }
};

function t(key, fallback = "") {
  return window.SMC_PREFS?.t?.(key, fallback) || fallback || key;
}

function currentLanguage() {
  return window.SMC_PREFS?.currentLanguage?.() || document.documentElement.dataset.lang || "zh-CN";
}

function terminalColumns(output) {
  const fallback = 88;
  if (!output) return fallback;
  const style = getComputedStyle(output);
  const probe = document.createElement("span");
  probe.textContent = "0000000000";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.whiteSpace = "pre";
  probe.style.font = style.font;
  document.body.append(probe);
  const charWidth = probe.getBoundingClientRect().width / 10;
  probe.remove();
  if (!Number.isFinite(charWidth) || charWidth <= 0) return fallback;
  return Math.max(48, Math.min(132, Math.floor((output.clientWidth - 36) / charWidth)));
}

function localizedError(message) {
  if (message === "请输入要执行的内容") return t("tool.empty", message);
  if (message === "输入内容过长") return t("tool.failed", message);
  return message || t("tool.failed", "学习工具执行失败");
}

async function evaluate(endpoint, source, output) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source,
      columns: terminalColumns(output),
      lang: currentLanguage().startsWith("en") ? "en" : "zh"
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || t("tool.failed", "学习工具执行失败"));
  return data.output || "";
}

function initTool(root) {
  const endpoint = root.dataset.endpoint;
  const tool = root.dataset.tool;
  const input = root.querySelector("[data-tool-input]");
  const output = root.querySelector("[data-tool-output]");
  const submit = root.querySelector("[data-tool-submit]");
  const form = root.querySelector("[data-tool-form]");

  async function run() {
    const source = input.value.trim();
    if (!source) {
      output.textContent = t("tool.empty", "请输入要执行的内容");
      return;
    }

    submit.disabled = true;
    output.textContent = t("tool.running", "正在调用原项目...");
    try {
      output.textContent = await evaluate(endpoint, source, output);
    } catch (error) {
      output.textContent = localizedError(error.message);
    } finally {
      submit.disabled = false;
    }
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    run();
  });

  for (const button of root.querySelectorAll("[data-example]")) {
    button.addEventListener("click", () => {
      const source = samples[tool]?.[button.dataset.example] || "";
      if (!source) return;
      input.value = source;
      run();
      input.focus();
    });
  }

  const first = root.querySelector("[data-example]");
  if (first) {
    const source = samples[tool]?.[first.dataset.example] || "";
    if (source) input.value = source;
  }
}

for (const root of document.querySelectorAll("[data-python-tool]")) initTool(root);
