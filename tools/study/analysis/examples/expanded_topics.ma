# 数学分析学习辅助器 - 章节扩展样例

# 1. 数列与 epsilon-N
SequenceLimit((n+1)/(n+2), n)
EpsilonNHint((n+1)/(n+2), 1, n)
RecursiveFixedPoints((x+2/x)/2, x)

# 2. 极限、连续、间断点、洛必达
Limit(sin(x)/x, x, 0)
EpsilonDeltaHint(sin(x)/x, 1, x, 0)
SqueezeLimitReport(-x**2, x**2*sin(1/x), x**2, x, 0)
EquivalentInfinitesimalReport(sin(x), x, x, 0)
ContinuityCheck(sin(x)/x, x, 0)
DiscontinuityType(1/x, x, 0)
DomainContinuity(log(x)/(x-1), x)
UniformContinuityHint(sqrt(x), x, 0, 1)
LHopitalCheck(sin(x)-x, x**3, x, 0)

# 3. 微分学、Taylor、中值定理
MonotonicityReport(x**3-3*x, x)
ConvexityReport(x**4-2*x**2, x)
TaylorReport(log(1+x), x, 0, 5)
MeanValueReport(x**2, x, 1, 3)

# 4. 积分、广义积分、含参积分
IntegralByParts(x, exp(x), x)
RiemannSumLimit(x**2, x, n, 0, 1)
ImproperIntegralReport(1/x**2, x, 1, oo)
IntegralConvergenceTest(1/x**2, x, 1, oo, 1/x**2)
ParamIntegralReport(exp(-t*x), x, 0, oo, t)

# 5. 数项级数
SeriesTestReport(1/n**2, n)
ComparisonSeriesTest(1/(n**2+n), 1/n**2, n)
IntegralSeriesTest(1/n**2, n, 1)
DirichletAbelHint((-1)**n, 1/n, n)
AlternatingSeriesReport(1/n, n)
CauchyCondensation(1/n**2, n)

# 6. 函数列、函数项级数、幂级数
PointwiseLimit(x/n, n)
UniformConvergenceHint(x/n, 0, n, x)
WeierstrassMTest(1/n**2, n)
TermwiseDifferentiationCheck(x**n/n**2, x, n)
PowerSeriesRadius(1/n, n, x, 0)
PowerSeriesInterval(1/n, n, x, 0)

# 7. 多元函数
MultivarLimitPaths(x*y/(x**2+y**2), x, y, 0, 0)
Gradient(x**2+y**2, x, y)
HessianMatrix(x**2+x*y+y**2, x, y)
CriticalPointReport(x**4+y**4-2*x**2-2*y**2, x, y)
DirectionalDerivative(x**2+y**2, [1, 1], x, y)
LagrangeMultiplier(x*y, x+y-1, x, y)

# 8. 步骤卡
StudyGuide("series")
StudyGuide("function_series")
StudyGuide("transform")

# 9. Fourier / Laplace / 正弦余弦变换
FourierCoefficientReport(x, x, -pi, pi, 4)
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
TransformTable("fourier")

# 10. 多元函数专题：连续、补定义、可微、隐函数、曲线曲面积分
EuclideanDistance([1, 2, 3], [0, 0, 0])
NeighborhoodReport([0, 0], 0.1)
PatchValueForContinuity(x*y/(x**2+y**2), x, y, 0, 0)
MultivarContinuityAt(x**2*y**2/(x**2+y**2), x, y, 0, 0, 0)
PartialDerivativeReport(x**2*y + sin(x*y), x, y, 0, 0)
DifferentiabilityReport(x**2*y**2/(x**2+y**2), x, y, 0, 0, 0)
ChainRuleReport(x**2+y**2, {x: t, y: t**2}, t)
JacobianReport([x**2-y, x+y**2], [x, y])
ImplicitPartialReport(x**2+y**2+z**2-1, z, (x, y))
ImplicitFunctionTheoremCheck(x**2+y**2+z**2-1, z, {x:0, y:0, z:1})
InverseFunctionTheoremCheck([x+y, x-y], [x, y], {x:0, y:0})
TangentPlaneGraph(x**2+y**2, x, y, 1, 1)
TangentPlaneImplicit(x**2+y**2+z**2-1, {x:0, y:0, z:1}, (x, y, z))
NormalLineImplicit(x**2+y**2+z**2-1, {x:0, y:0, z:1}, (x, y, z), t)
DoubleIntegral(x+y, x, 0, 1, y, 0, 1)
TripleIntegral(1, x, 0, 1, y, 0, 1, z, 0, 1)
ChangeVariablesJacobian([x, y], [t*cos(theta), t*sin(theta)], [t, theta])
LineIntegralScalar(x+y, [t, t**2], t, 0, 1)
LineIntegralVector([y, x], [cos(t), sin(t)], t, 0, 2*pi)
Divergence([x**2, y**2, z**2], (x, y, z))
Curl([y, z, x], (x, y, z))
GreenTheoremReport(-y/2, x/2, "unit disk")
SurfaceIntegralGraphScalar(1, x**2+y**2, x, 0, 1, y, 0, 1)
GaussTheoremReport([x, y, z])
StokesTheoremReport([y, z, x])
