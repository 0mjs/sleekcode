import { describe, expect, test } from "bun:test";
import { carFleet } from "./solution";

describe("853. Car Fleet", () => {
  test("example 1", () => {
    expect(carFleet(12, [10,8,0,5,3], [2,4,1,1,3])).toEqual(3);
  });

  test("example 2", () => {
    expect(carFleet(10, [3], [3])).toEqual(1);
  });

  test("example 3", () => {
    expect(carFleet(100, [0,2,4], [4,2,1])).toEqual(1);
  });
});
