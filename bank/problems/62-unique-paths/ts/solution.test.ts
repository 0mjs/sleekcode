import { describe, expect, test } from "bun:test";
import { uniquePaths } from "./solution";

describe("62. Unique Paths", () => {
  test("example 1", () => {
    expect(uniquePaths(3, 7)).toEqual(28);
  });

  test("example 2", () => {
    expect(uniquePaths(3, 2)).toEqual(3);
  });
});
