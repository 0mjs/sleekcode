from solution import Solution


# 121. Best Time to Buy and Sell Stock


def test_example_1():
    assert Solution().maxProfit([7, 1, 5, 3, 6, 4]) == 5


def test_example_2():
    assert Solution().maxProfit([7, 6, 4, 3, 1]) == 0
