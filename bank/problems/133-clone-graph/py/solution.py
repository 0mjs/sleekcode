"""
133. Clone Graph — Medium ⭐
https://leetcode.com/problems/clone-graph/
Pattern: Graphs

Full problem + examples in README.md
"""

from sleek import Node, from_graph, to_graph


# class Node:
#     val: int
#     neighbors: list[Node]


class Solution:
    def cloneGraph(self, node: Node | None) -> Node | None:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(from_graph(Solution().cloneGraph(to_graph([[2, 4], [1, 3], [2, 4], [1, 3]]))))
