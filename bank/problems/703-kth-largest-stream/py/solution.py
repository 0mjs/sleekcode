"""
703. Kth Largest Element in a Stream — Easy
https://leetcode.com/problems/kth-largest-element-in-a-stream/
Pattern: Heap / Priority Queue

Full problem + examples in README.md
"""

from sleek import run_ops


class KthLargest:

    def __init__(self, k: int, nums: list[int]):
        raise NotImplementedError("Not implemented")

    def add(self, val: int) -> int:
        raise NotImplementedError("Not implemented")


# Your KthLargest object will be instantiated and called as such:
# obj = KthLargest(k, nums)
# param_1 = obj.add(val)


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(run_ops(KthLargest, ["KthLargest", "add", "add", "add", "add", "add"], [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]))
