"""
199. Binary Tree Right Side View — Medium
https://leetcode.com/problems/binary-tree-right-side-view/
Pattern: Trees

Full problem + examples in README.md
"""

from sleek import TreeNode, to_tree


class Solution:
    def rightSideView(self, root: TreeNode | None) -> list[int]:
        raise NotImplementedError("Not implemented")


# Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if __name__ == "__main__":
    print(Solution().rightSideView(to_tree([1, 2, 3, None, 5, None, 4])))
