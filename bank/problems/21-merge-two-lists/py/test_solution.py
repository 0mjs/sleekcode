from sleek import from_list, to_list
from solution import Solution


# 21. Merge Two Sorted Lists


def test_example_1():
    assert from_list(Solution().mergeTwoLists(to_list([1, 2, 4]), to_list([1, 3, 4]))) == [1, 1, 2, 3, 4, 4]


def test_example_2():
    assert from_list(Solution().mergeTwoLists(to_list([]), to_list([]))) == []


def test_example_3():
    assert from_list(Solution().mergeTwoLists(to_list([]), to_list([0]))) == [0]
