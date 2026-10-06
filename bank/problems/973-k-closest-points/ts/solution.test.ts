import { describe, expect, test } from "bun:test";
import { anyOrder } from "../../lib";
import { kClosest } from "./solution";

describe("973. K Closest Points to Origin", () => {
  test("example 1", () => {
    expect(anyOrder(kClosest([[1,3],[-2,2]], 1))).toEqual(anyOrder([[-2,2]]));
  });

  test("example 2", () => {
    expect(anyOrder(kClosest([[3,3],[5,-1],[-2,4]], 2))).toEqual(anyOrder([[3,3],[-2,4]]));
  });
});
