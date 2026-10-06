from solution import Solution


# 261. Graph Valid Tree


def test_example_1():
    assert Solution().validTree(5, [[0, 1], [0, 2], [0, 3], [1, 4]]) is True


def test_example_2_has_a_cycle():
    assert Solution().validTree(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]) is False


def test_single_node_no_edges():
    assert Solution().validTree(1, []) is True


def test_disconnected():
    assert Solution().validTree(4, [[0, 1], [2, 3]]) is False


def test_two_nodes_with_no_edge():
    assert Solution().validTree(2, []) is False


def test_simple_chain():
    assert Solution().validTree(4, [[0, 1], [1, 2], [2, 3]]) is True
