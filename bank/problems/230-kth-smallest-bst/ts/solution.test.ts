import { describe, expect, test } from "bun:test";
import { toTree } from "../../lib";
import { kthSmallest } from "./solution";

describe("230. Kth Smallest Element in a BST", () => {
  test("example 1", () => {
    expect(kthSmallest(toTree([3,1,4,null,2]), 1)).toEqual(1);
  });

  test("example 2", () => {
    expect(kthSmallest(toTree([5,3,6,2,4,null,null,1]), 3)).toEqual(3);
  });
});
