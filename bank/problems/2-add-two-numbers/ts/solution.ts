import { ListNode, toList, fromList } from "../../lib";

/**
 * 2. Add Two Numbers — Medium
 * https://leetcode.com/problems/add-two-numbers/
 * Pattern: Linked List
 *
 * Full problem + examples in README.md
 */
export function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  throw new Error("Not implemented");
}

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(fromList(addTwoNumbers(toList([2,4,3]), toList([5,6,4]))));
}
