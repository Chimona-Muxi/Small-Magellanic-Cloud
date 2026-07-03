# 高等代数学习辅助器 - 完整语法参考手册
# Higher Algebra Learning Assistant - Complete Syntax Reference Manual

**版本 / Version**: v0.4  
**最后更新 / Last Updated**: 2026-06-06

---

## 1. 基本语法规则 / Basic Syntax Rules

### 1.1 赋值语句
```text
变量名 = 表达式
```
示例：
```text
A = [[1;2];[3;4]]
p = x^2 + 3*x + 2
```

### 1.2 直接表达式（自动打印结果）
```text
det(A)
eigvals(A)
poly_roots(p)
```

### 1.3 输出语句
```text
print(表达式)
```
示例：
```text
print(A)
print(det(A))
```

### 1.4 注释
以 `#` 开头的行为注释，解析器会忽略。

### 1.5 符号定义
```text
x, y = symbols('x y')
# 或分别定义
x = symbols('x')
y = symbols('y')
```

---

## 2. 矩阵语法 / Matrix Syntax

### 2.1 矩阵定义
**格式**：`[[元素;元素];[元素;元素]]`（使用 `;` 分隔）

```text
A = [[1;2];[3;4]]
B = [[x^2 + 1; 0]; [0; x + 1]]
C = [[1/2; sqrt(2)]; [x+1; I]]
```

### 2.2 矩阵运算符与函数

| 运算 / Operation       | 语法 / Syntax              | 示例                  | 说明 / Description          |
|------------------------|----------------------------|-----------------------|-----------------------------|
| 转置                   | `A^T`                      | `A^T`                 | 矩阵转置                    |
| 行列式                 | `det(A)`                   | `det(A)`              | 行列式                      |
| 秩                     | `rank(A)`                  | `rank(A)`             | 矩阵秩                      |
| 迹                     | `tr(A)` 或 `trace(A)`      | `tr(A)`               | 矩阵迹                      |
| 逆                     | `inv(A)`                   | `inv(A)`              | 逆矩阵                      |
| 特征值                 | `eigvals(A)`               | `eigvals(A)`          | 特征值（符号优先）          |
| 特征向量               | `eigvects(A)`              | `eigvects(A)`         | 特征向量                    |
| 若当标准型             | `jordan(A)`                | `jordan(A)`           | Jordan 标准型               |
| 史密斯标准型           | `smith(A)`                 | `smith(A)`            | Smith 标准型                |
| 矩阵指数               | `exp(A)`                   | `exp(A)`              | 矩阵指数                    |
| 特征多项式             | `charpoly(A)`              | `charpoly(A)`         | 特征多项式                  |
| λ-矩阵                 | `A - lam * eye(n)`         | `A - lam * eye(2)`    | 特征矩阵                    |

### 2.3 特殊矩阵构造
```text
eye(2)                    # 2×2 单位矩阵
Matrix([[1],[0]])         # 列向量
```

---

## 3. 多项式语法 / Polynomial Syntax

### 3.1 多项式定义
```text
p = x^2 + 3*x + 2
q = x^2 + 5*x + 6
```

### 3.2 多项式函数

| 函数 / Function        | 语法 / Syntax                  | 示例                     | 说明 / Description             |
|------------------------|--------------------------------|--------------------------|--------------------------------|
| 多项式加法             | `poly_add(p, q)`               | `poly_add(p, q)`         | 同类项自动合并                 |
| 多项式乘法             | `poly_mul(p, q)`               | `poly_mul(p, q)`         | 多项式乘法                     |
| 最大公因式             | `poly_gcd(p, q)`               | `poly_gcd(p, q)`         | 返回 GCD（符号形式）           |
| 多项式求根             | `poly_roots(p)`                | `poly_roots(p)`          | 优先返回符号根                 |

---

## 4. 线性方程组语法 / Linear System Syntax

### 4.1 使用 `solve_linear`
```text
A_sys = [[2;1];[1;3]]
b = [[5];[10]]
solve_linear(A_sys, b)
```

### 4.2 直接使用 `solve`
```text
eq1 = 2*x + y - 5
eq2 = x + 3*y - 10
solve([eq1, eq2], [x, y])
```

---

## 5. 线性变换与二次型语法 / Linear Transformation & Quadratic Form

### 5.1 Gram-Schmidt 正交化
```text
v1 = Matrix([[1],[0]])
v2 = Matrix([[1],[1]])
gram_schmidt(v1, v2)
```

### 5.2 二次型
```text
Q = [[2;1];[1;3]]
vec = Matrix([[x],[y]])
quadratic_form(Q, vec)
```

### 5.3 双线性形式
```text
u = Matrix([[1],[0]])
v = Matrix([[0],[1]])
bilinear_form(Q, u, v)
```

### 5.4 正定性与对称性
```text
is_positive_definite(Q)
is_symmetric(Q)
```

### 5.5 内积与范数
```text
dot(u, v)
norm(u)
```

---

## 6. 完整函数速查表 / Complete Function Quick Reference

### 6.1 矩阵类函数
| 中文名称           | 英文函数名                  | 返回类型          |
|--------------------|-----------------------------|-------------------|
| 行列式             | `det(A)`                    | 标量              |
| 秩                 | `rank(A)`                   | 整数              |
| 迹                 | `tr(A)`                     | 标量              |
| 逆                 | `inv(A)`                    | 矩阵              |
| 特征值             | `eigvals(A)`                | 字典（符号优先）  |
| 特征向量           | `eigvects(A)`               | 列表              |
| 若当标准型         | `jordan(A)`                 | 元组              |
| 史密斯标准型       | `smith(A)`                  | 矩阵              |
| 矩阵指数           | `exp(A)`                    | 矩阵              |
| 特征多项式         | `charpoly(A)`               | 多项式            |

### 6.2 多项式类函数
| 函数               | 说明                       |
|--------------------|----------------------------|
| `poly_add`         | 多项式加法                 |
| `poly_mul`         | 多项式乘法                 |
| `poly_gcd`         | 最大公因式                 |
| `poly_roots`       | 多项式求根（符号优先）     |

### 6.3 线性方程组
| 函数               | 说明                       |
|--------------------|----------------------------|
| `solve_linear(A,b)`| 求解 Ax=b                  |
| `solve`            | SymPy 通用求解器           |

### 6.4 线性变换与二次型
| 函数                        | 说明                          |
|-----------------------------|-------------------------------|
| `gram_schmidt(v1,v2,...)`   | Gram-Schmidt 正交化           |
| `quadratic_form(Q, vec)`    | 二次型                        |
| `bilinear_form(Q,u,v)`      | 双线性形式                    |
| `is_positive_definite(Q)`   | 正定性判断                    |
| `is_symmetric(Q)`           | 对称性判断                    |
| `dot(u,v)`                  | 内积                          |
| `norm(u)`                   | 范数                          |

---

## 7. 语言切换 / Language Switching

```bash
# 中文（默认）
python src/parser.py input.txt

# 英文
python src/parser.py --lang en input.txt
```

---

## 8. 示例文件 / Example Files

- `examples/example.txt` — 综合示例
- `test/test_full_features.txt` — 完整功能测试
- `test/test_symbolic_eigen*.txt` — 符号特征值测试

---

## 9. 注意事项 / Notes

- 所有运算优先返回**符号形式**（如 `1 ± √5`）
- 矩阵元素含浮点数时，结果可能退化为数值
- 多项式求根默认使用 `Poly` 对象
- Gram-Schmidt 返回正交向量组（非单位化）
- 当前线性方程组示例主要支持 2 变量，可扩展

---

**祝使用愉快！ / Happy using!**