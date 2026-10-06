from solution import Solution


# 136. Single Number


def test_example_1():
    assert Solution().singleNumber([2, 2, 1]) == 1


def test_example_2():
    assert Solution().singleNumber([4, 1, 2, 1, 2]) == 4


def test_example_3():
    assert Solution().singleNumber([1]) == 1
