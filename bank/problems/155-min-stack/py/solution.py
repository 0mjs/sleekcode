"""
155. Min Stack — Medium
https://leetcode.com/problems/min-stack/
Pattern: Stack

Full problem + examples in README.md
"""

from sleek import run_ops


class MinStack:

    def __init__(self):
        raise NotImplementedError("Not implemented")

    def push(self, value: int) -> None:
        raise NotImplementedError("Not implemented")

    def pop(self) -> None:
        raise NotImplementedError("Not implemented")

    def top(self) -> int:
        raise NotImplementedError("Not implemented")

    def getMin(self) -> int:
        raise NotImplementedError("Not implemented")


# Your MinStack object will be instantiated and called as such:
# obj = MinStack()
# obj.push(value)
# obj.pop()
# param_3 = obj.top()
# param_4 = obj.getMin()


# Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if __name__ == "__main__":
    print(run_ops(MinStack, ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"], [[], [-2], [0], [-3], [], [], [], []]))
