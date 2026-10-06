import { describe, expect, test } from "bun:test";
import { jump } from "./solution";

describe("45. Jump Game II", () => {
  test("example 1", () => {
    expect(jump([2,3,1,1,4])).toEqual(2);
  });

  test("example 2", () => {
    expect(jump([2,3,0,1,4])).toEqual(2);
  });
});
