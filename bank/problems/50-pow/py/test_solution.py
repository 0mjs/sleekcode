import pytest

from solution import Solution


# 50. Pow(x, n)


def test_example_1():
    assert Solution().myPow(2, 10) == pytest.approx(1024)


def test_example_2():
    assert Solution().myPow(2.1, 3) == pytest.approx(9.261)


def test_example_3():
    assert Solution().myPow(2, -2) == pytest.approx(0.25)
