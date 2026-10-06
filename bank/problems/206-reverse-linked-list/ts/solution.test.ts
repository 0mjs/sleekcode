import { describe, expect, test } from "bun:test";
import { fromList, toList } from "../../lib";
import { reverseList } from "./solution";

describe("206. Reverse Linked List", () => {
  test("example 1", () => {
    expect(fromList(reverseList(toList([1,2,3,4,5])))).toEqual([5,4,3,2,1]);
  });

  test("example 2", () => {
    expect(fromList(reverseList(toList([1,2])))).toEqual([2,1]);
  });

  test("example 3", () => {
    expect(fromList(reverseList(toList([])))).toEqual([]);
  });
});
