#!/usr/bin/env python3
"""
数学分析学习辅助器 - GeoGebra CAS 风格解析器 (v0.30)

已稳定：
- 支持直接输入数学表达式
- 支持 GeoGebra CAS 风格命令
- 包含 GeoGebra 默认数学函数 + 数学分析常用特殊函数
- 支持绘图功能（Plot, PlotImplicit, PlotParametric, PlotPolar, Plot3D）
"""

import os
import sys
import sympy as sp
os.environ.setdefault("MPLCONFIGDIR", "/tmp/matplotlib-codex")
import matplotlib.pyplot as plt
from sympy import (
    symbols, Function, Eq, I, Matrix,
    limit, diff, integrate, series, summation, dsolve, idiff,
    sin, cos, tan, cot, sec, csc,
    asin, acos, atan, acot, asec, acsc, atan2,
    sinh, cosh, tanh, coth, sech, csch,
    asinh, acosh, atanh, acoth, asech, acsch,
    exp, log, sqrt, cbrt, Abs,
    sign, factorial, binomial,
    floor, ceiling, re, im, arg, conjugate,
    oo, pi, gamma, beta, S,
    simplify, factor, expand, fourier_series,
    fourier_transform, inverse_fourier_transform,
    laplace_transform, inverse_laplace_transform,
    sine_transform, inverse_sine_transform,
    cosine_transform, inverse_cosine_transform,
    DiracDelta, totient,
    rsolve,
    pprint
)
from sympy.calculus.util import continuous_domain, function_range

x, y, z, t, n, k, m, theta, eps, delta, lam = symbols('x y z t n k m theta eps delta lam')
f = Function('f')
a = Function('a')
S = Function('S')

ANALYSIS_GUIDES = {
    "sequence": [
        "1. 先猜极限：单调有界、夹逼、Stolz、递推不动点、等价无穷小。",
        "2. 再证明：epsilon-N、单调有界、Cauchy 准则、子列反证。",
        "3. 递推数列先看不动点，再证明有界和单调，最后取极限。",
    ],
    "limit_continuity": [
        "1. 单点极限先比较左右极限，多元极限先试路径。",
        "2. 等价无穷小、Taylor 展开、夹逼、洛必达只在条件满足时使用。",
        "3. 连续性检查 value、left limit、right limit；间断点再分类。",
    ],
    "derivative": [
        "1. 先写定义差商，再用求导法则。",
        "2. 中值定理题先确认闭区间连续、开区间可导。",
        "3. Taylor 题要明确展开点、阶数、余项形式和适用邻域。",
    ],
    "integral": [
        "1. 定积分先看奇偶性、周期性、换元、分部积分。",
        "2. 广义积分先找瑕点和无穷端，再分段判断。",
        "3. 含参积分要检查一致收敛、连续性、可交换极限/积分/导数条件。",
    ],
    "series": [
        "1. 数项级数先看一般项是否趋零。",
        "2. 正项级数用比较、比值、根值、积分、Cauchy 凝聚。",
        "3. 任意项级数分绝对收敛、条件收敛、交错级数和 Dirichlet/Abel。",
    ],
    "function_series": [
        "1. 先求逐点极限或逐点收敛域。",
        "2. 再用 sup 范数、Weierstrass M 判别、Dirichlet/Abel 判别做一致收敛。",
        "3. 逐项求极限/积分/求导前检查一致收敛或一致收敛的导数条件。",
    ],
    "transform": [
        "1. Fourier 级数用于周期函数，先算 a0、an、bn 或复系数。",
        "2. Fourier 变换用于非周期函数，先确认可积性、衰减和所采用的规范。",
        "3. Laplace 变换常用于常微分方程、卷积和初值问题，注意收敛半平面。",
        "4. 逆变换题先做部分分式、平移、伸缩、卷积定理，再查基本表。",
    ],
    "multivariable": [
        "1. 多元极限先沿直线、坐标轴、曲线路径试探。",
        "2. 可偏导不推出连续，可微推出连续且偏导存在。",
        "3. 极值先解梯度为零，再用 Hessian；约束极值用 Lagrange 乘子。",
    ],
}

def _safe_limit(expr, var, point, direction="+-"):
    try:
        return limit(expr, var, point, dir=direction)
    except TypeError:
        return limit(expr, var, point)

def StudyGuide(topic="all"):
    if topic == "all":
        return ANALYSIS_GUIDES
    return ANALYSIS_GUIDES.get(str(topic), "未知主题，可用: " + ", ".join(ANALYSIS_GUIDES))

def SequenceLimit(expr, var=n):
    return {"limit": limit(expr, var, oo), "zero_term_check": limit(expr, var, oo)}

def EpsilonNHint(expr, target, var=n):
    diff_expr = simplify(Abs(expr - target))
    return {
        "absolute_error": diff_expr,
        "limit_of_error": limit(diff_expr, var, oo),
        "template": "要证明极限为 A，需对任意 eps>0 找 N，使 n>N 时 |a_n-A|<eps。",
    }

def EpsilonDeltaHint(expr, target, var=x, point=0):
    diff_expr = simplify(Abs(expr - target))
    return {
        "absolute_error": diff_expr,
        "limit_of_error": limit(diff_expr, var, point),
        "template": "要证明 lim_{x->a} f(x)=A，需对任意 eps>0 找 delta，使 0<|x-a|<delta 时 |f(x)-A|<eps。",
    }

def SqueezeLimitReport(lower, middle, upper, var=x, point=0):
    lower_limit = limit(lower, var, point)
    upper_limit = limit(upper, var, point)
    return {
        "lower_limit": lower_limit,
        "upper_limit": upper_limit,
        "conclusion": lower_limit if lower_limit == upper_limit else "上下界极限不同，不能直接夹逼",
        "condition": "需先证明 lower <= middle <= upper 在去心邻域成立。",
    }

