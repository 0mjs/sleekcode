import { describe, expect, test } from "bun:test";
import { toTree } from "../../lib";
import { maxDepth } from "./solution";

describe("104. Maximum Depth of Binary Tree", () => {
  test("example 1", () => {
    expect(maxDepth(toTree([3,9,20,null,null,15,7]))).toEqual(3);
  });

  test("example 2", () => {
    expect(maxDepth(toTree([1,null,2]))).toEqual(2);
  });
});
