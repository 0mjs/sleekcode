/**
 * 286. Walls and Gates — Medium
 * https://leetcode.com/problems/walls-and-gates/ (Premium)
 * Pattern: Graphs
 *
 * Full problem + examples in README.md
 */
/** Do not return anything, modify rooms in-place instead. */
export function wallsAndGates(rooms: number[][]): void {
  throw new Error("Not implemented");
}

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  const INF = 2147483647;
  const rooms = [
    [INF, -1, 0, INF],
    [INF, INF, INF, -1],
    [INF, -1, INF, -1],
    [0, -1, INF, INF],
  ];
  wallsAndGates(rooms);
  console.log(rooms);
}
