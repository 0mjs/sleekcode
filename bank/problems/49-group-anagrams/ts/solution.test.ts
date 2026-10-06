import { describe, expect, test } from "bun:test";
import { anyOrderDeep } from "../../lib";
import { groupAnagrams } from "./solution";

describe("49. Group Anagrams", () => {
  test("example 1", () => {
    expect(anyOrderDeep(groupAnagrams(["eat","tea","tan","ate","nat","bat"]))).toEqual(anyOrderDeep([["bat"],["nat","tan"],["ate","eat","tea"]]));
  });

  test("example 2", () => {
    expect(anyOrderDeep(groupAnagrams([""]))).toEqual(anyOrderDeep([[""]]));
  });

  test("example 3", () => {
    expect(anyOrderDeep(groupAnagrams(["a"]))).toEqual(anyOrderDeep([["a"]]));
  });
});
