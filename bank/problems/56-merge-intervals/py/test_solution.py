from solution import Solution


# 56. Merge Intervals


def test_example_1():
    assert Solution().merge([[1, 3], [2, 6], [8, 10], [15, 18]]) == [[1, 6], [8, 10], [15, 18]]


def test_example_2():
    assert Solution().merge([[1, 4], [4, 5]]) == [[1, 5]]


def test_example_3():
    assert Solution().merge([[4, 7], [1, 4]]) == [[1, 7]]
