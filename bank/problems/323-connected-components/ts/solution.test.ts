import { describe, expect, test } from "bun:test";
import { countComponents } from "./solution";

describe("323. Number of Connected Components in an Undirected Graph", () => {
  test("example 1", () => {
    expect(countComponents(5, [[0, 1], [1, 2], [3, 4]])).toBe(2);
  });

  test("example 2", () => {
    expect(countComponents(5, [[0, 1], [1, 2], [2, 3], [3, 4]])).toBe(1);
  });

  test("isolated nodes each count", () => {
    expect(countComponents(4, [[0, 1]])).toBe(3);
  });

  test("no edges", () => {
    expect(countComponents(3, [])).toBe(3);
  });

  test("cycle is still one component", () => {
    expect(countComponents(4, [[0, 1], [1, 2], [2, 0], [3, 2]])).toBe(1);
  });

  test("edges given in reverse direction", () => {
    expect(countComponents(6, [[1, 0], [2, 1], [5, 4]])).toBe(3);
  });
});
