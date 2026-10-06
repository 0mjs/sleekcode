import { describe, expect, test } from "bun:test";
import { anyOrder } from "../../lib";
import { letterCombinations } from "./solution";

describe("17. Letter Combinations of a Phone Number", () => {
  test("example 1", () => {
    expect(anyOrder(letterCombinations("23"))).toEqual(anyOrder(["ad","ae","af","bd","be","bf","cd","ce","cf"]));
  });

  test("example 2", () => {
    expect(anyOrder(letterCombinations("2"))).toEqual(anyOrder(["a","b","c"]));
  });
});
