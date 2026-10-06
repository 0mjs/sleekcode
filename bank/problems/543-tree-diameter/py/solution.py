"""
543. Diameter of Binary Tree — Easy
https://leetcode.com/problems/diameter-of-binary-tree/
Pattern: Trees

Full problem + examples in README.md
"""

from typing import Optional

from sleek import TreeNode, to_tree


class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(Solution().diameterOfBinaryTree(to_tree([1, 2, 3, 4, 5])))
