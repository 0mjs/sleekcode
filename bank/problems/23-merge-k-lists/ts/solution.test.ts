import { describe, expect, test } from "bun:test";
import { fromList, toList } from "../../lib";
import { mergeKLists } from "./solution";

describe("23. Merge k Sorted Lists", () => {
  test("example 1", () => {
    expect(fromList(mergeKLists([[1,4,5],[1,3,4],[2,6]].map(toList)))).toEqual([1,1,2,3,4,4,5,6]);
  });

  test("example 2", () => {
    expect(fromList(mergeKLists([].map(toList)))).toEqual([]);
  });

  test("example 3", () => {
    expect(fromList(mergeKLists([[]].map(toList)))).toEqual([]);
  });
});
