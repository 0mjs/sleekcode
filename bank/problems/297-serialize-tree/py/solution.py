"""
297. Serialize and Deserialize Binary Tree — Hard ⭐
https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
Pattern: Trees

Full problem + examples in README.md
"""

from sleek import TreeNode, from_tree, to_tree


class Codec:
    def serialize(self, root: TreeNode | None) -> str:
        """Encodes a tree to a single string."""
        raise NotImplementedError("Not implemented")

    def deserialize(self, data: str) -> TreeNode | None:
        """Decodes your encoded data to tree."""
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    encoded = Codec().serialize(to_tree([1, 2, 3, None, None, 4, 5]))
    print(encoded)
    print(from_tree(Codec().deserialize(encoded)))
