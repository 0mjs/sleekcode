from sleek import any_order
from solution import Solution


# 1. Two Sum


def test_example_1():
    assert any_order(Solution().twoSum([2, 7, 11, 15], 9)) == any_order([0, 1])


def test_example_2():
    assert any_order(Solution().twoSum([3, 2, 4], 6)) == any_order([1, 2])


def test_example_3():
    assert any_order(Solution().twoSum([3, 3], 6)) == any_order([0, 1])
