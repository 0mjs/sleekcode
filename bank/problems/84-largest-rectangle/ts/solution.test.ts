import { describe, expect, test } from "bun:test";
import { largestRectangleArea } from "./solution";

describe("84. Largest Rectangle in Histogram", () => {
  test("example 1", () => {
    expect(largestRectangleArea([2,1,5,6,2,3])).toEqual(10);
  });

  test("example 2", () => {
    expect(largestRectangleArea([2,4])).toEqual(4);
  });
});
