import { describe, expect, test } from "bun:test";
import { maxAreaOfIsland } from "./solution";

describe("695. Max Area of Island", () => {
  test("example 1", () => {
    expect(maxAreaOfIsland([[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]])).toEqual(6);
  });

  test("example 2", () => {
    expect(maxAreaOfIsland([[0,0,0,0,0,0,0,0]])).toEqual(0);
  });
});
