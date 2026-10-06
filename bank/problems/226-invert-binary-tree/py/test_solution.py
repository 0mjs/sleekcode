from sleek import from_tree, to_tree
from solution import Solution


# 226. Invert Binary Tree


def test_example_1():
    assert from_tree(Solution().invertTree(to_tree([4, 2, 7, 1, 3, 6, 9]))) == [4, 7, 2, 9, 6, 3, 1]


def test_example_2():
    assert from_tree(Solution().invertTree(to_tree([2, 1, 3]))) == [2, 3, 1]


def test_example_3():
    assert from_tree(Solution().invertTree(to_tree([]))) == []
