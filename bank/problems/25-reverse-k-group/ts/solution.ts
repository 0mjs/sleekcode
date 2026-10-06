import { ListNode, toList, fromList } from "../../lib";

/**
 * 25. Reverse Nodes in k-Group — Hard
 * https://leetcode.com/problems/reverse-nodes-in-k-group/
 * Pattern: Linked List
 *
 * Full problem + examples in README.md
 */
export function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  throw new Error("Not implemented");
}

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  console.log(fromList(reverseKGroup(toList([1,2,3,4,5]), 2)));
}
