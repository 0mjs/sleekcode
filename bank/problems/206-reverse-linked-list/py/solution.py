"""
206. Reverse Linked List — Easy ⭐
https://leetcode.com/problems/reverse-linked-list/
Pattern: Linked List

Full problem + examples in README.md
"""

from sleek import ListNode, to_list, from_list


class Solution:
    def reverseList(self, head: ListNode | None) -> ListNode | None:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(from_list(Solution().reverseList(to_list([1, 2, 3, 4, 5]))))
