import { runOps } from "../../lib";

/**
 * 703. Kth Largest Element in a Stream — Easy
 * https://leetcode.com/problems/kth-largest-element-in-a-stream/
 * Pattern: Heap / Priority Queue
 *
 * Full problem + examples in README.md
 */
export class KthLargest {
  constructor(k: number, nums: number[]) {
    throw new Error("Not implemented");
  }

  add(val: number): number {
    throw new Error("Not implemented");
  }
}

/**
 * Your KthLargest object will be instantiated and called as such:
 * var obj = new KthLargest(k, nums)
 * var param_1 = obj.add(val)
 */

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  console.log(runOps(KthLargest, ["KthLargest","add","add","add","add","add"], [[3,[4,5,8,2]],[3],[5],[10],[9],[4]]));
}
