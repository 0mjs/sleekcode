"""
143. Reorder List — Medium ⭐
https://leetcode.com/problems/reorder-list/
Pattern: Linked List

Full problem + examples in README.md
"""

from sleek import ListNode, to_list, from_list


class Solution:
    def reorderList(self, head: ListNode | None) -> None:
        """
        Do not return anything, modify head in-place instead.
        """


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    head = to_list([1, 2, 3, 4])
    Solution().reorderList(head)
    print(from_list(head))
