# 数学分析学习辅助器

一个基于 **SymPy** 的**纯符号数学分析计算工具**，专门处理数学分析中的各种**符号运算**（非数值近似）。

## 核心特性
- 支持从 `.tex` 文件中提取 LaTeX 数学公式
- 全部使用**符号运算**（非数值近似）
- 支持数学分析主要内容：
  - 极限（单变量、多变量）
  - 导数与偏导数
  - 不定积分、定积分、广义积分
  - 泰勒级数展开
  - 傅里叶级数
  - 级数求和
  - 常微分方程符号求解
  - 多元函数极值、拉格朗日乘子法等

## 运行方式
```bash
python src/parser.py examples/analysis.tex
```

## 在 Small Magellanic Cloud 中发布

本目录是主站 `/study/analysis/` 的核心计算项目。网页页面只提交输入文件内容，实际计算仍由 `src/cas_parser.py` 完成。

本地从仓库根目录运行：

```bash
python3 tools/study/analysis/src/cas_parser.py tools/study/analysis/examples/cas_test.ma
python3 tools/study/analysis/src/cas_parser.py tools/study/analysis/examples/theory.ma
```

网页 API：

```text
POST /api/study/analysis/evaluate
```

请求体：

```json
{ "source": "Limit(sin(x)/x, x, 0)" }
```

## 依赖
```bash
python3 -m pip install -r ../requirements.txt
```

当前版本：v0.30（完整 GeoGebra CAS 风格 + 数学分析扩展）

已支持命令：
- Limit / Derivative / ImplicitDerivative
- Integral（不定/定/广义）
- Series / Sum
- Solve / SolveODE
- Simplify / Factor / Expand
- Gamma / Beta
- FourierSeries（扩展）
- FourierCoefficientReport / FourierTransformReport / InverseFourierTransformReport
- LaplaceTransformReport / InverseLaplaceTransformReport / LaplaceDerivativeRule
- SineTransformReport / CosineTransformReport / LaplaceConvolutionReport
- EpsilonNHint / EpsilonDeltaHint / SqueezeLimitReport / EquivalentInfinitesimalReport
- SeriesTestReport / ComparisonSeriesTest / IntegralSeriesTest / DirichletAbelHint
- UniformConvergenceHint / PowerSeriesInterval / RiemannSumLimit
- 多元函数专题：PatchValueForContinuity / DifferentiabilityReport / ImplicitPartialReport / JacobianReport
- 曲线曲面积分与场论：LineIntegralScalar / LineIntegralVector / GreenTheoremReport / Divergence / Curl / GaussTheoremReport / StokesTheoremReport
- LagrangeMultiplier（扩展）
- CriticalPoints（扩展）

使用方式：
```bash
python src/cas_parser.py examples/cas_test.ma
python src/cas_parser.py examples/expanded_topics.ma
```

详细说明请查看：`docs/使用手册.md` 和 `docs/chapter_feature_map.md`
