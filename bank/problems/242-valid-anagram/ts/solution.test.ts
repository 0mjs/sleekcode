import { describe, expect, test } from "bun:test";
import { isAnagram } from "./solution";

describe("242. Valid Anagram", () => {
  test("example 1", () => {
    expect(isAnagram("anagram", "nagaram")).toEqual(true);
  });

  test("example 2", () => {
    expect(isAnagram("rat", "car")).toEqual(false);
  });
});
