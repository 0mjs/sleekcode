import { TreeNode, toTree } from "../../lib";

/**
 * 572. Subtree of Another Tree — Easy ⭐
 * https://leetcode.com/problems/subtree-of-another-tree/
 * Pattern: Trees
 *
 * Full problem + examples in README.md
 */
export function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  throw new Error("Not implemented");
}

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(isSubtree(toTree([3,4,5,1,2]), toTree([4,1,2])));
}
