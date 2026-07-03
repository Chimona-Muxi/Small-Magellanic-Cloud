#!/usr/bin/env python3
"""
数学分析学习辅助器 - 符号理论推导器 (v0.2)

目标：像高等代数辅助器一样，输入文件 → 输出漂亮的符号推导结果
重点支持数学分析理论学习（非数值计算）
"""

import sys
import re
import sympy as sp
from sympy import (
    symbols, Function, Eq,
    limit, diff, integrate, series, summation, dsolve,
    sin, cos, exp, log, oo, pi, pprint, latex
)

# 全局符号
x, y, z, t, n = symbols('x y z t n')
f = Function('f')

def evaluate_line(line: str):
    """解析并执行单行数学分析表达式"""
    line = line.strip()
    if not line or line.startswith('#'):
        return

    print(f"\n>>> {line}")

    try:
        # 极限
        if line.startswith('limit('):
            expr = eval(line, {"__builtins__": {}}, {
                "limit": limit, "sin": sin, "cos": cos, "exp": exp,
                "log": log, "oo": oo, "x": x, "symbols": symbols
            })
            print("极限结果:")
            pprint(expr)

        # 导数 / 偏导数
        elif line.startswith('diff('):
            expr = eval(line, {"__builtins__": {}}, {
                "diff": diff, "sin": sin, "cos": cos, "exp": exp, "x": x, "y": y
            })
            print("导数/偏导数结果:")
            pprint(expr)

        # 积分
        elif line.startswith('integrate('):
            expr = eval(line, {"__builtins__": {}}, {
                "integrate": integrate, "sin": sin, "cos": cos, "exp": exp,
                "oo": oo, "x": x
            })
            print("积分结果:")
            pprint(expr)

        # 泰勒 / 级数展开
        elif line.startswith('series('):
            expr = eval(line, {"__builtins__": {}}, {
                "series": series, "sin": sin, "cos": cos, "exp": exp, "x": x
            })
            print("级数展开:")
            pprint(expr)

        # 级数求和
        elif line.startswith('summation('):
            expr = eval(line, {"__builtins__": {}}, {
                "summation": summation, "n": n, "oo": oo
            })
            print("级数求和结果:")
            pprint(expr)

        # 常微分方程
        elif line.startswith('dsolve('):
            expr = eval(line, {"__builtins__": {}}, {
                "dsolve": dsolve, "Eq": Eq, "f": f, "x": x
            })
            print("微分方程解:")
            pprint(expr)

        else:
            # 尝试直接 sympify
            expr = sp.sympify(line)
            print("符号表达式:")
            pprint(expr)

    except Exception as e:
        print(f"计算失败: {e}")

def main(input_file: str):
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"找不到文件: {input_file}")
        return

    print("数学分析学习辅助器 - 符号理论推导开始\n" + "="*50)
    for line in lines:
        evaluate_line(line)
    print("\n" + "="*50 + "\n符号推导完成。")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python parser.py <file.ma>")
        sys.exit(1)
    main(sys.argv[1])