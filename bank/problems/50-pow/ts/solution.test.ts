import { describe, expect, test } from "bun:test";
import { myPow } from "./solution";

describe("50. Pow(x, n)", () => {
  test("example 1", () => {
    expect(myPow(2.00000, 10)).toBeCloseTo(1024.00000, 5);
  });

  test("example 2", () => {
    expect(myPow(2.10000, 3)).toBeCloseTo(9.26100, 5);
  });

  test("example 3", () => {
    expect(myPow(2.00000, -2)).toBeCloseTo(0.25000, 5);
  });
});
