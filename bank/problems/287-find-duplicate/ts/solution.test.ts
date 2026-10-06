import { describe, expect, test } from "bun:test";
import { findDuplicate } from "./solution";

describe("287. Find the Duplicate Number", () => {
  test("example 1", () => {
    expect(findDuplicate([1,3,4,2,2])).toEqual(2);
  });

  test("example 2", () => {
    expect(findDuplicate([3,1,3,4,2])).toEqual(3);
  });

  test("example 3", () => {
    expect(findDuplicate([3,3,3,3,3])).toEqual(3);
  });
});
