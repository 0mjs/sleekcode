from sleek import to_tree
from solution import Solution


# 110. Balanced Binary Tree


def test_example_1():
    assert Solution().isBalanced(to_tree([3, 9, 20, None, None, 15, 7])) == True


def test_example_2():
    assert Solution().isBalanced(to_tree([1, 2, 2, 3, 3, None, None, 4, 4])) == False


def test_example_3():
    assert Solution().isBalanced(to_tree([])) == True
