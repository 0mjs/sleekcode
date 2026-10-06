from sleek import to_tree
from solution import Solution


# 572. Subtree of Another Tree


def test_example_1():
    assert Solution().isSubtree(to_tree([3, 4, 5, 1, 2]), to_tree([4, 1, 2])) == True


def test_example_2():
    assert Solution().isSubtree(to_tree([3, 4, 5, 1, 2, None, None, None, None, 0]), to_tree([4, 1, 2])) == False
