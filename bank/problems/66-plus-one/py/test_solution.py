from solution import Solution


# 66. Plus One


def test_example_1():
    assert Solution().plusOne([1, 2, 3]) == [1, 2, 4]


def test_example_2():
    assert Solution().plusOne([4, 3, 2, 1]) == [4, 3, 2, 2]


def test_example_3():
    assert Solution().plusOne([9]) == [1, 0]
