import { describe, expect, test } from "bun:test";
import { isValid } from "./solution";

describe("20. Valid Parentheses", () => {
  test("example 1", () => {
    expect(isValid("()")).toEqual(true);
  });

  test("example 2", () => {
    expect(isValid("()[]{}")).toEqual(true);
  });

  test("example 3", () => {
    expect(isValid("(]")).toEqual(false);
  });

  test("example 4", () => {
    expect(isValid("([])")).toEqual(true);
  });

  test("example 5", () => {
    expect(isValid("([)]")).toEqual(false);
  });
});
