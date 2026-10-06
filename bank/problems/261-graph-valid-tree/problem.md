You have a graph of `n` nodes labelled `0` to `n - 1`, and a list of **undirected** `edges` (each edge is a pair of nodes).

Return `true` if the edges of the graph make up a **valid tree**, and `false` otherwise.

A valid tree is **connected** (every node can reach every other node) and has **no cycles**.

### Example 1

```
Input:  n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
Output: true
```

### Example 2

```
Input:  n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]
Output: false
Explanation: 1 - 2 - 3 - 1 is a cycle.
```

### Constraints

- `1 <= n <= 2000`
- `0 <= edges.length <= 5000`
- `edges[i].length == 2`
- `0 <= a, b < n`, `a != b`
- There are no self-loops or repeated edges.

