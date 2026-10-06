from solution import Solution


# 217. Contains Duplicate


def test_example_1():
    assert Solution().containsDuplicate([1, 2, 3, 1]) == True


def test_example_2():
    assert Solution().containsDuplicate([1, 2, 3, 4]) == False


def test_example_3():
    assert Solution().containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]) == True
