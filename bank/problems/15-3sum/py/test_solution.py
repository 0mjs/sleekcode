from sleek import any_order_deep
from solution import Solution


# 15. 3Sum


def test_example_1():
    assert any_order_deep(Solution().threeSum([-1, 0, 1, 2, -1, -4])) == any_order_deep([[-1, -1, 2], [-1, 0, 1]])


def test_example_2():
    assert any_order_deep(Solution().threeSum([0, 1, 1])) == any_order_deep([])


def test_example_3():
    assert any_order_deep(Solution().threeSum([0, 0, 0])) == any_order_deep([[0, 0, 0]])
