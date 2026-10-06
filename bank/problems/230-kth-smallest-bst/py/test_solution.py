from sleek import to_tree
from solution import Solution


# 230. Kth Smallest Element in a BST


def test_example_1():
    assert Solution().kthSmallest(to_tree([3, 1, 4, None, 2]), 1) == 1


def test_example_2():
    assert Solution().kthSmallest(to_tree([5, 3, 6, 2, 4, None, None, 1]), 3) == 3
