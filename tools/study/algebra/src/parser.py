#!/usr/bin/env python3
"""
高等代数学习辅助器 - 高级语法解析器 (v0.9)

支持：
- 数值/符号矩阵定义
- 矩阵元素：整数、分式、根式、多项式、符号
- 高级运算：rank, det, trace, inv, eigvals, eigvects, jordan_form,
  smith_normal_form, 等价/合同标准型（部分）、lambda矩阵等
- 从文本文件读取并执行

扩展接口：
- MatrixElement 抽象（未来可替换为自定义类）
- 易于添加新函数
"""

import re
import argparse
from typing import Any, Dict, Iterable
import sympy as sp
from sympy import (
    Matrix, symbols, sqrt, Rational, I, simplify, pprint,
    Poly, gcd, roots, solve, eye, zeros, factor, expand,
    ImmutableDenseMatrix
)
from sympy.matrices.normalforms import smith_normal_form

# 中英双语消息
MESSAGES = {
    'zh': {
        'define_matrix': '定义矩阵',
        'result': '结果',
        'print': '输出',
        'error_eval': '表达式求值失败',
        'error_matrix': '矩阵解析失败',
        'usage': '用法: python parser.py [--lang zh|en] <input.txt>'
    },
    'en': {
        'define_matrix': 'Define matrix',
        'result': 'Result',
        'print': 'Print',
        'error_eval': 'Expression evaluation failed',
        'error_matrix': 'Matrix parsing failed',
        'usage': 'Usage: python parser.py [--lang zh|en] <input.txt>'
    }
}

# 全局变量存储已定义的矩阵/表达式
variables: Dict[str, Any] = {}

DEFAULT_SYMBOLS = symbols('x y z t lam lambda_')
x, y, z, t, lam, lambda_ = DEFAULT_SYMBOLS

STUDY_GUIDES = {
    "polynomial": [
        "1. 明确数域与主变量，先化成 Poly 对象。",
        "2. 做除法、带余除法、最大公因式、互素判断。",
        "3. 需要根的信息时，先因式分解，再讨论重根 gcd(f, f')。",
        "4. 矩阵多项式题要区分普通多项式、特征多项式、最小多项式。",
    ],
    "matrix": [
        "1. 先看尺寸、秩、行列式、可逆性。",
        "2. 解方程组时比较 rank(A) 与 rank([A|b])。",
        "3. 做行变换保留行等价，做相似/合同题不能混用行变换结论。",
        "4. 需要步骤时用 rref、augmented_rref、inverse_by_augmented。",
        "5. 行列式题常用：按行/列展开、初等变换、分块、Vandermonde、特征多项式。",
    ],
    "linear_space": [
        "1. 检查向量组线性相关性：组矩阵并求秩或 RREF 主元。",
        "2. 求基：保留主元列；求坐标：解 Bc=v。",
        "3. 子空间题常转成齐次线性方程组、生成子空间或二者交。",
        "4. 换基题分清旧基坐标、标准坐标、新基坐标。",
    ],
    "linear_map": [
        "1. 确定定义域/值域基，写出每个基向量的像。",
        "2. 把像在值域基下展开，列成矩阵表示。",
        "3. 核对应 Ax=0，像对应列空间，秩-零度公式校验。",
        "4. 相似矩阵是同一线性变换在不同基下的矩阵。",
    ],
    "eigen": [
        "1. 算特征多项式 det(lambda I-A)。",
        "2. 对每个特征值求代数重数与几何重数。",
        "3. 几何重数之和等于维数时可对角化。",
        "4. 不可对角化时看 Jordan 块或各阶核维数。",
    ],
    "quadratic_form": [
        "1. 先把二次型写成对称矩阵 A。",
        "2. 判断正定可用顺序主子式或特征值。",
        "3. 合同标准形保惯性指数；相似标准形保特征值。",
        "4. 配方法、初等合同变换、正交变换要分清适用场景。",
    ],
    "exam_checklist": [
        "1. 先标注对象：数域、空间维数、矩阵尺寸、变量范围。",
        "2. 再标注等价关系：行等价、列等价、相似、合同、正交相似。",
        "3. 每一步写清保持不变量：秩、行列式、特征多项式、惯性指数等。",
        "4. 最后用维数公式、秩-零度、代入原式做校验。",
    ],
}

def _as_matrix(value: Any) -> Matrix:
    return value if isinstance(value, Matrix) else Matrix(value)

def _as_poly(expr: Any, var: Any = None) -> Poly:
    if isinstance(expr, Poly):
        return expr
    return Poly(expr, var or x)

def _matrix_poly_value(poly_expr: Any, mat: Matrix, var: Any = None) -> Matrix:
    mat = _as_matrix(mat)
    gen = var or x
    poly = _as_poly(poly_expr, gen)
    result = zeros(mat.rows)
    for coeff in poly.all_coeffs():
        result = result * mat + coeff * eye(mat.rows)
    return simplify(result)

def poly_add(p: Any, q: Any, var: Any = None) -> Poly:
    return _as_poly(p, var) + _as_poly(q, var)

def poly_mul(p: Any, q: Any, var: Any = None) -> Poly:
    return _as_poly(p, var) * _as_poly(q, var)

def poly_div(p: Any, q: Any, var: Any = None):
    quotient, remainder = _as_poly(p, var).div(_as_poly(q, var))
    return {"quotient": quotient, "remainder": remainder}

def poly_gcd(p: Any, q: Any, var: Any = None) -> Poly:
    return gcd(_as_poly(p, var), _as_poly(q, var))

def poly_roots(p: Any, var: Any = None):
    return roots(_as_poly(p, var))

def poly_factor(p: Any, var: Any = None):
    return factor(_as_poly(p, var).as_expr())

def poly_derivative(p: Any, var: Any = None) -> Poly:
    return _as_poly(p, var).diff()

def poly_squarefree(p: Any, var: Any = None):
    poly = _as_poly(p, var)
    return {"square_free_part": poly.exquo(gcd(poly, poly.diff())), "repeated_factor": gcd(poly, poly.diff())}

