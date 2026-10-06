from sleek import any_order
from solution import Solution


# 17. Letter Combinations of a Phone Number


def test_example_1():
    assert any_order(Solution().letterCombinations("23")) == any_order(["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"])


def test_example_2():
    assert any_order(Solution().letterCombinations("2")) == any_order(["a", "b", "c"])
