"""
295. Find Median from Data Stream — Hard ⭐
https://leetcode.com/problems/find-median-from-data-stream/
Pattern: Heap / Priority Queue

Full problem + examples in README.md
"""

from sleek import run_ops


class MedianFinder:

    def __init__(self):
        raise NotImplementedError("Not implemented")

    def addNum(self, num: int) -> None:
        raise NotImplementedError("Not implemented")

    def findMedian(self) -> float:
        raise NotImplementedError("Not implemented")


# Your MedianFinder object will be instantiated and called as such:
# obj = MedianFinder()
# obj.addNum(num)
# param_2 = obj.findMedian()


# Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if __name__ == "__main__":
    print(run_ops(MedianFinder, ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"], [[], [1], [2], [], [3], []]))
