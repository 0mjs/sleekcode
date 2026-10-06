import { describe, expect, test } from "bun:test";
import { lengthOfLIS } from "./solution";

describe("300. Longest Increasing Subsequence", () => {
  test("example 1", () => {
    expect(lengthOfLIS([10,9,2,5,3,7,101,18])).toEqual(4);
  });

  test("example 2", () => {
    expect(lengthOfLIS([0,1,0,3,2,3])).toEqual(4);
  });

  test("example 3", () => {
    expect(lengthOfLIS([7,7,7,7,7,7,7])).toEqual(1);
  });
});
