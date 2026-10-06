import { describe, expect, test } from "bun:test";
import { ladderLength } from "./solution";

describe("127. Word Ladder", () => {
  test("example 1", () => {
    expect(ladderLength("hit", "cog", ["hot","dot","dog","lot","log","cog"])).toEqual(5);
  });

  test("example 2", () => {
    expect(ladderLength("hit", "cog", ["hot","dot","dog","lot","log"])).toEqual(0);
  });
});
