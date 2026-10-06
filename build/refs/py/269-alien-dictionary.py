class Solution:
    def alienOrder(self, words):
        adj = {c: set() for w in words for c in w}
        for a, b in zip(words, words[1:]):
            for x, y in zip(a, b):
                if x != y:
                    adj[x].add(y)
                    break
            else:
                if len(a) > len(b):
                    return ""
        state, out = {}, []

        def dfs(c):
            if c in state:
                return state[c]
            state[c] = False
            if not all(dfs(d) for d in adj[c]):
                return False
            state[c] = True
            out.append(c)
            return True

        if not all(dfs(c) for c in adj):
            return ""
        return "".join(reversed(out))
