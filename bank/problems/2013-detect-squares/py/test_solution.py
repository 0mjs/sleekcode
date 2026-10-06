from sleek import run_ops
from solution import DetectSquares


# 2013. Detect Squares


def test_example_1():
    ops = ["DetectSquares", "add", "add", "add", "count", "count", "add", "count"]
    args = [[], [[3, 10]], [[11, 2]], [[3, 2]], [[11, 10]], [[14, 8]], [[11, 2]], [[11, 10]]]
    assert run_ops(DetectSquares, ops, args) == [None, None, None, None, 1, 0, None, 2]
