import { describe, expect, test } from "bun:test";
import { anyOrderDeep } from "../../lib";
import { combinationSum } from "./solution";

describe("39. Combination Sum", () => {
  test("example 1", () => {
    expect(anyOrderDeep(combinationSum([2,3,6,7], 7))).toEqual(anyOrderDeep([[2,2,3],[7]]));
  });

  test("example 2", () => {
    expect(anyOrderDeep(combinationSum([2,3,5], 8))).toEqual(anyOrderDeep([[2,2,2,2],[2,3,3],[3,5]]));
  });

  test("example 3", () => {
    expect(anyOrderDeep(combinationSum([2], 1))).toEqual(anyOrderDeep([]));
  });
});
