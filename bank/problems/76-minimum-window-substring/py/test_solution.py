from solution import Solution


# 76. Minimum Window Substring


def test_example_1():
    assert Solution().minWindow("ADOBECODEBANC", "ABC") == "BANC"


def test_example_2():
    assert Solution().minWindow("a", "a") == "a"


def test_example_3():
    assert Solution().minWindow("a", "aa") == ""
