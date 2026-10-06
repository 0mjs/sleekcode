from solution import Solution


# 269. Alien Dictionary
# Several orders can be correct, so check the rules the words imply instead of one exact answer.


def expect_valid_order(words):
    order = Solution().alienOrder(words)
    assert sorted(order) == sorted(set("".join(words)))  # every letter exactly once
    rank = {c: i for i, c in enumerate(order)}
    for a, b in zip(words, words[1:]):
        for x, y in zip(a, b):
            if x != y:
                assert rank[x] < rank[y]
                break


def test_example_1():
    assert Solution().alienOrder(["wrt", "wrf", "er", "ett", "rftt"]) == "wertf"


def test_example_2():
    assert Solution().alienOrder(["z", "x"]) == "zx"


def test_example_3_contradiction():
    assert Solution().alienOrder(["z", "x", "z"]) == ""


def test_longer_word_before_its_own_prefix_is_invalid():
    assert Solution().alienOrder(["abc", "ab"]) == ""


def test_single_word_any_order_of_its_letters():
    expect_valid_order(["zyx"])


def test_letters_with_no_constraints_still_appear():
    expect_valid_order(["ab", "adc"])


def test_identical_words():
    expect_valid_order(["z", "z"])
