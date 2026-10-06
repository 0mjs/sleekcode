import { describe, expect, test } from "bun:test";
import { trap } from "./solution";

describe("42. Trapping Rain Water", () => {
  test("example 1", () => {
    expect(trap([0,1,0,2,1,0,1,3,2,1,2,1])).toEqual(6);
  });

  test("example 2", () => {
    expect(trap([4,2,0,3,2,5])).toEqual(9);
  });
});
