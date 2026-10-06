import { ListNode, toList, fromList } from "../../lib";

/**
 * 21. Merge Two Sorted Lists — Easy ⭐
 * https://leetcode.com/problems/merge-two-sorted-lists/
 * Pattern: Linked List
 *
 * Full problem + examples in README.md
 */
export function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  throw new Error("Not implemented");
}

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(fromList(mergeTwoLists(toList([1,2,4]), toList([1,3,4]))));
}
