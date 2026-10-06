from solution import Solution


# 435. Non-overlapping Intervals


def test_example_1():
    assert Solution().eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]) == 1


def test_example_2():
    assert Solution().eraseOverlapIntervals([[1, 2], [1, 2], [1, 2]]) == 2


def test_example_3():
    assert Solution().eraseOverlapIntervals([[1, 2], [2, 3]]) == 0
