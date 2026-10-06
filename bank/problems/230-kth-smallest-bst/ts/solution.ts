import { TreeNode, toTree } from "../../lib";

/**
 * 230. Kth Smallest Element in a BST — Medium ⭐
 * https://leetcode.com/problems/kth-smallest-element-in-a-bst/
 * Pattern: Trees
 *
 * Full problem + examples in README.md
 */
export function kthSmallest(root: TreeNode | null, k: number): number {
  throw new Error("Not implemented");
}

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(kthSmallest(toTree([3,1,4,null,2]), 1));
}
