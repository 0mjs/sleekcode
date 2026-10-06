from sleek import any_order
from solution import Solution


# 417. Pacific Atlantic Water Flow


def test_example_1():
    assert any_order(Solution().pacificAtlantic([[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]])) == any_order([[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]])


def test_example_2():
    assert any_order(Solution().pacificAtlantic([[1]])) == any_order([[0, 0]])
