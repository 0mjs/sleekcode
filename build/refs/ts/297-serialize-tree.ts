import { TreeNode, toTree, fromTree } from "../../lib";
export const serialize = (r: TreeNode | null) => JSON.stringify(fromTree(r));
export const deserialize = (s: string) => toTree(JSON.parse(s));
