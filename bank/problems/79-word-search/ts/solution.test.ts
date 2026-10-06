import { describe, expect, test } from "bun:test";
import { exist } from "./solution";

describe("79. Word Search", () => {
  test("example 1", () => {
    expect(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED")).toEqual(true);
  });

  test("example 2", () => {
    expect(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE")).toEqual(true);
  });

  test("example 3", () => {
    expect(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB")).toEqual(false);
  });
});
