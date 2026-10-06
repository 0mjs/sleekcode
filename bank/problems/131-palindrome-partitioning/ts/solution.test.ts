import { describe, expect, test } from "bun:test";
import { anyOrder } from "../../lib";
import { partition } from "./solution";

describe("131. Palindrome Partitioning", () => {
  test("example 1", () => {
    expect(anyOrder(partition("aab"))).toEqual(anyOrder([["a","a","b"],["aa","b"]]));
  });

  test("example 2", () => {
    expect(anyOrder(partition("a"))).toEqual(anyOrder([["a"]]));
  });
});
