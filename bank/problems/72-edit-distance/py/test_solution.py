from solution import Solution


# 72. Edit Distance


def test_example_1():
    assert Solution().minDistance("horse", "ros") == 3


def test_example_2():
    assert Solution().minDistance("intention", "execution") == 5
