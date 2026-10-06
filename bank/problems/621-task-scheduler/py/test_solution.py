from solution import Solution


# 621. Task Scheduler


def test_example_1():
    assert Solution().leastInterval(["A", "A", "A", "B", "B", "B"], 2) == 8


def test_example_2():
    assert Solution().leastInterval(["A", "C", "A", "B", "D", "B"], 1) == 6


def test_example_3():
    assert Solution().leastInterval(["A", "A", "A", "B", "B", "B"], 3) == 10
