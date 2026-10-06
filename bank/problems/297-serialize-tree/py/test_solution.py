from sleek import from_tree, to_tree
from solution import Codec


# 297. Serialize and Deserialize Binary Tree
# Any string format is fine, as long as deserialize(serialize(tree)) rebuilds the same tree.


def round_trip(values):
    return from_tree(Codec().deserialize(Codec().serialize(to_tree(values))))


def test_example_1():
    assert round_trip([1, 2, 3, None, None, 4, 5]) == [1, 2, 3, None, None, 4, 5]


def test_example_2_empty_tree():
    assert round_trip([]) == []


def test_single_node():
    assert round_trip([1]) == [1]


def test_negative_and_multi_digit_values():
    assert round_trip([-10, 200, -3000, None, 7]) == [-10, 200, -3000, None, 7]


def test_left_skewed_tree():
    assert round_trip([1, 2, None, 3, None, 4]) == [1, 2, None, 3, None, 4]


def test_serialize_returns_a_string():
    assert isinstance(Codec().serialize(to_tree([1, 2, 3])), str)
