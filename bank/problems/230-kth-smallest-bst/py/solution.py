"""
230. Kth Smallest Element in a BST — Medium ⭐
https://leetcode.com/problems/kth-smallest-element-in-a-bst/
Pattern: Trees

Full problem + examples in README.md
"""

from sleek import TreeNode, to_tree


class Solution:
    def kthSmallest(self, root: TreeNode | None, k: int) -> int:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(Solution().kthSmallest(to_tree([3, 1, 4, None, 2]), 1))
