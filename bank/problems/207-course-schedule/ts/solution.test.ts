import { describe, expect, test } from "bun:test";
import { canFinish } from "./solution";

describe("207. Course Schedule", () => {
  test("example 1", () => {
    expect(canFinish(2, [[1,0]])).toEqual(true);
  });

  test("example 2", () => {
    expect(canFinish(2, [[1,0],[0,1]])).toEqual(false);
  });
});
