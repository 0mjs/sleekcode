from solution import Solution


# 167. Two Sum II - Input Array Is Sorted


def test_example_1():
    assert Solution().twoSum([2, 7, 11, 15], 9) == [1, 2]


def test_example_2():
    assert Solution().twoSum([2, 3, 4], 6) == [1, 3]


def test_example_3():
    assert Solution().twoSum([-1, 0], -1) == [1, 2]
