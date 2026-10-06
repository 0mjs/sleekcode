import { describe, expect, test } from "bun:test";
import { toTree } from "../../lib";
import { isSameTree } from "./solution";

describe("100. Same Tree", () => {
  test("example 1", () => {
    expect(isSameTree(toTree([1,2,3]), toTree([1,2,3]))).toEqual(true);
  });

  test("example 2", () => {
    expect(isSameTree(toTree([1,2]), toTree([1,null,2]))).toEqual(false);
  });

  test("example 3", () => {
    expect(isSameTree(toTree([1,2,1]), toTree([1,1,2]))).toEqual(false);
  });
});
