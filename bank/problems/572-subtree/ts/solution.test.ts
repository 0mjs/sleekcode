import { describe, expect, test } from "bun:test";
import { toTree } from "../../lib";
import { isSubtree } from "./solution";

describe("572. Subtree of Another Tree", () => {
  test("example 1", () => {
    expect(isSubtree(toTree([3,4,5,1,2]), toTree([4,1,2]))).toEqual(true);
  });

  test("example 2", () => {
    expect(isSubtree(toTree([3,4,5,1,2,null,null,null,null,0]), toTree([4,1,2]))).toEqual(false);
  });
});
