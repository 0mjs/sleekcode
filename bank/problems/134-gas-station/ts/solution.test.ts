import { describe, expect, test } from "bun:test";
import { canCompleteCircuit } from "./solution";

describe("134. Gas Station", () => {
  test("example 1", () => {
    expect(canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2])).toEqual(3);
  });

  test("example 2", () => {
    expect(canCompleteCircuit([2,3,4], [3,4,3])).toEqual(-1);
  });
});
