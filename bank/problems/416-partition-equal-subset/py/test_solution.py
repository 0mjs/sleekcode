from solution import Solution


# 416. Partition Equal Subset Sum


def test_example_1():
    assert Solution().canPartition([1, 5, 11, 5]) == True


def test_example_2():
    assert Solution().canPartition([1, 2, 3, 5]) == False
