import { describe, expect, test } from "bun:test";
import { toTree } from "../../lib";
import { isValidBST } from "./solution";

describe("98. Validate Binary Search Tree", () => {
  test("example 1", () => {
    expect(isValidBST(toTree([2,1,3]))).toEqual(true);
  });

  test("example 2", () => {
    expect(isValidBST(toTree([5,1,4,null,null,3,6]))).toEqual(false);
  });
});
