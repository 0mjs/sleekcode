import { describe, expect, test } from "bun:test";
import { numIslands } from "./solution";

describe("200. Number of Islands", () => {
  test("example 1", () => {
    expect(numIslands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]])).toEqual(1);
  });

  test("example 2", () => {
    expect(numIslands([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]])).toEqual(3);
  });
});
