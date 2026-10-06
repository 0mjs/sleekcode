import { describe, expect, test } from "bun:test";
import { anyOrder } from "../../lib";
import { topKFrequent } from "./solution";

describe("347. Top K Frequent Elements", () => {
  test("example 1", () => {
    expect(anyOrder(topKFrequent([1,1,1,2,2,3], 2))).toEqual(anyOrder([1,2]));
  });

  test("example 2", () => {
    expect(anyOrder(topKFrequent([1], 1))).toEqual(anyOrder([1]));
  });

  test("example 3", () => {
    expect(anyOrder(topKFrequent([1,2,1,2,1,2,3,1,3,2], 2))).toEqual(anyOrder([1,2]));
  });
});
