"""
110. Balanced Binary Tree — Easy
https://leetcode.com/problems/balanced-binary-tree/
Pattern: Trees

Full problem + examples in README.md
"""

from sleek import TreeNode, to_tree


class Solution:
    def isBalanced(self, root: TreeNode | None) -> bool:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(Solution().isBalanced(to_tree([3, 9, 20, None, None, 15, 7])))
