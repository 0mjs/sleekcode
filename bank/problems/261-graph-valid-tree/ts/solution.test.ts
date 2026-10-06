import { describe, expect, test } from "bun:test";
import { validTree } from "./solution";

describe("261. Graph Valid Tree", () => {
  test("example 1", () => {
    expect(validTree(5, [[0, 1], [0, 2], [0, 3], [1, 4]])).toBe(true);
  });

  test("example 2: has a cycle", () => {
    expect(validTree(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]])).toBe(false);
  });

  test("single node, no edges", () => {
    expect(validTree(1, [])).toBe(true);
  });

  test("disconnected (no cycle, but not connected)", () => {
    expect(validTree(4, [[0, 1], [2, 3]])).toBe(false);
  });

  test("two nodes with no edge", () => {
    expect(validTree(2, [])).toBe(false);
  });

  test("simple chain", () => {
    expect(validTree(4, [[0, 1], [1, 2], [2, 3]])).toBe(true);
  });
});
