# 数学分析理论学习示例（符号推导）

x = symbols('x')
n = symbols('n', integer=True, positive=True)

# 1. 极限理论
limit(sin(x)/x, x, 0)

# 2. 导数理论
diff(sin(x)*exp(x), x)

# 3. 积分理论
integrate(sin(x), x)
integrate(exp(-x), (x, 0, oo))

# 4. 泰勒展开
series(sin(x), x, 0, 6)

# 5. 级数求和
summation(1/n**2, (n, 1, oo))

# 6. 常微分方程
f = Function('f')
dsolve(Eq(f(x).diff(x), f(x)), f(x))