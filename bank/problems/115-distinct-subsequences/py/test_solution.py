from solution import Solution


# 115. Distinct Subsequences


def test_example_1():
    assert Solution().numDistinct("rabbbit", "rabbit") == 3


def test_example_2():
    assert Solution().numDistinct("babgbag", "bag") == 5
