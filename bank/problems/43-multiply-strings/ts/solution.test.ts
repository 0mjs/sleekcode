import { describe, expect, test } from "bun:test";
import { multiply } from "./solution";

describe("43. Multiply Strings", () => {
  test("example 1", () => {
    expect(multiply("2", "3")).toEqual("6");
  });

  test("example 2", () => {
    expect(multiply("123", "456")).toEqual("56088");
  });
});
