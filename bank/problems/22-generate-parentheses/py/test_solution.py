from sleek import any_order
from solution import Solution


# 22. Generate Parentheses


def test_example_1():
    assert any_order(Solution().generateParenthesis(3)) == any_order(["((()))", "(()())", "(())()", "()(())", "()()()"])


def test_example_2():
    assert any_order(Solution().generateParenthesis(1)) == any_order(["()"])
