import { describe, expect, test } from "bun:test";
import { longestConsecutive } from "./solution";

describe("128. Longest Consecutive Sequence", () => {
  test("example 1", () => {
    expect(longestConsecutive([100,4,200,1,3,2])).toEqual(4);
  });

  test("example 2", () => {
    expect(longestConsecutive([0,3,7,2,5,8,4,6,0,1])).toEqual(9);
  });

  test("example 3", () => {
    expect(longestConsecutive([1,0,1,2])).toEqual(3);
  });
});
