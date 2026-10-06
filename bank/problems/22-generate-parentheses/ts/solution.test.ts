import { describe, expect, test } from "bun:test";
import { anyOrder } from "../../lib";
import { generateParenthesis } from "./solution";

describe("22. Generate Parentheses", () => {
  test("example 1", () => {
    expect(anyOrder(generateParenthesis(3))).toEqual(anyOrder(["((()))","(()())","(())()","()(())","()()()"]));
  });

  test("example 2", () => {
    expect(anyOrder(generateParenthesis(1))).toEqual(anyOrder(["()"]));
  });
});
