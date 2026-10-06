import { describe, expect, test } from "bun:test";
import { hammingWeight } from "./solution";

describe("191. Number of 1 Bits", () => {
  test("example 1", () => {
    expect(hammingWeight(11)).toEqual(3);
  });

  test("example 2", () => {
    expect(hammingWeight(128)).toEqual(1);
  });

  test("example 3", () => {
    expect(hammingWeight(2147483645)).toEqual(30);
  });
});
