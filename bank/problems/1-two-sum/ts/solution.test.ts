import { describe, expect, test } from "bun:test";
import { anyOrder } from "../../lib";
import { twoSum } from "./solution";

describe("1. Two Sum", () => {
  test("example 1", () => {
    expect(anyOrder(twoSum([2,7,11,15], 9))).toEqual(anyOrder([0,1]));
  });

  test("example 2", () => {
    expect(anyOrder(twoSum([3,2,4], 6))).toEqual(anyOrder([1,2]));
  });

  test("example 3", () => {
    expect(anyOrder(twoSum([3,3], 6))).toEqual(anyOrder([0,1]));
  });
});
