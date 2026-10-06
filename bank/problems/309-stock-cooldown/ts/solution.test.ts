import { describe, expect, test } from "bun:test";
import { maxProfit } from "./solution";

describe("309. Best Time to Buy and Sell Stock with Cooldown", () => {
  test("example 1", () => {
    expect(maxProfit([1,2,3,0,2])).toEqual(3);
  });

  test("example 2", () => {
    expect(maxProfit([1])).toEqual(0);
  });
});
