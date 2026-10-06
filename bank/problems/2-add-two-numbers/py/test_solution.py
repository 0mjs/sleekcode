from sleek import from_list, to_list
from solution import Solution


# 2. Add Two Numbers


def test_example_1():
    assert from_list(Solution().addTwoNumbers(to_list([2, 4, 3]), to_list([5, 6, 4]))) == [7, 0, 8]


def test_example_2():
    assert from_list(Solution().addTwoNumbers(to_list([0]), to_list([0]))) == [0]


def test_example_3():
    assert from_list(Solution().addTwoNumbers(to_list([9, 9, 9, 9, 9, 9, 9]), to_list([9, 9, 9, 9]))) == [8, 9, 9, 9, 0, 0, 0, 1]
