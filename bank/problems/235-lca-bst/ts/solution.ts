import { TreeNode, findNode, toTree } from "../../lib";

/**
 * 235. Lowest Common Ancestor of a Binary Search Tree — Medium ⭐
 * https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
 * Pattern: Trees
 *
 * Full problem + examples in README.md
 */
export function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
  throw new Error("Not implemented");
}

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  const root = toTree([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]);
  console.log(lowestCommonAncestor(root, findNode(root, 2), findNode(root, 8))?.val);
}
