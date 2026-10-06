import { describe, expect, test } from "bun:test";
import { minWindow } from "./solution";

describe("76. Minimum Window Substring", () => {
  test("example 1", () => {
    expect(minWindow("ADOBECODEBANC", "ABC")).toEqual("BANC");
  });

  test("example 2", () => {
    expect(minWindow("a", "a")).toEqual("a");
  });

  test("example 3", () => {
    expect(minWindow("a", "aa")).toEqual("");
  });
});
