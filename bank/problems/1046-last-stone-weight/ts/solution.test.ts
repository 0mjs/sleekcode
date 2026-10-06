import { describe, expect, test } from "bun:test";
import { lastStoneWeight } from "./solution";

describe("1046. Last Stone Weight", () => {
  test("example 1", () => {
    expect(lastStoneWeight([2,7,4,1,8,1])).toEqual(1);
  });

  test("example 2", () => {
    expect(lastStoneWeight([1])).toEqual(1);
  });
});
