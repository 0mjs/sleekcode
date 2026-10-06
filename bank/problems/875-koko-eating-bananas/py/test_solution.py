from solution import Solution


# 875. Koko Eating Bananas


def test_example_1():
    assert Solution().minEatingSpeed([3, 6, 7, 11], 8) == 4


def test_example_2():
    assert Solution().minEatingSpeed([30, 11, 23, 4, 20], 5) == 30


def test_example_3():
    assert Solution().minEatingSpeed([30, 11, 23, 4, 20], 6) == 23
