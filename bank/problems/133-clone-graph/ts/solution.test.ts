import { describe, expect, test } from "bun:test";
import { fromGraph, graphNodes, toGraph } from "../../lib";
import { cloneGraph } from "./solution";

function expectDeepCopy(adj: number[][]) {
  const original = toGraph(adj);
  const copy = cloneGraph(original);
  expect(fromGraph(copy)).toEqual(adj);
  // A real clone shares no nodes with the original
  const originals = new Set(graphNodes(original));
  for (const n of graphNodes(copy)) expect(originals.has(n)).toBe(false);
}

describe("133. Clone Graph", () => {
  test("example 1", () => {
    expectDeepCopy([[2, 4], [1, 3], [2, 4], [1, 3]]);
  });

  test("example 2: single node, no neighbours", () => {
    expectDeepCopy([[]]);
  });

  test("example 3: empty graph", () => {
    expect(cloneGraph(null)).toBeNull();
  });

  test("two nodes", () => {
    expectDeepCopy([[2], [1]]);
  });

  test("fully connected", () => {
    expectDeepCopy([[2, 3, 4], [1, 3, 4], [1, 2, 4], [1, 2, 3]]);
  });
});
