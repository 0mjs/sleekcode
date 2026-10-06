from solution import Solution


# 329. Longest Increasing Path in a Matrix


def test_example_1():
    assert Solution().longestIncreasingPath([[9, 9, 4], [6, 6, 8], [2, 1, 1]]) == 4


def test_example_2():
    assert Solution().longestIncreasingPath([[3, 4, 5], [3, 2, 6], [2, 2, 1]]) == 4


def test_example_3():
    assert Solution().longestIncreasingPath([[1]]) == 1
