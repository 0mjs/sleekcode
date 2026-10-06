import { describe, expect, test } from "bun:test";
import { minInterval } from "./solution";

describe("1851. Minimum Interval to Include Each Query", () => {
  test("example 1", () => {
    expect(minInterval([[1,4],[2,4],[3,6],[4,4]], [2,3,4,5])).toEqual([3,3,1,4]);
  });

  test("example 2", () => {
    expect(minInterval([[2,3],[2,5],[1,8],[20,25]], [2,19,5,22])).toEqual([2,-1,4,6]);
  });
});
