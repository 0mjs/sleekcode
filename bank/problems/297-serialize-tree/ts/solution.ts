import { TreeNode, fromTree, toTree } from "../../lib";

/**
 * 297. Serialize and Deserialize Binary Tree — Hard ⭐
 * https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
 * Pattern: Trees
 *
 * Full problem + examples in README.md
 */

/** Encodes a tree to a single string. */
export function serialize(root: TreeNode | null): string {
  throw new Error("Not implemented");
}

/** Decodes your encoded data to tree. */
export function deserialize(data: string): TreeNode | null {
  throw new Error("Not implemented");
}

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  const encoded = serialize(toTree([1, 2, 3, null, null, 4, 5]));
  console.log(encoded);
  console.log(fromTree(deserialize(encoded)));
}
