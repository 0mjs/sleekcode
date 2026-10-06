from sleek import from_random_list, random_list_nodes, to_random_list
from solution import Solution


# 138. Copy List with Random Pointer


def expect_deep_copy(pairs):
    original = to_random_list(pairs)
    copy = Solution().copyRandomList(original)
    assert from_random_list(copy) == pairs
    # None of the copied nodes (or their pointers) may point into the original list
    originals = {id(n) for n in random_list_nodes(original)}
    for n in random_list_nodes(copy):
        assert id(n) not in originals
        assert n.random is None or id(n.random) not in originals
    assert from_random_list(original) == pairs  # original left untouched


def test_example_1():
    expect_deep_copy([[7, None], [13, 0], [11, 4], [10, 2], [1, 0]])


def test_example_2():
    expect_deep_copy([[1, 1], [2, 1]])


def test_example_3():
    expect_deep_copy([[3, None], [3, 0], [3, None]])


def test_empty_list():
    assert Solution().copyRandomList(None) is None


def test_random_points_to_itself():
    expect_deep_copy([[5, 0]])
