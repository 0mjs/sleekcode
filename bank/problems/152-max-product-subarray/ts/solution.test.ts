import { describe, expect, test } from "bun:test";
import { maxProduct } from "./solution";

describe("152. Maximum Product Subarray", () => {
  test("example 1", () => {
    expect(maxProduct([2,3,-2,4])).toEqual(6);
  });

  test("example 2", () => {
    expect(maxProduct([-2,0,-1])).toEqual(0);
  });
});
