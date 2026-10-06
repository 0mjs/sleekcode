from solution import Solution


# 494. Target Sum


def test_example_1():
    assert Solution().findTargetSumWays([1, 1, 1, 1, 1], 3) == 5


def test_example_2():
    assert Solution().findTargetSumWays([1], 1) == 1
