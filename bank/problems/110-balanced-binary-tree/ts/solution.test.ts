import { describe, expect, test } from "bun:test";
import { toTree } from "../../lib";
import { isBalanced } from "./solution";

describe("110. Balanced Binary Tree", () => {
  test("example 1", () => {
    expect(isBalanced(toTree([3,9,20,null,null,15,7]))).toEqual(true);
  });

  test("example 2", () => {
    expect(isBalanced(toTree([1,2,2,3,3,null,null,4,4]))).toEqual(false);
  });

  test("example 3", () => {
    expect(isBalanced(toTree([]))).toEqual(true);
  });
});