def poly_bezout(p: Any, q: Any, var: Any = None):
    s, t_coef, h = sp.gcdex(_as_poly(p, var), _as_poly(q, var))
    return {"s": s, "t": t_coef, "gcd": h, "check": expand(s.as_expr() * _as_poly(p, var).as_expr() + t_coef.as_expr() * _as_poly(q, var).as_expr())}

def eisenstein_check(poly_expr: Any, prime: int, var: Any = None):
    poly = _as_poly(poly_expr, var)
    coeffs = [int(c) if c.is_Integer else c for c in poly.all_coeffs()]
    leading = coeffs[0]
    rest = coeffs[1:]
    constant = coeffs[-1]
    return {
        "polynomial": poly,
        "prime": prime,
        "p_not_divide_leading": leading % prime != 0 if isinstance(leading, int) else "symbolic",
        "p_divides_nonleading": all(c % prime == 0 for c in rest) if all(isinstance(c, int) for c in rest) else "symbolic",
        "p_squared_not_divide_constant": constant % (prime ** 2) != 0 if isinstance(constant, int) else "symbolic",
        "irreducible_by_eisenstein_if_all_true": "检查前三项均为 True",
    }

def polynomial_ideal_generator(*polys: Any):
    generator = _as_poly(polys[0])
    for poly in polys[1:]:
        generator = gcd(generator, _as_poly(poly, generator.gens[0]))
    return {"generator_gcd": generator, "ideal": f"({generator.as_expr()})"}

def finite_difference_antiderivative(poly_expr: Any, var: Any = None):
    gen = var or x
    poly = _as_poly(poly_expr, gen)
    coeff_symbols = symbols(f'a0:{poly.degree() + 2}')
    G = sum(coeff_symbols[i] * gen ** i for i in range(poly.degree() + 2))
    equations = Poly(expand(G.subs(gen, gen + 1) - G - poly.as_expr()), gen).coeffs()
    solution = solve(equations, coeff_symbols, dict=True)
    if not solution:
        return {"error": "未能求出差分原函数"}
    sol = solution[0]
    if coeff_symbols[0] not in sol:
        sol[coeff_symbols[0]] = 0
    G_expr = simplify(G.subs(sol))
    return {"G": G_expr, "check_delta_G": simplify(G_expr.subs(gen, gen + 1) - G_expr), "sum_0_to_n_minus_1": G_expr}

def vandermonde_matrix(points, rows=None):
    rows = rows or len(points)
    return Matrix([[point ** power for point in points] for power in range(rows)])

def vandermonde_report(points, rows=None):
    V = vandermonde_matrix(points, rows)
    square_det = vandermonde_matrix(points, len(points)).det()
    return {"matrix": V, "rank": V.rank(), "square_vandermonde_det": factor(square_det), "column_independent_if_distinct": square_det != 0}

def value_matrix(functions, points, var: Any = None):
    gen = var or x
    return Matrix([[sp.sympify(func).subs(gen, point) if not callable(func) else func(point) for point in points] for func in functions])

def value_matrix_report(functions, points, var: Any = None):
    M = value_matrix(functions, points, var)
    return {"value_matrix": M, "rank": M.rank(), "determinant": M.det() if M.rows == M.cols else None}

def rref(A: Matrix):
    R, pivots = _as_matrix(A).rref()
    return {"rref": R, "pivot_columns": pivots, "rank": len(pivots)}

def augmented_rref(A: Matrix, b: Matrix):
    aug = _as_matrix(A).row_join(_as_matrix(b))
    R, pivots = aug.rref()
    return {"augmented_matrix": aug, "rref": R, "pivot_columns": pivots}

def solve_linear(A: Matrix, b: Matrix):
    A = _as_matrix(A)
    b = _as_matrix(b)
    aug = A.row_join(b)
    result = {
        "rank_A": A.rank(),
        "rank_augmented": aug.rank(),
        "unknowns": A.cols,
        "augmented_rref": aug.rref()[0],
    }
    if A.rank() != aug.rank():
        result["classification"] = "无解"
        return result
    result["classification"] = "唯一解" if A.rank() == A.cols else "无穷多解"
    try:
        solution, params = A.gauss_jordan_solve(b)
        result["solution"] = solution
        result["parameters"] = params
    except Exception as exc:
        result["solution_error"] = str(exc)
    return result

def homogeneous_solution(A: Matrix):
    A = _as_matrix(A)
    return {"nullspace_basis": A.nullspace(), "nullity": A.cols - A.rank(), "rref": A.rref()[0]}

def column_space(A: Matrix):
    return _as_matrix(A).columnspace()

def row_space(A: Matrix):
    return _as_matrix(A).rowspace()

def null_space(A: Matrix):
    return _as_matrix(A).nullspace()

def left_null_space(A: Matrix):
    return _as_matrix(A).T.nullspace()

def rank_factorization(A: Matrix):
    A = _as_matrix(A)
    R, pivots = A.rref()
    C = A[:, list(pivots)] if pivots else zeros(A.rows, 0)
    F = R[:len(pivots), :] if pivots else zeros(0, A.cols)
    return {"C": C, "F": F, "check_C_times_F": C * F}

def inverse_by_augmented(A: Matrix):
    A = _as_matrix(A)
    if A.rows != A.cols:
        return {"error": "只有方阵才可能可逆"}
    aug = A.row_join(eye(A.rows))
    R, pivots = aug.rref()
    return {"augmented": aug, "rref": R, "inverse": A.inv() if A.det() != 0 else None, "pivot_columns": pivots}

def woodbury_identity(A: Matrix, B: Matrix):
    A = _as_matrix(A)
    B = _as_matrix(B)
    Iab = eye(A.rows)
    Iba = eye(B.rows)
    report = {"I_minus_AB_det": (Iab - A * B).det(), "I_minus_BA_det": (Iba - B * A).det()}
    if report["I_minus_AB_det"] != 0:
        C = (Iab - A * B).inv()
        D = Iba + B * C * A
        report.update({
            "(I-AB)^-1": C,
            "candidate_(I-BA)^-1": D,
            "check_left": simplify((Iba - B * A) * D),
            "E_plus_A_candidate_B": simplify(Iab + A * D * B),
        })
    return report

