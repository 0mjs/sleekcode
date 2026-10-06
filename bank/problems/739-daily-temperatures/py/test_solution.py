from solution import Solution


# 739. Daily Temperatures


def test_example_1():
    assert Solution().dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0]


def test_example_2():
    assert Solution().dailyTemperatures([30, 40, 50, 60]) == [1, 1, 1, 0]


def test_example_3():
    assert Solution().dailyTemperatures([30, 60, 90]) == [1, 1, 0]
