import { describe, expect, test } from "bun:test";
import { searchMatrix } from "./solution";

describe("74. Search a 2D Matrix", () => {
  test("example 1", () => {
    expect(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3)).toEqual(true);
  });

  test("example 2", () => {
    expect(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 13)).toEqual(false);
  });
});
