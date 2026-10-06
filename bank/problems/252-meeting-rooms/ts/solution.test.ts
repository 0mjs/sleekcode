import { describe, expect, test } from "bun:test";
import { canAttendMeetings } from "./solution";

describe("252. Meeting Rooms", () => {
  test("example 1", () => {
    expect(canAttendMeetings([[0, 30], [5, 10], [15, 20]])).toBe(false);
  });

  test("example 2", () => {
    expect(canAttendMeetings([[7, 10], [2, 4]])).toBe(true);
  });

  test("no meetings", () => {
    expect(canAttendMeetings([])).toBe(true);
  });

  test("back-to-back meetings don't conflict", () => {
    expect(canAttendMeetings([[5, 8], [8, 10]])).toBe(true);
  });

  test("unsorted input with an overlap at the end", () => {
    expect(canAttendMeetings([[10, 20], [1, 5], [6, 9], [19, 25]])).toBe(false);
  });
});
