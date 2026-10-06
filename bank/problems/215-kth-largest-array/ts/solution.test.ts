import { describe, expect, test } from "bun:test";
import { findKthLargest } from "./solution";

describe("215. Kth Largest Element in an Array", () => {
  test("example 1", () => {
    expect(findKthLargest([3,2,1,5,6,4], 2)).toEqual(5);
  });

  test("example 2", () => {
    expect(findKthLargest([3,2,3,1,2,4,5,5,6], 4)).toEqual(4);
  });
});
