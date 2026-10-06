import { describe, expect, test } from "bun:test";
import { longestIncreasingPath } from "./solution";

describe("329. Longest Increasing Path in a Matrix", () => {
  test("example 1", () => {
    expect(longestIncreasingPath([[9,9,4],[6,6,8],[2,1,1]])).toEqual(4);
  });

  test("example 2", () => {
    expect(longestIncreasingPath([[3,4,5],[3,2,6],[2,2,1]])).toEqual(4);
  });

  test("example 3", () => {
    expect(longestIncreasingPath([[1]])).toEqual(1);
  });
});
