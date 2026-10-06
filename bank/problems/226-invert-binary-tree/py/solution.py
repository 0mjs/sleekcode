"""
226. Invert Binary Tree — Easy ⭐
https://leetcode.com/problems/invert-binary-tree/
Pattern: Trees

Full problem + examples in README.md
"""

from sleek import TreeNode, to_tree, from_tree


class Solution:
    def invertTree(self, root: TreeNode | None) -> TreeNode | None:
        raise NotImplementedError("Not implemented")


# Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if __name__ == "__main__":
    print(from_tree(Solution().invertTree(to_tree([4, 2, 7, 1, 3, 6, 9]))))
