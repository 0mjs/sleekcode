import { describe, expect, test } from "bun:test";
import { toTree } from "../../lib";
import { diameterOfBinaryTree } from "./solution";

describe("543. Diameter of Binary Tree", () => {
  test("example 1", () => {
    expect(diameterOfBinaryTree(toTree([1,2,3,4,5]))).toEqual(3);
  });

  test("example 2", () => {
    expect(diameterOfBinaryTree(toTree([1,2]))).toEqual(1);
  });
});
