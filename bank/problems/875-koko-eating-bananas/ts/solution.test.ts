import { describe, expect, test } from "bun:test";
import { minEatingSpeed } from "./solution";

describe("875. Koko Eating Bananas", () => {
  test("example 1", () => {
    expect(minEatingSpeed([3,6,7,11], 8)).toEqual(4);
  });

  test("example 2", () => {
    expect(minEatingSpeed([30,11,23,4,20], 5)).toEqual(30);
  });

  test("example 3", () => {
    expect(minEatingSpeed([30,11,23,4,20], 6)).toEqual(23);
  });
});
