import { describe, expect, test } from "bun:test";
import { rob } from "./solution";

describe("213. House Robber II", () => {
  test("example 1", () => {
    expect(rob([2,3,2])).toEqual(3);
  });

  test("example 2", () => {
    expect(rob([1,2,3,1])).toEqual(4);
  });

  test("example 3", () => {
    expect(rob([1,2,3])).toEqual(3);
  });
});
