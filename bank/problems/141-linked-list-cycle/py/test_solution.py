from sleek import to_cycle_list
from solution import Solution


# 141. Linked List Cycle
# `pos` is the index the tail links back to (-1 = no cycle). Your function only gets `head`.


def test_example_1():
    assert Solution().hasCycle(to_cycle_list([3, 2, 0, -4], 1)) is True


def test_example_2():
    assert Solution().hasCycle(to_cycle_list([1, 2], 0)) is True


def test_example_3():
    assert Solution().hasCycle(to_cycle_list([1], -1)) is False


def test_empty_list():
    assert Solution().hasCycle(None) is False


def test_single_node_pointing_to_itself():
    assert Solution().hasCycle(to_cycle_list([1], 0)) is True


def test_long_list_without_a_cycle():
    assert Solution().hasCycle(to_cycle_list(list(range(10_000)), -1)) is False
