"""
2013. Detect Squares — Medium
https://leetcode.com/problems/detect-squares/
Pattern: Math & Geometry

Full problem + examples in README.md
"""

from sleek import run_ops


class DetectSquares:

    def __init__(self):
        raise NotImplementedError("Not implemented")

    def add(self, point: list[int]) -> None:
        raise NotImplementedError("Not implemented")

    def count(self, point: list[int]) -> int:
        raise NotImplementedError("Not implemented")


# Your DetectSquares object will be instantiated and called as such:
# obj = DetectSquares()
# obj.add(point)
# param_2 = obj.count(point)


# Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if __name__ == "__main__":
    print(run_ops(DetectSquares, ["DetectSquares", "add", "add", "add", "count", "count", "add", "count"], [[], [[3, 10]], [[11, 2]], [[3, 2]], [[11, 10]], [[14, 8]], [[11, 2]], [[11, 10]]]))
