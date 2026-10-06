import { runOps } from "../../lib";

/**
 * 981. Time Based Key-Value Store — Medium
 * https://leetcode.com/problems/time-based-key-value-store/
 * Pattern: Binary Search
 *
 * Full problem + examples in README.md
 */
export class TimeMap {
  constructor() {
    throw new Error("Not implemented");
  }

  set(key: string, value: string, timestamp: number): void {
    throw new Error("Not implemented");
  }

  get(key: string, timestamp: number): string {
    throw new Error("Not implemented");
  }
}

/**
 * Your TimeMap object will be instantiated and called as such:
 * var obj = new TimeMap()
 * obj.set(key,value,timestamp)
 * var param_2 = obj.get(key,timestamp)
 */

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(runOps(TimeMap, ["TimeMap","set","get","get","set","get","get"], [[],["foo","bar",1],["foo",1],["foo",3],["foo","bar2",4],["foo",4],["foo",5]]));
}
