from sleek import to_tree
from solution import Solution


# 102. Binary Tree Level Order Traversal


def test_example_1():
    assert Solution().levelOrder(to_tree([3, 9, 20, None, None, 15, 7])) == [[3], [9, 20], [15, 7]]


def test_example_2():
    assert Solution().levelOrder(to_tree([1])) == [[1]]


def test_example_3():
    assert Solution().levelOrder(to_tree([])) == []
