// The 13 problems whose starting code is hand-written (LeetCode Premium, or a special input/check).
// Their cases.json starts from LeetCode's official examples below; hidden cases come from build/cases/specs
// like every other problem. Custom calls and validators live in runtime/{ts/lib/cases.ts, py/sleek/cases.py}.
import type { CaseFile } from "../src/core/generate";

type Manual = Omit<CaseFile, "title" | "cases" | "perf"> & { examples: [unknown[], unknown][] };

const p = (name: string, type: string) => ({ name, type });

export const MANUAL_CASES: Record<string, Manual> = {
  "meeting-rooms": {
    call: { kind: "function", name: "canAttendMeetings", params: [p("intervals", "integer[][]")], returns: "boolean" },
    compare: "exact",
    examples: [[[[[0, 30], [5, 10], [15, 20]]], false], [[[[7, 10], [2, 4]]], true]],
  },
  "meeting-rooms-ii": {
    call: { kind: "function", name: "minMeetingRooms", params: [p("intervals", "integer[][]")], returns: "integer" },
    compare: "exact",
    examples: [[[[[0, 30], [5, 10], [15, 20]]], 2], [[[[7, 10], [2, 4]]], 1]],
  },
  "graph-valid-tree": {
    call: { kind: "function", name: "validTree", params: [p("n", "integer"), p("edges", "integer[][]")], returns: "boolean" },
    compare: "exact",
    examples: [[[5, [[0, 1], [0, 2], [0, 3], [1, 4]]], true], [[5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]], false]],
  },
  "number-of-connected-components-in-an-undirected-graph": {
    call: { kind: "function", name: "countComponents", params: [p("n", "integer"), p("edges", "integer[][]")], returns: "integer" },
    compare: "exact",
    examples: [[[5, [[0, 1], [1, 2], [3, 4]]], 2], [[5, [[0, 1], [1, 2], [2, 3], [3, 4]]], 1]],
  },
  "walls-and-gates": {
    call: { kind: "function", name: "wallsAndGates", params: [p("rooms", "integer[][]")], returns: "void" },
    compare: "exact",
    examples: [
      [[[[2147483647, -1, 0, 2147483647], [2147483647, 2147483647, 2147483647, -1], [2147483647, -1, 2147483647, -1], [0, -1, 2147483647, 2147483647]]],
        [[3, -1, 0, 1], [2, 2, 1, -1], [1, -1, 2, -1], [0, -1, 3, 4]]],
      [[[[-1]]], [[-1]]],
    ],
  },
  "alien-dictionary": {
    call: { kind: "function", name: "alienOrder", params: [p("words", "string[]")], returns: "string" },
    compare: "validator:alienOrder",
    examples: [[[["wrt", "wrf", "er", "ett", "rftt"]], "wertf"], [[["z", "x"]], "zx"], [[["z", "x", "z"]], ""]],
  },
  "course-schedule-ii": {
    call: { kind: "function", name: "findOrder", params: [p("numCourses", "integer"), p("prerequisites", "integer[][]")], returns: "integer[]" },
    compare: "validator:courseOrder",
    examples: [[[2, [[1, 0]]], [0, 1]], [[4, [[1, 0], [2, 0], [3, 1], [3, 2]]], [0, 2, 1, 3]], [[1, []], [0]]],
  },
  "encode-and-decode-strings": {
    call: { kind: "custom", adapter: "encodeDecode", params: [p("strs", "string[]")], exports: ["encode", "decode"] },
    compare: "exact",
    examples: [[[["neet", "code", "love", "you"]], ["neet", "code", "love", "you"]], [[["we", "say", ":", "yes"]], ["we", "say", ":", "yes"]]],
  },
  "serialize-and-deserialize-binary-tree": {
    call: { kind: "custom", adapter: "serializeTree", params: [p("root", "TreeNode")], exports: ["serialize", "deserialize"] },
    compare: "exact",
    examples: [[[[1, 2, 3, null, null, 4, 5]], [1, 2, 3, null, null, 4, 5]], [[[]], []]],
  },
  "clone-graph": {
    call: { kind: "custom", adapter: "cloneGraph", params: [p("adjList", "integer[][]")], exports: ["cloneGraph"] },
    compare: "exact",
    examples: [[[[[2, 4], [1, 3], [2, 4], [1, 3]]], [[2, 4], [1, 3], [2, 4], [1, 3]]], [[[[]]], [[]]], [[[]], []]],
  },
  "copy-list-with-random-pointer": {
    call: { kind: "custom", adapter: "copyRandomList", params: [p("head", "[val, random_index][]")], exports: ["copyRandomList"] },
    compare: "exact",
    examples: [
      [[[[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]], [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]],
      [[[[1, 1], [2, 1]]], [[1, 1], [2, 1]]],
      [[[[3, null], [3, 0], [3, null]]], [[3, null], [3, 0], [3, null]]],
    ],
  },
  "linked-list-cycle": {
    call: { kind: "custom", adapter: "hasCycle", params: [p("head", "ListNode"), p("pos", "integer")], exports: ["hasCycle"] },
    compare: "exact",
    examples: [[[[3, 2, 0, -4], 1], true], [[[1, 2], 0], true], [[[1], -1], false]],
  },
  "lowest-common-ancestor-of-a-binary-search-tree": {
    call: { kind: "custom", adapter: "lowestCommonAncestor", params: [p("root", "TreeNode"), p("p", "integer"), p("q", "integer")], exports: ["lowestCommonAncestor"] },
    compare: "exact",
    examples: [
      [[[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], 6],
      [[[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], 2],
      [[[2, 1], 2, 1], 2],
    ],
  },
};
