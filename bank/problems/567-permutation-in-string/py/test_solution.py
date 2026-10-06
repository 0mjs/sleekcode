from solution import Solution


# 567. Permutation in String


def test_example_1():
    assert Solution().checkInclusion("ab", "eidbaooo") == True


def test_example_2():
    assert Solution().checkInclusion("ab", "eidboaoo") == False
