import { describe, expect, test } from "bun:test";
import { swimInWater } from "./solution";

describe("778. Swim in Rising Water", () => {
  test("example 1", () => {
    expect(swimInWater([[0,2],[1,3]])).toEqual(3);
  });

  test("example 2", () => {
    expect(swimInWater([[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]])).toEqual(16);
  });
});
