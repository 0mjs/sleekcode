from solution import Solution


# 684. Redundant Connection


def test_example_1():
    assert Solution().findRedundantConnection([[1, 2], [1, 3], [2, 3]]) == [2, 3]


def test_example_2():
    assert Solution().findRedundantConnection([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]) == [1, 4]
