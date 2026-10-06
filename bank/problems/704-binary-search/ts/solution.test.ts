import { describe, expect, test } from "bun:test";
import { search } from "./solution";

describe("704. Binary Search", () => {
  test("example 1", () => {
    expect(search([-1,0,3,5,9,12], 9)).toEqual(4);
  });

  test("example 2", () => {
    expect(search([-1,0,3,5,9,12], 2)).toEqual(-1);
  });
});
