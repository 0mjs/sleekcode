from solution import Solution


# 150. Evaluate Reverse Polish Notation


def test_example_1():
    assert Solution().evalRPN(["2", "1", "+", "3", "*"]) == 9


def test_example_2():
    assert Solution().evalRPN(["4", "13", "5", "/", "+"]) == 6


def test_example_3():
    assert Solution().evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]) == 22
