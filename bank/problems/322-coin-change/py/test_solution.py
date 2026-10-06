from solution import Solution


# 322. Coin Change


def test_example_1():
    assert Solution().coinChange([1, 2, 5], 11) == 3


def test_example_2():
    assert Solution().coinChange([2], 3) == -1


def test_example_3():
    assert Solution().coinChange([1], 0) == 0
