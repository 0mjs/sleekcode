"""
271. Encode and Decode Strings — Medium ⭐
https://leetcode.com/problems/encode-and-decode-strings/ (Premium)
Pattern: Arrays & Hashing

Full problem + examples in README.md
"""


class Solution:
    def encode(self, strs: list[str]) -> str:
        raise NotImplementedError("Not implemented")

    def decode(self, s: str) -> list[str]:
        raise NotImplementedError("Not implemented")


# Scratchpad: `sk play` runs this, tests skip it
if __name__ == "__main__":
    encoded = Solution().encode(["neet", "code", "love", "you"])
    print(repr(encoded))
    print(Solution().decode(encoded))