def EquivalentInfinitesimalReport(expr, equivalent, var=x, point=0):
    ratio = simplify(expr / equivalent)
    return {"ratio": ratio, "ratio_limit": limit(ratio, var, point), "equivalent_if_limit_is_one": limit(ratio, var, point) == 1}

def RecursiveFixedPoints(update_expr, var=x):
    return {
        "fixed_point_equation": Eq(var, update_expr),
        "fixed_points": sp.solve(Eq(var, update_expr), var),
        "derivative_for_stability": diff(update_expr, var),
    }

def ContinuityCheck(expr, var=x, point=0):
    left = limit(expr, var, point, dir="-")
    right = limit(expr, var, point, dir="+")
    value = expr.subs(var, point)
    return {"left_limit": left, "right_limit": right, "value": value, "continuous": simplify(left - value) == 0 and simplify(right - value) == 0}

def DiscontinuityType(expr, var=x, point=0):
    check = ContinuityCheck(expr, var, point)
    if check["continuous"]:
        kind = "连续"
    elif check["left_limit"] == check["right_limit"] and check["left_limit"].is_finite:
        kind = "可去间断"
    elif check["left_limit"].is_finite and check["right_limit"].is_finite:
        kind = "跳跃间断"
    else:
        kind = "无穷间断或振荡间断"
    return {**check, "type": kind}

def DomainContinuity(expr, var=x):
    return continuous_domain(expr, var, sp.S.Reals)

def RangeOnInterval(expr, var=x, start=-oo, end=oo):
    return function_range(expr, var, sp.Interval(start, end))

def UniformContinuityHint(expr, var=x, start=0, end=1):
    derivative = diff(expr, var)
    return {
        "domain": sp.Interval(start, end),
        "derivative": derivative,
        "derivative_range_hint": function_range(derivative, var, sp.Interval(start, end)) if start != -oo and end != oo else "无界区间需另判",
        "theorem": "闭区间连续函数一致连续；若导数有界，可用 Lipschitz 证明一致连续。",
    }

def LHopitalCheck(numerator, denominator, var=x, point=0):
    original = limit(numerator / denominator, var, point)
    derivative_quotient = simplify(diff(numerator, var) / diff(denominator, var))
    return {
        "original_limit": original,
        "num_limit": limit(numerator, var, point),
        "den_limit": limit(denominator, var, point),
        "derivative_quotient": derivative_quotient,
        "derivative_quotient_limit": limit(derivative_quotient, var, point),
        "note": "洛必达需先确认 0/0 或 oo/oo 及邻域可导、分母导数不为零。",
    }

def TaylorPolynomial(expr, var=x, point=0, order=5):
    return series(expr, var, point, order + 1).removeO()

def TaylorReport(expr, var=x, point=0, order=5):
    expansion = series(expr, var, point, order + 1)
    return {
        "polynomial": expansion.removeO(),
        "with_big_O": expansion,
        "derivatives_at_point": [diff(expr, var, i).subs(var, point) for i in range(order + 1)],
    }

def MeanValueReport(expr, var=x, start=0, end=1):
    slope = simplify((expr.subs(var, end) - expr.subs(var, start)) / (end - start))
    c = symbols("c")
    candidates = sp.solve(Eq(diff(expr, var).subs(var, c), slope), c)
    return {"secant_slope": slope, "candidates": candidates, "condition": "闭区间连续、开区间可导时可用 Lagrange 中值定理。"}

def MonotonicityReport(expr, var=x):
    derivative = diff(expr, var)
    critical = sp.solve(Eq(derivative, 0), var)
    return {"derivative": derivative, "critical_points": critical, "increasing_condition": derivative > 0, "decreasing_condition": derivative < 0}

def ConvexityReport(expr, var=x):
    second = diff(expr, var, 2)
    inflection_candidates = sp.solve(Eq(second, 0), var)
    return {"second_derivative": second, "inflection_candidates": inflection_candidates, "convex_condition": second > 0, "concave_condition": second < 0}

def IntegralByParts(u, dv, var=x):
    v = integrate(dv, var)
    return {"u": u, "dv": dv, "v": v, "formula_result": simplify(u * v - integrate(v * diff(u, var), var))}

def RiemannSumLimit(expr, var=x, index_var=n, start=0, end=1, sample="right"):
    i = symbols("i", integer=True, positive=True)
    width = (end - start) / index_var
    if sample == "left":
        sample_point = start + (i - 1) * width
    elif sample == "mid":
        sample_point = start + (i - sp.Rational(1, 2)) * width
    else:
        sample_point = start + i * width
    finite_sum = summation(expr.subs(var, sample_point) * width, (i, 1, index_var))
    return {"finite_sum": simplify(finite_sum), "limit": limit(finite_sum, index_var, oo), "integral": integrate(expr, (var, start, end))}

def ImproperIntegralReport(expr, var=x, start=0, end=oo):
    integral_value = integrate(expr, (var, start, end))
    abs_value = integrate(Abs(expr), (var, start, end))
    return {
        "integral": integral_value,
        "absolute_integral": abs_value,
        "absolute_convergence_hint": abs_value.is_finite,
        "note": "若区间内有瑕点，需要手动分段分别调用。",
    }

def IntegralConvergenceTest(expr, var=x, start=1, end=oo, compare=None):
    value = integrate(expr, (var, start, end))
    report = {"integral": value, "absolute_integral": integrate(Abs(expr), (var, start, end))}
    if compare is not None:
        report["comparison_ratio_limit"] = limit(expr / compare, var, end)
        report["comparison_integral"] = integrate(compare, (var, start, end))
    return report

