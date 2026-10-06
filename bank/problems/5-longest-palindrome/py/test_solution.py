from solution import Solution


# 5. Longest Palindromic Substring


def test_example_1():
    assert Solution().longestPalindrome("babad") == "bab"


def test_example_2():
    assert Solution().longestPalindrome("cbbd") == "bb"
