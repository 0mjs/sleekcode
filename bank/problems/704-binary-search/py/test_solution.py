from solution import Solution


# 704. Binary Search


def test_example_1():
    assert Solution().search([-1, 0, 3, 5, 9, 12], 9) == 4


def test_example_2():
    assert Solution().search([-1, 0, 3, 5, 9, 12], 2) == -1
