from solution import Solution


# 268. Missing Number


def test_example_1():
    assert Solution().missingNumber([3, 0, 1]) == 2


def test_example_2():
    assert Solution().missingNumber([0, 1]) == 2


def test_example_3():
    assert Solution().missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]) == 8
