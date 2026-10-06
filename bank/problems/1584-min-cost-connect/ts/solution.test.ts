import { describe, expect, test } from "bun:test";
import { minCostConnectPoints } from "./solution";

describe("1584. Min Cost to Connect All Points", () => {
  test("example 1", () => {
    expect(minCostConnectPoints([[0,0],[2,2],[3,10],[5,2],[7,0]])).toEqual(20);
  });

  test("example 2", () => {
    expect(minCostConnectPoints([[3,12],[-2,5],[-4,1]])).toEqual(18);
  });
});
