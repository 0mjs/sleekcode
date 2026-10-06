from solution import Solution


# 57. Insert Interval


def test_example_1():
    assert Solution().insert([[1, 3], [6, 9]], [2, 5]) == [[1, 5], [6, 9]]


def test_example_2():
    assert Solution().insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]) == [[1, 2], [3, 10], [12, 16]]
