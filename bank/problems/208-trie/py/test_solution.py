from sleek import run_ops
from solution import Trie


# 208. Implement Trie (Prefix Tree)


def test_example_1():
    ops = ["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
    args = [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
    assert run_ops(Trie, ops, args) == [None, None, True, False, True, None, True]
