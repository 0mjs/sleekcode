import { describe, expect, test } from "bun:test";
import { maxProfit } from "./solution";

describe("121. Best Time to Buy and Sell Stock", () => {
  test("example 1", () => {
    expect(maxProfit([7,1,5,3,6,4])).toEqual(5);
  });

  test("example 2", () => {
    expect(maxProfit([7,6,4,3,1])).toEqual(0);
  });
});
