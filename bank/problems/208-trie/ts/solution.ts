import { runOps } from "../../lib";

/**
 * 208. Implement Trie (Prefix Tree) — Medium ⭐
 * https://leetcode.com/problems/implement-trie-prefix-tree/
 * Pattern: Tries
 *
 * Full problem + examples in README.md
 */
export class Trie {
  constructor() {
    throw new Error("Not implemented");
  }

  insert(word: string): void {
    throw new Error("Not implemented");
  }

  search(word: string): boolean {
    throw new Error("Not implemented");
  }

  startsWith(prefix: string): boolean {
    throw new Error("Not implemented");
  }
}

/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  console.log(runOps(Trie, ["Trie","insert","search","search","startsWith","insert","search"], [[],["apple"],["apple"],["app"],["app"],["app"],["app"]]));
}
