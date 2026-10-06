"""
73. Set Matrix Zeroes — Medium ⭐
https://leetcode.com/problems/set-matrix-zeroes/
Pattern: Math & Geometry

Full problem + examples in README.md
"""


class Solution:
    def setZeroes(self, matrix: list[list[int]]) -> None:
        """
        Do not return anything, modify matrix in-place instead.
        """


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    matrix = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]
    Solution().setZeroes(matrix)
    print(matrix)
