import { GraphNode as _Node, fromGraph, toGraph } from "../../lib";

/**
 * 133. Clone Graph — Medium ⭐
 * https://leetcode.com/problems/clone-graph/
 * Pattern: Graphs
 *
 * Full problem + examples in README.md
 *
 * class _Node {
 *   val: number
 *   neighbors: _Node[]
 * }
 */
export function cloneGraph(node: _Node | null): _Node | null {
  throw new Error("Not implemented");
}

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  console.log(fromGraph(cloneGraph(toGraph([[2, 4], [1, 3], [2, 4], [1, 3]]))));
}
