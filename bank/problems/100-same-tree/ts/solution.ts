import { TreeNode, toTree } from "../../lib";

/**
 * 100. Same Tree — Easy ⭐
 * https://leetcode.com/problems/same-tree/
 * Pattern: Trees
 *
 * Full problem + examples in README.md
 */
export function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  throw new Error("Not implemented");
}

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(isSameTree(toTree([1,2,3]), toTree([1,2,3])));
}
