from sleek import from_list, to_list
from solution import Solution


# 19. Remove Nth Node From End of List


def test_example_1():
    assert from_list(Solution().removeNthFromEnd(to_list([1, 2, 3, 4, 5]), 2)) == [1, 2, 3, 5]


def test_example_2():
    assert from_list(Solution().removeNthFromEnd(to_list([1]), 1)) == []


def test_example_3():
    assert from_list(Solution().removeNthFromEnd(to_list([1, 2]), 1)) == [1]
