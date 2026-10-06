import { describe, expect, test } from "bun:test";
import { maxCoins } from "./solution";

describe("312. Burst Balloons", () => {
  test("example 1", () => {
    expect(maxCoins([3,1,5,8])).toEqual(167);
  });

  test("example 2", () => {
    expect(maxCoins([1,5])).toEqual(10);
  });
});
