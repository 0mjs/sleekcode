"""
208. Implement Trie (Prefix Tree) — Medium ⭐
https://leetcode.com/problems/implement-trie-prefix-tree/
Pattern: Tries

Full problem + examples in README.md
"""

from sleek import run_ops


class Trie:

    def __init__(self):
        raise NotImplementedError("Not implemented")

    def insert(self, word: str) -> None:
        raise NotImplementedError("Not implemented")

    def search(self, word: str) -> bool:
        raise NotImplementedError("Not implemented")

    def startsWith(self, prefix: str) -> bool:
        raise NotImplementedError("Not implemented")


# Your Trie object will be instantiated and called as such:
# obj = Trie()
# obj.insert(word)
# param_2 = obj.search(word)
# param_3 = obj.startsWith(prefix)


# Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if __name__ == "__main__":
    print(run_ops(Trie, ["Trie", "insert", "search", "search", "startsWith", "insert", "search"], [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]))
