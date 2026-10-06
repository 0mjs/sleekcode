import { describe, expect, test } from "bun:test";
import { missingNumber } from "./solution";

describe("268. Missing Number", () => {
  test("example 1", () => {
    expect(missingNumber([3,0,1])).toEqual(2);
  });

  test("example 2", () => {
    expect(missingNumber([0,1])).toEqual(2);
  });

  test("example 3", () => {
    expect(missingNumber([9,6,4,2,3,5,7,0,1])).toEqual(8);
  });
});
