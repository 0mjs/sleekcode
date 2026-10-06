import { describe, expect, test } from "bun:test";
import { runOps } from "../../lib";
import { DetectSquares } from "./solution";

describe("2013. Detect Squares", () => {
  test("example 1", () => {
    const ops = ["DetectSquares","add","add","add","count","count","add","count"];
    const args = [[],[[3,10]],[[11,2]],[[3,2]],[[11,10]],[[14,8]],[[11,2]],[[11,10]]];
    expect(runOps(DetectSquares, ops, args)).toEqual([null, null, null, null, 1, 0, null, 2]);
  });
});
