import { describe, expect, test } from "bun:test";
import { runOps } from "../../lib";
import { MinStack } from "./solution";

describe("155. Min Stack", () => {
  test("example 1", () => {
    const ops = ["MinStack","push","push","push","getMin","pop","top","getMin"];
    const args = [[],[-2],[0],[-3],[],[],[],[]];
    expect(runOps(MinStack, ops, args)).toEqual([null,null,null,null,-3,null,0,-2]);
  });
});
