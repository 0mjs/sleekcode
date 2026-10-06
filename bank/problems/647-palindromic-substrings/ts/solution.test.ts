import { describe, expect, test } from "bun:test";
import { countSubstrings } from "./solution";

describe("647. Palindromic Substrings", () => {
  test("example 1", () => {
    expect(countSubstrings("abc")).toEqual(3);
  });

  test("example 2", () => {
    expect(countSubstrings("aaa")).toEqual(6);
  });
});
