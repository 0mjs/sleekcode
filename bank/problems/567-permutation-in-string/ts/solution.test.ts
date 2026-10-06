import { describe, expect, test } from "bun:test";
import { checkInclusion } from "./solution";

describe("567. Permutation in String", () => {
  test("example 1", () => {
    expect(checkInclusion("ab", "eidbaooo")).toEqual(true);
  });

  test("example 2", () => {
    expect(checkInclusion("ab", "eidboaoo")).toEqual(false);
  });
});
