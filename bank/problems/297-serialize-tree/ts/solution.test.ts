import { describe, expect, test } from "bun:test";
import { fromTree, toTree } from "../../lib";
import { deserialize, serialize } from "./solution";

// Any string format is fine, as long as deserialize(serialize(tree)) rebuilds the same tree.
const roundTrip = (values: (number | null)[]) => fromTree(deserialize(serialize(toTree(values))));

describe("297. Serialize and Deserialize Binary Tree", () => {
  test("example 1", () => {
    expect(roundTrip([1, 2, 3, null, null, 4, 5])).toEqual([1, 2, 3, null, null, 4, 5]);
  });

  test("example 2: empty tree", () => {
    expect(roundTrip([])).toEqual([]);
  });

  test("single node", () => {
    expect(roundTrip([1])).toEqual([1]);
  });

  test("negative and multi-digit values", () => {
    expect(roundTrip([-10, 200, -3000, null, 7])).toEqual([-10, 200, -3000, null, 7]);
  });

  test("left-skewed tree", () => {
    expect(roundTrip([1, 2, null, 3, null, 4])).toEqual([1, 2, null, 3, null, 4]);
  });

  test("serialize returns a string", () => {
    expect(typeof serialize(toTree([1, 2, 3]))).toBe("string");
  });
});