def rank_chain_report(A: Matrix, max_power: int = None):
    A = _as_matrix(A)
    max_power = max_power or A.rows + 1
    ranks = [((A ** k), (A ** k).rank()) for k in range(1, max_power + 1)]
    stable_at = None
    for idx in range(len(ranks) - 1):
        if ranks[idx][1] == ranks[idx + 1][1]:
            stable_at = idx + 1
            break
    return {"ranks": [(i + 1, rank) for i, (_, rank) in enumerate(ranks)], "first_stable_power": stable_at, "note": "Im A^k 是递降链，有限维中秩必稳定。"}

def nilpotent_report(A: Matrix):
    A = _as_matrix(A)
    powers = []
    nil_index = None
    current = eye(A.rows)
    for power in range(1, A.rows + 2):
        current = current * A
        powers.append((power, current))
        if current == zeros(A.rows):
            nil_index = power
            break
    return {
        "eigenvalues": A.eigenvals(),
        "traces_of_powers": [((A ** k).trace()) for k in range(1, A.rows + 1)],
        "nilpotent_index": nil_index,
        "is_nilpotent_by_power": nil_index is not None,
        "jordan_block_report": jordan_block_report(A) if A.rows == A.cols else None,
    }

def cofactor(A: Matrix, i: int, j: int):
    A = _as_matrix(A)
    return (-1) ** (i + j) * A.minor_submatrix(i - 1, j - 1).det()

def cofactor_matrix(A: Matrix):
    A = _as_matrix(A)
    return Matrix(A.rows, A.cols, lambda i, j: cofactor(A, i + 1, j + 1))

def adjugate_identity(A: Matrix):
    A = _as_matrix(A)
    adj = A.adjugate()
    return {"adjugate": adj, "A_adjA": A * adj, "det_times_I": A.det() * eye(A.rows)}

def laplace_expand(A: Matrix, index: int = 1, axis: str = "row"):
    A = _as_matrix(A)
    zero_based = index - 1
    terms = []
    if axis == "row":
        for j in range(A.cols):
            terms.append((A[zero_based, j], cofactor(A, index, j + 1), A[zero_based, j] * cofactor(A, index, j + 1)))
    else:
        for i in range(A.rows):
            terms.append((A[i, zero_based], cofactor(A, i + 1, index), A[i, zero_based] * cofactor(A, i + 1, index)))
    return {"terms": terms, "determinant": sum(term[2] for term in terms)}

def cramer_rule(A: Matrix, b: Matrix):
    A = _as_matrix(A)
    b = _as_matrix(b)
    det_A = A.det()
    if A.rows != A.cols:
        return {"error": "Cramer 法则只用于方阵系数矩阵"}
    if det_A == 0:
        return {"det_A": det_A, "error": "det(A)=0，不能直接使用 Cramer 法则"}
    replacements = []
    solution = []
    for j in range(A.cols):
        Aj = A.copy()
        Aj[:, j] = b
        replacements.append({"column": j + 1, "matrix": Aj, "det": Aj.det()})
        solution.append(Aj.det() / det_A)
    return {"det_A": det_A, "column_replacements": replacements, "solution": Matrix(solution)}

def is_linearly_independent(*vectors: Matrix) -> bool:
    mat = Matrix.hstack(*[_as_matrix(v) for v in vectors])
    return mat.rank() == len(vectors)

def basis_from_vectors(*vectors: Matrix):
    mat = Matrix.hstack(*[_as_matrix(v) for v in vectors])
    _, pivots = mat.rref()
    return {"basis": [vectors[i] for i in pivots], "pivot_columns": pivots, "rank": len(pivots)}

def coordinate_in_basis(v: Matrix, *basis: Matrix):
    B = Matrix.hstack(*[_as_matrix(vec) for vec in basis])
    solution, params = B.gauss_jordan_solve(_as_matrix(v))
    return {"basis_matrix": B, "coordinates": solution, "parameters": params}

def transition_matrix(*basis: Matrix):
    return Matrix.hstack(*[_as_matrix(vec) for vec in basis])

def change_coordinates(coords: Matrix, old_basis: Matrix, new_basis: Matrix):
    old_basis = _as_matrix(old_basis)
    new_basis = _as_matrix(new_basis)
    standard = old_basis * _as_matrix(coords)
    new_coords, params = new_basis.gauss_jordan_solve(standard)
    return {"standard_coordinates": standard, "new_coordinates": new_coords, "parameters": params}

def subspace_sum(*basis_matrices: Matrix):
    mat = Matrix.hstack(*[_as_matrix(B) for B in basis_matrices])
    _, pivots = mat.rref()
    return {"sum_basis": [mat[:, i] for i in pivots], "dimension": len(pivots), "generator_matrix": mat}

def subspace_intersection(U: Matrix, V: Matrix):
    U = _as_matrix(U)
    V = _as_matrix(V)
    block = U.row_join(-V)
    kernel = block.nullspace()
    basis = []
    for vec in kernel:
        left_coeffs = vec[:U.cols, :]
        basis.append(simplify(U * left_coeffs))
    return {"intersection_basis": basis, "dimension": len(basis), "solver_matrix": block}

def dimension_formula(U: Matrix, V: Matrix):
    U = _as_matrix(U)
    V = _as_matrix(V)
    dim_u = U.rank()
    dim_v = V.rank()
    dim_sum = U.row_join(V).rank()
    return {"dim_U": dim_u, "dim_V": dim_v, "dim_sum": dim_sum, "dim_intersection": dim_u + dim_v - dim_sum}

def linear_map_matrix(images: Iterable[Matrix], *codomain_basis: Matrix):
    B = Matrix.hstack(*[_as_matrix(vec) for vec in codomain_basis])
    cols = [B.gauss_jordan_solve(_as_matrix(img))[0] for img in images]
    return Matrix.hstack(*cols)

def linear_map_report(A: Matrix):
    A = _as_matrix(A)
    return {
        "matrix": A,
        "rank": A.rank(),
        "nullity": A.cols - A.rank(),
        "kernel_basis": A.nullspace(),
        "image_basis": A.columnspace(),
        "rank_nullity_check": A.rank() + (A.cols - A.rank()),
        "domain_dimension": A.cols,
    }

