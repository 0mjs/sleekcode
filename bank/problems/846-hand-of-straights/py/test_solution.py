from solution import Solution


# 846. Hand of Straights


def test_example_1():
    assert Solution().isNStraightHand([1, 2, 3, 6, 2, 3, 4, 7, 8], 3) == True


def test_example_2():
    assert Solution().isNStraightHand([1, 2, 3, 4, 5], 4) == False
