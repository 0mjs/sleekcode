from solution import Solution


# 424. Longest Repeating Character Replacement


def test_example_1():
    assert Solution().characterReplacement("ABAB", 2) == 4


def test_example_2():
    assert Solution().characterReplacement("AABABBA", 1) == 4
