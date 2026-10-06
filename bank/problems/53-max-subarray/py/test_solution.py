from solution import Solution


# 53. Maximum Subarray


def test_example_1():
    assert Solution().maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6


def test_example_2():
    assert Solution().maxSubArray([1]) == 1


def test_example_3():
    assert Solution().maxSubArray([5, 4, -1, 7, 8]) == 23
