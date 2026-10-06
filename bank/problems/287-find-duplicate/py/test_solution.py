from solution import Solution


# 287. Find the Duplicate Number


def test_example_1():
    assert Solution().findDuplicate([1, 3, 4, 2, 2]) == 2


def test_example_2():
    assert Solution().findDuplicate([3, 1, 3, 4, 2]) == 3


def test_example_3():
    assert Solution().findDuplicate([3, 3, 3, 3, 3]) == 3
