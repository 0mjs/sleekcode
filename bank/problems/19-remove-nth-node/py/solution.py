"""
19. Remove Nth Node From End of List — Medium ⭐
https://leetcode.com/problems/remove-nth-node-from-end-of-list/
Pattern: Linked List

Full problem + examples in README.md
"""

from sleek import ListNode, to_list, from_list


class Solution:
    def removeNthFromEnd(self, head: ListNode | None, n: int) -> ListNode | None:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(from_list(Solution().removeNthFromEnd(to_list([1, 2, 3, 4, 5]), 2)))
