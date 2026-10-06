from sleek import run_ops
from solution import KthLargest


# 703. Kth Largest Element in a Stream


def test_example_1():
    ops = ["KthLargest", "add", "add", "add", "add", "add"]
    args = [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]
    assert run_ops(KthLargest, ops, args) == [None, 4, 5, 5, 8, 8]


def test_example_2():
    ops = ["KthLargest", "add", "add", "add", "add"]
    args = [[4, [7, 7, 7, 7, 8, 3]], [2], [10], [9], [9]]
    assert run_ops(KthLargest, ops, args) == [None, 7, 7, 7, 8]
