import { describe, expect, test } from "bun:test";
import { findItinerary } from "./solution";

describe("332. Reconstruct Itinerary", () => {
  test("example 1", () => {
    expect(findItinerary([["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]])).toEqual(["JFK","MUC","LHR","SFO","SJC"]);
  });

  test("example 2", () => {
    expect(findItinerary([["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]])).toEqual(["JFK","ATL","JFK","SFO","ATL","SFO"]);
  });
});
