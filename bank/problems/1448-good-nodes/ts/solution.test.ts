import { describe, expect, test } from "bun:test";
import { toTree } from "../../lib";
import { goodNodes } from "./solution";

describe("1448. Count Good Nodes in Binary Tree", () => {
  test("example 1", () => {
    expect(goodNodes(toTree([3,1,4,3,null,1,5]))).toEqual(4);
  });

  test("example 2", () => {
    expect(goodNodes(toTree([3,3,null,4,2]))).toEqual(3);
  });

  test("example 3", () => {
    expect(goodNodes(toTree([1]))).toEqual(1);
  });
});
