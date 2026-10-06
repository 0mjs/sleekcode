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

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(isBalanced(toTree([3,9,20,null,null,15,7])));
}
