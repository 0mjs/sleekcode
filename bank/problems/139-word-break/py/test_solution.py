from solution import Solution


# 139. Word Break


def test_example_1():
    assert Solution().wordBreak("leetcode", ["leet", "code"]) == True


def test_example_2():
    assert Solution().wordBreak("applepenapple", ["apple", "pen"]) == True


def test_example_3():
    assert Solution().wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"]) == False
