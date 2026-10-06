from sleek import run_ops
from solution import MinStack


# 155. Min Stack


def test_example_1():
    ops = ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"]
    args = [[], [-2], [0], [-3], [], [], [], []]
    assert run_ops(MinStack, ops, args) == [None, None, None, None, -3, None, 0, -2]
