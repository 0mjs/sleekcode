from sleek import any_order
from solution import Solution


# 51. N-Queens


def test_example_1():
    assert any_order(Solution().solveNQueens(4)) == any_order([[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]])


def test_example_2():
    assert any_order(Solution().solveNQueens(1)) == any_order([["Q"]])
