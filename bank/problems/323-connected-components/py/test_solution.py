from solution import Solution


# 323. Number of Connected Components in an Undirected Graph


def test_example_1():
    assert Solution().countComponents(5, [[0, 1], [1, 2], [3, 4]]) == 2


def test_example_2():
    assert Solution().countComponents(5, [[0, 1], [1, 2], [2, 3], [3, 4]]) == 1


def test_isolated_nodes_each_count():
    assert Solution().countComponents(4, [[0, 1]]) == 3


def test_no_edges():
    assert Solution().countComponents(3, []) == 3


def test_cycle_is_still_one_component():
    assert Solution().countComponents(4, [[0, 1], [1, 2], [2, 0], [3, 2]]) == 1


def test_edges_given_in_reverse_direction():
    assert Solution().countComponents(6, [[1, 0], [2, 1], [5, 4]]) == 3
