import { describe, expect, test } from "bun:test";
import { longestPalindrome } from "./solution";

describe("5. Longest Palindromic Substring", () => {
  test("example 1", () => {
    expect(longestPalindrome("babad")).toEqual("bab");
  });

  test("example 2", () => {
    expect(longestPalindrome("cbbd")).toEqual("bb");
  });
});
