from solution import Solution


# 242. Valid Anagram


def test_example_1():
    assert Solution().isAnagram("anagram", "nagaram") == True


def test_example_2():
    assert Solution().isAnagram("rat", "car") == False
