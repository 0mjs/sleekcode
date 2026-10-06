import { describe, expect, test } from "bun:test";
import { canJump } from "./solution";

describe("55. Jump Game", () => {
  test("example 1", () => {
    expect(canJump([2,3,1,1,4])).toEqual(true);
  });

  test("example 2", () => {
    expect(canJump([3,2,1,0,4])).toEqual(false);
  });
});
