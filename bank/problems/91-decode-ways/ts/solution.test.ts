import { describe, expect, test } from "bun:test";
import { numDecodings } from "./solution";

describe("91. Decode Ways", () => {
  test("example 1", () => {
    expect(numDecodings("12")).toEqual(2);
  });

  test("example 2", () => {
    expect(numDecodings("226")).toEqual(3);
  });

  test("example 3", () => {
    expect(numDecodings("06")).toEqual(0);
  });
});