def ParamIntegralReport(expr, var=x, start=0, end=1, param=t):
    F = integrate(expr, (var, start, end))
    return {
        "integral_function": F,
        "differentiate_after_integral": diff(F, param),
        "integral_of_param_derivative": integrate(diff(expr, param), (var, start, end)),
        "note": "交换求导与积分前，需检查连续性、一致收敛或支配条件。",
    }

def SeriesTestReport(term, var=n):
    term_limit = limit(term, var, oo)
    ratio = simplify(Abs(term.subs(var, var + 1) / term))
    root = Abs(term) ** (1 / var)
    return {
        "term_limit": term_limit,
        "necessary_condition": term_limit == 0,
        "ratio_expression": ratio,
        "ratio_limit": limit(ratio, var, oo),
        "root_expression": root,
        "root_limit": limit(root, var, oo),
        "symbolic_sum": summation(term, (var, 1, oo)),
    }

def ComparisonSeriesTest(term, comparison, var=n):
    return {
        "term_limit": limit(term, var, oo),
        "comparison_sum": summation(comparison, (var, 1, oo)),
        "ratio_limit": limit(term / comparison, var, oo),
        "note": "极限比较法：ratio 极限为正有限数时同敛散。",
    }

def IntegralSeriesTest(term, var=n, start=1):
    continuous_var = x
    expr = term.subs(var, continuous_var)
    return {
        "integral_test_value": integrate(expr, (continuous_var, start, oo)),
        "note": "积分判别法需正项、连续、最终单调递减。",
    }

def DirichletAbelHint(term_a, term_b, var=n):
    return {
        "partial_sum_of_a": summation(term_a, (var, 1, n)),
        "b_limit": limit(term_b, var, oo),
        "b_next_minus_b": simplify(term_b.subs(var, var + 1) - term_b),
        "dirichlet": "若 a_n 部分和有界，b_n 单调趋零，则 sum a_n b_n 收敛。",
        "abel": "若 sum a_n 收敛，b_n 单调有界，则 sum a_n b_n 收敛。",
    }

def AlternatingSeriesReport(positive_term, var=n):
    return {
        "term_limit": limit(positive_term, var, oo),
        "next_minus_current": simplify(positive_term.subs(var, var + 1) - positive_term),
        "series": summation((-1) ** (var - 1) * positive_term, (var, 1, oo)),
        "note": "Leibniz 判别还需正项最终单调递减且趋于 0。",
    }

def CauchyCondensation(term, var=n):
    condensed = simplify(2 ** var * term.subs(var, 2 ** var))
    return {"condensed_term": condensed, "condensed_series": summation(condensed, (var, 1, oo)), "condition": "适用于正项单调递减数列。"}

def PowerSeriesRadius(coefficient, var=n, series_var=x, center=0):
    ratio = simplify(Abs(coefficient / coefficient.subs(var, var + 1)))
    radius = limit(ratio, var, oo)
    return {"radius": radius, "center": center, "ratio_for_radius": ratio, "endpoint_note": "端点需代回原级数分别判别。"}

def PowerSeriesInterval(coefficient, var=n, series_var=x, center=0):
    radius_info = PowerSeriesRadius(coefficient, var, series_var, center)
    radius = radius_info["radius"]
    return {
        **radius_info,
        "open_interval": sp.Interval.open(center - radius, center + radius) if radius.is_number else "半径为符号表达式，需人工整理",
        "left_endpoint_series": coefficient * (center - radius - center) ** var if radius.is_number else None,
        "right_endpoint_series": coefficient * (center + radius - center) ** var if radius.is_number else None,
    }

def PointwiseLimit(expr, var=n):
    return limit(expr, var, oo)

def UniformConvergenceHint(expr, limit_expr, index_var=n, domain_var=x):
    diff_expr = simplify(Abs(expr - limit_expr))
    return {
        "pointwise_error": diff_expr,
        "pointwise_error_limit": limit(diff_expr, index_var, oo),
        "sup_norm_task": f"在给定区间上求 sup {diff_expr}，若其随 {index_var}->oo 趋零，则一致收敛。",
    }

def WeierstrassMTest(bound, var=n, start=1):
    return {"majorant_series": summation(bound, (var, start, oo)), "note": "若 |f_n(x)|<=M_n 且 sum M_n 收敛，则函数项级数一致收敛。"}

def TermwiseDifferentiationCheck(fn, var=x, index_var=n):
    return {
        "function_term": fn,
        "derivative_term": diff(fn, var),
        "need": "若某点级数收敛且导数项级数一致收敛，则可逐项求导。",
    }

def MultivarLimitPaths(expr, varx=x, vary=y, pointx=0, pointy=0):
    shifted_x = varx
    shifted_y = vary
    return {
        "x_axis": limit(expr.subs(vary, pointy), varx, pointx),
        "y_axis": limit(expr.subs(varx, pointx), vary, pointy),
        "line_y_equals_mx": limit(expr.subs(vary, pointy + m * (varx - pointx)), varx, pointx),
        "parabola_y_equals_x2": limit(expr.subs(vary, pointy + (varx - pointx) ** 2), varx, pointx),
        "note": "若不同路径极限不同，则多元极限不存在；相同仍需证明。",
    }

def Gradient(expr, *vars_):
    vars_ = vars_ or (x, y)
    return Matrix([diff(expr, v) for v in vars_])

def HessianMatrix(expr, *vars_):
    vars_ = vars_ or (x, y)
    return sp.hessian(expr, vars_)

