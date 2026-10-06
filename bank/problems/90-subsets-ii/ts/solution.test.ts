import { describe, expect, test } from "bun:test";
import { anyOrderDeep } from "../../lib";
import { subsetsWithDup } from "./solution";

describe("90. Subsets II", () => {
  test("example 1", () => {
    expect(anyOrderDeep(subsetsWithDup([1,2,2]))).toEqual(anyOrderDeep([[],[1],[1,2],[1,2,2],[2],[2,2]]));
  });

  test("example 2", () => {
    expect(anyOrderDeep(subsetsWithDup([0]))).toEqual(anyOrderDeep([[],[0]]));
  });
});
