import { describe, expect, test } from "bun:test";
import { mergeTriplets } from "./solution";

describe("1899. Merge Triplets to Form Target Triplet", () => {
  test("example 1", () => {
    expect(mergeTriplets([[2,5,3],[1,8,4],[1,7,5]], [2,7,5])).toEqual(true);
  });

  test("example 2", () => {
    expect(mergeTriplets([[3,4,5],[4,5,6]], [3,2,5])).toEqual(false);
  });

  test("example 3", () => {
    expect(mergeTriplets([[2,5,3],[2,3,4],[1,2,5],[5,2,3]], [5,5,5])).toEqual(true);
  });
});