def CriticalPointReport(expr, *vars_):
    vars_ = vars_ or (x, y)
    gradient = [diff(expr, v) for v in vars_]
    points = sp.solve(gradient, vars_, dict=True)
    hess = sp.hessian(expr, vars_)
    classifications = []
    if len(vars_) == 2:
        D = simplify(hess.det())
        fxx = hess[0, 0]
        for point in points:
            Dv = simplify(D.subs(point))
            fxxv = simplify(fxx.subs(point))
            if Dv.is_positive and fxxv.is_positive:
                kind = "极小值"
            elif Dv.is_positive and fxxv.is_negative:
                kind = "极大值"
            elif Dv.is_negative:
                kind = "鞍点"
            else:
                kind = "二阶判别失效"
            classifications.append({"point": point, "D": Dv, "f_xx": fxxv, "type": kind})
    return {"gradient": gradient, "critical_points": points, "hessian": hess, "classifications": classifications}

def DirectionalDerivative(expr, direction, *vars_):
    vars_ = vars_ or (x, y)
    vec = Matrix(direction)
    unit = vec / sp.sqrt((vec.T * vec)[0])
    grad = Gradient(expr, *vars_)
    return simplify((grad.T * unit)[0])

def LagrangeMultiplier(objective, constraint, *vars_):
    vars_ = vars_ or (x, y)
    lambda_symbol = lam
    equations = [diff(objective, v) - lambda_symbol * diff(constraint, v) for v in vars_] + [constraint]
    return {"equations": equations, "solutions": sp.solve(equations, (*vars_, lambda_symbol), dict=True)}

def EuclideanDistance(point_a, point_b):
    a_vec = Matrix(point_a)
    b_vec = Matrix(point_b)
    diff_vec = a_vec - b_vec
    return {"difference": diff_vec, "distance": simplify(sp.sqrt((diff_vec.T * diff_vec)[0]))}

def NeighborhoodReport(center, radius):
    return {"center": center, "radius": radius, "description": "邻域 B(a,r)={x: ||x-a||<r}；去心邻域去掉中心点。"}

def MultivarContinuityAt(expr, varx=x, vary=y, pointx=0, pointy=0, value=None):
    path_report = MultivarLimitPaths(expr, varx, vary, pointx, pointy)
    iterated_xy = limit(limit(expr, varx, pointx), vary, pointy)
    iterated_yx = limit(limit(expr, vary, pointy), varx, pointx)
    actual_value = value if value is not None else expr.subs({varx: pointx, vary: pointy})
    likely_limit = path_report["x_axis"] if path_report["x_axis"] == path_report["y_axis"] == path_report["parabola_y_equals_x2"] and not path_report["line_y_equals_mx"].has(m) else "路径检验未能确认"
    return {
        "path_report": path_report,
        "iterated_limit_x_then_y": iterated_xy,
        "iterated_limit_y_then_x": iterated_yx,
        "value_at_point": actual_value,
        "continuous_if_limit_equals_value": likely_limit == actual_value,
        "note": "路径结果不同则不连续；路径结果相同仍需用夹逼、极坐标或估计证明。",
    }

def PatchValueForContinuity(expr, varx=x, vary=y, pointx=0, pointy=0):
    path_report = MultivarLimitPaths(expr, varx, vary, pointx, pointy)
    iterated_xy = limit(limit(expr, varx, pointx), vary, pointy)
    iterated_yx = limit(limit(expr, vary, pointy), varx, pointx)
    candidate = iterated_xy if iterated_xy == iterated_yx else "累次极限不同，不能补成连续"
    return {"candidate_value": candidate, "path_report": path_report, "definition": f"若极限存在，应定义 f({pointx},{pointy}) = 极限值。"}

def PartialDerivativeReport(expr, varx=x, vary=y, pointx=None, pointy=None):
    fx = diff(expr, varx)
    fy = diff(expr, vary)
    result = {"f_x": fx, "f_y": fy, "f_xx": diff(expr, varx, 2), "f_xy": diff(fx, vary), "f_yx": diff(fy, varx), "f_yy": diff(expr, vary, 2)}
    if pointx is not None and pointy is not None:
        subs = {varx: pointx, vary: pointy}
        result["at_point"] = {key: simplify(value.subs(subs)) for key, value in result.items() if key.startswith("f_")}
    return result

def DifferentiabilityReport(expr, varx=x, vary=y, pointx=0, pointy=0, value=None):
    f0 = value if value is not None else expr.subs({varx: pointx, vary: pointy})
    fx = diff(expr, varx)
    fy = diff(expr, vary)
    fx0 = fx.subs({varx: pointx, vary: pointy})
    fy0 = fy.subs({varx: pointx, vary: pointy})
    h, k_var = symbols("h k")
    remainder = simplify(expr.subs({varx: pointx + h, vary: pointy + k_var}) - f0 - fx0 * h - fy0 * k_var)
    radial_ratio = simplify(remainder / sp.sqrt(h ** 2 + k_var ** 2))
    return {
        "value": f0,
        "partial_x_at_point": fx0,
        "partial_y_at_point": fy0,
        "linear_part": fx0 * (varx - pointx) + fy0 * (vary - pointy),
        "remainder": remainder,
        "remainder_over_radius": radial_ratio,
        "path_test_h_equals_k": limit(radial_ratio.subs(k_var, h), h, 0),
        "note": "若余项除以 sqrt(h^2+k^2) 趋于 0，则可微。偏导存在不保证可微。",
    }

def ChainRuleReport(expr, substitutions, parameter=t):
    composed = simplify(expr.subs(substitutions))
    direct = diff(composed, parameter)
    rule_terms = []
    for old_var, new_expr in substitutions.items():
        rule_terms.append(diff(expr, old_var).subs(substitutions) * diff(new_expr, parameter))
    return {"composed_function": composed, "direct_derivative": direct, "chain_rule_sum": simplify(sum(rule_terms)), "terms": rule_terms}

