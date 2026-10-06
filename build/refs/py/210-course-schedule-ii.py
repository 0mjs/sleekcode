class Solution:
    def findOrder(self, n, prerequisites):
        adj = [[] for _ in range(n)]
        indegree = [0] * n
        for a, b in prerequisites:
            adj[b].append(a)
            indegree[a] += 1
        order = [i for i in range(n) if indegree[i] == 0]
        for c in order:
            for nxt in adj[c]:
                indegree[nxt] -= 1
                if indegree[nxt] == 0:
                    order.append(nxt)
        return order if len(order) == n else []
