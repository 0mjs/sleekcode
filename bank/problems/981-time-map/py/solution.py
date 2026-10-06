"""
981. Time Based Key-Value Store — Medium
https://leetcode.com/problems/time-based-key-value-store/
Pattern: Binary Search

Full problem + examples in README.md
"""

from sleek import run_ops


class TimeMap:

    def __init__(self):
        raise NotImplementedError("Not implemented")

    def set(self, key: str, value: str, timestamp: int) -> None:
        raise NotImplementedError("Not implemented")

    def get(self, key: str, timestamp: int) -> str:
        raise NotImplementedError("Not implemented")


# Your TimeMap object will be instantiated and called as such:
# obj = TimeMap()
# obj.set(key,value,timestamp)
# param_2 = obj.get(key,timestamp)


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(run_ops(TimeMap, ["TimeMap", "set", "get", "get", "set", "get", "get"], [[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]))
