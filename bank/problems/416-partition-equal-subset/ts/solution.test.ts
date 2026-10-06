import { describe, expect, test } from "bun:test";
import { canPartition } from "./solution";

describe("416. Partition Equal Subset Sum", () => {
  test("example 1", () => {
    expect(canPartition([1,5,11,5])).toEqual(true);
  });

  test("example 2", () => {
    expect(canPartition([1,2,3,5])).toEqual(false);
  });
});
