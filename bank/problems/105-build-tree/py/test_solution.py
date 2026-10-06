from sleek import from_tree
from solution import Solution


# 105. Construct Binary Tree from Preorder and Inorder Traversal


def test_example_1():
    assert from_tree(Solution().buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])) == [3, 9, 20, None, None, 15, 7]


def test_example_2():
    assert from_tree(Solution().buildTree([-1], [-1])) == [-1]
