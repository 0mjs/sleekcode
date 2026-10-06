import { describe, expect, test } from "bun:test";
import { toCycleList } from "../../lib";
import { hasCycle } from "./solution";

// `pos` is the index the tail links back to (-1 = no cycle). Your function only gets `head`.
describe("141. Linked List Cycle", () => {
  test("example 1", () => {
    expect(hasCycle(toCycleList([3, 2, 0, -4], 1))).toBe(true);
  });

  test("example 2", () => {
    expect(hasCycle(toCycleList([1, 2], 0))).toBe(true);
  });

  test("example 3", () => {
    expect(hasCycle(toCycleList([1], -1))).toBe(false);
  });

  test("empty list", () => {
    expect(hasCycle(null)).toBe(false);
  });

  test("single node pointing to itself", () => {
    expect(hasCycle(toCycleList([1], 0))).toBe(true);
  });

  test("long list without a cycle", () => {
    expect(hasCycle(toCycleList(Array.from({ length: 10_000 }, (_, i) => i), -1))).toBe(false);
  });
});
