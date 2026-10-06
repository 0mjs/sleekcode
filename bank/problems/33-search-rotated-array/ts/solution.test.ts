import { describe, expect, test } from "bun:test";
import { search } from "./solution";

describe("33. Search in Rotated Sorted Array", () => {
  test("example 1", () => {
    expect(search([4,5,6,7,0,1,2], 0)).toEqual(4);
  });

  test("example 2", () => {
    expect(search([4,5,6,7,0,1,2], 3)).toEqual(-1);
  });

  test("example 3", () => {
    expect(search([1], 0)).toEqual(-1);
  });
});
