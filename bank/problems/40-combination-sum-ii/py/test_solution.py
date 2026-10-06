from sleek import any_order_deep
from solution import Solution


# 40. Combination Sum II


def test_example_1():
    assert any_order_deep(Solution().combinationSum2([10, 1, 2, 7, 6, 1, 5], 8)) == any_order_deep([[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]])


def test_example_2():
    assert any_order_deep(Solution().combinationSum2([2, 5, 2, 1, 2], 5)) == any_order_deep([[1, 2, 2], [5]])
