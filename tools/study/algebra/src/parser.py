#!/usr/bin/env python3
"""
高等代数学习辅助器 - 高级语法解析器 (v0.2)

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

import sys
import re
import argparse
from typing import Any, Dict
import sympy as sp
from sympy import (
    Matrix, symbols, sqrt, Rational, I, simplify, pprint,
    Poly, gcd, roots, solve, eye, ImmutableDenseMatrix
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
    # 这里用括号平衡扫描，避免正则在 Matrix([[1,0],[0,1]]) 里提前截断。
    def _matrix_literal_end(s: str, start: int) -> int:
        depth = 0
        for index in range(start, len(s)):
            if s[index] == '[':
                depth += 1
            elif s[index] == ']':
                depth -= 1
                if depth == 0:
                    return index + 1
        return -1

    def _convert_matrices(s: str) -> str:
        parts = []
        index = 0
        while index < len(s):
            if s.startswith('[[', index):
                end = _matrix_literal_end(s, index)
                if end > index:
                    literal = s[index:end]
                    if s[max(0, index - 7):index] == 'Matrix(':
                        parts.append(literal)
                    else:
                        parts.append(f"Matrix({literal.replace(';', ',')})")
                    index = end
                    continue
            parts.append(s[index])
            index += 1
        return ''.join(parts)
    expr = _convert_matrices(expr)

    def _replace_charpoly(match: re.Match) -> str:
        matrix_name = match.group(1)
        variable_name = match.group(2) or "x"
        return f"({matrix_name}).charpoly(symbols('{variable_name}'))"

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
        # 多项式相关
        r'poly_gcd\(([^,]+),\s*([^)]+)\)': r'gcd(Poly(\1), Poly(\2))',
        r'poly_roots\(([^)]+)\)': r'roots(Poly(\1))',
        r'poly_add\(([^,]+),\s*([^)]+)\)': r'Poly(\1) + Poly(\2)',
        r'poly_mul\(([^,]+),\s*([^)]+)\)': r'Poly(\1) * Poly(\2)',
        # 线性方程组
        r'solve_linear\(([^,]+),\s*([^)]+)\)': r'solve((\1) * Matrix([[x],[y]]) - (\2), [x, y])',
        # 线性变换与二次型
        r'gram_schmidt\((.+)\)': r'Matrix.orthogonalize(\1)',
        r'quadratic_form\(([^,]+),\s*([^)]+)\)': r'(\2).T * (\1) * (\2)',
        r'bilinear_form\(([^,]+),\s*([^,]+),\s*([^)]+)\)': r'(\2).T * (\1) * (\3)',
        r'is_positive_definite\((\w+)\)': r'(\1).is_positive_definite',
        r'is_symmetric\((\w+)\)': r'(\1).is_symmetric()',
        r'norm\((\w+)\)': r'(\1).norm()',
        r'dot\(([^,]+),\s*([^)]+)\)': r'(\1).dot(\2)',
    }

    for pattern, repl in func_map.items():
        expr = re.sub(pattern, repl, expr)

    expr = re.sub(r'charpoly\((\w+)(?:,\s*(\w+))?\)', _replace_charpoly, expr)

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
        "ImmutableDenseMatrix": ImmutableDenseMatrix,
        "x": variables.get('x', symbols('x')),
        "y": variables.get('y', symbols('y')),
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
