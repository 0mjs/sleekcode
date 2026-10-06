import { describe, expect, test } from "bun:test";
import { minMeetingRooms } from "./solution";

describe("253. Meeting Rooms II", () => {
  test("example 1", () => {
    expect(minMeetingRooms([[0, 30], [5, 10], [15, 20]])).toBe(2);
  });

  test("example 2", () => {
    expect(minMeetingRooms([[7, 10], [2, 4]])).toBe(1);
  });

  test("back-to-back meetings share a room", () => {
    expect(minMeetingRooms([[1, 5], [5, 10], [10, 15]])).toBe(1);
  });

  test("all overlapping", () => {
    expect(minMeetingRooms([[1, 10], [2, 9], [3, 8], [4, 7]])).toBe(4);
  });

  test("single meeting", () => {
    expect(minMeetingRooms([[3, 4]])).toBe(1);
  });

  test("rooms freed and reused", () => {
    expect(minMeetingRooms([[1, 4], [2, 5], [4, 8], [5, 9], [9, 10]])).toBe(2);
  });
});
