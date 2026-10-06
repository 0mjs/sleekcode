import { describe, expect, test } from "bun:test";
import { findRedundantConnection } from "./solution";

describe("684. Redundant Connection", () => {
  test("example 1", () => {
    expect(findRedundantConnection([[1,2],[1,3],[2,3]])).toEqual([2,3]);
  });

  test("example 2", () => {
    expect(findRedundantConnection([[1,2],[2,3],[3,4],[1,4],[1,5]])).toEqual([1,4]);
  });
});
