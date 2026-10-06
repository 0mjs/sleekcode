"""
1448. Count Good Nodes in Binary Tree — Medium
https://leetcode.com/problems/count-good-nodes-in-binary-tree/
Pattern: Trees

Full problem + examples in README.md
"""

from sleek import TreeNode, to_tree


class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(Solution().goodNodes(to_tree([3, 1, 4, 3, None, 1, 5])))
