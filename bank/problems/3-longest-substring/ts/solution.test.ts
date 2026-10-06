import { describe, expect, test } from "bun:test";
import { lengthOfLongestSubstring } from "./solution";

describe("3. Longest Substring Without Repeating Characters", () => {
  test("example 1", () => {
    expect(lengthOfLongestSubstring("abcabcbb")).toEqual(3);
  });

  test("example 2", () => {
    expect(lengthOfLongestSubstring("bbbbb")).toEqual(1);
  });

  test("example 3", () => {
    expect(lengthOfLongestSubstring("pwwkew")).toEqual(3);
  });
});
