import { describe, expect, test } from "bun:test";
import { eraseOverlapIntervals } from "./solution";

describe("435. Non-overlapping Intervals", () => {
  test("example 1", () => {
    expect(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]])).toEqual(1);
  });

  test("example 2", () => {
    expect(eraseOverlapIntervals([[1,2],[1,2],[1,2]])).toEqual(2);
  });

  test("example 3", () => {
    expect(eraseOverlapIntervals([[1,2],[2,3]])).toEqual(0);
  });
});
