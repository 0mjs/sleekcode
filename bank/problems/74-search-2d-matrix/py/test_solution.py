from solution import Solution


# 74. Search a 2D Matrix


def test_example_1():
    assert Solution().searchMatrix([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3) == True


def test_example_2():
    assert Solution().searchMatrix([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13) == False
