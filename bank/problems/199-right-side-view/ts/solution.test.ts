import { describe, expect, test } from "bun:test";
import { toTree } from "../../lib";
import { rightSideView } from "./solution";

describe("199. Binary Tree Right Side View", () => {
  test("example 1", () => {
    expect(rightSideView(toTree([1,2,3,null,5,null,4]))).toEqual([1,3,4]);
  });

  test("example 2", () => {
    expect(rightSideView(toTree([1,2,3,4,null,null,null,5]))).toEqual([1,3,4,5]);
  });

  test("example 3", () => {
    expect(rightSideView(toTree([1,null,3]))).toEqual([1,3]);
  });

  test("example 4", () => {
    expect(rightSideView(toTree([]))).toEqual([]);
  });
});
