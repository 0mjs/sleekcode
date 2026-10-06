import { describe, expect, test } from "bun:test";
import { twoSum } from "./solution";

describe("167. Two Sum II - Input Array Is Sorted", () => {
  test("example 1", () => {
    expect(twoSum([2,7,11,15], 9)).toEqual([1,2]);
  });

  test("example 2", () => {
    expect(twoSum([2,3,4], 6)).toEqual([1,3]);
  });

  test("example 3", () => {
    expect(twoSum([-1,0], -1)).toEqual([1,2]);
  });
});
