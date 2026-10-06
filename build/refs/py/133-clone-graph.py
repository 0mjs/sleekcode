from sleek import Node


class Solution:
    def cloneGraph(self, node):
        copies = {}

        def clone(n):
            if n in copies:
                return copies[n]
            c = copies[n] = Node(n.val)
            c.neighbors = [clone(m) for m in n.neighbors]
            return c

        return clone(node) if node else None