def JacobianMatrix(functions, variables):
    return Matrix([[diff(func, var) for var in variables] for func in functions])

def JacobianReport(functions, variables):
    J = JacobianMatrix(functions, variables)
    return {"jacobian_matrix": J, "determinant": simplify(J.det()) if J.rows == J.cols else None, "rank": J.rank()}

def ImplicitPartialReport(equation_expr, dep_var=z, indep_vars=(x, y)):
    denominator = diff(equation_expr, dep_var)
    partials = {}
    for var in indep_vars:
        partials[f"d{dep_var}/d{var}"] = simplify(-diff(equation_expr, var) / denominator)
    return {"equation": equation_expr, "denominator_F_dep": denominator, "partials": partials, "condition": f"需 F_{dep_var} != 0 才能局部解出 {dep_var}。"}

def ImplicitFunctionTheoremCheck(equation_expr, dep_var=z, point=None):
    derivative = diff(equation_expr, dep_var)
    value = derivative.subs(point) if point else derivative
    equation_value = equation_expr.subs(point) if point else equation_expr
    return {"F_at_point": equation_value, f"F_{dep_var}_at_point": value, "can_solve_locally_if": value != 0 and equation_value == 0}

def InverseFunctionTheoremCheck(functions, variables, point=None):
    J = JacobianMatrix(functions, variables)
    detJ = simplify(J.det()) if J.rows == J.cols else None
    det_at_point = simplify(detJ.subs(point)) if point and detJ is not None else detJ
    return {"jacobian": J, "determinant": detJ, "determinant_at_point": det_at_point, "locally_invertible_if_nonzero": det_at_point != 0}

def TangentPlaneGraph(expr, varx=x, vary=y, pointx=0, pointy=0):
    z0 = expr.subs({varx: pointx, vary: pointy})
    fx0 = diff(expr, varx).subs({varx: pointx, vary: pointy})
    fy0 = diff(expr, vary).subs({varx: pointx, vary: pointy})
    plane = simplify(z0 + fx0 * (varx - pointx) + fy0 * (vary - pointy))
    return {"point": (pointx, pointy, z0), "tangent_plane_z": plane, "normal_vector": Matrix([-fx0, -fy0, 1])}

def TangentPlaneImplicit(surface_expr, point, variables=(x, y, z)):
    gradient = Matrix([diff(surface_expr, var).subs(point) for var in variables])
    plane = simplify(sum(gradient[i] * (variables[i] - point[variables[i]]) for i in range(len(variables))))
    return {"gradient_normal": gradient, "tangent_plane_equation_left": plane, "equation": Eq(plane, 0)}

def NormalLineImplicit(surface_expr, point, variables=(x, y, z), parameter=t):
    normal = Matrix([diff(surface_expr, var).subs(point) for var in variables])
    line = [point[variables[i]] + parameter * normal[i] for i in range(len(variables))]
    return {"normal_vector": normal, "normal_line": line}

def DoubleIntegral(expr, varx=x, x_start=0, x_end=1, vary=y, y_start=0, y_end=1):
    return integrate(integrate(expr, (vary, y_start, y_end)), (varx, x_start, x_end))

def TripleIntegral(expr, varx=x, x_start=0, x_end=1, vary=y, y_start=0, y_end=1, varz=z, z_start=0, z_end=1):
    return integrate(integrate(integrate(expr, (varz, z_start, z_end)), (vary, y_start, y_end)), (varx, x_start, x_end))

def ChangeVariablesJacobian(old_vars, new_exprs, new_vars):
    J = JacobianMatrix(new_exprs, new_vars)
    return {"jacobian_matrix": J, "jacobian_determinant": simplify(J.det()), "absolute_jacobian": Abs(simplify(J.det())), "old_vars": old_vars, "new_exprs": new_exprs}

def LineIntegralScalar(expr, param_map, parameter=t, start=0, end=1):
    r = Matrix(param_map)
    speed = simplify(sp.sqrt((diff(r, parameter).T * diff(r, parameter))[0]))
    substituted = expr.subs({x: r[0], y: r[1], z: r[2] if len(r) > 2 else z})
    return {"speed": speed, "integrand": simplify(substituted * speed), "integral": integrate(substituted * speed, (parameter, start, end))}

def LineIntegralVector(field, param_map, parameter=t, start=0, end=1):
    r = Matrix(param_map)
    dr = diff(r, parameter)
    subs = {x: r[0], y: r[1], z: r[2] if len(r) > 2 else z}
    F = Matrix(field)
    integrand = simplify((F.subs(subs).T * dr)[0])
    return {"dr": dr, "integrand": integrand, "integral": integrate(integrand, (parameter, start, end))}

def Divergence(field, variables=(x, y, z)):
    F = Matrix(field)
    return simplify(sum(diff(F[i], variables[i]) for i in range(len(variables))))

def Curl(field, variables=(x, y, z)):
    F = Matrix(field)
    return Matrix([
        diff(F[2], variables[1]) - diff(F[1], variables[2]),
        diff(F[0], variables[2]) - diff(F[2], variables[0]),
        diff(F[1], variables[0]) - diff(F[0], variables[1]),
    ])

def GreenTheoremReport(P_expr, Q_expr, region_note="D"):
    return {"curl_scalar": simplify(diff(Q_expr, x) - diff(P_expr, y)), "formula": f"∮ P dx + Q dy = ∬_{{{region_note}}} (Q_x - P_y) dA", "orientation": "边界取正向。"}

