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

默认部署只安装基础 CAS 路径需要的 SymPy，避免 Render 冷启动或运行时补装时被大型绘图库拖到超时。需要本地绘图能力时再执行：

```bash
npm run install:study:plot
```

额外绘图依赖：

- NumPy：绘图和数值采样辅助
- Matplotlib：数学分析绘图命令

## 高等代数语法

高等代数工具已同步到 v0.9，支持矩阵定义、矩阵运算、多项式、线性方程组、线性空间、线性映射、Gram-Schmidt、二次型、Jordan/Smith 标准形和总复习题方法库。

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
| `rref(A)` | 行最简形 |
| `cramer_rule(A, b)` | Cramer 法则 |
| `homogeneous_solution(A)` | 齐次线性方程组基础解系 |
| `basis_from_vectors(...)` | 从向量组提取基 |
| `coordinate_in_basis(v, ...)` | 求坐标 |
| `diagonalizable_report(A)` | 可对角化报告 |
| `minimal_polynomial(A)` | 最小多项式 |
| `schmidt_report(...)` | Schmidt 正交化步骤 |
| `poly_gcd(p, q)` | 多项式最大公因式 |
| `poly_bezout(p, q)` | Bezout 等式 |
| `poly_squarefree(p)` | 重根检查 |
| `poly_roots(p)` | 多项式求根 |
| `solve_linear(A, b)` | 解 `Ax=b` |
| `quadratic_form(Q, v)` | 二次型 |
| `sylvester_criterion(Q)` | Sylvester 判别 |
| `study("exam_checklist")` | 高代复习清单 |

本地运行：

```bash
python3 tools/study/algebra/src/parser.py tools/study/algebra/examples/example.txt
python3 tools/study/algebra/src/parser.py tools/study/algebra/examples/expanded_topics.txt
python3 tools/study/algebra/src/parser.py --lang en tools/study/algebra/examples/example.txt
```

## 数学分析语法

数学分析工具已同步到 v0.30，保留 GeoGebra CAS 风格命令，同时扩展数列、连续性、微分学、级数判别、函数项级数、多元函数、曲线曲面积分、Fourier/Laplace/正弦余弦变换等专题。

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
| `FourierCoefficientReport(...)` | 傅里叶系数报告 |
| `LaplaceTransformReport(...)` | Laplace 变换报告 |
| `InverseLaplaceTransformReport(...)` | 逆 Laplace 变换报告 |
| `EpsilonNHint(...)` | 数列 epsilon-N 提示 |
| `EpsilonDeltaHint(...)` | 函数极限 epsilon-delta 提示 |
| `SeriesTestReport(...)` | 数项级数判别 |
| `UniformConvergenceHint(...)` | 一致收敛提示 |
| `PowerSeriesInterval(...)` | 幂级数收敛区间 |
| `JacobianReport(...)` | Jacobi 矩阵报告 |
| `LineIntegralScalar(...)` | 第一类曲线积分 |
| `GreenTheoremReport(...)` | Green 公式报告 |
| `Divergence(...)` / `Curl(...)` | 散度与旋度 |
| `RecurrenceSolve(...)` | 递推求通项 |
| `Plot(...)` 等 | 本地绘图命令 |

本地运行：

```bash
python3 tools/study/analysis/src/cas_parser.py tools/study/analysis/examples/cas_test.ma
python3 tools/study/analysis/src/cas_parser.py tools/study/analysis/examples/theory.ma
python3 tools/study/analysis/src/cas_parser.py tools/study/analysis/examples/expanded_topics.ma
```

网页环境默认保障符号推导；`Plot*` 绘图命令需要额外安装绘图依赖。需要看到实际图像时，请在本地 CLI 运行并执行 `npm run install:study:plot`。

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

线上默认不要安装 `requirements-plot.txt`。基础学习工具接口的超时预算用于 SymPy 冷启动和符号推导；绘图依赖体积较大，放进默认构建容易导致 Render 免费实例冷启动或运行时安装超时。

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
