#!/usr/bin/env python3
"""
数学分析学习辅助器 - GeoGebra CAS 风格解析器 (v0.12)

已稳定：
- 支持直接输入数学表达式
- 支持 GeoGebra CAS 风格命令
- 包含 GeoGebra 默认数学函数 + 数学分析常用特殊函数
- 支持绘图功能（Plot, PlotImplicit, PlotParametric, PlotPolar, Plot3D）
"""

import os
import sys
import tempfile

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "smc-matplotlib"))
if os.environ.get("SMC_WEB_RUN"):
    os.environ.setdefault("MPLBACKEND", "Agg")

import sympy as sp
from sympy import (
    symbols, Function, Eq, I,
    limit, diff, integrate, series, summation, dsolve, idiff,
    sin, cos, tan, cot, sec, csc,
    asin, acos, atan, acot, asec, acsc, atan2,
    sinh, cosh, tanh, coth, sech, csch,
    asinh, acosh, atanh, acoth, asech, acsch,
    exp, log, sqrt, cbrt, Abs,
    sign, factorial, binomial,
    floor, ceiling, re, im, arg, conjugate,
    oo, pi, gamma, beta,
    simplify, factor, expand, fourier_series,
    fourier_transform, inverse_fourier_transform,
    DiracDelta, totient,
    rsolve,
    pprint
)

plt = None

x, y, z, t, n, k, theta = symbols('x y z t n k theta')
f = Function('f')
a = Function('a')
S = Function('S')
variables = {}

# GeoGebra CAS 默认数学函数 + 扩展
math_functions = {
    # 三角
    "sin": sin, "cos": cos, "tan": tan, "cot": cot, "sec": sec, "csc": csc,
    # 反三角
    "asin": asin, "acos": acos, "atan": atan, "acot": acot, "asec": asec, "acsc": acsc, "atan2": atan2,
    # 双曲
    "sinh": sinh, "cosh": cosh, "tanh": tanh, "coth": coth, "sech": sech, "csch": csch,
    # 反双曲
    "asinh": asinh, "acosh": acosh, "atanh": atanh, "acoth": acoth, "asech": asech, "acsch": acsch,
    # 对数指数
    "exp": exp, "log": log, "ln": log,
    "log10": lambda x: log(x, 10),
    "log2":  lambda x: log(x, 2),
    # 根式与常用
    "sqrt": sqrt, "cbrt": cbrt, "abs": Abs, "sign": sign,
    "factorial": factorial, "binomial": binomial,
    "floor": floor, "ceiling": ceiling,
    # 复数
    "re": re, "im": im, "arg": arg, "conjugate": conjugate,
    # 特殊函数
    "gamma": gamma, "beta": beta,
    # 数学分析常用特殊函数
    "erf": sp.erf,
    # 新增特殊函数
    "DiracDelta": DiracDelta,          # 狄拉克 δ 函数
    "totient": totient,                # 欧拉 φ 函数（欧拉函数）
    "eulerPhi": totient,               # 别名：欧拉 φ 函数
    "DirichletEta": sp.dirichlet_eta,  # 狄利克雷 η 函数
    "expIntegral": lambda *args: sp.expint(1, args[0]) if len(args) == 1 else sp.expint(*args),
    "sinIntegral": sp.Si,
    "cosIntegral": sp.Ci,
    "gammaRegularized": lambda a, x: sp.uppergamma(a, x) / gamma(a),
    "betaRegularized": lambda a, b, x: sp.betainc(a, b, 0, x) / beta(a, b),
    # 常量
    "oo": oo, "pi": pi, "I": I,
    "symbols": symbols, "Function": Function, "Eq": Eq, "sp": sp,
    # SymPy / 小写命令别名
    "limit": limit, "diff": diff, "integrate": integrate,
    "series": series, "summation": summation, "dsolve": dsolve,
    "simplify": simplify, "factor": factor, "expand": expand,
    # 常用符号变量
    "x": x, "y": y, "z": z, "t": t, "n": n, "k": k, "theta": theta,
    "f": f,
    "a": a,
    "S": S,
    # 绘图命令（返回参数元组，由后续代码处理）
    "Plot": lambda *args: args,
    "PlotImplicit": lambda *args: args,
    "PlotParametric": lambda *args: args,
    "PlotPolar": lambda *args: args,
    "Plot3D": lambda *args: args
}

def eval_env(extra=None):
    return {**math_functions, **variables, **(extra or {})}

def is_web_run():
    return bool(os.environ.get("SMC_WEB_RUN"))

def get_pyplot():
    global plt
    if plt is None:
        import matplotlib.pyplot as pyplot
        plt = pyplot
    return plt

