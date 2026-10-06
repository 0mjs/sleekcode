import { TreeNode } from "../../lib";
export function lowestCommonAncestor(r: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
  while (r) { if (p!.val < r.val && q!.val < r.val) r = r.left; else if (p!.val > r.val && q!.val > r.val) r = r.right; else return r; } return null; }