def linear_map_change_bases(A: Matrix, domain_old_basis: Matrix, codomain_old_basis: Matrix):
    A = _as_matrix(A)
    P_domain = _as_matrix(domain_old_basis)
    P_codomain = _as_matrix(codomain_old_basis)
    new_matrix = simplify(P_codomain.inv() * A * P_domain)
    return {
        "new_matrix": new_matrix,
        "formula": "A_new = B_codomain^{-1} A_standard B_domain",
        "check_standard_action": simplify(P_codomain * new_matrix),
    }

def invariant_subspace_check(A: Matrix, basis: Matrix):
    A = _as_matrix(A)
    B = _as_matrix(basis)
    images = A * B
    augmented_ranks = []
    coordinates = []
    invariant = True
    for j in range(images.cols):
        image = images[:, j]
        if B.rank() != B.row_join(image).rank():
            invariant = False
            coordinates.append(None)
        else:
            coordinates.append(B.gauss_jordan_solve(image)[0])
        augmented_ranks.append(B.row_join(image).rank())
    restricted = Matrix.hstack(*[c for c in coordinates if c is not None]) if invariant else None
    return {"invariant": invariant, "images": images, "coordinates_in_basis": coordinates, "restricted_matrix": restricted, "rank_checks": augmented_ranks}

def quotient_dimension(total_dimension: int, subspace_basis: Matrix):
    B = _as_matrix(subspace_basis)
    return {"dim_V": total_dimension, "dim_W": B.rank(), "dim_V_mod_W": total_dimension - B.rank()}

def eigenspace(A: Matrix, value: Any):
    A = _as_matrix(A)
    return (A - value * eye(A.rows)).nullspace()

def characteristic_matrix(A: Matrix, var: Any = lam):
    A = _as_matrix(A)
    return var * eye(A.rows) - A

def algebraic_geometric_multiplicity(A: Matrix):
    A = _as_matrix(A)
    data = []
    for value, algebraic_mult in A.eigenvals().items():
        data.append({
            "eigenvalue": value,
            "algebraic_multiplicity": algebraic_mult,
            "geometric_multiplicity": len(eigenspace(A, value)),
            "eigenspace_basis": eigenspace(A, value),
        })
    return data

def diagonalizable_report(A: Matrix):
    A = _as_matrix(A)
    report = {"charpoly": A.charpoly(lam).as_expr(), "eigenvalues": A.eigenvals(), "details": []}
    total_geo = 0
    for value, algebraic_mult in A.eigenvals().items():
        geo_mult = len((A - value * eye(A.rows)).nullspace())
        total_geo += geo_mult
        report["details"].append({
            "eigenvalue": value,
            "algebraic_multiplicity": algebraic_mult,
            "geometric_multiplicity": geo_mult,
            "eigenspace_basis": (A - value * eye(A.rows)).nullspace(),
        })
    report["is_diagonalizable"] = total_geo == A.rows
    return report

def cayley_hamilton(A: Matrix):
    A = _as_matrix(A)
    p = A.charpoly(lam).as_expr()
    return {"charpoly": p, "p(A)": _matrix_poly_value(p, A, lam)}

def minimal_polynomial(A: Matrix):
    A = _as_matrix(A)
    powers = [eye(A.rows)]
    columns = [Matrix(powers[0]).reshape(A.rows * A.cols, 1)]
    for degree in range(1, A.rows * A.cols + 1):
        powers.append(powers[-1] * A)
        columns.append(Matrix(powers[-1]).reshape(A.rows * A.cols, 1))
        relation_space = Matrix.hstack(*columns).nullspace()
        if relation_space:
            coeffs = relation_space[0]
            poly_expr = sum(coeffs[i] * lam ** i for i in range(len(coeffs)))
            poly = Poly(poly_expr, lam)
            lc = poly.LC()
            monic = Poly(poly.as_expr() / lc, lam)
            return {"minimal_polynomial": monic.as_expr(), "degree": monic.degree(), "check": _matrix_poly_value(monic.as_expr(), A, lam)}
    return {"error": "未找到线性关系"}

def matrix_polynomial_value(poly_expr: Any, A: Matrix, var: Any = lam):
    return _matrix_poly_value(poly_expr, _as_matrix(A), var)

def power_reduce(A: Matrix, power: int):
    A = _as_matrix(A)
    minpoly = minimal_polynomial(A)
    if "minimal_polynomial" not in minpoly:
        return minpoly
    remainder = Poly(lam ** power, lam).rem(Poly(minpoly["minimal_polynomial"], lam))
    return {"minimal_polynomial": minpoly["minimal_polynomial"], "remainder": remainder.as_expr(), f"A^{power}": _matrix_poly_value(remainder.as_expr(), A, lam)}

def jordan_block_report(A: Matrix):
    A = _as_matrix(A)
    report = []
    for value, algebraic_mult in A.eigenvals().items():
        nullities = []
        for power in range(1, algebraic_mult + 1):
            kernel_matrix = (A - value * eye(A.rows)) ** power
            nullities.append(kernel_matrix.cols - kernel_matrix.rank())
        report.append({
            "eigenvalue": value,
            "algebraic_multiplicity": algebraic_mult,
            "kernel_dimensions": nullities,
            "hint": "相邻核维数差可读出至少为该大小的 Jordan 块数量。",
        })
    return report

def similar_quick_check(A: Matrix, B: Matrix):
    A = _as_matrix(A)
    B = _as_matrix(B)
    checks = {
        "same_shape": A.shape == B.shape,
        "same_rank": A.rank() == B.rank(),
        "same_trace": A.trace() == B.trace() if A.rows == A.cols and B.rows == B.cols else None,
        "same_determinant": A.det() == B.det() if A.rows == A.cols and B.rows == B.cols else None,
        "same_charpoly": A.charpoly(lam).as_expr() == B.charpoly(lam).as_expr() if A.rows == A.cols and B.rows == B.cols else None,
    }
    checks["note"] = "这些是相似的必要条件；全部满足仍不保证相似。可继续比较 Jordan 结构。"
    return checks

