import { RandomNode as _Node, fromRandomList, toRandomList } from "../../lib";

/**
 * 138. Copy List with Random Pointer — Medium
 * https://leetcode.com/problems/copy-list-with-random-pointer/
 * Pattern: Linked List
 *
 * Full problem + examples in README.md
 *
 * class _Node {
 *   val: number
 *   next: _Node | null
 *   random: _Node | null
 * }
 */
export function copyRandomList(head: _Node | null): _Node | null {
  throw new Error("Not implemented");
}

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  console.log(fromRandomList(copyRandomList(toRandomList([[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]))));
}