def SurfaceIntegralGraphScalar(expr, graph_z, varx=x, x_start=0, x_end=1, vary=y, y_start=0, y_end=1):
    zx = diff(graph_z, varx)
    zy = diff(graph_z, vary)
    factor = simplify(sp.sqrt(1 + zx ** 2 + zy ** 2))
    substituted = sp.sympify(expr).subs(z, graph_z)
    return {"surface_factor": factor, "integrand": simplify(substituted * factor), "integral": integrate(integrate(substituted * factor, (vary, y_start, y_end)), (varx, x_start, x_end))}

def GaussTheoremReport(field):
    return {"divergence": Divergence(field), "formula": "∯_{∂V} F·n dS = ∭_V div(F) dV", "orientation": "外法向。"}

def StokesTheoremReport(field):
    return {"curl": Curl(field), "formula": "∮_{∂S} F·dr = ∬_S curl(F)·n dS", "orientation": "右手定则。"}

def LaplaceSolveODE(eq, func, var=t, s=lam):
    solution = dsolve(eq, func)
    return {
        "dsolve_solution": solution,
        "laplace_workflow": "对方程两边作 Laplace 变换，代入初值，解 F(s)，再逆变换。",
        "note": "自动完整 Laplace 初值推导依赖方程形式；这里给出符号解和流程。",
    }

def FourierCoefficientReport(expr, var=x, start=-pi, end=pi, order=5):
    period = end - start
    L = period / 2
    a0 = simplify((1 / L) * integrate(expr, (var, start, end)))
    coeffs = []
    for idx in range(1, order + 1):
        an = simplify((1 / L) * integrate(expr * cos(idx * pi * (var - start - L) / L), (var, start, end)))
        bn = simplify((1 / L) * integrate(expr * sin(idx * pi * (var - start - L) / L), (var, start, end)))
        coeffs.append({"n": idx, "a_n": an, "b_n": bn})
    return {"a0": a0, "coefficients": coeffs, "series_object": fourier_series(expr, (var, start, end)).truncate(order)}

def FourierTransformReport(expr, var=x, freq=k):
    return {
        "transform": fourier_transform(expr, var, freq),
        "inverse_check": inverse_fourier_transform(fourier_transform(expr, var, freq), freq, var),
        "note": "SymPy 使用其默认 Fourier 变换规范；教材规范不同会差 2*pi 因子。",
    }

def InverseFourierTransformReport(expr, freq=k, var=x):
    return {"inverse_transform": inverse_fourier_transform(expr, freq, var)}

def LaplaceTransformReport(expr, var=t, s=lam):
    transformed = laplace_transform(expr, var, s)
    return {
        "transform": transformed[0],
        "convergence_abscissa": transformed[1],
        "conditions": transformed[2],
        "inverse_check": inverse_laplace_transform(transformed[0], s, var),
    }

def InverseLaplaceTransformReport(expr, s=lam, var=t):
    return {"inverse_laplace": inverse_laplace_transform(expr, s, var)}

def LaplaceDerivativeRule(expr, var=t, s=lam):
    F = laplace_transform(expr, var, s)[0]
    derivative_transform = laplace_transform(diff(expr, var), var, s)[0]
    rule_side = simplify(s * F - expr.subs(var, 0))
    return {"L_f": F, "L_f_derivative": derivative_transform, "sF_minus_f0": rule_side, "matches": simplify(derivative_transform - rule_side) == 0}

def ConvolutionIntegral(f_expr, g_expr, var=t):
    tau = symbols("tau", positive=True)
    return integrate(f_expr.subs(var, tau) * g_expr.subs(var, var - tau), (tau, 0, var))

def LaplaceConvolutionReport(f_expr, g_expr, var=t, s=lam):
    conv = ConvolutionIntegral(f_expr, g_expr, var)
    return {
        "convolution": conv,
        "L_f": laplace_transform(f_expr, var, s)[0],
        "L_g": laplace_transform(g_expr, var, s)[0],
        "L_convolution": laplace_transform(conv, var, s)[0],
        "product": simplify(laplace_transform(f_expr, var, s)[0] * laplace_transform(g_expr, var, s)[0]),
    }

def SineTransformReport(expr, var=x, freq=k):
    F = sine_transform(expr, var, freq)
    return {"sine_transform": F, "inverse_check": inverse_sine_transform(F, freq, var)}

def CosineTransformReport(expr, var=x, freq=k):
    F = cosine_transform(expr, var, freq)
    return {"cosine_transform": F, "inverse_check": inverse_cosine_transform(F, freq, var)}

def TransformTable(name="laplace"):
    tables = {
        "laplace": [
            "L{1}=1/s",
            "L{t^n}=n!/s^(n+1)",
            "L{exp(a t)}=1/(s-a)",
            "L{sin(a t)}=a/(s^2+a^2)",
            "L{cos(a t)}=s/(s^2+a^2)",
            "L{f*g}=L{f}L{g}",
        ],
        "fourier": [
            "Fourier 变换规范依教材而定，先确认 2*pi 因子。",
            "平移、调制、伸缩、卷积、Parseval 是常见考点。",
            "偶函数常转余弦变换，奇函数常转正弦变换。",
        ],
    }
    return tables.get(str(name), tables)

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
    "symbols": symbols,
    # 常用符号变量
    "x": x, "y": y, "z": z, "t": t, "n": n, "k": k, "m": m,
    "theta": theta, "eps": eps, "delta": delta, "lam": lam,
    "f": f,
    "a": a,
    "S": S,
    "Eq": Eq,
    "Matrix": Matrix,
    "Abs": Abs,
    # 绘图命令（返回参数元组，由后续代码处理）
    "Plot": lambda *args: args,
    "PlotImplicit": lambda *args: args,
    "PlotParametric": lambda *args: args,
    "PlotPolar": lambda *args: args,
    "Plot3D": lambda *args: args
}

