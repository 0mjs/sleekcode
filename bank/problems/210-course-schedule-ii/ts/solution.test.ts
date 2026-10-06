import { describe, expect, test } from "bun:test";
import { findOrder } from "./solution";

/** Many orders can be correct, so check the rules instead of one exact answer. */
function expectValidOrder(numCourses: number, prerequisites: number[][]) {
  const order = findOrder(numCourses, prerequisites);
  expect([...order].sort((a, b) => a - b)).toEqual(Array.from({ length: numCourses }, (_, i) => i));
  const position = new Map(order.map((course, i) => [course, i]));
  for (const [course, pre] of prerequisites) {
    expect(position.get(pre!)!).toBeLessThan(position.get(course!)!);
  }
}

describe("210. Course Schedule II", () => {
  test("example 1", () => {
    expectValidOrder(2, [[1, 0]]);
  });

  test("example 2", () => {
    expectValidOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]]);
  });

  test("example 3", () => {
    expectValidOrder(1, []);
  });

  test("cycle means impossible", () => {
    expect(findOrder(2, [[1, 0], [0, 1]])).toEqual([]);
  });

  test("longer cycle", () => {
    expect(findOrder(3, [[0, 1], [1, 2], [2, 0]])).toEqual([]);
  });

  test("no prerequisites", () => {
    expectValidOrder(3, []);
  });
});
