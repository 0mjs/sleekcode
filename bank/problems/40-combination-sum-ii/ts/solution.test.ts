import { describe, expect, test } from "bun:test";
import { anyOrderDeep } from "../../lib";
import { combinationSum2 } from "./solution";

describe("40. Combination Sum II", () => {
  test("example 1", () => {
    expect(anyOrderDeep(combinationSum2([10,1,2,7,6,1,5], 8))).toEqual(anyOrderDeep([[1,1,6],[1,2,5],[1,7],[2,6]]));
  });

  test("example 2", () => {
    expect(anyOrderDeep(combinationSum2([2,5,2,1,2], 5))).toEqual(anyOrderDeep([[1,2,2],[5]]));
  });
});
