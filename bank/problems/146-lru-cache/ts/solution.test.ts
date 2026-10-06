import { describe, expect, test } from "bun:test";
import { runOps } from "../../lib";
import { LRUCache } from "./solution";

describe("146. LRU Cache", () => {
  test("example 1", () => {
    const ops = ["LRUCache","put","put","get","put","get","put","get","get","get"];
    const args = [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]];
    expect(runOps(LRUCache, ops, args)).toEqual([null, null, null, 1, null, -1, null, -1, 3, 4]);
  });
});
