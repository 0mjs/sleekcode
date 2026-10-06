import { describe, expect, test } from "bun:test";
import { fromTree, toTree } from "../../lib";
import { invertTree } from "./solution";

describe("226. Invert Binary Tree", () => {
  test("example 1", () => {
    expect(fromTree(invertTree(toTree([4,2,7,1,3,6,9])))).toEqual([4,7,2,9,6,3,1]);
  });

  test("example 2", () => {
    expect(fromTree(invertTree(toTree([2,1,3])))).toEqual([2,3,1]);
  });

  test("example 3", () => {
    expect(fromTree(invertTree(toTree([])))).toEqual([]);
  });
});
