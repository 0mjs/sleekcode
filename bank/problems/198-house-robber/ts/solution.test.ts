import { describe, expect, test } from "bun:test";
import { rob } from "./solution";

describe("198. House Robber", () => {
  test("example 1", () => {
    expect(rob([1,2,3,1])).toEqual(4);
  });

  test("example 2", () => {
    expect(rob([2,7,9,3,1])).toEqual(12);
  });
});
