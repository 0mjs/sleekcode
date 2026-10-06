import { describe, expect, test } from "bun:test";
import { anyOrderDeep } from "../../lib";
import { subsets } from "./solution";

describe("78. Subsets", () => {
  test("example 1", () => {
    expect(anyOrderDeep(subsets([1,2,3]))).toEqual(anyOrderDeep([[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]));
  });

  test("example 2", () => {
    expect(anyOrderDeep(subsets([0]))).toEqual(anyOrderDeep([[],[0]]));
  });
});
