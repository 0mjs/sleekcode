import { describe, expect, test } from "bun:test";
import { checkValidString } from "./solution";

describe("678. Valid Parenthesis String", () => {
  test("example 1", () => {
    expect(checkValidString("()")).toEqual(true);
  });

  test("example 2", () => {
    expect(checkValidString("(*)")).toEqual(true);
  });

  test("example 3", () => {
    expect(checkValidString("(*))")).toEqual(true);
  });

  test("example 4", () => {
    expect(checkValidString("(")).toEqual(false);
  });
});
