import { describe, expect, test } from "bun:test";
import { fromList, toList } from "../../lib";
import { removeNthFromEnd } from "./solution";

describe("19. Remove Nth Node From End of List", () => {
  test("example 1", () => {
    expect(fromList(removeNthFromEnd(toList([1,2,3,4,5]), 2))).toEqual([1,2,3,5]);
  });

  test("example 2", () => {
    expect(fromList(removeNthFromEnd(toList([1]), 1))).toEqual([]);
  });

  test("example 3", () => {
    expect(fromList(removeNthFromEnd(toList([1,2]), 1))).toEqual([1]);
  });
});
