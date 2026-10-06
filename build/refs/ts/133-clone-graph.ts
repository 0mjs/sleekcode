import { GraphNode } from "../../lib";
export function cloneGraph(n: GraphNode | null, m = new Map<GraphNode, GraphNode>()): GraphNode | null {
  if (!n) return null; if (m.has(n)) return m.get(n)!; const c = new GraphNode(n.val); m.set(n, c);
  c.neighbors = n.neighbors.map((x) => cloneGraph(x, m)!); return c; }
