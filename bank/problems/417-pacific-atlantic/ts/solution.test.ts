import { describe, expect, test } from "bun:test";
import { anyOrder } from "../../lib";
import { pacificAtlantic } from "./solution";

describe("417. Pacific Atlantic Water Flow", () => {
  test("example 1", () => {
    expect(anyOrder(pacificAtlantic([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]))).toEqual(anyOrder([[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]));
  });

  test("example 2", () => {
    expect(anyOrder(pacificAtlantic([[1]]))).toEqual(anyOrder([[0,0]]));
  });
});
