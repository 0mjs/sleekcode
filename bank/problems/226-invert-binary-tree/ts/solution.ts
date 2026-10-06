import { TreeNode, toTree, fromTree } from "../../lib";

/**
 * 226. Invert Binary Tree — Easy ⭐
 * https://leetcode.com/problems/invert-binary-tree/
 * Pattern: Trees
 *
 * Full problem + examples in README.md
 */
export function invertTree(root: TreeNode | null): TreeNode | null {
  throw new Error("Not implemented");
}

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  console.log(fromTree(invertTree(toTree([4,2,7,1,3,6,9]))));
}
