from sleek import from_list, to_list
from solution import Solution


# 25. Reverse Nodes in k-Group


def test_example_1():
    assert from_list(Solution().reverseKGroup(to_list([1, 2, 3, 4, 5]), 2)) == [2, 1, 4, 3, 5]


def test_example_2():
    assert from_list(Solution().reverseKGroup(to_list([1, 2, 3, 4, 5]), 3)) == [3, 2, 1, 4, 5]
