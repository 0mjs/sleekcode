import { describe, expect, test } from "bun:test";
import { reverse } from "./solution";

describe("7. Reverse Integer", () => {
  test("example 1", () => {
    expect(reverse(123)).toEqual(321);
  });

  test("example 2", () => {
    expect(reverse(-123)).toEqual(-321);
  });

  test("example 3", () => {
    expect(reverse(120)).toEqual(21);
  });
});
