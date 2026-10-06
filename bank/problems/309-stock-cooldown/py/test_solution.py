from solution import Solution


# 309. Best Time to Buy and Sell Stock with Cooldown


def test_example_1():
    assert Solution().maxProfit([1, 2, 3, 0, 2]) == 3


def test_example_2():
    assert Solution().maxProfit([1]) == 0
