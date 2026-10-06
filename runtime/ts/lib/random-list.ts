/** Linked-list node with a random pointer, used by Copy List with Random Pointer (LeetCode calls it `_Node`). */
export class RandomNode {
  val: number;
  next: RandomNode | null;
  random: RandomNode | null;
  constructor(val?: number, next?: RandomNode, random?: RandomNode) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
    this.random = random === undefined ? null : random;
  }
}

/** [[val, randomIndex | null], ...] -> list */
export function toRandomList(pairs: [number, number | null][]): RandomNode | null {
  const nodes = pairs.map(([v]) => new RandomNode(v));
  nodes.forEach((n, i) => {
    n.next = nodes[i + 1] ?? null;
    const r = pairs[i]![1];
    n.random = r === null ? null : nodes[r]!;
  });
  return nodes[0] ?? null;
}

/** list -> [[val, randomIndex | null], ...] */
export function fromRandomList(head: RandomNode | null): [number, number | null][] {
  const nodes: RandomNode[] = [];
  for (let n = head; n && nodes.length < 10_000; n = n.next) nodes.push(n);
  return nodes.map((n) => [n.val, n.random ? nodes.indexOf(n.random) : null]);
}

/** All nodes in a list, for checking a copy shares none of them */
export function randomListNodes(head: RandomNode | null): RandomNode[] {
  const nodes: RandomNode[] = [];
  for (let n = head; n && nodes.length < 10_000; n = n.next) nodes.push(n);
  return nodes;
}
