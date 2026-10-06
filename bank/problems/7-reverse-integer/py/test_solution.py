from solution import Solution


# 7. Reverse Integer


def test_example_1():
    assert Solution().reverse(123) == 321


def test_example_2():
    assert Solution().reverse(-123) == -321


def test_example_3():
    assert Solution().reverse(120) == 21
