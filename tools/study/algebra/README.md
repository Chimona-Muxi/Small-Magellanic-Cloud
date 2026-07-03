# 高等代数学习辅助器 (v0.2)

支持数值与符号矩阵的高级运算解析器。

## 功能
- 矩阵定义：支持整数、分式、根式、多项式、复数、符号
- 运算：
  - 基本：+, -, *, T, det, rank, trace, inv
  - 高级：eigvals, eigvects, jordan_form, smith_normal_form
  - 特征矩阵 (A - λI)
  - charpoly 等
- 从文本文件输入，自动解析执行

## 运行
```bash
python3 -m pip install -r ../requirements.txt
python src/parser.py examples/input.txt
```

## 在 Small Magellanic Cloud 中发布

本目录是主站 `/study/algebra/` 的核心计算项目。网页页面只提交输入文件内容，实际计算仍由本脚本完成。

本地从仓库根目录运行：

```bash
python3 tools/study/algebra/src/parser.py tools/study/algebra/examples/example.txt
```

网页 API：

```text
POST /api/study/algebra/evaluate
```

请求体：

```json
{ "source": "A = [[1;2];[3;4]]\nprint(det(A))", "lang": "zh" }
```

## 扩展接口
- 可轻松添加新函数映射
- 未来支持自定义 MatrixElement 类型
- 支持有理标准型、合同标准型等进一步实现

当前基于 SymPy 实现，兼顾符号与数值计算。
