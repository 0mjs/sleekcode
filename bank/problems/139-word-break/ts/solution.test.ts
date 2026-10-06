import { describe, expect, test } from "bun:test";
import { wordBreak } from "./solution";

describe("139. Word Break", () => {
  test("example 1", () => {
    expect(wordBreak("leetcode", ["leet","code"])).toEqual(true);
  });

  test("example 2", () => {
    expect(wordBreak("applepenapple", ["apple","pen"])).toEqual(true);
  });

  test("example 3", () => {
    expect(wordBreak("catsandog", ["cats","dog","sand","and","cat"])).toEqual(false);
  });
});
