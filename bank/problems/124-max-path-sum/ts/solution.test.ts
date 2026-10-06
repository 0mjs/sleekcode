import { describe, expect, test } from "bun:test";
import { toTree } from "../../lib";
import { maxPathSum } from "./solution";

describe("124. Binary Tree Maximum Path Sum", () => {
  test("example 1", () => {
    expect(maxPathSum(toTree([1,2,3]))).toEqual(6);
  });

  test("example 2", () => {
    expect(maxPathSum(toTree([-10,9,20,null,null,15,7]))).toEqual(42);
  });
});
