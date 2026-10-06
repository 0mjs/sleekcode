import { describe, expect, test } from "bun:test";
import { decode, encode } from "./solution";

// Any encoding works, as long as decode(encode(x)) gives back x.
const roundTrip = (strs: string[]) => decode(encode(strs));

describe("271. Encode and Decode Strings", () => {
  test("example 1", () => {
    expect(roundTrip(["neet", "code", "love", "you"])).toEqual(["neet", "code", "love", "you"]);
  });

  test("example 2", () => {
    expect(roundTrip(["we", "say", ":", "yes"])).toEqual(["we", "say", ":", "yes"]);
  });

  test("empty list", () => {
    expect(roundTrip([])).toEqual([]);
  });

  test("list containing an empty string", () => {
    expect(roundTrip([""])).toEqual([""]);
  });

  test("several empty strings", () => {
    expect(roundTrip(["", "", "a", ""])).toEqual(["", "", "a", ""]);
  });

  test("strings containing common delimiters", () => {
    const tricky = ["a,b", "#", "4#abc", "|", "\n", " ", "::", "5#"];
    expect(roundTrip(tricky)).toEqual(tricky);
  });

  test("encode returns a single string", () => {
    expect(typeof encode(["a", "b"])).toBe("string");
  });
});
