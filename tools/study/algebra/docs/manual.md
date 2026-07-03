# 高等代数学习辅助器使用说明书
# Higher Algebra Learning Assistant User Manual

**版本 / Version**: v0.3 (支持多项式与线性方程组)

---

## 1. 功能概述 / Features Overview

本工具支持从文本文件解析并执行高等代数运算，包括：

- 数值与符号矩阵运算
- 特征值、特征向量、若当标准型、史密斯标准型
- **多项式运算**（同类项合并、最大公因式、求根）
- **多项式矩阵**与行列式
- **线性方程组求解**
- **线性变换**（矩阵表示、Gram-Schmidt 正交化）
- **二次型与双线性形式**（正定性判断、内积、范数）
- 中英双语界面

---

## 2. 安装与运行 / Installation & Usage

### 依赖 / Dependencies
```bash
pip install sympy numpy
```

### 基本运行 / Basic Run
```bash
# 中文界面（默认）
python src/parser.py examples/example.txt

# 英文界面
python src/parser.py --lang en examples/example.txt
```

---

## 3. 支持的语法 / Supported Syntax

### 3.1 矩阵定义
```text
A = [[1;2];[3;4]]
B = [[x^2 + 1; 0]; [0; x + 1]]
```

### 3.2 矩阵运算
- `A^T`：转置
- `det(A)`、`rank(A)`、`tr(A)`、`inv(A)`
- `eigvals(A)`、`eigvects(A)`
- `jordan(A)`、`smith(A)`
- `exp(A)`、`charpoly(A)`

### 3.3 多项式运算
```text
p = x^2 + 3*x + 2
q = x^2 + 5*x + 6

poly_gcd(p, q)     # 最大公因式
poly_roots(p)      # 求根（符号优先）
poly_add(p, q)     # 多项式加法
poly_mul(p, q)     # 多项式乘法
```

### 3.4 线性方程组
```text
A_sys = [[2;1];[1;3]]
b = [[5];[10]]
solve_linear(A_sys, b)
```

或直接使用 SymPy solve：
```text
eq1 = 2*x + y - 5
eq2 = x + 3*y - 10
solve([eq1, eq2], [x, y])
```

### 3.5 线性变换与二次型
```text
# Gram-Schmidt 正交化
v1 = Matrix([[1],[0]])
v2 = Matrix([[1],[1]])
gram_schmidt(v1, v2)

# 二次型
Q = [[2;1];[1;3]]
vec = Matrix([[x],[y]])
quadratic_form(Q, vec)

# 双线性形式
bilinear_form(Q, u, v)

# 正定性与对称性
is_positive_definite(Q)
is_symmetric(Q)

# 内积与范数
dot(u, v)
norm(u)
```

---

## 4. 示例文件 / Example Files

- `examples/example.txt`：综合示例（矩阵 + 多项式 + 方程组）
- `test/test_matrix.txt`：完整功能测试
- `test/test_symbolic_eigen*.txt`：符号特征值测试

---

## 5. 中英双语支持 / Bilingual Support

运行时可指定语言：
```bash
python src/parser.py --lang zh input.txt   # 中文
python src/parser.py --lang en input.txt   # English
```

---

## 6. 扩展接口 / Extension Interface

- 新增函数只需在 `func_map` 中添加正则映射
- 新增类型支持可扩展 `safe_globals`
- 未来可支持自定义 `MatrixElement` 类型（分式、多项式等）

## 7. 高等代数内容覆盖 / Coverage of Higher Algebra Topics

当前已支持的主要内容：

- 矩阵论与行列式
- 线性方程组与向量空间
- 特征值、特征向量、相似/若当/有理/史密斯标准型
- 多项式环与特征多项式
- 线性变换与不变子空间
- 二次型、双线性形式、合同标准型
- 欧几里得/酉空间、内积、正交化、正定性

仍可继续扩展的方向：
- 模与理想（抽象代数）
- 群表示论
- 更复杂的线性算子理论

---

---

## 8. 注意事项 / Notes

- 多项式求根优先返回**符号形式**（如 `1 ± √5`）
- 矩阵元素含浮点数时，特征值等会退化为数值
- 线性方程组目前支持 2 变量示例，可扩展为通用 `solve`
- Gram-Schmidt 返回正交向量组（非单位化）

---

**祝学习愉快！ / Happy studying!**