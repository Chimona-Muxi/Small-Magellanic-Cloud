const form = document.querySelector("[data-padic-form]");
const input = document.querySelector("[data-padic-input]");
const digitsInput = document.querySelector("[data-padic-digits]");
const output = document.querySelector("[data-padic-output]");

const helpText = `p-adic Web Converter help

Input format:
  <expression> <p>

Examples:
  5 7                  integer to 7-adic
  1/3 5                rational number to 5-adic
  3+4*2 5              expression first, then convert
  (1/3+1)*2 5          parentheses and fractions
  2^10 7               integer exponent
  pow(2,10) 7          pow(base, integerExponent)

Commands:
  help                 show this help
  menu                 show examples
  language             show the current site language

Notes:
  p must be prime.
  The web version supports rational expressions and integer powers.
  sqrt, exp and log are available in the terminal installer version from main2.0.`;

function gcd(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1n;
}

function makeRational(numerator, denominator = 1n) {
  if (denominator === 0n) throw new Error("分母不能为 0。");
  let n = numerator;
  let d = denominator;
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

function add(a, b) {
  return makeRational(a.n * b.d + b.n * a.d, a.d * b.d);
}

function sub(a, b) {
  return makeRational(a.n * b.d - b.n * a.d, a.d * b.d);
}

function mul(a, b) {
  return makeRational(a.n * b.n, a.d * b.d);
}

function div(a, b) {
  return makeRational(a.n * b.d, a.d * b.n);
}

function powInt(base, exponent) {
  if (exponent === 0n) return makeRational(1n);
  const negative = exponent < 0n;
  let exp = negative ? -exponent : exponent;
  let result = makeRational(1n);
  let factor = base;
  while (exp > 0n) {
    if (exp & 1n) result = mul(result, factor);
    factor = mul(factor, factor);
    exp >>= 1n;
  }
  return negative ? div(makeRational(1n), result) : result;
}

function tokenize(source) {
  const tokens = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }
    if (/[0-9]/.test(ch)) {
      let value = ch;
      i += 1;
      while (i < source.length && /[0-9]/.test(source[i])) {
        value += source[i];
        i += 1;
      }
      tokens.push({ type: "number", value: BigInt(value) });
      continue;
    }
    if (/[A-Za-z_]/.test(ch)) {
      let value = ch;
      i += 1;
      while (i < source.length && /[A-Za-z0-9_]/.test(source[i])) {
        value += source[i];
        i += 1;
      }
      tokens.push({ type: "ident", value });
      continue;
    }
    if ("+-*/^(),".includes(ch)) {
      tokens.push({ type: ch, value: ch });
      i += 1;
      continue;
    }
    throw new Error(`无法识别字符：${ch}`);
  }
  tokens.push({ type: "eof", value: "" });
  return tokens;
}

class Parser {
  constructor(source) {
    this.tokens = tokenize(source);
    this.index = 0;
  }

  peek() {
    return this.tokens[this.index];
  }

  take(type) {
    if (this.peek().type !== type) throw new Error(`这里需要 ${type}。`);
    return this.tokens[this.index++];
  }

  match(type) {
    if (this.peek().type !== type) return false;
    this.index += 1;
    return true;
  }

  parse() {
    const value = this.expression();
    if (this.peek().type !== "eof") throw new Error("表达式末尾还有无法解析的内容。");
    return value;
  }

  expression() {
    let value = this.term();
    while (this.peek().type === "+" || this.peek().type === "-") {
      const op = this.take(this.peek().type).type;
      const right = this.term();
      value = op === "+" ? add(value, right) : sub(value, right);
    }
    return value;
  }

  term() {
    let value = this.power();
    while (this.peek().type === "*" || this.peek().type === "/") {
      const op = this.take(this.peek().type).type;
      const right = this.power();
      value = op === "*" ? mul(value, right) : div(value, right);
    }
    return value;
  }

  power() {
    let value = this.unary();
    if (this.match("^")) {
      const exponent = this.power();
      if (exponent.d !== 1n) throw new Error("^ 只支持整数指数。");
      value = powInt(value, exponent.n);
    }
    return value;
  }

  unary() {
    if (this.match("+")) return this.unary();
    if (this.match("-")) return mul(makeRational(-1n), this.unary());
    return this.primary();
  }

  primary() {
    const token = this.peek();
    if (token.type === "number") {
      this.index += 1;
      return makeRational(token.value);
    }
    if (this.match("(")) {
      const value = this.expression();
      this.take(")");
      return value;
    }
    if (token.type === "ident") {
      const name = token.value.toLowerCase();
      this.index += 1;
      this.take("(");
      if (name !== "pow") throw new Error(`${token.value} 暂不在网页版支持范围内。`);
      const base = this.expression();
      this.take(",");
      const exponent = this.expression();
      this.take(")");
      if (exponent.d !== 1n) throw new Error("pow 的网页版指数必须是整数。");
      return powInt(base, exponent.n);
    }
    throw new Error("表达式不完整。");
  }
}

