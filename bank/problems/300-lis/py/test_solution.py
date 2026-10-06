from solution import Solution


# 300. Longest Increasing Subsequence


def test_example_1():
    assert Solution().lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]) == 4


def test_example_2():
    assert Solution().lengthOfLIS([0, 1, 0, 3, 2, 3]) == 4


def test_example_3():
    assert Solution().lengthOfLIS([7, 7, 7, 7, 7, 7, 7]) == 1
