from solution import Solution


# 153. Find Minimum in Rotated Sorted Array


def test_example_1():
    assert Solution().findMin([3, 4, 5, 1, 2]) == 1


def test_example_2():
    assert Solution().findMin([4, 5, 6, 7, 0, 1, 2]) == 0


def test_example_3():
    assert Solution().findMin([11, 13, 15, 17]) == 11
