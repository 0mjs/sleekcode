from solution import Solution


# 778. Swim in Rising Water


def test_example_1():
    assert Solution().swimInWater([[0, 2], [1, 3]]) == 3


def test_example_2():
    assert Solution().swimInWater([[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]]) == 16
