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

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(fromTree(invertTree(toTree([4,2,7,1,3,6,9]))));
}
