from sleek import to_tree
from solution import Solution


# 100. Same Tree


def test_example_1():
    assert Solution().isSameTree(to_tree([1, 2, 3]), to_tree([1, 2, 3])) == True


def test_example_2():
    assert Solution().isSameTree(to_tree([1, 2]), to_tree([1, None, 2])) == False


def test_example_3():
    assert Solution().isSameTree(to_tree([1, 2, 1]), to_tree([1, 1, 2])) == False
