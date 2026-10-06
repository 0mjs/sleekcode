import { runOps } from "../../lib";

/**
 * 155. Min Stack — Medium
 * https://leetcode.com/problems/min-stack/
 * Pattern: Stack
 *
 * Full problem + examples in README.md
 */
export class MinStack {
  constructor() {
    throw new Error("Not implemented");
  }

  push(value: number): void {
    throw new Error("Not implemented");
  }

  pop(): void {
    throw new Error("Not implemented");
  }

  top(): number {
    throw new Error("Not implemented");
  }

  getMin(): number {
    throw new Error("Not implemented");
  }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(value)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(runOps(MinStack, ["MinStack","push","push","push","getMin","pop","top","getMin"], [[],[-2],[0],[-3],[],[],[],[]]));
}
