You have a graph of `n` nodes labelled `0` to `n - 1`. You are given `n` and an array `edges` where `edges[i] = [a, b]` means there is an **undirected** edge between nodes `a` and `b`.

Return the **number of connected components** in the graph.

### Example 1

```
0 - 1      3
    |      |
    2      4

Input:  n = 5, edges = [[0,1],[1,2],[3,4]]
Output: 2
```

### Example 2

```
0 - 1
    |
    2 - 3 - 4

Input:  n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
Output: 1
```

### Constraints

- `1 <= n <= 2000`
- `1 <= edges.length <= 5000`
- `edges[i].length == 2`
- `0 <= a, b < n`, `a != b`
- There are no repeated edges.

