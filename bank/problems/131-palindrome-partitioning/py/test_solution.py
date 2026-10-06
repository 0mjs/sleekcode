from sleek import any_order
from solution import Solution


# 131. Palindrome Partitioning


def test_example_1():
    assert any_order(Solution().partition("aab")) == any_order([["a", "a", "b"], ["aa", "b"]])


def test_example_2():
    assert any_order(Solution().partition("a")) == any_order([["a"]])
