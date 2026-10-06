import { describe, expect, test } from "bun:test";
import { fromRandomList, randomListNodes, toRandomList } from "../../lib";
import { copyRandomList } from "./solution";

function expectDeepCopy(pairs: [number, number | null][]) {
  const original = toRandomList(pairs);
  const copy = copyRandomList(original);
  expect(fromRandomList(copy)).toEqual(pairs);
  // None of the copied nodes (or their pointers) may point into the original list
  const originals = new Set(randomListNodes(original));
  for (const n of randomListNodes(copy)) {
    expect(originals.has(n)).toBe(false);
    if (n.random) expect(originals.has(n.random)).toBe(false);
  }
  expect(fromRandomList(original)).toEqual(pairs); // original left untouched
}

describe("138. Copy List with Random Pointer", () => {
  test("example 1", () => {
    expectDeepCopy([[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]);
  });

  test("example 2", () => {
    expectDeepCopy([[1, 1], [2, 1]]);
  });

  test("example 3", () => {
    expectDeepCopy([[3, null], [3, 0], [3, null]]);
  });

  test("empty list", () => {
    expect(copyRandomList(null)).toBeNull();
  });

  test("node whose random points to itself", () => {
    expectDeepCopy([[5, 0]]);
  });
});
