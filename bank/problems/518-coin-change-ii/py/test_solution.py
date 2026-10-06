from solution import Solution


# 518. Coin Change II


def test_example_1():
    assert Solution().change(5, [1, 2, 5]) == 4


def test_example_2():
    assert Solution().change(3, [2]) == 0


def test_example_3():
    assert Solution().change(10, [10]) == 1
