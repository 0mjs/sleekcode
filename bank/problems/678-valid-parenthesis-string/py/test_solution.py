from solution import Solution


# 678. Valid Parenthesis String


def test_example_1():
    assert Solution().checkValidString("()") == True


def test_example_2():
    assert Solution().checkValidString("(*)") == True


def test_example_3():
    assert Solution().checkValidString("(*))") == True


def test_example_4():
    assert Solution().checkValidString("(") == False
