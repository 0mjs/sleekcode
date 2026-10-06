import { TreeNode, toTree } from "../../lib";

/**
 * 110. Balanced Binary Tree — Easy
 * https://leetcode.com/problems/balanced-binary-tree/
 * Pattern: Trees
 *
 * Full problem + examples in README.md
 */
export function isBalanced(root: TreeNode | null): boolean {
  throw new Error("Not implemented");
}

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  console.log(isBalanced(toTree([3,9,20,null,null,15,7])));
}
