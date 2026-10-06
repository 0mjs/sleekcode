import { describe, expect, test } from "bun:test";
import { change } from "./solution";

describe("518. Coin Change II", () => {
  test("example 1", () => {
    expect(change(5, [1,2,5])).toEqual(4);
  });

  test("example 2", () => {
    expect(change(3, [2])).toEqual(0);
  });

  test("example 3", () => {
    expect(change(10, [10])).toEqual(1);
  });
});
