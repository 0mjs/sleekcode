from sleek import from_graph, graph_nodes, to_graph
from solution import Solution


# 133. Clone Graph


def expect_deep_copy(adj):
    original = to_graph(adj)
    copy = Solution().cloneGraph(original)
    assert from_graph(copy) == adj
    # A real clone shares no nodes with the original
    originals = {id(n) for n in graph_nodes(original)}
    assert all(id(n) not in originals for n in graph_nodes(copy))


def test_example_1():
    expect_deep_copy([[2, 4], [1, 3], [2, 4], [1, 3]])


def test_example_2_single_node():
    expect_deep_copy([[]])


def test_example_3_empty_graph():
    assert Solution().cloneGraph(None) is None


def test_two_nodes():
    expect_deep_copy([[2], [1]])


def test_fully_connected():
    expect_deep_copy([[2, 3, 4], [1, 3, 4], [1, 2, 4], [1, 2, 3]])
