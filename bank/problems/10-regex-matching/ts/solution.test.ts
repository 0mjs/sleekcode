import { describe, expect, test } from "bun:test";
import { isMatch } from "./solution";

describe("10. Regular Expression Matching", () => {
  test("example 1", () => {
    expect(isMatch("aa", "a")).toEqual(false);
  });

  test("example 2", () => {
    expect(isMatch("aa", "a*")).toEqual(true);
  });

  test("example 3", () => {
    expect(isMatch("ab", ".*")).toEqual(true);
  });
});
