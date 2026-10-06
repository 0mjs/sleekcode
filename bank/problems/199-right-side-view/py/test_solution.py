from sleek import to_tree
from solution import Solution


# 199. Binary Tree Right Side View


def test_example_1():
    assert Solution().rightSideView(to_tree([1, 2, 3, None, 5, None, 4])) == [1, 3, 4]


def test_example_2():
    assert Solution().rightSideView(to_tree([1, 2, 3, 4, None, None, None, 5])) == [1, 3, 4, 5]


def test_example_3():
    assert Solution().rightSideView(to_tree([1, None, 3])) == [1, 3]


def test_example_4():
    assert Solution().rightSideView(to_tree([])) == []
