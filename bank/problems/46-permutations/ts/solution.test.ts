import { describe, expect, test } from "bun:test";
import { anyOrder } from "../../lib";
import { permute } from "./solution";

describe("46. Permutations", () => {
  test("example 1", () => {
    expect(anyOrder(permute([1,2,3]))).toEqual(anyOrder([[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]));
  });

  test("example 2", () => {
    expect(anyOrder(permute([0,1]))).toEqual(anyOrder([[0,1],[1,0]]));
  });

  test("example 3", () => {
    expect(anyOrder(permute([1]))).toEqual(anyOrder([[1]]));
  });
});
