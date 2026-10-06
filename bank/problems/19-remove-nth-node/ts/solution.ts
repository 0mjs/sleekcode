import { ListNode, toList, fromList } from "../../lib";

/**
 * 19. Remove Nth Node From End of List — Medium ⭐
 * https://leetcode.com/problems/remove-nth-node-from-end-of-list/
 * Pattern: Linked List
 *
 * Full problem + examples in README.md
 */
export function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  throw new Error("Not implemented");
}

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(fromList(removeNthFromEnd(toList([1,2,3,4,5]), 2)));
}
