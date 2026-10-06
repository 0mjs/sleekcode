import { describe, expect, test } from "bun:test";
import { isHappy } from "./solution";

describe("202. Happy Number", () => {
  test("example 1", () => {
    expect(isHappy(19)).toEqual(true);
  });

  test("example 2", () => {
    expect(isHappy(2)).toEqual(false);
  });
});
