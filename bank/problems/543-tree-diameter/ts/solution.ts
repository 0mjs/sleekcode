import { TreeNode, toTree } from "../../lib";

/**
 * 543. Diameter of Binary Tree — Easy
 * https://leetcode.com/problems/diameter-of-binary-tree/
 * Pattern: Trees
 *
 * Full problem + examples in README.md
 */
export function diameterOfBinaryTree(root: TreeNode | null): number {
  throw new Error("Not implemented");
}

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(diameterOfBinaryTree(toTree([1,2,3,4,5])));
}
