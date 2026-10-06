"""
104. Maximum Depth of Binary Tree — Easy ⭐
https://leetcode.com/problems/maximum-depth-of-binary-tree/
Pattern: Trees

Full problem + examples in README.md
"""

from sleek import TreeNode, to_tree


class Solution:
    def maxDepth(self, root: TreeNode | None) -> int:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(Solution().maxDepth(to_tree([3, 9, 20, None, None, 15, 7])))
