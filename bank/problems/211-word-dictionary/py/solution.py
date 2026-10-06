"""
211. Design Add and Search Words Data Structure — Medium ⭐
https://leetcode.com/problems/design-add-and-search-words-data-structure/
Pattern: Tries

Full problem + examples in README.md
"""

from sleek import run_ops


class WordDictionary:

    def __init__(self):
        raise NotImplementedError("Not implemented")

    def addWord(self, word: str) -> None:
        raise NotImplementedError("Not implemented")

    def search(self, word: str) -> bool:
        raise NotImplementedError("Not implemented")


# Your WordDictionary object will be instantiated and called as such:
# obj = WordDictionary()
# obj.addWord(word)
# param_2 = obj.search(word)


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    print(run_ops(WordDictionary, ["WordDictionary", "addWord", "addWord", "addWord", "search", "search", "search", "search"], [[], ["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]]))