def congruent_quick_check(A: Matrix, B: Matrix):
    A = _as_matrix(A)
    B = _as_matrix(B)
    return {
        "same_shape": A.shape == B.shape,
        "same_rank": A.rank() == B.rank(),
        "A_quadratic": quadratic_classify(A),
        "B_quadratic": quadratic_classify(B),
        "note": "实对称矩阵合同由秩和惯性指数决定；这里给出判别所需数据。",
    }

def gram_matrix(*vectors: Matrix):
    vecs = [_as_matrix(v) for v in vectors]
    return Matrix([[u.dot(v) for v in vecs] for u in vecs])

def gram_schmidt(*vectors: Matrix):
    return Matrix.orthogonalize(*[_as_matrix(v) for v in vectors], normalize=False)

def orthonormalize(*vectors: Matrix):
    return Matrix.orthogonalize(*[_as_matrix(v) for v in vectors], normalize=True)

def normalize_vector(v: Matrix):
    v = _as_matrix(v)
    norm = simplify(v.norm())
    return {"vector": v, "norm": norm, "unit_vector": simplify(v / norm) if norm != 0 else None}

def schmidt_report(*vectors: Matrix):
    orthogonal = []
    steps = []
    for index, raw in enumerate([_as_matrix(v) for v in vectors], start=1):
        projection_terms = []
        current = raw
        for basis_vec in orthogonal:
            proj = projection(raw, basis_vec)
            projection_terms.append(proj)
            current = simplify(current - proj)
        norm = simplify(current.norm())
        unit = simplify(current / norm) if norm != 0 else None
        steps.append({
            "input_index": index,
            "input_vector": raw,
            "projection_terms": projection_terms,
            "orthogonal_vector": simplify(current),
            "norm": norm,
            "unit_vector": unit,
        })
        if current != zeros(current.rows, 1):
            orthogonal.append(simplify(current))
    units = [simplify(v / v.norm()) for v in orthogonal if v.norm() != 0]
    return {"steps": steps, "orthogonal_basis": orthogonal, "orthonormal_basis": units}

def projection(u: Matrix, v: Matrix):
    u = _as_matrix(u)
    v = _as_matrix(v)
    return simplify((u.dot(v) / v.dot(v)) * v)

def projection_to_subspace(v: Matrix, *orthogonal_basis: Matrix):
    parts = [projection(_as_matrix(v), _as_matrix(b)) for b in orthogonal_basis]
    return {"components": parts, "projection": simplify(sum(parts, zeros(_as_matrix(v).rows, 1)))}

def distance_to_subspace(v: Matrix, *orthogonal_basis: Matrix):
    proj = projection_to_subspace(v, *orthogonal_basis)["projection"]
    residual = _as_matrix(v) - proj
    return {"projection": proj, "residual": residual, "distance": simplify(residual.norm())}

def orthogonal_matrix_from_columns(*vectors: Matrix):
    units = orthonormalize(*vectors)
    return Matrix.hstack(*units)

def transition_from_to(old_basis: Matrix, new_basis: Matrix):
    old_basis = _as_matrix(old_basis)
    new_basis = _as_matrix(new_basis)
    transition = simplify(new_basis.inv() * old_basis)
    return {
        "old_basis": old_basis,
        "new_basis": new_basis,
        "transition_new_coordinates_from_old": transition,
        "check_new_basis_times_transition": simplify(new_basis * transition),
        "note": "[v]_new = P [v]_old，其中 P = new_basis^{-1} old_basis。",
    }

def matrix_in_basis(A: Matrix, basis: Matrix):
    A = _as_matrix(A)
    P = _as_matrix(basis)
    return {"P": P, "P_inverse_A_P": simplify(P.inv() * A * P), "A_equals_PBP_inverse": simplify(P * (P.inv() * A * P) * P.inv())}

def diagonalization_similarity(A: Matrix):
    A = _as_matrix(A)
    try:
        P, D = A.diagonalize()
        return {"P": P, "D": D, "P_inverse_A_P": simplify(P.inv() * A * P), "A_equals_P_D_P_inverse": simplify(P * D * P.inv())}
    except Exception as exc:
        return {"error": str(exc), "diagonalizable_report": diagonalizable_report(A)}

def jordan_similarity(A: Matrix):
    A = _as_matrix(A)
    try:
        P, J = A.jordan_form()
        return {
            "P": P,
            "J": J,
            "P_inverse_A_P": simplify(P.inv() * A * P),
            "A_equals_P_J_P_inverse": simplify(P * J * P.inv()),
            "jordan_block_report": jordan_block_report(A),
        }
    except Exception as exc:
        return {"error": str(exc), "jordan_block_report": jordan_block_report(A)}

def similar_by_given_P(A: Matrix, P: Matrix):
    A = _as_matrix(A)
    P = _as_matrix(P)
    return {"P": P, "P_inverse_A_P": simplify(P.inv() * A * P), "PAP_inverse": simplify(P * A * P.inv())}

def congruence_by_given_P(A: Matrix, P: Matrix):
    A = _as_matrix(A)
    P = _as_matrix(P)
    return {"P": P, "P_T_A_P": simplify(P.T * A * P), "note": "合同变换用于二次型换变量，和相似变换 P^-1AP 不同。"}

def bilinear_matrix_in_basis(A: Matrix, basis: Matrix):
    A = _as_matrix(A)
    P = _as_matrix(basis)
    return {"matrix_in_basis": simplify(P.T * A * P), "formula": "B_new = P^T A P"}

def sylvester_criterion(A: Matrix):
    minors = principal_minors(A)["leading_principal_minors"]
    return {"leading_principal_minors": minors, "positive_definite_if_all_positive": all(m.is_positive for m in minors), "negative_definite_pattern": [(-1) ** (i + 1) * minors[i] for i in range(len(minors))]}

def symmetric_ldl_report(A: Matrix):
    A = _as_matrix(A)
    if A != A.T:
        return {"error": "LDL 合同对角化要求对称矩阵"}
    try:
        L, D = A.LDLdecomposition()
        return {"L": L, "D": D, "L_D_L_T": simplify(L * D * L.T), "congruence_P_T_A_P": simplify(L.inv() * A * L.inv().T)}
    except Exception as exc:
        return {"error": str(exc), "quadratic_classify": quadratic_classify(A)}

