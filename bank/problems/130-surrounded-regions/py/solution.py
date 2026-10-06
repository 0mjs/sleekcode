"""
130. Surrounded Regions — Medium
https://leetcode.com/problems/surrounded-regions/
Pattern: Graphs

Full problem + examples in README.md
"""


class Solution:
    def solve(self, board: list[list[str]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    board = [["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]]
    Solution().solve(board)
    print(board)
