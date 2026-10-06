from sleek import run_ops
from solution import LRUCache


# 146. LRU Cache


def test_example_1():
    ops = ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
    args = [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
    assert run_ops(LRUCache, ops, args) == [None, None, None, 1, None, -1, None, -1, 3, 4]
