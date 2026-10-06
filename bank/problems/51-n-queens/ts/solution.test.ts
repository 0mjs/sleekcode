import { describe, expect, test } from "bun:test";
import { anyOrder } from "../../lib";
import { solveNQueens } from "./solution";

describe("51. N-Queens", () => {
  test("example 1", () => {
    expect(anyOrder(solveNQueens(4))).toEqual(anyOrder([[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]));
  });

  test("example 2", () => {
    expect(anyOrder(solveNQueens(1))).toEqual(anyOrder([["Q"]]));
  });
});
