# 数学分析学习辅助器 - 章节功能地图

版本：v0.30

本工具面向中国数学专业“数学分析”课程，而不是普通微积分计算器。它把常见题型拆成极限、连续、微分、积分、级数、函数列、多元函数和含参问题的细步骤命令。

## 1. 实数、数列极限

覆盖问题：
- 数列极限
- epsilon-N 证明提示
- 递推数列不动点
- 递推稳定性线索
- Cauchy/单调有界证明前的计算准备

命令：
```ma
SequenceLimit((n+1)/(n+2), n)
EpsilonNHint((n+1)/(n+2), 1, n)
RecursiveFixedPoints((x+2/x)/2, x)
StudyGuide("sequence")
```

## 2. 函数极限与连续

覆盖问题：
- 左右极限
- epsilon-delta 证明提示
- 夹逼定理组织
- 等价无穷小判别
- 可去/跳跃/无穷间断分类
- 连续域
- 值域
- 一致连续性常用判据
- 洛必达使用条件检查
- 等价无穷小与 Taylor 线索

命令：
```ma
Limit(sin(x)/x, x, 0)
EpsilonDeltaHint(sin(x)/x, 1, x, 0)
SqueezeLimitReport(-x**2, x**2*sin(1/x), x**2, x, 0)
EquivalentInfinitesimalReport(sin(x), x, x, 0)
ContinuityCheck(sin(x)/x, x, 0)
DiscontinuityType(1/x, x, 0)
DomainContinuity(log(x)/(x-1), x)
RangeOnInterval(x**2, x, -2, 3)
UniformContinuityHint(sqrt(x), x, 0, 1)
LHopitalCheck(sin(x)-x, x**3, x, 0)
StudyGuide("limit_continuity")
```

## 3. 一元微分学

覆盖问题：
- 高阶导数
- 隐函数求导
- 单调区间线索
- 凸凹性和拐点线索
- Taylor 多项式与导数表
- Lagrange 中值定理候选点

命令：
```ma
Derivative(sin(x)*exp(x), x, 3)
ImplicitDerivative(x**2 + y**2 - 1, x, y)
MonotonicityReport(x**3-3*x, x)
ConvexityReport(x**4-2*x**2, x)
TaylorReport(log(1+x), x, 0, 5)
MeanValueReport(x**2, x, 1, 3)
StudyGuide("derivative")
```

## 4. 一元积分学与广义积分

覆盖问题：
- 不定积分
- 定积分
- Riemann 和极限
- 分部积分模板
- 广义积分和绝对收敛线索
- 广义积分比较判别
- 含参积分求导对照

命令：
```ma
Integral(sin(x), x)
Integral(exp(-x), (x, 0, oo))
RiemannSumLimit(x**2, x, n, 0, 1)
IntegralByParts(x, exp(x), x)
ImproperIntegralReport(1/x**2, x, 1, oo)
IntegralConvergenceTest(1/x**2, x, 1, oo, 1/x**2)
ParamIntegralReport(exp(-t*x), x, 0, oo, t)
StudyGuide("integral")
```

## 5. 数项级数

覆盖问题：
- 一般项趋零必要条件
- 比值判别
- 根值判别
- 极限比较判别
- 积分判别
- Dirichlet / Abel 判别提示
- 绝对收敛线索
- 交错级数判别线索
- Cauchy 凝聚判别

命令：
```ma
SeriesTestReport(1/n**2, n)
ComparisonSeriesTest(1/(n**2+n), 1/n**2, n)
IntegralSeriesTest(1/n**2, n, 1)
DirichletAbelHint((-1)**n, 1/n, n)
AlternatingSeriesReport(1/n, n)
CauchyCondensation(1/(n*log(n)**2), n)
StudyGuide("series")
```

## 6. 函数列、函数项级数、幂级数

覆盖问题：
- 逐点极限
- 一致收敛 sup 范数任务
- Weierstrass M 判别
- 逐项求导条件提示
- 幂级数收敛半径
- 幂级数开收敛区间和端点待判项
- 端点需另判

命令：
```ma
PointwiseLimit(x/n, n)
UniformConvergenceHint(x/n, 0, n, x)
WeierstrassMTest(1/n**2, n)
TermwiseDifferentiationCheck(x**n/n**2, x, n)
PowerSeriesRadius(1/n, n, x, 0)
PowerSeriesInterval(1/n, n, x, 0)
StudyGuide("function_series")
```

## 7. Fourier 与特殊函数

覆盖问题：
- Fourier 级数截断
- Fourier 系数 a0、an、bn
- Fourier 变换和逆变换
- 正弦变换、余弦变换
- Laplace 变换和逆变换
- Laplace 求导规则
- 卷积积分和卷积定理
- Gamma、Beta、误差函数、积分函数

