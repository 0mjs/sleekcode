import { runOps } from "../../lib";

/**
 * 146. LRU Cache — Medium
 * https://leetcode.com/problems/lru-cache/
 * Pattern: Linked List
 *
 * Full problem + examples in README.md
 */
export class LRUCache {
  constructor(capacity: number) {
    throw new Error("Not implemented");
  }

  get(key: number): number {
    throw new Error("Not implemented");
  }

  put(key: number, value: number): void {
    throw new Error("Not implemented");
  }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  console.log(runOps(LRUCache, ["LRUCache","put","put","get","put","get","put","get","get","get"], [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]));
}
