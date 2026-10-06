from sleek import any_order
from solution import Solution


# 973. K Closest Points to Origin


def test_example_1():
    assert any_order(Solution().kClosest([[1, 3], [-2, 2]], 1)) == any_order([[-2, 2]])


def test_example_2():
    assert any_order(Solution().kClosest([[3, 3], [5, -1], [-2, 4]], 2)) == any_order([[3, 3], [-2, 4]])