analysis_commands = {
    "StudyGuide": StudyGuide,
    "SequenceLimit": SequenceLimit,
    "EpsilonNHint": EpsilonNHint,
    "EpsilonDeltaHint": EpsilonDeltaHint,
    "SqueezeLimitReport": SqueezeLimitReport,
    "EquivalentInfinitesimalReport": EquivalentInfinitesimalReport,
    "RecursiveFixedPoints": RecursiveFixedPoints,
    "ContinuityCheck": ContinuityCheck,
    "DiscontinuityType": DiscontinuityType,
    "DomainContinuity": DomainContinuity,
    "RangeOnInterval": RangeOnInterval,
    "UniformContinuityHint": UniformContinuityHint,
    "LHopitalCheck": LHopitalCheck,
    "TaylorPolynomial": TaylorPolynomial,
    "TaylorReport": TaylorReport,
    "MeanValueReport": MeanValueReport,
    "MonotonicityReport": MonotonicityReport,
    "ConvexityReport": ConvexityReport,
    "IntegralByParts": IntegralByParts,
    "RiemannSumLimit": RiemannSumLimit,
    "ImproperIntegralReport": ImproperIntegralReport,
    "IntegralConvergenceTest": IntegralConvergenceTest,
    "ParamIntegralReport": ParamIntegralReport,
    "SeriesTestReport": SeriesTestReport,
    "ComparisonSeriesTest": ComparisonSeriesTest,
    "IntegralSeriesTest": IntegralSeriesTest,
    "DirichletAbelHint": DirichletAbelHint,
    "AlternatingSeriesReport": AlternatingSeriesReport,
    "CauchyCondensation": CauchyCondensation,
    "PowerSeriesRadius": PowerSeriesRadius,
    "PowerSeriesInterval": PowerSeriesInterval,
    "PointwiseLimit": PointwiseLimit,
    "UniformConvergenceHint": UniformConvergenceHint,
    "WeierstrassMTest": WeierstrassMTest,
    "TermwiseDifferentiationCheck": TermwiseDifferentiationCheck,
    "MultivarLimitPaths": MultivarLimitPaths,
    "Gradient": Gradient,
    "HessianMatrix": HessianMatrix,
    "CriticalPointReport": CriticalPointReport,
    "DirectionalDerivative": DirectionalDerivative,
    "LagrangeMultiplier": LagrangeMultiplier,
    "EuclideanDistance": EuclideanDistance,
    "NeighborhoodReport": NeighborhoodReport,
    "MultivarContinuityAt": MultivarContinuityAt,
    "PatchValueForContinuity": PatchValueForContinuity,
    "PartialDerivativeReport": PartialDerivativeReport,
    "DifferentiabilityReport": DifferentiabilityReport,
    "ChainRuleReport": ChainRuleReport,
    "JacobianMatrix": JacobianMatrix,
    "JacobianReport": JacobianReport,
    "ImplicitPartialReport": ImplicitPartialReport,
    "ImplicitFunctionTheoremCheck": ImplicitFunctionTheoremCheck,
    "InverseFunctionTheoremCheck": InverseFunctionTheoremCheck,
    "TangentPlaneGraph": TangentPlaneGraph,
    "TangentPlaneImplicit": TangentPlaneImplicit,
    "NormalLineImplicit": NormalLineImplicit,
    "DoubleIntegral": DoubleIntegral,
    "TripleIntegral": TripleIntegral,
    "ChangeVariablesJacobian": ChangeVariablesJacobian,
    "LineIntegralScalar": LineIntegralScalar,
    "LineIntegralVector": LineIntegralVector,
    "Divergence": Divergence,
    "Curl": Curl,
    "GreenTheoremReport": GreenTheoremReport,
    "SurfaceIntegralGraphScalar": SurfaceIntegralGraphScalar,
    "GaussTheoremReport": GaussTheoremReport,
    "StokesTheoremReport": StokesTheoremReport,
    "FourierCoefficientReport": FourierCoefficientReport,
    "FourierTransformReport": FourierTransformReport,
    "InverseFourierTransformReport": InverseFourierTransformReport,
    "LaplaceTransformReport": LaplaceTransformReport,
    "InverseLaplaceTransformReport": InverseLaplaceTransformReport,
    "LaplaceDerivativeRule": LaplaceDerivativeRule,
    "ConvolutionIntegral": ConvolutionIntegral,
    "LaplaceConvolutionReport": LaplaceConvolutionReport,
    "LaplaceSolveODE": LaplaceSolveODE,
    "SineTransformReport": SineTransformReport,
    "CosineTransformReport": CosineTransformReport,
    "TransformTable": TransformTable,
}

def eval_env():
    return {**math_functions, **analysis_commands}

