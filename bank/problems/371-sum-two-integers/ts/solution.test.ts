import { describe, expect, test } from "bun:test";
import { getSum } from "./solution";

describe("371. Sum of Two Integers", () => {
  test("example 1", () => {
    expect(getSum(1, 2)).toEqual(3);
  });

  test("example 2", () => {
    expect(getSum(2, 3)).toEqual(5);
  });
});
