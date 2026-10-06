from sleek import run_ops
from solution import TimeMap


# 981. Time Based Key-Value Store


def test_example_1():
    ops = ["TimeMap", "set", "get", "get", "set", "get", "get"]
    args = [[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]
    assert run_ops(TimeMap, ops, args) == [None, None, "bar", "bar", None, "bar2", "bar2"]
