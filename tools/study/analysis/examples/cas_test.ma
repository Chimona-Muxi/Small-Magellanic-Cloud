# GeoGebra CAS 风格测试（v0.6 - 完整数学函数）

# 三角与反三角
tan(x)
cot(x)
asin(0.5)
atan(1)

# 双曲函数
sinh(x)
cosh(x)
tanh(x)

# 对数与根式
log(x)
log10(100)
sqrt(2)
cbrt(8)

# 其他常用
abs(-3)
sign(-5)
factorial(5)
binomial(5, 2)

# 复数相关
re(3+4*I)
im(3+4*I)
conjugate(3+4*I)

# 极限与微分
Limit(sin(x)/x, x, 0)
Derivative(sin(x)*exp(x), x)
ImplicitDerivative(x**2 + y**2 - 1, x, y)

# 积分与级数
Integral(sin(x), x)
Series(sin(x), x, 0, 6)
Sum(1/k**2, (k, 1, oo))

# 方程与 ODE
Solve(Eq(x**2 - 3*x + 2, 0), x)
SolveODE(Eq(f(x).diff(x), f(x)), f(x))

# 化简
Simplify((x**2-1)/(x-1))
Factor(x**2-1)
Expand((x+1)**2)

# 特殊函数
Gamma(1/2)
Beta(2, 3)
erf(1)
expIntegral(1)
expIntegral(2, 1)
sinIntegral(1)
cosIntegral(1)
gammaRegularized(2, 1)
betaRegularized(2, 3, 0.5)

# 扩展功能
FourierSeries(sin(x), x, -pi, pi, 3)
CriticalPoints(x**2 + y**2, x, y)

# 傅立叶变换
FourierTransform(exp(-x**2), x, k)
InverseFourierTransform(exp(-k**2/4)/sqrt(2), k, x)

# 特殊函数新增测试
DiracDelta(0)
totient(10)
eulerPhi(15)
DirichletEta(2)

# 数列递推求通项（an / Sn）
RecurrenceSolve(a(n) - a(n-1) - a(n-2), a(n), {a(0):0, a(1):1})
RecurrenceSolve(S(n) - S(n-1) - n, S(n), {S(0):0})

# 不定积分示例（GeoGebra CAS 风格）
Integral(sin(x), x)
Integral(exp(x), x)
Integral(1/x, x)
Integral(x**2 + 3*x + 2, x)
Integral(tan(x), x)

# 绘图功能示例（GeoGebra CAS 风格）
Plot(sin(x), x, -pi, pi)
PlotImplicit(x**2 + y**2 - 1, x, y)
PlotParametric(cos(t), sin(t), t, 0, 2*pi)
PlotPolar(1 + cos(theta), theta, 0, 2*pi)
Plot3D(x**2 + y**2, x, -2, 2, y, -2, 2)