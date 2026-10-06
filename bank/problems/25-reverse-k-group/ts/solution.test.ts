import { describe, expect, test } from "bun:test";
import { fromList, toList } from "../../lib";
import { reverseKGroup } from "./solution";

describe("25. Reverse Nodes in k-Group", () => {
  test("example 1", () => {
    expect(fromList(reverseKGroup(toList([1,2,3,4,5]), 2))).toEqual([2,1,4,3,5]);
  });

  test("example 2", () => {
    expect(fromList(reverseKGroup(toList([1,2,3,4,5]), 3))).toEqual([3,2,1,4,5]);
  });
});
