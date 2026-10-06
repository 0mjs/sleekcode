import { describe, expect, test } from "bun:test";
import { longestCommonSubsequence } from "./solution";

describe("1143. Longest Common Subsequence", () => {
  test("example 1", () => {
    expect(longestCommonSubsequence("abcde", "ace")).toEqual(3);
  });

  test("example 2", () => {
    expect(longestCommonSubsequence("abc", "abc")).toEqual(3);
  });

  test("example 3", () => {
    expect(longestCommonSubsequence("abc", "def")).toEqual(0);
  });
});
