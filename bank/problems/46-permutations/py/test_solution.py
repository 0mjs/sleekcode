from sleek import any_order
from solution import Solution


# 46. Permutations


def test_example_1():
    assert any_order(Solution().permute([1, 2, 3])) == any_order([[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]])


def test_example_2():
    assert any_order(Solution().permute([0, 1])) == any_order([[0, 1], [1, 0]])


def test_example_3():
    assert any_order(Solution().permute([1])) == any_order([[1]])
