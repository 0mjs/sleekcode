"""
572. Subtree of Another Tree — Easy ⭐
https://leetcode.com/problems/subtree-of-another-tree/
Pattern: Trees

Full problem + examples in README.md
"""

from sleek import TreeNode, to_tree


class Solution:
    def isSubtree(self, root: TreeNode | None, subRoot: TreeNode | None) -> bool:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(Solution().isSubtree(to_tree([3, 4, 5, 1, 2]), to_tree([4, 1, 2])))
