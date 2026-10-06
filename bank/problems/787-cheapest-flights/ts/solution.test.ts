import { describe, expect, test } from "bun:test";
import { findCheapestPrice } from "./solution";

describe("787. Cheapest Flights Within K Stops", () => {
  test("example 1", () => {
    expect(findCheapestPrice(4, [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 0, 3, 1)).toEqual(700);
  });

  test("example 2", () => {
    expect(findCheapestPrice(3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 1)).toEqual(200);
  });

  test("example 3", () => {
    expect(findCheapestPrice(3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 0)).toEqual(500);
  });
});
