import { describe, expect, test } from "bun:test";
import { isInterleave } from "./solution";

describe("97. Interleaving String", () => {
  test("example 1", () => {
    expect(isInterleave("aabcc", "dbbca", "aadbbcbcac")).toEqual(true);
  });

  test("example 2", () => {
    expect(isInterleave("aabcc", "dbbca", "aadbbbaccc")).toEqual(false);
  });

  test("example 3", () => {
    expect(isInterleave("", "", "")).toEqual(true);
  });
});
