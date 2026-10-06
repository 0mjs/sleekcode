export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

/** LeetCode level-order array -> tree, e.g. [3,9,20,null,null,15,7] */
export function toTree(values: (number | null)[]): TreeNode | null {
  if (!values.length || values[0] == null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  for (let q = 0; q < queue.length && i < values.length; q++) {
    const node = queue[q]!;
    for (const side of ["left", "right"] as const) {
      const v = values[i++];
      if (v != null) queue.push((node[side] = new TreeNode(v)));
    }
  }
  return root;
}

/** Tree -> LeetCode level-order array (trailing nulls trimmed) */
export function fromTree(root: TreeNode | null): (number | null)[] {
  const out: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  for (let q = 0; q < queue.length; q++) {
    const node = queue[q];
    out.push(node ? node.val : null);
    if (node) queue.push(node.left, node.right);
  }
  while (out.length && out.at(-1) === null) out.pop();
  return out;
}

/** First node with the given value (for problems that pass nodes as arguments). */
export function findNode(root: TreeNode | null, val: number): TreeNode | null {
  if (!root || root.val === val) return root;
  return findNode(root.left, val) ?? findNode(root.right, val);
}
