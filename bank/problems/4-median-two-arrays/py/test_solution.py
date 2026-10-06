import pytest

from solution import Solution


# 4. Median of Two Sorted Arrays


def test_example_1():
    assert Solution().findMedianSortedArrays([1, 3], [2]) == pytest.approx(2)


def test_example_2():
    assert Solution().findMedianSortedArrays([1, 2], [3, 4]) == pytest.approx(2.5)
