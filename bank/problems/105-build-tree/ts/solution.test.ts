import { describe, expect, test } from "bun:test";
import { fromTree } from "../../lib";
import { buildTree } from "./solution";

describe("105. Construct Binary Tree from Preorder and Inorder Traversal", () => {
  test("example 1", () => {
    expect(fromTree(buildTree([3,9,20,15,7], [9,3,15,20,7]))).toEqual([3,9,20,null,null,15,7]);
  });

  test("example 2", () => {
    expect(fromTree(buildTree([-1], [-1]))).toEqual([-1]);
  });
});
