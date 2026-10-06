import { describe, expect, test } from "bun:test";
import { dailyTemperatures } from "./solution";

describe("739. Daily Temperatures", () => {
  test("example 1", () => {
    expect(dailyTemperatures([73,74,75,71,69,72,76,73])).toEqual([1,1,4,2,1,1,0,0]);
  });

  test("example 2", () => {
    expect(dailyTemperatures([30,40,50,60])).toEqual([1,1,1,0]);
  });

  test("example 3", () => {
    expect(dailyTemperatures([30,60,90])).toEqual([1,1,0]);
  });
});
