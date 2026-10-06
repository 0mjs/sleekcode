import { describe, expect, test } from "bun:test";
import { runOps } from "../../lib";
import { WordDictionary } from "./solution";

describe("211. Design Add and Search Words Data Structure", () => {
  test("example 1", () => {
    const ops = ["WordDictionary","addWord","addWord","addWord","search","search","search","search"];
    const args = [[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]];
    expect(runOps(WordDictionary, ops, args)).toEqual([null,null,null,null,false,true,true,true]);
  });
});
