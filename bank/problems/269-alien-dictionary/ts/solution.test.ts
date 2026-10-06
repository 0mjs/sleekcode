import { describe, expect, test } from "bun:test";
import { alienOrder } from "./solution";

/** Several orders can be correct, so check the rules the words imply instead of one exact answer. */
function expectValidOrder(words: string[]) {
  const order = alienOrder(words);
  const letters = [...new Set(words.join(""))].sort();
  expect([...order].sort()).toEqual(letters); // every letter exactly once
  const rank = new Map([...order].map((c, i) => [c, i]));
  for (let i = 0; i + 1 < words.length; i++) {
    const [a, b] = [words[i]!, words[i + 1]!];
    const j = [...a].findIndex((c, k) => c !== b[k]);
    if (j !== -1 && j < b.length) expect(rank.get(a[j]!)!).toBeLessThan(rank.get(b[j]!)!);
  }
}

describe("269. Alien Dictionary", () => {
  test("example 1", () => {
    expect(alienOrder(["wrt", "wrf", "er", "ett", "rftt"])).toBe("wertf");
  });

  test("example 2", () => {
    expect(alienOrder(["z", "x"])).toBe("zx");
  });

  test("example 3: contradiction", () => {
    expect(alienOrder(["z", "x", "z"])).toBe("");
  });

  test("longer word before its own prefix is invalid", () => {
    expect(alienOrder(["abc", "ab"])).toBe("");
  });

  test("single word: any order of its letters", () => {
    expectValidOrder(["zyx"]);
  });

  test("letters with no constraints still appear", () => {
    expectValidOrder(["ab", "adc"]);
  });

  test("identical words", () => {
    expectValidOrder(["z", "z"]);
  });
});
