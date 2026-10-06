class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        rows, cols = len(grid), len(grid[0])

        def dfs(r, c):
            if not 0 <= r < rows or not 0 <= c < cols or grid[r][c] == "0":
                return 0
            grid[r][c] = "0"
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)
            return 1

        return sum(dfs(r, c) for r in range(rows) for c in range(cols))
