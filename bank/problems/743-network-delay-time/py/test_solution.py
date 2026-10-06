from solution import Solution


# 743. Network Delay Time


def test_example_1():
    assert Solution().networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2) == 2


def test_example_2():
    assert Solution().networkDelayTime([[1, 2, 1]], 2, 1) == 1


def test_example_3():
    assert Solution().networkDelayTime([[1, 2, 1]], 2, 2) == -1
