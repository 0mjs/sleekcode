import { describe, expect, test } from "bun:test";
import { runOps } from "../../lib";
import { MedianFinder } from "./solution";

describe("295. Find Median from Data Stream", () => {
  test("example 1", () => {
    const ops = ["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"];
    const args = [[],[1],[2],[],[3],[]];
    expect(runOps(MedianFinder, ops, args)).toEqual([null, null, null, 1.5, null, 2.0]);
  });
});
