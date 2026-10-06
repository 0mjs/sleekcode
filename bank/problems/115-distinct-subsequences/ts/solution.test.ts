import { describe, expect, test } from "bun:test";
import { numDistinct } from "./solution";

describe("115. Distinct Subsequences", () => {
  test("example 1", () => {
    expect(numDistinct("rabbbit", "rabbit")).toEqual(3);
  });

  test("example 2", () => {
    expect(numDistinct("babgbag", "bag")).toEqual(5);
  });
});
