import { describe, expect, test } from "bun:test";
import { fromList, toList } from "../../lib";
import { reorderList } from "./solution";

describe("143. Reorder List", () => {
  test("example 1", () => {
    const head = toList([1,2,3,4]);
    reorderList(head);
    expect(fromList(head)).toEqual([1,4,2,3]);
  });

  test("example 2", () => {
    const head = toList([1,2,3,4,5]);
    reorderList(head);
    expect(fromList(head)).toEqual([1,5,2,4,3]);
  });
});
