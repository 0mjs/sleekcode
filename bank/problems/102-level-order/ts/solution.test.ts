import { describe, expect, test } from "bun:test";
import { toTree } from "../../lib";
import { levelOrder } from "./solution";

describe("102. Binary Tree Level Order Traversal", () => {
  test("example 1", () => {
    expect(levelOrder(toTree([3,9,20,null,null,15,7]))).toEqual([[3],[9,20],[15,7]]);
  });

  test("example 2", () => {
    expect(levelOrder(toTree([1]))).toEqual([[1]]);
  });

  test("example 3", () => {
    expect(levelOrder(toTree([]))).toEqual([]);
  });
});
