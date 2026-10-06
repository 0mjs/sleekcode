"""
105. Construct Binary Tree from Preorder and Inorder Traversal — Medium ⭐
https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
Pattern: Trees

Full problem + examples in README.md
"""

from sleek import TreeNode, from_tree


class Solution:
    def buildTree(self, preorder: list[int], inorder: list[int]) -> TreeNode | None:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(from_tree(Solution().buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])))
