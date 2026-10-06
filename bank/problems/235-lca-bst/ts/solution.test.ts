import { describe, expect, test } from "bun:test";
import { findNode, toTree } from "../../lib";
import { lowestCommonAncestor } from "./solution";

const lca = (values: (number | null)[], p: number, q: number) => {
  const root = toTree(values);
  return lowestCommonAncestor(root, findNode(root, p), findNode(root, q))?.val;
};

describe("235. Lowest Common Ancestor of a Binary Search Tree", () => {
  const tree = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5];

  test("example 1", () => {
    expect(lca(tree, 2, 8)).toBe(6);
  });

  test("example 2: a node can be its own ancestor", () => {
    expect(lca(tree, 2, 4)).toBe(2);
  });

  test("example 3", () => {
    expect(lca([2, 1], 2, 1)).toBe(2);
  });

  test("both in left subtree", () => {
    expect(lca(tree, 3, 5)).toBe(4);
  });

  test("both in right subtree", () => {
    expect(lca(tree, 7, 9)).toBe(8);
  });

  test("deep nodes on opposite sides", () => {
    expect(lca(tree, 3, 7)).toBe(6);
  });
});