def orthogonal_diagonalization(A: Matrix):
    A = _as_matrix(A)
    if A != A.T:
        return {"error": "实正交对角化通常要求对称矩阵", "symmetric": False}
    eigen_data = A.eigenvects()
    columns = []
    for _, _, vecs in eigen_data:
        columns.extend(Matrix.orthogonalize(*vecs, normalize=True))
    Q = Matrix.hstack(*columns)
    return {"Q": Q, "Q_T_A_Q": simplify(Q.T * A * Q), "Q_T_Q": simplify(Q.T * Q), "A_equals_Q_D_Q_T": simplify(Q * (Q.T * A * Q) * Q.T)}

def simultaneous_orthogonal_diagonalization(A: Matrix, B: Matrix):
    A = _as_matrix(A)
    B = _as_matrix(B)
    if A != A.T or B != B.T:
        return {"error": "需要两个实对称矩阵"}
    if A * B != B * A:
        return {"error": "两个矩阵不可交换，通常不能同时正交对角化"}
    eigenspaces = A.eigenvects()
    columns = []
    for value, _, vecs in eigenspaces:
        basis = Matrix.hstack(*vecs)
        restricted = basis.T * B * basis
        try:
            local = orthogonal_diagonalization(restricted)
            columns.extend([basis * local["Q"][:, j] for j in range(local["Q"].cols)])
        except Exception:
            columns.extend(vecs)
    Q = Matrix.hstack(*Matrix.orthogonalize(*columns, normalize=True))
    return {"Q": Q, "Q_T_A_Q": simplify(Q.T * A * Q), "Q_T_B_Q": simplify(Q.T * B * Q), "Q_T_Q": simplify(Q.T * Q)}

def skew_symmetric_report(Smat: Matrix):
    Smat = _as_matrix(Smat)
    return {
        "is_skew_symmetric": Smat.T == -Smat,
        "eigenvalues": Smat.eigenvals() if Smat.rows == Smat.cols else None,
        "det_I_plus_S": (eye(Smat.rows) + Smat).det() if Smat.rows == Smat.cols else None,
        "note": "实反称矩阵可正交化为若干 [[0,b],[-b,0]] 与零块的直和。",
    }

def symmetric_square_root(A: Matrix):
    A = _as_matrix(A)
    if A != A.T:
        return {"error": "需要实对称矩阵"}
    od = orthogonal_diagonalization(A)
    D = od["Q_T_A_Q"]
    sqrtD = zeros(D.rows)
    for i in range(D.rows):
        sqrtD[i, i] = sqrt(D[i, i])
    B = simplify(od["Q"] * sqrtD * od["Q"].T)
    return {"sqrt_matrix": B, "check_square": simplify(B * B), "positive_semidefinite_needed": "特征值非负时存在实对称平方根。"}

def polar_decomposition_report(A: Matrix):
    A = _as_matrix(A)
    P_report = symmetric_square_root(A.T * A)
    if "sqrt_matrix" not in P_report:
        return P_report
    Pmat = P_report["sqrt_matrix"]
    if Pmat.det() == 0:
        return {"P": Pmat, "error": "A^T A 不可逆；这里实现的是非退化情形"}
    Qmat = simplify(A * Pmat.inv())
    return {"Q": Qmat, "P": Pmat, "Q_T_Q": simplify(Qmat.T * Qmat), "Q_P": simplify(Qmat * Pmat)}

def cayley_transform_skew(A: Matrix):
    A = _as_matrix(A)
    Q = simplify((eye(A.rows) - A) * (eye(A.rows) + A).inv())
    return {"Q": Q, "Q_T_Q": simplify(Q.T * Q), "condition": "A^T=-A 时 E+A 自动可逆，Q 正交。"}

def commutator(A: Matrix, B: Matrix):
    A = _as_matrix(A)
    B = _as_matrix(B)
    return simplify(A * B - B * A)

def commutator_report(A: Matrix, B: Matrix):
    C = commutator(A, B)
    return {"commutator": C, "trace": C.trace(), "zero_trace": C.trace() == 0}

def jordan_block(size: int, eigenvalue=0):
    J = eigenvalue * eye(size)
    for i in range(size - 1):
        J[i, i + 1] = 1
    return J

def centralizer_jordan_block(size: int, eigenvalue=0):
    N = jordan_block(size, 0)
    coeffs = symbols(f'c0:{size}')
    X = zeros(size)
    for i in range(size):
        X += coeffs[i] * (N ** i)
    return {"jordan_block": jordan_block(size, eigenvalue), "general_commuting_matrix": X, "dimension": size, "description": "单个 Jordan 块的中心化子就是该块的多项式。"}

def centralizer_dimension_from_blocks(blocks):
    total = 0
    for block_sizes in blocks:
        for a_size in block_sizes:
            for b_size in block_sizes:
                total += min(a_size, b_size)
    return {"blocks_by_eigenvalue": blocks, "centralizer_dimension": total}

def sylvester_equation_report(A: Matrix, B: Matrix):
    A = _as_matrix(A)
    B = _as_matrix(B)
    variables_x = symbols(f'x0:{A.rows * B.rows}')
    X = Matrix(A.rows, B.rows, variables_x)
    equations = list(A * X - X * B)
    solution = solve(equations, variables_x, dict=True)
    return {
        "common_eigenvalues": set(A.eigenvals()).intersection(set(B.eigenvals())),
        "solution_space_sample": solution[:1],
        "criterion": "AX=XB 有非零解当且仅当 A 与 B 有公共特征值。",
    }

def spectral_projectors(A: Matrix):
    A = _as_matrix(A)
    eigenvalues = list(A.eigenvals().keys())
    projectors = []
    for value in eigenvalues:
        numerator = eye(A.rows)
        denominator = 1
        for other in eigenvalues:
            if other != value:
                numerator *= (A - other * eye(A.rows))
                denominator *= (value - other)
        projectors.append({"eigenvalue": value, "projector": simplify(numerator / denominator), "check_idempotent": simplify((numerator / denominator) ** 2 - numerator / denominator)})
    return projectors

