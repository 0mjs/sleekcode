"""
21. Merge Two Sorted Lists — Easy ⭐
https://leetcode.com/problems/merge-two-sorted-lists/
Pattern: Linked List

Full problem + examples in README.md
"""

from sleek import ListNode, to_list, from_list


class Solution:
    def mergeTwoLists(self, list1: ListNode | None, list2: ListNode | None) -> ListNode | None:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(from_list(Solution().mergeTwoLists(to_list([1, 2, 4]), to_list([1, 3, 4]))))
