from solution import Solution


# 191. Number of 1 Bits


def test_example_1():
    assert Solution().hammingWeight(11) == 3


def test_example_2():
    assert Solution().hammingWeight(128) == 1


def test_example_3():
    assert Solution().hammingWeight(2147483645) == 30
