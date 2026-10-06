"""
355. Design Twitter — Medium
https://leetcode.com/problems/design-twitter/
Pattern: Heap / Priority Queue

Full problem + examples in README.md
"""

from sleek import run_ops


class Twitter:

    def __init__(self):
        raise NotImplementedError("Not implemented")

    def postTweet(self, userId: int, tweetId: int) -> None:
        raise NotImplementedError("Not implemented")

    def getNewsFeed(self, userId: int) -> list[int]:
        raise NotImplementedError("Not implemented")

    def follow(self, followerId: int, followeeId: int) -> None:
        raise NotImplementedError("Not implemented")

    def unfollow(self, followerId: int, followeeId: int) -> None:
        raise NotImplementedError("Not implemented")


# Your Twitter object will be instantiated and called as such:
# obj = Twitter()
# obj.postTweet(userId,tweetId)
# param_2 = obj.getNewsFeed(userId)
# obj.follow(followerId,followeeId)
# obj.unfollow(followerId,followeeId)


# Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if __name__ == "__main__":
    print(run_ops(Twitter, ["Twitter", "postTweet", "getNewsFeed", "follow", "postTweet", "getNewsFeed", "unfollow", "getNewsFeed"], [[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]]))
