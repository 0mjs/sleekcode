from sleek import to_tree
from solution import Solution


# 98. Validate Binary Search Tree


def test_example_1():
    assert Solution().isValidBST(to_tree([2, 1, 3])) == True


def test_example_2():
    assert Solution().isValidBST(to_tree([5, 1, 4, None, None, 3, 6])) == False
