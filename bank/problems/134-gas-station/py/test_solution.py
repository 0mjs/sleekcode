from solution import Solution


# 134. Gas Station


def test_example_1():
    assert Solution().canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]) == 3


def test_example_2():
    assert Solution().canCompleteCircuit([2, 3, 4], [3, 4, 3]) == -1
