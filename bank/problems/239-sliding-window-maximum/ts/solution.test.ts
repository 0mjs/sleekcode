import { describe, expect, test } from "bun:test";
import { maxSlidingWindow } from "./solution";

describe("239. Sliding Window Maximum", () => {
  test("example 1", () => {
    expect(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3)).toEqual([3,3,5,5,6,7]);
  });

  test("example 2", () => {
    expect(maxSlidingWindow([1], 1)).toEqual([1]);
  });
});
