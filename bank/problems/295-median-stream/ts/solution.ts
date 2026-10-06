import { runOps } from "../../lib";

/**
 * 295. Find Median from Data Stream — Hard ⭐
 * https://leetcode.com/problems/find-median-from-data-stream/
 * Pattern: Heap / Priority Queue
 *
 * Full problem + examples in README.md
 */
export class MedianFinder {
  constructor() {
    throw new Error("Not implemented");
  }

  addNum(num: number): void {
    throw new Error("Not implemented");
  }

  findMedian(): number {
    throw new Error("Not implemented");
  }
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * var obj = new MedianFinder()
 * obj.addNum(num)
 * var param_2 = obj.findMedian()
 */

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  console.log(runOps(MedianFinder, ["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"], [[],[1],[2],[],[3],[]]));
}
