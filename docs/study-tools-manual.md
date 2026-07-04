# 学习辅助器发布说明书

这份说明面向 Small Magellanic Cloud 中的两个课程学习工具：

- 高等代数学习辅助器：`/study/algebra/`
- 数学分析学习辅助器：`/study/analysis/`

它们不是前端重写版。网站页面只承担输入、提交、展示和说明，核心计算仍然来自原 Python/SymPy 项目：

| 工具 | 核心目录 | 主脚本 |
| --- | --- | --- |
| 高等代数学习辅助器 | `tools/study/algebra/` | `tools/study/algebra/src/parser.py` |
| 数学分析学习辅助器 | `tools/study/analysis/` | `tools/study/analysis/src/cas_parser.py` |

## 网页运行流程

1. 用户在网页输入多行脚本。
2. 前端把脚本提交到 Node API。
3. Node 服务把内容写入临时输入文件。
4. Node 调用对应 Python 主脚本。
5. Python/SymPy 输出原始推导结果。
6. 网页展示输出文本，并清理临时文件。

对应 API：

| API | 用途 |
| --- | --- |
| `POST /api/study/algebra/evaluate` | 运行高等代数输入文件 |
| `POST /api/study/analysis/evaluate` | 运行数学分析 CAS 输入文件 |

请求体格式：

```json
{
  "source": "Limit(sin(x)/x, x, 0)",
  "lang": "zh"
}
```

返回格式：

```json
{
  "output": "..."
}
```

## 本地依赖

```bash
npm run install:study
```

依赖内容：

- SymPy：符号计算核心
- NumPy：绘图和数值采样辅助
- Matplotlib：数学分析绘图命令

## 高等代数语法

高等代数工具支持矩阵定义、矩阵运算、多项式、线性方程组、Gram-Schmidt、二次型和双线性形式。

示例：

```text
x = symbols('x')
A = [[1;2];[3;4]]
print(det(A))
print(rank(A))
print(inv(A))
print(charpoly(A))
```

常用函数：

| 函数 | 含义 |
| --- | --- |
| `det(A)` | 行列式 |
| `rank(A)` | 秩 |
| `tr(A)` / `trace(A)` | 迹 |
| `inv(A)` | 逆矩阵 |
| `eigvals(A)` | 特征值 |
| `eigvects(A)` | 特征向量 |
| `jordan(A)` | Jordan 标准型 |
| `smith(A)` | Smith 标准型 |
| `charpoly(A)` | 特征多项式 |
| `poly_gcd(p, q)` | 多项式最大公因式 |
| `poly_roots(p)` | 多项式求根 |
| `solve_linear(A, b)` | 解 `Ax=b` |
| `quadratic_form(Q, v)` | 二次型 |

本地运行：

```bash
python3 tools/study/algebra/src/parser.py tools/study/algebra/examples/example.txt
python3 tools/study/algebra/src/parser.py --lang en tools/study/algebra/examples/example.txt
```

## 数学分析语法

数学分析工具保留 GeoGebra CAS 风格命令，同时兼容一部分小写 SymPy 命令和简单变量赋值。

示例：

```text
Limit(sin(x)/x, x, 0)
Derivative(sin(x)*exp(x), x)
Integral(exp(-x), (x, 0, oo))
Series(sin(x), x, 0, 6)
```

常用函数：

| 函数 | 含义 |
| --- | --- |
| `Limit(expr, x, a)` | 极限 |
| `Derivative(expr, x)` | 导数/偏导数 |
| `ImplicitDerivative(expr, x, y)` | 隐函数微分 |
| `Integral(expr, x)` | 不定积分 |
| `Integral(expr, (x, a, b))` | 定积分/广义积分 |
| `Series(expr, x, a, n)` | 级数展开 |
| `Sum(expr, (k, a, b))` | 级数求和 |
| `Solve(Eq(...), x)` | 方程求解 |
| `SolveODE(Eq(...), f(x))` | 常微分方程 |
| `FourierSeries(...)` | 傅里叶级数 |
| `FourierTransform(...)` | 傅里叶变换 |
| `RecurrenceSolve(...)` | 递推求通项 |
| `Plot(...)` 等 | 本地绘图命令 |

本地运行：

```bash
python3 tools/study/analysis/src/cas_parser.py tools/study/analysis/examples/cas_test.ma
python3 tools/study/analysis/src/cas_parser.py tools/study/analysis/examples/theory.ma
```

网页环境会使用无界面 Matplotlib 后端，绘图命令可完成计算并返回文本提示；需要看到实际图像时，请在本地 CLI 运行。

## 部署

`render.yaml` 使用 Node 服务。构建阶段执行 `npm install`，随后 `postinstall` 会安装 Python 依赖：

```bash
npm install
```

依赖安装到：

```text
tools/study/python-packages/
```

运行时由 `server.mjs` 调用 `python3`，并自动把这个目录注入 `PYTHONPATH`。如果部署环境跳过了 `postinstall`，服务端第一次运行学习工具时会尝试补装一次。若部署环境禁止运行时安装，可以设置 `SMC_SKIP_RUNTIME_PIP=1`，并确保构建阶段已经执行 `npm run install:study`。

如部署环境需要指定 Python 命令，可以设置：

```bash
PYTHON=/path/to/python
```

## 维护边界

- 不在前端重写数学核心。
- 前端只维护交互、文案、示例和可访问性。
- Python 项目继续保留 README、docs、examples、src 的原有结构。
- 新增数学能力优先修改 `tools/study/*/src`，再补网页示例和说明。
- API 输入长度限制为 40000 字符，避免长任务占满服务。
