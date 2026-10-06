"""
146. LRU Cache — Medium
https://leetcode.com/problems/lru-cache/
Pattern: Linked List

Full problem + examples in README.md
"""

from sleek import run_ops


class LRUCache:

    def __init__(self, capacity: int):
        raise NotImplementedError("Not implemented")

    def get(self, key: int) -> int:
        raise NotImplementedError("Not implemented")

    def put(self, key: int, value: int) -> None:
        raise NotImplementedError("Not implemented")


# Your LRUCache object will be instantiated and called as such:
# obj = LRUCache(capacity)
# param_1 = obj.get(key)
# obj.put(key,value)


# Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if __name__ == "__main__":
    print(run_ops(LRUCache, ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]))
