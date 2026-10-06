from sleek import any_order_deep
from solution import Solution


# 78. Subsets


def test_example_1():
    assert any_order_deep(Solution().subsets([1, 2, 3])) == any_order_deep([[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]])


def test_example_2():
    assert any_order_deep(Solution().subsets([0])) == any_order_deep([[], [0]])
