# 高等代数学习辅助器 - 章节功能地图

版本：v0.9

本工具面向中国数学专业“高等代数”课程，而不是普通线性代数速算器。功能按学习中常见问题拆成细命令：先判断对象，再给出中间量，最后给出可用于书写证明或计算题的结果。

## 1. 多项式

覆盖问题：
- 数域与主变量确认
- 多项式加减乘、除法、带余除法
- 最大公因式、互素、Bezout 等式
- 重根判别、平方因子分解
- 因式分解、根与重数
- 矩阵多项式、Cayley-Hamilton 代入

命令：
```text
poly_add(p, q)
poly_mul(p, q)
poly_div(p, q)
poly_gcd(p, q)
poly_bezout(p, q)
poly_squarefree(p)
poly_factor(p)
poly_roots(p)
matrix_polynomial_value(p, A)
```

## 2. 行列式与矩阵

覆盖问题：
- 行列式、秩、迹、逆矩阵
- RREF 主元列和行等价
- 伴随矩阵恒等式
- 代数余子式与按行/列展开
- Cramer 法则
- 初等行变换求逆
- 列空间、行空间、零空间、左零空间
- 秩分解

命令：
```text
det(A)
rank(A)
rref(A)
inverse_by_augmented(A)
cofactor(A, i, j)
cofactor_matrix(A)
laplace_expand(A, 1, "row")
adjugate_identity(A)
cramer_rule(A, b)
column_space(A)
row_space(A)
null_space(A)
left_null_space(A)
rank_factorization(A)
```

## 3. 线性方程组

覆盖问题：
- 齐次方程基础解系
- 非齐次方程有解判别
- 唯一解/无穷多解/无解分类
- 增广矩阵行最简形
- 参数解

命令：
```text
solve_linear(A, b)
augmented_rref(A, b)
homogeneous_solution(A)
```

## 4. 线性空间、基与坐标

覆盖问题：
- 向量组线性相关/无关
- 从生成元提取基
- 向量在一组基下的坐标
- 过渡矩阵与换基
- 子空间和、交、维数公式

命令：
```text
is_linearly_independent(v1, v2, v3)
basis_from_vectors(v1, v2, v3)
coordinate_in_basis(v, e1, e2, e3)
transition_matrix(e1, e2, e3)
change_coordinates(coords, old_basis, new_basis)
subspace_sum(U, V)
subspace_intersection(U, V)
dimension_formula(U, V)
```

## 5. 线性变换

覆盖问题：
- 基向量像写出矩阵表示
- 核、像、秩-零度公式
- 线性映射完整报告：秩、零度、核、像
- 定义域基和值域基同时变化
- 不变子空间判定和限制矩阵
- 商空间维数
- 同一线性变换不同基下的矩阵
- 相似的必要条件检查
- 给定基下的矩阵表示 `P^-1AP`
- 已知 P 时计算相似矩阵
- 对角化时输出 `P, D, P^-1AP`
- Jordan 标准形时输出 `P, J, P^-1AP`

命令：
```text
linear_map_matrix([img1, img2], codomain_e1, codomain_e2)
linear_map_report(A)
linear_map_change_bases(A, domain_basis, codomain_basis)
invariant_subspace_check(A, W_basis)
quotient_dimension(3, W_basis)
null_space(A)
column_space(A)
similar_quick_check(A, B)
matrix_in_basis(A, P)
similar_by_given_P(A, P)
diagonalization_similarity(A)
jordan_similarity(A)
```

## 6. 特征值、标准形、最小多项式

覆盖问题：
- 特征矩阵与特征多项式
- 特征值、特征向量、特征子空间
- 代数重数和几何重数
- 可对角化判别
- Cayley-Hamilton 定理验证
- 最小多项式
- 高次幂化简
- Jordan 块核维数线索

命令：
```text
characteristic_matrix(A)
charpoly(A)
eigvals(A)
eigvects(A)
eigenspace(A, value)
algebraic_geometric_multiplicity(A)
diagonalizable_report(A)
cayley_hamilton(A)
minimal_polynomial(A)
power_reduce(A, 10)
jordan_block_report(A)
jordan(A)
```

