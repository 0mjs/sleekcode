from sleek import any_order_deep
from solution import Solution


# 39. Combination Sum


def test_example_1():
    assert any_order_deep(Solution().combinationSum([2, 3, 6, 7], 7)) == any_order_deep([[2, 2, 3], [7]])


def test_example_2():
    assert any_order_deep(Solution().combinationSum([2, 3, 5], 8)) == any_order_deep([[2, 2, 2, 2], [2, 3, 3], [3, 5]])


def test_example_3():
    assert any_order_deep(Solution().combinationSum([2], 1)) == any_order_deep([])
