from solution import Solution


# 11. Container With Most Water


def test_example_1():
    assert Solution().maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49


def test_example_2():
    assert Solution().maxArea([1, 1]) == 1
