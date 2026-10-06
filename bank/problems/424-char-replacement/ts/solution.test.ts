import { describe, expect, test } from "bun:test";
import { characterReplacement } from "./solution";

describe("424. Longest Repeating Character Replacement", () => {
  test("example 1", () => {
    expect(characterReplacement("ABAB", 2)).toEqual(4);
  });

  test("example 2", () => {
    expect(characterReplacement("AABABBA", 1)).toEqual(4);
  });
});
