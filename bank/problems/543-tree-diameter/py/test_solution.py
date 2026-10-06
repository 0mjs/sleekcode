from sleek import to_tree
from solution import Solution


# 543. Diameter of Binary Tree


def test_example_1():
    assert Solution().diameterOfBinaryTree(to_tree([1, 2, 3, 4, 5])) == 3


def test_example_2():
    assert Solution().diameterOfBinaryTree(to_tree([1, 2])) == 1
