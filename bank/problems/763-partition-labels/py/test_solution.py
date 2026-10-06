from solution import Solution


# 763. Partition Labels


def test_example_1():
    assert Solution().partitionLabels("ababcbacadefegdehijhklij") == [9, 7, 8]


def test_example_2():
    assert Solution().partitionLabels("eccbbbbdec") == [10]
