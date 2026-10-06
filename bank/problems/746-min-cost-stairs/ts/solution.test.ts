import { describe, expect, test } from "bun:test";
import { minCostClimbingStairs } from "./solution";

describe("746. Min Cost Climbing Stairs", () => {
  test("example 1", () => {
    expect(minCostClimbingStairs([10,15,20])).toEqual(15);
  });

  test("example 2", () => {
    expect(minCostClimbingStairs([1,100,1,1,1,100,1,1,100,1])).toEqual(6);
  });
});
