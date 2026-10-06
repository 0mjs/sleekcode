from solution import Solution


# 91. Decode Ways


def test_example_1():
    assert Solution().numDecodings("12") == 2


def test_example_2():
    assert Solution().numDecodings("226") == 3


def test_example_3():
    assert Solution().numDecodings("06") == 0
