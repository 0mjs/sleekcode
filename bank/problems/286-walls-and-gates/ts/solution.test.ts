import { describe, expect, test } from "bun:test";
import { wallsAndGates } from "./solution";

const INF = 2147483647;

describe("286. Walls and Gates", () => {
  test("example 1", () => {
    const rooms = [
      [INF, -1, 0, INF],
      [INF, INF, INF, -1],
      [INF, -1, INF, -1],
      [0, -1, INF, INF],
    ];
    wallsAndGates(rooms);
    expect(rooms).toEqual([
      [3, -1, 0, 1],
      [2, 2, 1, -1],
      [1, -1, 2, -1],
      [0, -1, 3, 4],
    ]);
  });

  test("example 2: single wall", () => {
    const rooms = [[-1]];
    wallsAndGates(rooms);
    expect(rooms).toEqual([[-1]]);
  });

  test("unreachable room stays INF", () => {
    const rooms = [
      [0, -1, INF],
      [INF, -1, INF],
    ];
    wallsAndGates(rooms);
    expect(rooms).toEqual([
      [0, -1, INF],
      [1, -1, INF],
    ]);
  });

  test("picks the nearest of two gates", () => {
    const rooms = [[0, INF, INF, INF, 0]];
    wallsAndGates(rooms);
    expect(rooms).toEqual([[0, 1, 2, 1, 0]]);
  });

  test("no gates at all", () => {
    const rooms = [[INF, INF]];
    wallsAndGates(rooms);
    expect(rooms).toEqual([[INF, INF]]);
  });
});