## 7. 欧氏空间、正交与投影

覆盖问题：
- 内积、范数、Gram 矩阵
- Gram-Schmidt 正交化
- 标准正交化
- Schmidt 每一步投影项、正交向量、单位向量
- 向量到子空间的正交投影
- 到子空间距离
- 用单位正交列组成正交矩阵
- 实对称矩阵正交对角化

命令：
```text
dot(u, v)
norm(u)
gram_matrix(v1, v2, v3)
gram_schmidt(v1, v2, v3)
orthonormalize(v1, v2, v3)
normalize_vector(v)
schmidt_report(v1, v2, v3)
projection(u, v)
projection_to_subspace(v, e1, e2)
distance_to_subspace(v, e1, e2)
orthogonal_matrix_from_columns(v1, v2, v3)
orthogonal_diagonalization(A)
```

## 7.1 过渡矩阵方向

若旧基矩阵为 `B_old`，新基矩阵为 `B_new`，则

```text
transition_from_to(B_old, B_new)
```

返回 `P = B_new^-1 * B_old`，满足：

```text
[v]_new = P * [v]_old
```

这能避免常见错误：把“旧到新”和“新到旧”的过渡矩阵写反。

## 8. 二次型与合同

覆盖问题：
- 二次型矩阵表达
- 双线性形式
- 双线性型换基矩阵 `P^T A P`
- 给定 P 的合同变换
- 顺序主子式与全部主子式
- Sylvester 正定判别
- 正定/负定/半正定线索
- 惯性指数线索
- 对称矩阵 LDL 合同对角化线索
- 合同必要数据

命令：
```text
quadratic_form(Q, vec)
bilinear_form(Q, u, v)
bilinear_matrix_in_basis(Q, P)
congruence_by_given_P(Q, P)
principal_minors(Q)
sylvester_criterion(Q)
quadratic_classify(Q)
symmetric_ldl_report(Q)
congruent_quick_check(Q1, Q2)
```

## 9. 做题步骤卡

```text
study("polynomial")
study("matrix")
study("linear_space")
study("linear_map")
study("eigen")
study("quadratic_form")
study("exam_checklist")
```

这些命令返回的是步骤清单，用于把计算结果组织成解题过程。

## 10. 总复习题方法库

根据 `Higher_Algebra_Review_Problems.pdf` 和 `Higher_Algebra_Review_Solutions.pdf` 中的代表性题型，补充以下方法命令。

覆盖问题：
- Vandermonde 矩阵、取值矩阵、函数线性无关
- Woodbury 型恒等式、`I-AB` 与 `I-BA`
- 矩阵幂的秩链稳定
- 幂零矩阵、迹幂、Jordan 块线索
- 同时正交对角化
- 实反称矩阵标准形线索、Cayley 变换
- 实对称半正定平方根、极分解
- Eisenstein 判别、主理想、有限差分
- 交换子和迹零
- Jordan 块中心化子、中心化子维数
- Sylvester 方程 `AX=XB`
- 谱投影、不变子空间分量
- Jordan 块数与独立特征向量最大数

命令：
```text
vandermonde_matrix([a1,a2,a3], 3)
vandermonde_report([1,2,3], 3)
value_matrix_report([1,x,x^2], [0,1,2])
woodbury_identity(A, B)
rank_chain_report(A)
nilpotent_report(A)
simultaneous_orthogonal_diagonalization(A, B)
skew_symmetric_report(S)
cayley_transform_skew(S)
symmetric_square_root(A)
polar_decomposition_report(A)
eisenstein_check(f, 2)
polynomial_ideal_generator(f, g)
finite_difference_antiderivative(x^2)
commutator(A, B)
commutator_report(A, B)
centralizer_jordan_block(3, 2)
centralizer_dimension_from_blocks(((2,1), (3,)))
sylvester_equation_report(A, B)
spectral_projectors(A)
jordan_chain_count(A)
```
