class Solution:
    def wallsAndGates(self, rooms):
        INF = 2147483647
        queue = [(r, c) for r, row in enumerate(rooms) for c, v in enumerate(row) if v == 0]
        for r, c in queue:
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < len(rooms) and 0 <= nc < len(rooms[0]) and rooms[nr][nc] == INF:
                    rooms[nr][nc] = rooms[r][c] + 1
                    queue.append((nr, nc))
