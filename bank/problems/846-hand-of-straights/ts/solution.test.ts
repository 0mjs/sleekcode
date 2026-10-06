import { describe, expect, test } from "bun:test";
import { isNStraightHand } from "./solution";

describe("846. Hand of Straights", () => {
  test("example 1", () => {
    expect(isNStraightHand([1,2,3,6,2,3,4,7,8], 3)).toEqual(true);
  });

  test("example 2", () => {
    expect(isNStraightHand([1,2,3,4,5], 4)).toEqual(false);
  });
});
