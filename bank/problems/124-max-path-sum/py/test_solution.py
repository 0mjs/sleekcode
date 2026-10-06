from sleek import to_tree
from solution import Solution


# 124. Binary Tree Maximum Path Sum


def test_example_1():
    assert Solution().maxPathSum(to_tree([1, 2, 3])) == 6


def test_example_2():
    assert Solution().maxPathSum(to_tree([-10, 9, 20, None, None, 15, 7])) == 42
