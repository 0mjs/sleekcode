import { describe, expect, test } from "bun:test";
import { anyOrder } from "../../lib";
import { findWords } from "./solution";

describe("212. Word Search II", () => {
  test("example 1", () => {
    expect(anyOrder(findWords([["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"]))).toEqual(anyOrder(["eat","oath"]));
  });

  test("example 2", () => {
    expect(anyOrder(findWords([["a","b"],["c","d"]], ["abcb"]))).toEqual(anyOrder([]));
  });
});
