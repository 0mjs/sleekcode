import { describe, expect, test } from "bun:test";
import { coinChange } from "./solution";

describe("322. Coin Change", () => {
  test("example 1", () => {
    expect(coinChange([1,2,5], 11)).toEqual(3);
  });

  test("example 2", () => {
    expect(coinChange([2], 3)).toEqual(-1);
  });

  test("example 3", () => {
    expect(coinChange([1], 0)).toEqual(0);
  });
});
