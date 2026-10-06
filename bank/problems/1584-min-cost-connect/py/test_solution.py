from solution import Solution


# 1584. Min Cost to Connect All Points


def test_example_1():
    assert Solution().minCostConnectPoints([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]) == 20


def test_example_2():
    assert Solution().minCostConnectPoints([[3, 12], [-2, 5], [-4, 1]]) == 18
