from sleek import run_ops
from solution import WordDictionary


# 211. Design Add and Search Words Data Structure


def test_example_1():
    ops = ["WordDictionary", "addWord", "addWord", "addWord", "search", "search", "search", "search"]
    args = [[], ["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]]
    assert run_ops(WordDictionary, ops, args) == [None, None, None, None, False, True, True, True]
