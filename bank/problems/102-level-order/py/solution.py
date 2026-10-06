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


# Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if __name__ == "__main__":
    print(Solution().levelOrder(to_tree([3, 9, 20, None, None, 15, 7])))