def jordan_chain_count(A: Matrix):
    A = _as_matrix(A)
    return {"block_count_by_eigenvalue": {value: len(eigenspace(A, value)) for value in A.eigenvals()}, "total_independent_eigenvectors": sum(len(eigenspace(A, value)) for value in A.eigenvals())}

def quadratic_form(A: Matrix, vec: Matrix):
    A = _as_matrix(A)
    vec = _as_matrix(vec)
    return simplify((vec.T * A * vec)[0])

def bilinear_form(A: Matrix, u: Matrix, v: Matrix):
    A = _as_matrix(A)
    return simplify((_as_matrix(u).T * A * _as_matrix(v))[0])

def principal_minors(A: Matrix):
    A = _as_matrix(A)
    leading = [A[:i, :i].det() for i in range(1, min(A.rows, A.cols) + 1)]
    all_minors = {}
    for size in range(1, A.rows + 1):
        vals = []
        for idx in sp.utilities.iterables.combinations(range(A.rows), size):
            vals.append((idx, A.extract(idx, idx).det()))
        all_minors[size] = vals
    return {"leading_principal_minors": leading, "all_principal_minors": all_minors}

def quadratic_classify(A: Matrix):
    A = _as_matrix(A)
    if A != A.T:
        A = (A + A.T) / 2
    eigs = A.eigenvals()
    signs = []
    for value, mult in eigs.items():
        if value.is_positive:
            signs.extend(["positive"] * mult)
        elif value.is_negative:
            signs.extend(["negative"] * mult)
        elif value == 0:
            signs.extend(["zero"] * mult)
        else:
            signs.extend(["undetermined"] * mult)
    return {
        "symmetric_matrix": A,
        "eigenvalues": eigs,
        "leading_principal_minors": principal_minors(A)["leading_principal_minors"],
        "inertia_hint": signs,
        "positive_definite": A.is_positive_definite,
        "negative_definite": A.is_negative_definite,
    }

def study(topic: str = "all"):
    if topic == "all":
        return STUDY_GUIDES
    return STUDY_GUIDES.get(str(topic), "未知主题，可用: " + ", ".join(STUDY_GUIDES))

def parse_matrix(text: str) -> Matrix:
    """解析矩阵，支持符号表达式；兼容 ; 分隔符（MATLAB 风格）"""
    text = text.strip()
    if not (text.startswith('[[') and text.endswith(']]')):
        raise ValueError("矩阵格式应为 [[...]]")
    # 将 ; 替换为 , 以兼容示例语法
    text = text.replace(';', ',')
    # 支持 ^ 作为幂运算符
    text = text.replace('^', '**')
    try:
        # 使用 sympy 安全解析，包含已定义变量
        env = {
            "sqrt": sqrt, "Rational": Rational, "I": I,
            "symbols": symbols, "sp": sp, "Matrix": Matrix,
            **variables
        }
        mat_list = eval(text, {"__builtins__": {}}, env)
        return Matrix(mat_list)
    except Exception as e:
        raise ValueError(f"矩阵解析失败: {e}")

