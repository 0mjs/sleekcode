import { describe, expect, test } from "bun:test";
import { reverseBits } from "./solution";

describe("190. Reverse Bits", () => {
  test("example 1", () => {
    expect(reverseBits(43261596)).toEqual(964176192);
  });

  test("example 2", () => {
    expect(reverseBits(2147483644)).toEqual(1073741822);
  });
});
