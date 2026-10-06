import { describe, expect, test } from "bun:test";
import { findTargetSumWays } from "./solution";

describe("494. Target Sum", () => {
  test("example 1", () => {
    expect(findTargetSumWays([1,1,1,1,1], 3)).toEqual(5);
  });

  test("example 2", () => {
    expect(findTargetSumWays([1], 1)).toEqual(1);
  });
});
