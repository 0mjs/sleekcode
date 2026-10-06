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

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  console.log(isSameTree(toTree([1,2,3]), toTree([1,2,3])));
}
