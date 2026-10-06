"""
235. Lowest Common Ancestor of a Binary Search Tree — Medium ⭐
https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
Pattern: Trees

Full problem + examples in README.md
"""

from sleek import TreeNode, find_node, to_tree


class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    root = to_tree([6, 2, 8, 0, 4, 7, 9, None, None, 3, 5])
    print(Solution().lowestCommonAncestor(root, find_node(root, 2), find_node(root, 8)).val)
