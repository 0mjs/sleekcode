/**
 * 271. Encode and Decode Strings — Medium ⭐
 * https://leetcode.com/problems/encode-and-decode-strings/ (Premium)
 * Pattern: Arrays & Hashing
 *
 * Full problem + examples in README.md
 */
export function encode(strs: string[]): string {
  throw new Error("Not implemented");
}

export function decode(s: string): string[] {
  throw new Error("Not implemented");
}

// Scratchpad: `sk play` runs this, tests skip it
if (import.meta.main) {
  const encoded = encode(["neet", "code", "love", "you"]);
  console.log(JSON.stringify(encoded));
  console.log(decode(encoded));
}
