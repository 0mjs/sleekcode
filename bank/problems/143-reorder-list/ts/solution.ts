import { ListNode, toList, fromList } from "../../lib";

/**
 * 143. Reorder List — Medium ⭐
 * https://leetcode.com/problems/reorder-list/
 * Pattern: Linked List
 *
 * Full problem + examples in README.md
 */
/**
 Do not return anything, modify head in-place instead.
 */
export function reorderList(head: ListNode | null): void {
  throw new Error("Not implemented");
}

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  const head = toList([1,2,3,4]);
  reorderList(head);
  console.log(fromList(head));
}
