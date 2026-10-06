import { describe, expect, test } from "bun:test";
import { maxArea } from "./solution";

describe("11. Container With Most Water", () => {
  test("example 1", () => {
    expect(maxArea([1,8,6,2,5,4,8,3,7])).toEqual(49);
  });

  test("example 2", () => {
    expect(maxArea([1,1])).toEqual(1);
  });
});
