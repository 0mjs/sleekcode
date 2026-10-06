import { describe, expect, test } from "bun:test";
import { productExceptSelf } from "./solution";

describe("238. Product of Array Except Self", () => {
  test("example 1", () => {
    expect(productExceptSelf([1,2,3,4]).map((x) => x + 0)).toEqual([24,12,8,6]);
  });

  test("example 2", () => {
    expect(productExceptSelf([-1,1,0,-3,3]).map((x) => x + 0)).toEqual([0,0,9,0,0]);
  });
});
