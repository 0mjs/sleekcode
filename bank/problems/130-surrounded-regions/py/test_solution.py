from solution import Solution


# 130. Surrounded Regions


def test_example_1():
    board = [["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]]
    Solution().solve(board)
    assert board == [["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "O", "X", "X"]]


def test_example_2():
    board = [["X"]]
    Solution().solve(board)
    assert board == [["X"]]
