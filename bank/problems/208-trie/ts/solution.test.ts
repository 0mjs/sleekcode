import { describe, expect, test } from "bun:test";
import { runOps } from "../../lib";
import { Trie } from "./solution";

describe("208. Implement Trie (Prefix Tree)", () => {
  test("example 1", () => {
    const ops = ["Trie","insert","search","search","startsWith","insert","search"];
    const args = [[],["apple"],["apple"],["app"],["app"],["app"],["app"]];
    expect(runOps(Trie, ops, args)).toEqual([null, null, true, false, true, null, true]);
  });
});
