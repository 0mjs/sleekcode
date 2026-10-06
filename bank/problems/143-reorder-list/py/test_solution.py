from sleek import from_list, to_list
from solution import Solution


# 143. Reorder List


def test_example_1():
    head = to_list([1, 2, 3, 4])
    Solution().reorderList(head)
    assert from_list(head) == [1, 4, 2, 3]


def test_example_2():
    head = to_list([1, 2, 3, 4, 5])
    Solution().reorderList(head)
    assert from_list(head) == [1, 5, 2, 4, 3]
