import { runOps } from "../../lib";

/**
 * 2013. Detect Squares — Medium
 * https://leetcode.com/problems/detect-squares/
 * Pattern: Math & Geometry
 *
 * Full problem + examples in README.md
 */
export class DetectSquares {
  constructor() {
    throw new Error("Not implemented");
  }

  add(point: number[]): void {
    throw new Error("Not implemented");
  }

  count(point: number[]): number {
    throw new Error("Not implemented");
  }
}

/**
 * Your DetectSquares object will be instantiated and called as such:
 * var obj = new DetectSquares()
 * obj.add(point)
 * var param_2 = obj.count(point)
 */

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  console.log(runOps(DetectSquares, ["DetectSquares","add","add","add","count","count","add","count"], [[],[[3,10]],[[11,2]],[[3,2]],[[11,10]],[[14,8]],[[11,2]],[[11,10]]]));
}
