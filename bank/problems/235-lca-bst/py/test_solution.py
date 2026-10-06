from sleek import find_node, to_tree
from solution import Solution


# 235. Lowest Common Ancestor of a Binary Search Tree

TREE = [6, 2, 8, 0, 4, 7, 9, None, None, 3, 5]


def lca(values, p, q):
    root = to_tree(values)
    return Solution().lowestCommonAncestor(root, find_node(root, p), find_node(root, q)).val


def test_example_1():
    assert lca(TREE, 2, 8) == 6


def test_example_2_node_is_its_own_ancestor():
    assert lca(TREE, 2, 4) == 2


def test_example_3():
    assert lca([2, 1], 2, 1) == 2


def test_both_in_left_subtree():
    assert lca(TREE, 3, 5) == 4


def test_both_in_right_subtree():
    assert lca(TREE, 7, 9) == 8


def test_deep_nodes_on_opposite_sides():
    assert lca(TREE, 3, 7) == 6
