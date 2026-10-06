"""
141. Linked List Cycle — Easy ⭐
https://leetcode.com/problems/linked-list-cycle/
Pattern: Linked List

Full problem + examples in README.md
"""

from sleek import ListNode, to_cycle_list


class Solution:
    def hasCycle(self, head: ListNode | None) -> bool:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(Solution().hasCycle(to_cycle_list([3, 2, 0, -4], 1)))
