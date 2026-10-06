from solution import Solution


# 746. Min Cost Climbing Stairs


def test_example_1():
    assert Solution().minCostClimbingStairs([10, 15, 20]) == 15


def test_example_2():
    assert Solution().minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]) == 6
