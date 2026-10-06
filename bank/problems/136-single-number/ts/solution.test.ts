import { describe, expect, test } from "bun:test";
import { singleNumber } from "./solution";

describe("136. Single Number", () => {
  test("example 1", () => {
    expect(singleNumber([2,2,1])).toEqual(1);
  });

  test("example 2", () => {
    expect(singleNumber([4,1,2,1,2])).toEqual(4);
  });

  test("example 3", () => {
    expect(singleNumber([1])).toEqual(1);
  });
});
