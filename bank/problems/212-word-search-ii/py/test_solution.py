from sleek import any_order
from solution import Solution


# 212. Word Search II


def test_example_1():
    assert any_order(Solution().findWords([["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]], ["oath", "pea", "eat", "rain"])) == any_order(["eat", "oath"])


def test_example_2():
    assert any_order(Solution().findWords([["a", "b"], ["c", "d"]], ["abcb"])) == any_order([])
