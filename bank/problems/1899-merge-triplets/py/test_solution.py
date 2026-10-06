from solution import Solution


# 1899. Merge Triplets to Form Target Triplet


def test_example_1():
    assert Solution().mergeTriplets([[2, 5, 3], [1, 8, 4], [1, 7, 5]], [2, 7, 5]) == True


def test_example_2():
    assert Solution().mergeTriplets([[3, 4, 5], [4, 5, 6]], [3, 2, 5]) == False


def test_example_3():
    assert Solution().mergeTriplets([[2, 5, 3], [2, 3, 4], [1, 2, 5], [5, 2, 3]], [5, 5, 5]) == True
