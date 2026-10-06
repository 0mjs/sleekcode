import { describe, expect, test } from "bun:test";
import { networkDelayTime } from "./solution";

describe("743. Network Delay Time", () => {
  test("example 1", () => {
    expect(networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2)).toEqual(2);
  });

  test("example 2", () => {
    expect(networkDelayTime([[1,2,1]], 2, 1)).toEqual(1);
  });

  test("example 3", () => {
    expect(networkDelayTime([[1,2,1]], 2, 2)).toEqual(-1);
  });
});
