import { describe, expect, test } from "bun:test";
import { fromList, toList } from "../../lib";
import { addTwoNumbers } from "./solution";

describe("2. Add Two Numbers", () => {
  test("example 1", () => {
    expect(fromList(addTwoNumbers(toList([2,4,3]), toList([5,6,4])))).toEqual([7,0,8]);
  });

  test("example 2", () => {
    expect(fromList(addTwoNumbers(toList([0]), toList([0])))).toEqual([0]);
  });

  test("example 3", () => {
    expect(fromList(addTwoNumbers(toList([9,9,9,9,9,9,9]), toList([9,9,9,9])))).toEqual([8,9,9,9,0,0,0,1]);
  });
});