function mod(value, modulus) {
  const r = value % modulus;
  return r < 0n ? r + modulus : r;
}

function invMod(value, modulus) {
  let t = 0n;
  let nextT = 1n;
  let r = modulus;
  let nextR = mod(value, modulus);
  while (nextR !== 0n) {
    const q = r / nextR;
    [t, nextT] = [nextT, t - q * nextT];
    [r, nextR] = [nextR, r - q * nextR];
  }
  if (r !== 1n) throw new Error("分母不能被 p 整除到非单位部分。");
  return mod(t, modulus);
}

function valuation(value, p) {
  if (value === 0n) return 0;
  let x = value < 0n ? -value : value;
  let count = 0;
  const prime = BigInt(p);
  while (x % prime === 0n) {
    x /= prime;
    count += 1;
  }
  return count;
}

function divideByPower(value, p, power) {
  let result = value;
  const prime = BigInt(p);
  for (let i = 0; i < power; i += 1) result /= prime;
  return result;
}

function isPrime(value) {
  if (!Number.isInteger(value) || value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let i = 3; i * i <= value; i += 2) {
    if (value % i === 0) return false;
  }
  return true;
}

function parseLine(line) {
  const trimmed = line.trim();
  const match = trimmed.match(/^(.*)\s+([0-9]+)$/);
  if (!match) throw new Error("格式应为：<表达式> <p>，例如 1/3 5。");
  const expr = match[1].trim();
  const p = Number(match[2]);
  if (!expr) throw new Error("表达式不能为空。");
  if (!isPrime(p)) throw new Error("p 必须是素数。");
  return { expr, p };
}

function formatPower(p, power) {
  if (power === 0) return "";
  if (power === 1) return String(p);
  return `${p}^${power}`;
}

function formatTerm(digit, p, power) {
  if (power === 0) return String(digit);
  const powerText = formatPower(p, power);
  return digit === 1n ? powerText : `${digit}*${powerText}`;
}

function toPadic(rational, p, digits) {
  if (rational.n === 0n) {
    return {
      minPower: 0,
      terms: Array.from({ length: digits }, () => 0n)
    };
  }
  const prime = BigInt(p);
  const numVp = valuation(rational.n, p);
  const denVp = valuation(rational.d, p);
  const minPower = numVp - denVp;
  let current = divideByPower(rational.n, p, numVp);
  const unitDen = divideByPower(rational.d, p, denVp);
  const invDen = invMod(unitDen, prime);
  const terms = [];
  for (let i = 0; i < digits; i += 1) {
    const digit = mod(current * invDen, prime);
    terms.push(digit);
    current = (current - digit * unitDen) / prime;
  }
  return { minPower, terms };
}

function renderPadic(expr, p, rational, padic) {
  const nonZero = padic.terms
    .map((digit, index) => ({ digit, power: padic.minPower + index }))
    .filter((term) => term.digit !== 0n);
  const formal = nonZero.length
    ? nonZero.map((term) => formatTerm(term.digit, p, term.power)).join(" + ")
    : "0";
  const compact = padic.terms.map(String).join(", ");
  const fraction = rational.d === 1n ? String(rational.n) : `${rational.n}/${rational.d}`;
  return [
    `input: ${expr} in Q_${p}`,
    `rational result: ${fraction}`,
    `valuation: v_${p} = ${padic.minPower}`,
    "",
    "formal expansion:",
    `${formal} + ...`,
    "",
    `digits from p^${padic.minPower}:`,
    `[${compact}]`
  ].join("\n");
}

function runCommand(command) {
  const trimmed = command.trim();
  if (!trimmed || trimmed === "help") return helpText;
  if (trimmed === "menu") return "Examples:\n  5 7\n  1/3 5\n  3+4*2 5\n  (1/3+1)*2 5\n  pow(2,10) 7\n\nType help for the full guide.";
  if (trimmed === "language") {
    const lang = window.SMC_PREFS?.currentLanguage?.() || document.documentElement.dataset.lang || "zh-CN";
    return `Current site language: ${lang}`;
  }
  const digits = Math.max(4, Math.min(60, Number(digitsInput?.value) || 18));
  const { expr, p } = parseLine(trimmed);
  const rational = new Parser(expr).parse();
  const padic = toPadic(rational, p, digits);
  return renderPadic(expr, p, rational, padic);
}

function submit(command) {
  try {
    output.textContent = runCommand(command);
  } catch (error) {
    output.textContent = `Error: ${error.message}\n\nType help for examples and supported syntax.`;
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