def finish_plot(message):
    plot = get_pyplot()
    if is_web_run():
        plot.close("all")
        print(f"{message}（网页运行环境已完成绘图计算，图像请在本地 CLI 查看）")
    else:
        plot.show()
        print(message)

def evaluate_cas_command(line: str):
    line = line.strip()
    if not line or line.startswith('#'):
        return

    print(f"\n>>> {line}")

    try:
        if '=' in line and not line.startswith('Eq(') and '==' not in line:
            name, expr_text = line.split('=', 1)
            name = name.strip()
            if name.isidentifier():
                expr = eval(expr_text.strip(), {"__builtins__": {}}, eval_env())
                variables[name] = expr
                math_functions[name] = expr
                print(f"{name} ="); pprint(expr)
                return

        if line.startswith('Limit('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"Limit": limit}))
            print("极限结果:"); pprint(expr)

        elif line.startswith('Derivative('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"Derivative": diff}))
            print("导数/偏导数结果:"); pprint(expr)

        elif line.startswith('ImplicitDerivative('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"ImplicitDerivative": lambda f, x, y: idiff(f, y, x)}))
            print("隐函数微分结果:"); pprint(expr)

        elif line.startswith('Integral('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"Integral": integrate}))
            print("积分结果:"); pprint(expr)

        elif line.startswith('Series('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"Series": series}))
            print("级数展开:"); pprint(expr)

        elif line.startswith('Sum('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"Sum": summation}))
            print("级数求和结果:"); pprint(expr)

        elif line.startswith('Solve('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"Solve": sp.solve, "Eq": Eq}))
            print("方程解:"); pprint(expr)

        elif line.startswith('SolveODE('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"SolveODE": dsolve, "Eq": Eq}))
            print("微分方程解:"); pprint(expr)

        elif line.startswith('Simplify('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"Simplify": simplify}))
            print("化简结果:"); pprint(expr)
        elif line.startswith('Factor('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"Factor": factor}))
            print("因式分解:"); pprint(expr)
        elif line.startswith('Expand('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"Expand": expand}))
            print("展开结果:"); pprint(expr)

        elif line.startswith('Gamma('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"Gamma": gamma}))
            print("Gamma 函数:"); pprint(expr)
        elif line.startswith('Beta('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"Beta": beta}))
            print("Beta 函数:"); pprint(expr)

        elif line.startswith('FourierSeries('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"FourierSeries": lambda f, x, a, b, n: fourier_series(f, (x, a, b)).truncate(n)}))
            print("傅里叶级数:"); pprint(expr)

        elif line.startswith('FourierTransform('):
            # FourierTransform(f, x, k)
            expr = eval(line, {"__builtins__": {}}, eval_env({"FourierTransform": fourier_transform}))
            print("傅立叶变换:"); pprint(expr)

        elif line.startswith('InverseFourierTransform('):
            # InverseFourierTransform(F, k, x)
            expr = eval(line, {"__builtins__": {}}, eval_env({"InverseFourierTransform": inverse_fourier_transform}))
            print("逆傅立叶变换:"); pprint(expr)

        elif line.startswith('RecurrenceSolve('):
            # RecurrenceSolve(eq, func, init_dict)
            # 示例: RecurrenceSolve(a(n)-a(n-1)-a(n-2), a(n), {a(0):0, a(1):1})
            expr = eval(line, {"__builtins__": {}}, eval_env({"RecurrenceSolve": rsolve, "Eq": Eq}))
            print("数列通项:"); pprint(expr)

        elif line.startswith('LagrangeMultiplier('):
            print("拉格朗日乘子法（简化实现）：请手动构造拉格朗日函数并求偏导")
            print("示例：L = f + λ*(g)")

        elif line.startswith('CriticalPoints('):
            expr = eval(line, {"__builtins__": {}}, eval_env({"CriticalPoints": lambda f, x, y: sp.solve([diff(f, x), diff(f, y)], [x, y])}))
            print("临界点:"); pprint(expr)

        # ==================== 绘图功能 ====================
        elif line.startswith('Plot('):
            # Plot(f, x, a, b)
            try:
                args = eval(line, {"__builtins__": {}}, eval_env())
                if len(args) == 4:
                    f_expr, var, a, b = args
                    lam = sp.lambdify(var, f_expr, modules=['numpy'])
                    import numpy as np
                    get_pyplot()
                    xs = np.linspace(float(a), float(b), 400)
                    ys = lam(xs)
                    plt.figure()
                    plt.plot(xs, ys)
                    plt.title(f"Plot of {f_expr}")
                    plt.xlabel(str(var))
                    plt.ylabel(f"f({var})")
                    plt.grid(True)
                    finish_plot("已绘制函数图像")
                else:
                    print("Plot 语法: Plot(f, x, a, b)")
            except Exception as e:
                print(f"绘图失败: {e}")

        elif line.startswith('PlotImplicit('):
            # PlotImplicit(eq, x, y)
            try:
                args = eval(line, {"__builtins__": {}}, eval_env())
                if len(args) == 3:
                    eq, varx, vary = args
                    sp.plot_implicit(eq, (varx, -10, 10), (vary, -10, 10), title=f"Implicit: {eq}", show=not is_web_run())
                    print("已绘制隐函数图像")
                else:
                    print("PlotImplicit 语法: PlotImplicit(eq, x, y)")
            except Exception as e:
                print(f"隐函数绘图失败: {e}")

        elif line.startswith('PlotParametric('):
            # PlotParametric(xt, yt, t, a, b)
            try:
                args = eval(line, {"__builtins__": {}}, eval_env())
                if len(args) == 5:
                    xt, yt, var, a, b = args
                    lam_x = sp.lambdify(var, xt, modules=['numpy'])
                    lam_y = sp.lambdify(var, yt, modules=['numpy'])
                    import numpy as np
                    get_pyplot()
                    ts = np.linspace(float(a), float(b), 400)
                    xs = lam_x(ts)
                    ys = lam_y(ts)
                    plt.figure()
                    plt.plot(xs, ys)
                    plt.title(f"Parametric: ({xt}, {yt})")
                    plt.xlabel("x")
                    plt.ylabel("y")
                    plt.grid(True)
                    plt.axis('equal')
                    finish_plot("已绘制参数方程图像")
                else:
                    print("PlotParametric 语法: PlotParametric(xt, yt, t, a, b)")
            except Exception as e:
                print(f"参数方程绘图失败: {e}")

        elif line.startswith('PlotPolar('):
            # PlotPolar(r, theta, a, b)
            try:
                args = eval(line, {"__builtins__": {}}, eval_env())
                if len(args) == 4:
                    r, theta, a, b = args
                    lam_r = sp.lambdify(theta, r, modules=['numpy'])
                    import numpy as np
                    get_pyplot()
                    thetas = np.linspace(float(a), float(b), 400)
                    rs = lam_r(thetas)
                    xs = rs * np.cos(thetas)
                    ys = rs * np.sin(thetas)
                    plt.figure()
                    plt.plot(xs, ys)
                    plt.title(f"Polar: r = {r}")
                    plt.xlabel("x")
                    plt.ylabel("y")
                    plt.grid(True)
                    plt.axis('equal')
                    finish_plot("已绘制极坐标图像")
                else:
                    print("PlotPolar 语法: PlotPolar(r, theta, a, b)")
            except Exception as e:
                print(f"极坐标绘图失败: {e}")

        elif line.startswith('Plot3D('):
            # Plot3D(f, x, a, b, y, c, d)
            try:
                args = eval(line, {"__builtins__": {}}, eval_env())
                if len(args) == 7:
                    f_expr, varx, xa, xb, vary, ya, yb = args
                    lam = sp.lambdify((varx, vary), f_expr, modules=['numpy'])
                    import numpy as np
                    from mpl_toolkits.mplot3d import Axes3D
                    get_pyplot()
                    xs = np.linspace(float(xa), float(xb), 100)
                    ys = np.linspace(float(ya), float(yb), 100)
                    X, Y = np.meshgrid(xs, ys)
                    Z = lam(X, Y)
                    fig = plt.figure()
                    ax = fig.add_subplot(111, projection='3d')
                    ax.plot_surface(X, Y, Z, cmap='viridis')
                    ax.set_title(f"3D: {f_expr}")
                    ax.set_xlabel(str(varx))
                    ax.set_ylabel(str(vary))
                    ax.set_zlabel("z")
                    finish_plot("已绘制三维曲面")
                else:
                    print("Plot3D 语法: Plot3D(f, x, a, b, y, c, d)")
            except Exception as e:
                print(f"三维绘图失败: {e}")

        else:
            expr = eval(line, {"__builtins__": {}}, eval_env())
            print("结果:"); pprint(expr)

    except Exception as e:
        print(f"执行失败: {e}")

def main(input_file: str):
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"找不到文件: {input_file}")
        return

    print("数学分析学习辅助器 - GeoGebra CAS 风格符号推导 (v0.12)\n" + "="*60)
    for line in lines:
        evaluate_cas_command(line)
    print("\n" + "="*60 + "\n符号推导完成。")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python cas_parser.py <file.ma>")
        sys.exit(1)
    main(sys.argv[1])
