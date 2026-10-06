from sleek import to_tree
from solution import Solution


# 104. Maximum Depth of Binary Tree


def test_example_1():
    assert Solution().maxDepth(to_tree([3, 9, 20, None, None, 15, 7])) == 3


def test_example_2():
    assert Solution().maxDepth(to_tree([1, None, 2])) == 2
