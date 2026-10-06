import { describe, expect, test } from "bun:test";
import { runOps } from "../../lib";
import { TimeMap } from "./solution";

describe("981. Time Based Key-Value Store", () => {
  test("example 1", () => {
    const ops = ["TimeMap","set","get","get","set","get","get"];
    const args = [[],["foo","bar",1],["foo",1],["foo",3],["foo","bar2",4],["foo",4],["foo",5]];
    expect(runOps(TimeMap, ops, args)).toEqual([null, null, "bar", "bar", null, "bar2", "bar2"]);
  });
});
