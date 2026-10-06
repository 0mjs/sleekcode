from solution import Solution


# 213. House Robber II


def test_example_1():
    assert Solution().rob([2, 3, 2]) == 3


def test_example_2():
    assert Solution().rob([1, 2, 3, 1]) == 4


def test_example_3():
    assert Solution().rob([1, 2, 3]) == 3
