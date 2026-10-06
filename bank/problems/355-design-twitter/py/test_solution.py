from sleek import run_ops
from solution import Twitter


# 355. Design Twitter


def test_example_1():
    ops = ["Twitter", "postTweet", "getNewsFeed", "follow", "postTweet", "getNewsFeed", "unfollow", "getNewsFeed"]
    args = [[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]]
    assert run_ops(Twitter, ops, args) == [None, None, [5], None, None, [6, 5], None, [5]]
