import { describe, expect, test } from "bun:test";
import { anyOrderDeep } from "../../lib";
import { threeSum } from "./solution";

describe("15. 3Sum", () => {
  test("example 1", () => {
    expect(anyOrderDeep(threeSum([-1,0,1,2,-1,-4]))).toEqual(anyOrderDeep([[-1,-1,2],[-1,0,1]]));
  });

  test("example 2", () => {
    expect(anyOrderDeep(threeSum([0,1,1]))).toEqual(anyOrderDeep([]));
  });

  test("example 3", () => {
    expect(anyOrderDeep(threeSum([0,0,0]))).toEqual(anyOrderDeep([[0,0,0]]));
  });
});
