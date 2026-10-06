import { describe, expect, test } from "bun:test";
import { minDistance } from "./solution";

describe("72. Edit Distance", () => {
  test("example 1", () => {
    expect(minDistance("horse", "ros")).toEqual(3);
  });

  test("example 2", () => {
    expect(minDistance("intention", "execution")).toEqual(5);
  });
});
