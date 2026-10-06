"""
138. Copy List with Random Pointer — Medium
https://leetcode.com/problems/copy-list-with-random-pointer/
Pattern: Linked List

Full problem + examples in README.md
"""

from sleek import RandomNode as Node, from_random_list, to_random_list


# class Node:
#     val: int
#     next: Node | None
#     random: Node | None


class Solution:
    def copyRandomList(self, head: Node | None) -> Node | None:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(from_random_list(Solution().copyRandomList(to_random_list([[7, None], [13, 0], [11, 4], [10, 2], [1, 0]]))))
