import { runOps } from "../../lib";

/**
 * 211. Design Add and Search Words Data Structure — Medium ⭐
 * https://leetcode.com/problems/design-add-and-search-words-data-structure/
 * Pattern: Tries
 *
 * Full problem + examples in README.md
 */
export class WordDictionary {
  constructor() {
    throw new Error("Not implemented");
  }

  addWord(word: string): void {
    throw new Error("Not implemented");
  }

  search(word: string): boolean {
    throw new Error("Not implemented");
  }
}

/**
 * Your WordDictionary object will be instantiated and called as such:
 * var obj = new WordDictionary()
 * obj.addWord(word)
 * var param_2 = obj.search(word)
 */

// Scratchpad, for your own experiments: `sk play --scratch` runs this (`sk play` runs the examples)
if (import.meta.main) {
  console.log(runOps(WordDictionary, ["WordDictionary","addWord","addWord","addWord","search","search","search","search"], [[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]));
}
