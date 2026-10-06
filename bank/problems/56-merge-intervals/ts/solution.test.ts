import { describe, expect, test } from "bun:test";
import { merge } from "./solution";

describe("56. Merge Intervals", () => {
  test("example 1", () => {
    expect(merge([[1,3],[2,6],[8,10],[15,18]])).toEqual([[1,6],[8,10],[15,18]]);
  });

  test("example 2", () => {
    expect(merge([[1,4],[4,5]])).toEqual([[1,5]]);
  });

  test("example 3", () => {
    expect(merge([[4,7],[1,4]])).toEqual([[1,7]]);
  });
});
