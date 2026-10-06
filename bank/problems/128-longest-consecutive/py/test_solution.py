from solution import Solution


# 128. Longest Consecutive Sequence


def test_example_1():
    assert Solution().longestConsecutive([100, 4, 200, 1, 3, 2]) == 4


def test_example_2():
    assert Solution().longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]) == 9


def test_example_3():
    assert Solution().longestConsecutive([1, 0, 1, 2]) == 3
