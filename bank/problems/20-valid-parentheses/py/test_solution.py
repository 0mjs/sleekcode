from solution import Solution


# 20. Valid Parentheses


def test_example_1():
    assert Solution().isValid("()") == True


def test_example_2():
    assert Solution().isValid("()[]{}") == True


def test_example_3():
    assert Solution().isValid("(]") == False


def test_example_4():
    assert Solution().isValid("([])") == True


def test_example_5():
    assert Solution().isValid("([)]") == False
