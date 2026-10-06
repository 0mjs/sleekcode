"""
286. Walls and Gates — Medium
https://leetcode.com/problems/walls-and-gates/ (Premium)
Pattern: Graphs

Full problem + examples in README.md
"""


class Solution:
    def wallsAndGates(self, rooms: list[list[int]]) -> None:
        """Do not return anything, modify rooms in-place instead."""
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    INF = 2147483647
    rooms = [[INF, -1, 0, INF], [INF, INF, INF, -1], [INF, -1, INF, -1], [0, -1, INF, INF]]
    Solution().wallsAndGates(rooms)
    print(rooms)
