import { describe, expect, test } from "bun:test";
import { findMedianSortedArrays } from "./solution";

describe("4. Median of Two Sorted Arrays", () => {
  test("example 1", () => {
    expect(findMedianSortedArrays([1,3], [2])).toBeCloseTo(2.00000, 5);
  });

  test("example 2", () => {
    expect(findMedianSortedArrays([1,2], [3,4])).toBeCloseTo(2.50000, 5);
  });
});
