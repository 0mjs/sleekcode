from sleek import any_order
from solution import Solution


# 347. Top K Frequent Elements


def test_example_1():
    assert any_order(Solution().topKFrequent([1, 1, 1, 2, 2, 3], 2)) == any_order([1, 2])


def test_example_2():
    assert any_order(Solution().topKFrequent([1], 1)) == any_order([1])


def test_example_3():
    assert any_order(Solution().topKFrequent([1, 2, 1, 2, 1, 2, 3, 1, 3, 2], 2)) == any_order([1, 2])
