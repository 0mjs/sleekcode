/** Graph node used by Clone Graph (LeetCode calls it `_Node`). */
import { INSPECT } from "./inspect";

export class GraphNode {
  val: number;
  neighbors: GraphNode[];
  constructor(val?: number, neighbors?: GraphNode[]) {
    this.val = val === undefined ? 0 : val;
    this.neighbors = neighbors === undefined ? [] : neighbors;
  }
  /** console.log(node) → Node(1 → [2, 4]) */
  [INSPECT]() {
    return `Node(${this.val} → [${this.neighbors.map((n) => n.val).join(", ")}])`;
  }
}

/** Adjacency list (1-indexed node values) -> node 1, e.g. [[2,4],[1,3],[2,4],[1,3]] */
export function toGraph(adj: number[][]): GraphNode | null {
  if (!adj.length) return null;
  const nodes = adj.map((_, i) => new GraphNode(i + 1));
  adj.forEach((ns, i) => (nodes[i]!.neighbors = ns.map((v) => nodes[v - 1]!)));
  return nodes[0]!;
}

/** Every node reachable from `node`, in value order */
export function graphNodes(node: GraphNode | null): GraphNode[] {
  const seen = new Map<number, GraphNode>();
  const stack = node ? [node] : [];
  while (stack.length) {
    const n = stack.pop()!;
    if (seen.has(n.val)) continue;
    seen.set(n.val, n);
    stack.push(...n.neighbors);
  }
  return [...seen.values()].sort((a, b) => a.val - b.val);
}

/** node 1 -> adjacency list */
export function fromGraph(node: GraphNode | null): number[][] {
  return graphNodes(node).map((n) => n.neighbors.map((m) => m.val));
}
