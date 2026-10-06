import { describe, expect, test } from "bun:test";
import { findMin } from "./solution";

describe("153. Find Minimum in Rotated Sorted Array", () => {
  test("example 1", () => {
    expect(findMin([3,4,5,1,2])).toEqual(1);
  });

  test("example 2", () => {
    expect(findMin([4,5,6,7,0,1,2])).toEqual(0);
  });

  test("example 3", () => {
    expect(findMin([11,13,15,17])).toEqual(11);
  });
});
