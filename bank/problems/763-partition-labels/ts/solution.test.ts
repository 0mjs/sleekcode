import { describe, expect, test } from "bun:test";
import { partitionLabels } from "./solution";

describe("763. Partition Labels", () => {
  test("example 1", () => {
    expect(partitionLabels("ababcbacadefegdehijhklij")).toEqual([9,7,8]);
  });

  test("example 2", () => {
    expect(partitionLabels("eccbbbbdec")).toEqual([10]);
  });
});
