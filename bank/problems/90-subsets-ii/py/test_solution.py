from sleek import any_order_deep
from solution import Solution


# 90. Subsets II


def test_example_1():
    assert any_order_deep(Solution().subsetsWithDup([1, 2, 2])) == any_order_deep([[], [1], [1, 2], [1, 2, 2], [2], [2, 2]])


def test_example_2():
    assert any_order_deep(Solution().subsetsWithDup([0])) == any_order_deep([[], [0]])
