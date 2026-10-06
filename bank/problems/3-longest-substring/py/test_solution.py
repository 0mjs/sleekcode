from solution import Solution


# 3. Longest Substring Without Repeating Characters


def test_example_1():
    assert Solution().lengthOfLongestSubstring("abcabcbb") == 3


def test_example_2():
    assert Solution().lengthOfLongestSubstring("bbbbb") == 1


def test_example_3():
    assert Solution().lengthOfLongestSubstring("pwwkew") == 3
