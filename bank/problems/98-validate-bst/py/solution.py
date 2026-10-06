"""
98. Validate Binary Search Tree — Medium ⭐
https://leetcode.com/problems/validate-binary-search-tree/
Pattern: Trees

Full problem + examples in README.md
"""

from sleek import TreeNode, to_tree


class Solution:
    def isValidBST(self, root: TreeNode | None) -> bool:
        raise NotImplementedError("Not implemented")


# Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if __name__ == "__main__":
    print(Solution().isValidBST(to_tree([2, 1, 3])))
