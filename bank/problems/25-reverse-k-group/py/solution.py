"""
25. Reverse Nodes in k-Group — Hard
https://leetcode.com/problems/reverse-nodes-in-k-group/
Pattern: Linked List

Full problem + examples in README.md
"""

from sleek import ListNode, to_list, from_list


class Solution:
    def reverseKGroup(self, head: ListNode | None, k: int) -> ListNode | None:
        raise NotImplementedError("Not implemented")


# Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if __name__ == "__main__":
    print(from_list(Solution().reverseKGroup(to_list([1, 2, 3, 4, 5]), 2)))
