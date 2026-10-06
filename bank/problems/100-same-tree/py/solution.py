"""
100. Same Tree — Easy ⭐
https://leetcode.com/problems/same-tree/
Pattern: Trees

Full problem + examples in README.md
"""

from sleek import TreeNode, to_tree


class Solution:
    def isSameTree(self, p: TreeNode | None, q: TreeNode | None) -> bool:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(Solution().isSameTree(to_tree([1, 2, 3]), to_tree([1, 2, 3])))
