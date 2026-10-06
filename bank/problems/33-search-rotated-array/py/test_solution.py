from solution import Solution


# 33. Search in Rotated Sorted Array


def test_example_1():
    assert Solution().search([4, 5, 6, 7, 0, 1, 2], 0) == 4


def test_example_2():
    assert Solution().search([4, 5, 6, 7, 0, 1, 2], 3) == -1


def test_example_3():
    assert Solution().search([1], 0) == -1
