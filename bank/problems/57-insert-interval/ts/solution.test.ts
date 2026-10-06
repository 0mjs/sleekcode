import { describe, expect, test } from "bun:test";
import { insert } from "./solution";

describe("57. Insert Interval", () => {
  test("example 1", () => {
    expect(insert([[1,3],[6,9]], [2,5])).toEqual([[1,5],[6,9]]);
  });

  test("example 2", () => {
    expect(insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8])).toEqual([[1,2],[3,10],[12,16]]);
  });
});
