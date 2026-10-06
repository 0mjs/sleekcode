from sleek import any_order_deep
from solution import Solution


# 49. Group Anagrams


def test_example_1():
    assert any_order_deep(Solution().groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])) == any_order_deep([["bat"], ["nat", "tan"], ["ate", "eat", "tea"]])


def test_example_2():
    assert any_order_deep(Solution().groupAnagrams([""])) == any_order_deep([[""]])


def test_example_3():
    assert any_order_deep(Solution().groupAnagrams(["a"])) == any_order_deep([["a"]])
