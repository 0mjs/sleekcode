"""
23. Merge k Sorted Lists — Hard ⭐
https://leetcode.com/problems/merge-k-sorted-lists/
Pattern: Linked List

Full problem + examples in README.md
"""

from sleek import ListNode, to_list, from_list


class Solution:
    def mergeKLists(self, lists: list[ListNode | None]) -> ListNode | None:
        raise NotImplementedError("Not implemented")


# Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if __name__ == "__main__":
    print(from_list(Solution().mergeKLists([to_list(x) for x in [[1, 4, 5], [1, 3, 4], [2, 6]]])))
