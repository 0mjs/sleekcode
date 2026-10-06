import { ListNode, toList, fromList } from "../../lib";

/**
 * 23. Merge k Sorted Lists — Hard ⭐
 * https://leetcode.com/problems/merge-k-sorted-lists/
 * Pattern: Linked List
 *
 * Full problem + examples in README.md
 */
export function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  throw new Error("Not implemented");
}

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(fromList(mergeKLists([[1,4,5],[1,3,4],[2,6]].map(toList))));
}
