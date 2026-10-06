import { describe, expect, test } from "bun:test";
import { solve } from "./solution";

describe("130. Surrounded Regions", () => {
  test("example 1", () => {
    const board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]];
    solve(board);
    expect(board).toEqual([["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]);
  });

  test("example 2", () => {
    const board = [["X"]];
    solve(board);
    expect(board).toEqual([["X"]]);
  });
});
