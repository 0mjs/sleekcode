import { ListNode, toList, fromList } from "../../lib";

/**
 * 206. Reverse Linked List — Easy ⭐
 * https://leetcode.com/problems/reverse-linked-list/
 * Pattern: Linked List
 *
 * Full problem + examples in README.md
 */
export function reverseList(head: ListNode | null): ListNode | null {
  throw new Error("Not implemented");
}

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(fromList(reverseList(toList([1,2,3,4,5]))));
}
