You are given an `m x n` grid `rooms` filled with three possible values:

- `-1` — a wall or obstacle.
- `0` — a gate.
- `INF` — an empty room. `INF` is `2^31 - 1 = 2147483647`.

Fill **each empty room** with the distance to its **nearest gate** (moving up, down, left or right). If a room can't reach any gate, leave it as `INF`.

Modify `rooms` **in place** — don't return anything.

### Example 1

```
Input:
[[INF, -1,   0, INF],
 [INF, INF, INF, -1],
 [INF, -1,  INF, -1],
 [  0, -1,  INF, INF]]

Output:
[[3, -1, 0,  1],
 [2,  2, 1, -1],
 [1, -1, 2, -1],
 [0, -1, 3,  4]]
```

### Example 2

```
Input:  [[-1]]
Output: [[-1]]
```

### Constraints

- `m == rooms.length`, `n == rooms[i].length`
- `1 <= m, n <= 250`
- `rooms[i][j]` is `-1`, `0`, or `2^31 - 1`.

