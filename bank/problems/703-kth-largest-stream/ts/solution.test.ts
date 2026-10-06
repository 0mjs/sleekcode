import { describe, expect, test } from "bun:test";
import { runOps } from "../../lib";
import { KthLargest } from "./solution";

describe("703. Kth Largest Element in a Stream", () => {
  test("example 1", () => {
    const ops = ["KthLargest","add","add","add","add","add"];
    const args = [[3,[4,5,8,2]],[3],[5],[10],[9],[4]];
    expect(runOps(KthLargest, ops, args)).toEqual([null, 4, 5, 5, 8, 8]);
  });

  test("example 2", () => {
    const ops = ["KthLargest","add","add","add","add"];
    const args = [[4,[7,7,7,7,8,3]],[2],[10],[9],[9]];
    expect(runOps(KthLargest, ops, args)).toEqual([null, 7, 7, 7, 8]);
  });
});
