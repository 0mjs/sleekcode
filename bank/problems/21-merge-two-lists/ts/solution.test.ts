import { describe, expect, test } from "bun:test";
import { fromList, toList } from "../../lib";
import { mergeTwoLists } from "./solution";

describe("21. Merge Two Sorted Lists", () => {
  test("example 1", () => {
    expect(fromList(mergeTwoLists(toList([1,2,4]), toList([1,3,4])))).toEqual([1,1,2,3,4,4]);
  });

  test("example 2", () => {
    expect(fromList(mergeTwoLists(toList([]), toList([])))).toEqual([]);
  });

  test("example 3", () => {
    expect(fromList(mergeTwoLists(toList([]), toList([0])))).toEqual([0]);
  });
});
