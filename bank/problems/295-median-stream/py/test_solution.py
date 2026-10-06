from sleek import run_ops
from solution import MedianFinder


# 295. Find Median from Data Stream


def test_example_1():
    ops = ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
    args = [[], [1], [2], [], [3], []]
    assert run_ops(MedianFinder, ops, args) == [None, None, None, 1.5, None, 2]
