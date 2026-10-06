"""
2. Add Two Numbers — Medium
https://leetcode.com/problems/add-two-numbers/
Pattern: Linked List

Full problem + examples in README.md
"""

from sleek import ListNode, to_list, from_list


class Solution:
    def addTwoNumbers(self, l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
        raise NotImplementedError("Not implemented")


# Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if __name__ == "__main__":
    print(from_list(Solution().addTwoNumbers(to_list([2, 4, 3]), to_list([5, 6, 4]))))
