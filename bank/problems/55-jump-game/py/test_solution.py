from solution import Solution


# 55. Jump Game


def test_example_1():
    assert Solution().canJump([2, 3, 1, 1, 4]) == True


def test_example_2():
    assert Solution().canJump([3, 2, 1, 0, 4]) == False
