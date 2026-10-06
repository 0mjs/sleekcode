import { describe, expect, test } from "bun:test";
import { runOps } from "../../lib";
import { Twitter } from "./solution";

describe("355. Design Twitter", () => {
  test("example 1", () => {
    const ops = ["Twitter","postTweet","getNewsFeed","follow","postTweet","getNewsFeed","unfollow","getNewsFeed"];
    const args = [[],[1,5],[1],[1,2],[2,6],[1],[1,2],[1]];
    expect(runOps(Twitter, ops, args)).toEqual([null, null, [5], null, null, [6, 5], null, [5]]);
  });
});
