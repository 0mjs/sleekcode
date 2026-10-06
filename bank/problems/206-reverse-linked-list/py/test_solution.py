from sleek import from_list, to_list
from solution import Solution


# 206. Reverse Linked List


def test_example_1():
    assert from_list(Solution().reverseList(to_list([1, 2, 3, 4, 5]))) == [5, 4, 3, 2, 1]


def test_example_2():
    assert from_list(Solution().reverseList(to_list([1, 2]))) == [2, 1]


def test_example_3():
    assert from_list(Solution().reverseList(to_list([]))) == []