def evaluate_cas_command(line: str):
    line = line.strip()
    if not line or line.startswith('#'):
        return

    print(f"\n>>> {line}")

    try:
        command_name = line.split("(", 1)[0]
        if command_name in analysis_commands:
            expr = eval(line, {"__builtins__": {}}, eval_env())
            print("分析步骤/判别结果:"); pprint(expr)
            return

        if line.startswith('Limit('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "Limit": limit})
            print("极限结果:"); pprint(expr)

        elif line.startswith('Derivative('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "Derivative": diff})
            print("导数/偏导数结果:"); pprint(expr)

        elif line.startswith('ImplicitDerivative('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "ImplicitDerivative": lambda f, x, y: idiff(f, y, x)})
            print("隐函数微分结果:"); pprint(expr)

        elif line.startswith('Integral('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "Integral": integrate})
            print("积分结果:"); pprint(expr)

        elif line.startswith('Series('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "Series": series})
            print("级数展开:"); pprint(expr)

        elif line.startswith('Sum('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "Sum": summation})
            print("级数求和结果:"); pprint(expr)

        elif line.startswith('Solve('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "Solve": sp.solve, "Eq": Eq})
            print("方程解:"); pprint(expr)

        elif line.startswith('SolveODE('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "SolveODE": dsolve, "Eq": Eq})
            print("微分方程解:"); pprint(expr)

        elif line.startswith('Simplify('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "Simplify": simplify})
            print("化简结果:"); pprint(expr)
        elif line.startswith('Factor('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "Factor": factor})
            print("因式分解:"); pprint(expr)
        elif line.startswith('Expand('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "Expand": expand})
            print("展开结果:"); pprint(expr)

        elif line.startswith('Gamma('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "Gamma": gamma})
            print("Gamma 函数:"); pprint(expr)
        elif line.startswith('Beta('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "Beta": beta})
            print("Beta 函数:"); pprint(expr)

        elif line.startswith('FourierSeries('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "FourierSeries": lambda f, x, a, b, n: fourier_series(f, (x, a, b)).truncate(n)})
            print("傅里叶级数:"); pprint(expr)

        elif line.startswith('FourierTransform('):
            # FourierTransform(f, x, k)
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "FourierTransform": fourier_transform})
            print("傅立叶变换:"); pprint(expr)

        elif line.startswith('InverseFourierTransform('):
            # InverseFourierTransform(F, k, x)
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "InverseFourierTransform": inverse_fourier_transform})
            print("逆傅立叶变换:"); pprint(expr)

        elif line.startswith('RecurrenceSolve('):
            # RecurrenceSolve(eq, func, init_dict)
            # 示例: RecurrenceSolve(a(n)-a(n-1)-a(n-2), a(n), {a(0):0, a(1):1})
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "RecurrenceSolve": rsolve, "Eq": Eq})
            print("数列通项:"); pprint(expr)

        elif line.startswith('LagrangeMultiplier('):
            expr = eval(line, {"__builtins__": {}}, eval_env())
            print("拉格朗日乘子法:"); pprint(expr)

        elif line.startswith('CriticalPoints('):
            expr = eval(line, {"__builtins__": {}}, {**math_functions, "CriticalPoints": lambda f, x, y: sp.solve([diff(f, x), diff(f, y)], [x, y])})
            print("临界点:"); pprint(expr)

        # ==================== 绘图功能 ====================
        elif line.startswith('Plot('):
            # Plot(f, x, a, b)
            try:
                args = eval(line, {"__builtins__": {}}, math_functions)
                if len(args) == 4:
                    f_expr, var, a, b = args
                    lam = sp.lambdify(var, f_expr, modules=['numpy'])
                    import numpy as np
                    xs = np.linspace(float(a), float(b), 400)
                    ys = lam(xs)
                    plt.figure()
                    plt.plot(xs, ys)
                    plt.title(f"Plot of {f_expr}")
                    plt.xlabel(str(var))
                    plt.ylabel(f"f({var})")
                    plt.grid(True)
                    plt.show()
                    print("已绘制函数图像")
                else:
                    print("Plot 语法: Plot(f, x, a, b)")
            except Exception as e:
                print(f"绘图失败: {e}")

        elif line.startswith('PlotImplicit('):
            # PlotImplicit(eq, x, y)
            try:
                args = eval(line, {"__builtins__": {}}, math_functions)
                if len(args) == 3:
                    eq, varx, vary = args
                    sp.plot_implicit(eq, (varx, -10, 10), (vary, -10, 10), title=f"Implicit: {eq}")
                    print("已绘制隐函数图像")
                else:
                    print("PlotImplicit 语法: PlotImplicit(eq, x, y)")
            except Exception as e:
                print(f"隐函数绘图失败: {e}")

        elif line.startswith('PlotParametric('):
            # PlotParametric(xt, yt, t, a, b)
            try:
                args = eval(line, {"__builtins__": {}}, math_functions)
                if len(args) == 5:
                    xt, yt, var, a, b = args
                    lam_x = sp.lambdify(var, xt, modules=['numpy'])
                    lam_y = sp.lambdify(var, yt, modules=['numpy'])
                    import numpy as np
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
                    plt.show()
                    print("已绘制参数方程图像")
                else:
                    print("PlotParametric 语法: PlotParametric(xt, yt, t, a, b)")
            except Exception as e:
                print(f"参数方程绘图失败: {e}")

        elif line.startswith('PlotPolar('):
            # PlotPolar(r, theta, a, b)
            try:
                args = eval(line, {"__builtins__": {}}, math_functions)
                if len(args) == 4:
                    r, theta, a, b = args
                    lam_r = sp.lambdify(theta, r, modules=['numpy'])
                    import numpy as np
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
                    plt.show()
                    print("已绘制极坐标图像")
                else:
                    print("PlotPolar 语法: PlotPolar(r, theta, a, b)")
            except Exception as e:
                print(f"极坐标绘图失败: {e}")

        elif line.startswith('Plot3D('):
            # Plot3D(f, x, a, b, y, c, d)
            try:
                args = eval(line, {"__builtins__": {}}, math_functions)
                if len(args) == 7:
                    f_expr, varx, xa, xb, vary, ya, yb = args
                    lam = sp.lambdify((varx, vary), f_expr, modules=['numpy'])
                    import numpy as np
                    from mpl_toolkits.mplot3d import Axes3D
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
                    plt.show()
                    print("已绘制三维曲面")
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

    print("数学分析学习辅助器 - GeoGebra CAS 风格符号推导 (v0.30)\n" + "="*60)
    for line in lines:
        evaluate_cas_command(line)
    print("\n" + "="*60 + "\n符号推导完成。")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python cas_parser.py <file.ma>")
        sys.exit(1)
    main(sys.argv[1])
