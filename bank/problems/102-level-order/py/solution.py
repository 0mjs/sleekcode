"""
102. Binary Tree Level Order Traversal — Medium ⭐
https://leetcode.com/problems/binary-tree-level-order-traversal/
Pattern: Trees

Full problem + examples in README.md
"""

from sleek import TreeNode, to_tree


class Solution:
    def levelOrder(self, root: TreeNode | None) -> list[list[int]]:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(Solution().levelOrder(to_tree([3, 9, 20, None, None, 15, 7])))
