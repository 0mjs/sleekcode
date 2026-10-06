import { TreeNode, fromTree } from "../../lib";

/**
 * 105. Construct Binary Tree from Preorder and Inorder Traversal — Medium ⭐
 * https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
 * Pattern: Trees
 *
 * Full problem + examples in README.md
 */
export function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  throw new Error("Not implemented");
}

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(fromTree(buildTree([3,9,20,15,7], [9,3,15,20,7])));
}
