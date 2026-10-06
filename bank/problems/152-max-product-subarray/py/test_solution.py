from solution import Solution


# 152. Maximum Product Subarray


def test_example_1():
    assert Solution().maxProduct([2, 3, -2, 4]) == 6


def test_example_2():
    assert Solution().maxProduct([-2, 0, -1]) == 0
