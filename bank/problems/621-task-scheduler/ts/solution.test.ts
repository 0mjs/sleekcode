import { describe, expect, test } from "bun:test";
import { leastInterval } from "./solution";

describe("621. Task Scheduler", () => {
  test("example 1", () => {
    expect(leastInterval(["A","A","A","B","B","B"], 2)).toEqual(8);
  });

  test("example 2", () => {
    expect(leastInterval(["A","C","A","B","D","B"], 1)).toEqual(6);
  });

  test("example 3", () => {
    expect(leastInterval(["A","A","A", "B","B","B"], 3)).toEqual(10);
  });
});
