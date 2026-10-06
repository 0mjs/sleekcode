from sleek import from_list, to_list
from solution import Solution


# 23. Merge k Sorted Lists


def test_example_1():
    assert from_list(Solution().mergeKLists([to_list(x) for x in [[1, 4, 5], [1, 3, 4], [2, 6]]])) == [1, 1, 2, 3, 4, 4, 5, 6]


def test_example_2():
    assert from_list(Solution().mergeKLists([to_list(x) for x in []])) == []


def test_example_3():
    assert from_list(Solution().mergeKLists([to_list(x) for x in [[]]])) == []
