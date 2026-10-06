from sleek import to_tree
from solution import Solution


# 1448. Count Good Nodes in Binary Tree


def test_example_1():
    assert Solution().goodNodes(to_tree([3, 1, 4, 3, None, 1, 5])) == 4


def test_example_2():
    assert Solution().goodNodes(to_tree([3, 3, None, 4, 2])) == 3


def test_example_3():
    assert Solution().goodNodes(to_tree([1])) == 1