命令：
```ma
FourierSeries(sin(x), x, -pi, pi, 5)
FourierCoefficientReport(x, x, -pi, pi, 5)
FourierTransform(exp(-x**2), x, k)
InverseFourierTransform(exp(-k**2/4)/sqrt(2), k, x)
FourierTransformReport(exp(-x**2), x, k)
InverseFourierTransformReport(exp(-k**2), k, x)
SineTransformReport(exp(-x), x, k)
CosineTransformReport(exp(-x), x, k)
LaplaceTransformReport(sin(t), t, lam)
InverseLaplaceTransformReport(1/(lam**2+1), lam, t)
LaplaceDerivativeRule(sin(t), t, lam)
LaplaceSolveODE(Eq(f(t).diff(t)-f(t), 0), f(t), t, lam)
ConvolutionIntegral(t, exp(-t), t)
LaplaceConvolutionReport(t, exp(-t), t, lam)
TransformTable("laplace")
StudyGuide("transform")
Gamma(1/2)
Beta(2, 3)
```

## 8. 多元函数微分学

覆盖问题：
- n 维欧氏空间距离、邻域、区域语言
- 多元极限路径检验
- 某点补定义使连续
- 多元连续性检查
- 偏导、二阶偏导、混合偏导
- 可微性余项判别
- 链式法则
- Jacobi 矩阵和 Jacobi 行列式
- 隐函数偏导
- 隐函数定理条件检查
- 反函数定理条件检查
- 梯度
- Hessian
- 临界点分类
- 方向导数
- 条件极值的 Lagrange 乘子法
- 显式曲面切平面和法向量
- 隐式曲面切平面和法线
- 二重积分、三重积分
- 换元 Jacobian
- 第一类/第二类曲线积分
- 曲面积分因子
- Green 公式、Gauss 公式、Stokes 公式
- 散度、旋度

命令：
```ma
EuclideanDistance([1,2,3], [0,0,0])
NeighborhoodReport([0,0], 0.1)
MultivarLimitPaths(x*y/(x**2+y**2), x, y, 0, 0)
PatchValueForContinuity(x**2*y**2/(x**2+y**2), x, y, 0, 0)
MultivarContinuityAt(x**2*y**2/(x**2+y**2), x, y, 0, 0, 0)
PartialDerivativeReport(x**2*y + sin(x*y), x, y, 0, 0)
DifferentiabilityReport(x**2*y**2/(x**2+y**2), x, y, 0, 0, 0)
ChainRuleReport(x**2+y**2, {x:t, y:t**2}, t)
JacobianReport([x**2-y, x+y**2], [x,y])
ImplicitPartialReport(x**2+y**2+z**2-1, z, (x,y))
ImplicitFunctionTheoremCheck(x**2+y**2+z**2-1, z, {x:0,y:0,z:1})
InverseFunctionTheoremCheck([x+y, x-y], [x,y], {x:0,y:0})
Gradient(x**2+y**2, x, y)
HessianMatrix(x**2+x*y+y**2, x, y)
CriticalPointReport(x**4+y**4-2*x**2-2*y**2, x, y)
DirectionalDerivative(x**2+y**2, [1, 1], x, y)
LagrangeMultiplier(x*y, x+y-1, x, y)
TangentPlaneGraph(x**2+y**2, x, y, 1, 1)
TangentPlaneImplicit(x**2+y**2+z**2-1, {x:0,y:0,z:1}, (x,y,z))
NormalLineImplicit(x**2+y**2+z**2-1, {x:0,y:0,z:1}, (x,y,z), t)
DoubleIntegral(x+y, x, 0, 1, y, 0, 1)
TripleIntegral(1, x, 0, 1, y, 0, 1, z, 0, 1)
ChangeVariablesJacobian([x,y], [t*cos(theta), t*sin(theta)], [t,theta])
LineIntegralScalar(x+y, [t, t**2], t, 0, 1)
LineIntegralVector([y, x], [cos(t), sin(t)], t, 0, 2*pi)
Divergence([x**2, y**2, z**2], (x,y,z))
Curl([y,z,x], (x,y,z))
GreenTheoremReport(-y/2, x/2, "unit disk")
SurfaceIntegralGraphScalar(1, x**2+y**2, x, 0, 1, y, 0, 1)
GaussTheoremReport([x,y,z])
StokesTheoremReport([y,z,x])
StudyGuide("multivariable")
```

## 9. 证明与解题步骤卡

```ma
StudyGuide("sequence")
StudyGuide("limit_continuity")
StudyGuide("derivative")
StudyGuide("integral")
StudyGuide("series")
StudyGuide("function_series")
StudyGuide("multivariable")
```

步骤卡不替代证明，但会提醒每类题要检查的条件，避免只算不证。