def evaluate_expression(expr: str) -> Any:
    """求值表达式，支持 SymPy 矩阵运算"""
    # 处理转置 ^T
    expr = re.sub(r'(\w+)\^T', r'(\1).T', expr)
    expr = expr.replace('^', '**')
    expr = re.sub(r'(\w+)\.T', r'(\1).T', expr)

    # 将表达式中的矩阵字面量 [[...]] 转换为 Matrix([...])，兼容 ; 
    def _convert_matrices(s):
        def repl(m):
            mat_str = m.group(0).replace(';', ',')
            return f'Matrix({mat_str})'
        return re.sub(r'\[\[.*?\]\]', repl, s, flags=re.DOTALL)
    expr = _convert_matrices(expr)

    # 函数映射
    func_map = {
        r'det\((\w+)\)': r'(\1).det()',
        r'rank\((\w+)\)': r'(\1).rank()',
        r'tr\((\w+)\)': r'(\1).trace()',
        r'trace\((\w+)\)': r'(\1).trace()',
        r'inv\((\w+)\)': r'(\1).inv()',
        r'eigvals\((\w+)\)': r'(\1).eigenvals()',
        r'eigvects\((\w+)\)': r'(\1).eigenvects()',
        r'jordan\((\w+)\)': r'(\1).jordan_form()',
        r'smith\((\w+)\)': r'smith_normal_form(\1)',
        r'exp\((\w+)\)': r'(\1).exp()',
        r'charpoly\((\w+)\)': r'charpoly(\1)',
        r'is_positive_definite\((\w+)\)': r'(\1).is_positive_definite',
        r'is_symmetric\((\w+)\)': r'(\1).is_symmetric()',
        r'norm\((\w+)\)': r'(\1).norm()',
        r'dot\(([^,]+),\s*([^)]+)\)': r'(\1).dot(\2)',
    }

    for pattern, repl in func_map.items():
        expr = re.sub(pattern, repl, expr)

    # 安全 globals
    safe_globals = {
        "__builtins__": {},
        "Matrix": Matrix,
        "symbols": symbols,
        "sqrt": sqrt,
        "Rational": Rational,
        "I": I,
        "simplify": simplify,
        "smith_normal_form": smith_normal_form,
        "Poly": Poly,
        "gcd": gcd,
        "roots": roots,
        "solve": solve,
        "eye": eye,
        "zeros": zeros,
        "factor": factor,
        "expand": expand,
        "ImmutableDenseMatrix": ImmutableDenseMatrix,
        "x": variables.get('x', x),
        "y": variables.get('y', y),
        "z": variables.get('z', z),
        "t": variables.get('t', t),
        "lam": variables.get('lam', lam),
        "lambda_": variables.get('lambda_', lambda_),
        "charpoly": lambda A, var=lam: _as_matrix(A).charpoly(var).as_expr(),
        "poly_add": poly_add,
        "poly_mul": poly_mul,
        "poly_div": poly_div,
        "poly_gcd": poly_gcd,
        "poly_roots": poly_roots,
        "poly_factor": poly_factor,
        "poly_derivative": poly_derivative,
        "poly_squarefree": poly_squarefree,
        "poly_bezout": poly_bezout,
        "eisenstein_check": eisenstein_check,
        "polynomial_ideal_generator": polynomial_ideal_generator,
        "finite_difference_antiderivative": finite_difference_antiderivative,
        "vandermonde_matrix": vandermonde_matrix,
        "vandermonde_report": vandermonde_report,
        "value_matrix": value_matrix,
        "value_matrix_report": value_matrix_report,
        "rref": rref,
        "augmented_rref": augmented_rref,
        "solve_linear": solve_linear,
        "homogeneous_solution": homogeneous_solution,
        "column_space": column_space,
        "row_space": row_space,
        "null_space": null_space,
        "left_null_space": left_null_space,
        "rank_factorization": rank_factorization,
        "inverse_by_augmented": inverse_by_augmented,
        "woodbury_identity": woodbury_identity,
        "rank_chain_report": rank_chain_report,
        "nilpotent_report": nilpotent_report,
        "cofactor": cofactor,
        "cofactor_matrix": cofactor_matrix,
        "adjugate_identity": adjugate_identity,
        "laplace_expand": laplace_expand,
        "cramer_rule": cramer_rule,
        "is_linearly_independent": is_linearly_independent,
        "basis_from_vectors": basis_from_vectors,
        "coordinate_in_basis": coordinate_in_basis,
        "transition_matrix": transition_matrix,
        "change_coordinates": change_coordinates,
        "subspace_sum": subspace_sum,
        "subspace_intersection": subspace_intersection,
        "dimension_formula": dimension_formula,
        "linear_map_matrix": linear_map_matrix,
        "linear_map_report": linear_map_report,
        "linear_map_change_bases": linear_map_change_bases,
        "invariant_subspace_check": invariant_subspace_check,
        "quotient_dimension": quotient_dimension,
        "characteristic_matrix": characteristic_matrix,
        "eigenspace": eigenspace,
        "algebraic_geometric_multiplicity": algebraic_geometric_multiplicity,
        "diagonalizable_report": diagonalizable_report,
        "cayley_hamilton": cayley_hamilton,
        "minimal_polynomial": minimal_polynomial,
        "matrix_polynomial_value": matrix_polynomial_value,
        "power_reduce": power_reduce,
        "jordan_block_report": jordan_block_report,
        "similar_quick_check": similar_quick_check,
        "congruent_quick_check": congruent_quick_check,
        "gram_matrix": gram_matrix,
        "gram_schmidt": gram_schmidt,
        "orthonormalize": orthonormalize,
        "normalize_vector": normalize_vector,
        "schmidt_report": schmidt_report,
        "projection": projection,
        "projection_to_subspace": projection_to_subspace,
        "distance_to_subspace": distance_to_subspace,
        "orthogonal_matrix_from_columns": orthogonal_matrix_from_columns,
        "transition_from_to": transition_from_to,
        "matrix_in_basis": matrix_in_basis,
        "diagonalization_similarity": diagonalization_similarity,
        "jordan_similarity": jordan_similarity,
        "similar_by_given_P": similar_by_given_P,
        "congruence_by_given_P": congruence_by_given_P,
        "orthogonal_diagonalization": orthogonal_diagonalization,
        "simultaneous_orthogonal_diagonalization": simultaneous_orthogonal_diagonalization,
        "skew_symmetric_report": skew_symmetric_report,
        "symmetric_square_root": symmetric_square_root,
        "polar_decomposition_report": polar_decomposition_report,
        "cayley_transform_skew": cayley_transform_skew,
        "commutator": commutator,
        "commutator_report": commutator_report,
        "jordan_block": jordan_block,
        "centralizer_jordan_block": centralizer_jordan_block,
        "centralizer_dimension_from_blocks": centralizer_dimension_from_blocks,
        "sylvester_equation_report": sylvester_equation_report,
        "spectral_projectors": spectral_projectors,
        "jordan_chain_count": jordan_chain_count,
        "bilinear_matrix_in_basis": bilinear_matrix_in_basis,
        "sylvester_criterion": sylvester_criterion,
        "symmetric_ldl_report": symmetric_ldl_report,
        "quadratic_form": quadratic_form,
        "bilinear_form": bilinear_form,
        "principal_minors": principal_minors,
        "quadratic_classify": quadratic_classify,
        "study": study,
        **variables
    }

    try:
        result = eval(expr, safe_globals, {})
        return result
    except Exception as e:
        raise RuntimeError(f"表达式求值失败: {e}")

def process_line(line: str, lang: str = 'zh'):
    msg = MESSAGES[lang]
    line = line.strip()
    if not line or line.startswith('#'):
        return

    if line.startswith('print('):
        inside = line[6:-1].strip()
        result = evaluate_expression(inside)
        print(f"{msg['print']}:")
        pprint(result)
        return

    if '=' in line and not line.startswith('='):
        var, expr = line.split('=', 1)
        var = var.strip()
        expr = expr.strip()

        if expr.startswith('[['):
            mat = parse_matrix(expr)
            variables[var] = mat
            print(f"{msg['define_matrix']} {var}:")
            pprint(mat)
        else:
            result = evaluate_expression(expr)
            variables[var] = result
            print(f"{var} =")
            pprint(result)
    else:
        result = evaluate_expression(line)
        print(f"{msg['result']}:")
        pprint(result)

def main(input_file: str, lang: str = 'zh'):
    msg = MESSAGES[lang]
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            for line in f:
                process_line(line, lang)
    except FileNotFoundError:
        print(f"找不到文件: {input_file}" if lang == 'zh' else f"File not found: {input_file}")
    except Exception as e:
        print(f"错误: {e}" if lang == 'zh' else f"Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="高等代数学习辅助器 / Higher Algebra Assistant")
    parser.add_argument('input_file', help='输入文件 / Input file')
    parser.add_argument('--lang', choices=['zh', 'en'], default='zh', help='语言 / Language')
    args = parser.parse_args()
    main(args.input_file, args.lang)
