import { runOps } from "../../lib";

/**
 * 355. Design Twitter — Medium
 * https://leetcode.com/problems/design-twitter/
 * Pattern: Heap / Priority Queue
 *
 * Full problem + examples in README.md
 */
export class Twitter {
  constructor() {
    throw new Error("Not implemented");
  }

  postTweet(userId: number, tweetId: number): void {
    throw new Error("Not implemented");
  }

  getNewsFeed(userId: number): number[] {
    throw new Error("Not implemented");
  }

  follow(followerId: number, followeeId: number): void {
    throw new Error("Not implemented");
  }

  unfollow(followerId: number, followeeId: number): void {
    throw new Error("Not implemented");
  }
}

/**
 * Your Twitter object will be instantiated and called as such:
 * var obj = new Twitter()
 * obj.postTweet(userId,tweetId)
 * var param_2 = obj.getNewsFeed(userId)
 * obj.follow(followerId,followeeId)
 * obj.unfollow(followerId,followeeId)
 */

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  console.log(runOps(Twitter, ["Twitter","postTweet","getNewsFeed","follow","postTweet","getNewsFeed","unfollow","getNewsFeed"], [[],[1,5],[1],[1,2],[2,6],[1],[1,2],[1]]));
}
