import { describe, expect, test } from "bun:test";
import { climbStairs } from "./solution";

describe("70. Climbing Stairs", () => {
  test("example 1", () => {
    expect(climbStairs(2)).toEqual(2);
  });

  test("example 2", () => {
    expect(climbStairs(3)).toEqual(3);
  });
});
