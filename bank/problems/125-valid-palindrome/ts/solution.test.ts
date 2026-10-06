import { describe, expect, test } from "bun:test";
import { isPalindrome } from "./solution";

describe("125. Valid Palindrome", () => {
  test("example 1", () => {
    expect(isPalindrome("A man, a plan, a canal: Panama")).toEqual(true);
  });

  test("example 2", () => {
    expect(isPalindrome("race a car")).toEqual(false);
  });

  test("example 3", () => {
    expect(isPalindrome(" ")).toEqual(true);
  });
});
