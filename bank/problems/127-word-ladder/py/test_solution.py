from solution import Solution


# 127. Word Ladder


def test_example_1():
    assert Solution().ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]) == 5


def test_example_2():
    assert Solution().ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log"]) == 0
