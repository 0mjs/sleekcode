from solution import Solution


# 994. Rotting Oranges


def test_example_1():
    assert Solution().orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]) == 4


def test_example_2():
    assert Solution().orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]) == -1


def test_example_3():
    assert Solution().orangesRotting([[0, 2]]) == 0
