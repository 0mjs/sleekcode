// The 13 problems with special starting code (LeetCode Premium, or a custom input/check; see build/manual-cases.ts).
// Input formats follow the examples there. Validity notes are next to each problem.
import { defineSpecs, type Rng } from "../lib";

const INF = 2147483647;

/** n-node random tree as distinct undirected edges over 0..n-1 (random labels and orientation) */
function randomTree(r: Rng, n: number): number[][] {
  const label = r.shuffle([...Array(n).keys()]);
  const edges: number[][] = [];
  for (let i = 1; i < n; i++) {
    const [a, b] = [label[r.int(0, i - 1)]!, label[i]!];
    edges.push(r.bool() ? [a, b] : [b, a]);
  }
  return r.shuffle(edges);
}

/** A pair of different nodes in 0..n-1 that isn't already an edge (either way round), or null if the graph is complete */
function newEdge(r: Rng, n: number, edges: number[][]): number[] | null {
  const has = new Set(edges.map(([a, b]) => `${Math.min(a!, b!)},${Math.max(a!, b!)}`));
  const free: number[][] = [];
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (!has.has(`${a},${b}`)) free.push(r.bool() ? [a, b] : [b, a]);
  return free.length ? r.pick(free) : null;
}

/** Non-overlapping meetings (touching allowed), shuffled */
function freeSchedule(r: Rng, n: number): number[][] {
  const out: number[][] = [];
  let t = r.int(0, 5);
  for (let i = 0; i < n; i++) {
    const s = t + r.int(0, 3);
    const e = s + r.int(1, 8);
    out.push([s, e]);
    t = e;
  }
  return r.shuffle(out);
}

function randomMeetings(r: Rng, n: number, horizon = 60): number[][] {
  return Array.from({ length: n }, () => {
    const s = r.int(0, horizon - 1);
    return [s, Math.min(horizon, s + r.int(1, 15))];
  });
}

export const specs = defineSpecs({
  // 0 <= n <= 10^4, 0 <= start < end <= 10^6. Touching meetings ([5,8],[8,10]) don't conflict.
  "meeting-rooms": {
    edge: [
      [[]],
      [[[0, 1]]],
      [[[5, 8], [8, 10]]],
      [[[10, 20], [1, 5], [6, 9], [19, 25]]],
      [[[1, 5], [1, 5]]],
      [[[0, 1000000], [999999, 1000000]]],
      [[[1, 10], [2, 3]]],
      [[[3, 4], [2, 3], [1, 2], [0, 1]]],
    ],
    random: (r, i) => [i % 2 ? freeSchedule(r, r.int(1, 12)) : randomMeetings(r, r.int(1, 8), 80)],
    // back-to-back meetings [i, i+1], shuffled, so the answer is true and a pairwise check compares every pair.
    // (No `slow`: that takes ~0.2s in TypeScript, under the 0.5s floor; in Python it's ~2.7s and is caught.)
    perf: { input: [{ shuffle: { edges: "chain", n: 10001 }, seed: 7 }], about: "10,000 back-to-back meetings" },
  },

  // 1 <= n <= 10^4, 0 <= start < end <= 10^6
  "meeting-rooms-ii": {
    edge: [
      [[[3, 4]]],
      [[[1, 5], [5, 10], [10, 15]]],
      [[[1, 10], [2, 9], [3, 8], [4, 7]]],
      [[[1, 4], [2, 5], [4, 8], [5, 9], [9, 10]]],
      [[[0, 1000000], [0, 1000000], [0, 1000000]]],
      [[[13, 15], [1, 13]]],
      [[[1, 5], [2, 3], [3, 4], [4, 5]]],
      [[[9, 10], [4, 9], [4, 17]]],
    ],
    random: (r, i) => [i % 3 === 0 ? freeSchedule(r, r.int(1, 10)) : randomMeetings(r, r.int(1, 20), i % 2 ? 30 : 100)],
    // long meetings, so "mark every minute of every meeting" does ~10^9 steps
    perf: { input: [{ intervals: 10000, lo: 0, hi: 1000000, maxLen: 1000000, seed: 3 }], about: "10,000 meetings over times up to 10^6" },
    slow: `export function minMeetingRooms(intervals: number[][]) {
      const busy = new Int32Array(1000001);
      let best = 0;
      for (const [s, e] of intervals) for (let t = s; t < e; t++) best = Math.max(best, ++busy[t]);
      return best;
    }`,
  },

  // 1 <= n <= 2000, 0 <= edges <= 5000, a != b, no repeated edges (in either direction)
  "graph-valid-tree": {
    edge: [
      [1, []],
      [2, []],
      [2, [[1, 0]]],
      [4, [[0, 1], [2, 3]]],
      [4, [[0, 1], [1, 2], [2, 3]]],
      [4, [[0, 1], [1, 2], [2, 0]]],
      // n - 1 edges, but a cycle (0-1-2) plus a separate node 3
      [4, [[0, 1], [1, 2], [0, 2]]],
      [5, [[4, 0], [4, 1], [4, 2], [4, 3]]],
      [3, [[0, 1], [1, 2], [0, 2]]],
    ],
    random: (r, i) => {
      const n = r.int(1, 15);
      const edges = randomTree(r, n);
      const kind = i % 4; // 0: a tree, 1: one extra edge (cycle), 2: one edge missing (disconnected), 3: both (still n-1 edges)
      if ((kind === 2 || kind === 3) && edges.length) edges.splice(r.int(0, edges.length - 1), 1);
      if (kind === 1 || kind === 3) { const e = newEdge(r, n, edges); if (e) edges.splice(r.int(0, edges.length), 0, e); }
      return [n, edges];
    },
    count: 12,
    // a 2,000-node path (a valid tree): transitive-closure style brute force is ~n^3
    perf: { input: [2000, { shuffle: { edges: "chain", n: 2000 }, seed: 6 }], about: "n = 2,000 with 1,999 edges" },
    slow: `export function validTree(n: number, edges: number[][]) {
      if (edges.length !== n - 1) return false;
      const reach = Array.from({ length: n }, (_, i) => { const row = new Uint8Array(n); row[i] = 1; return row; });
      for (const [a, b] of edges) reach[a][b] = reach[b][a] = 1;
      for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) if (reach[i][k]) for (let j = 0; j < n; j++) if (reach[k][j]) reach[i][j] = 1;
      return reach[0].every((x) => x === 1);
    }`,
  },

  // 1 <= n <= 2000, 1 <= edges <= 5000, a != b, no repeated edges
  "number-of-connected-components-in-an-undirected-graph": {
    edge: [
      [2, [[0, 1]]],
      [4, [[0, 1]]],
      [4, [[0, 1], [1, 2], [2, 0], [3, 2]]],
      [6, [[1, 0], [2, 1], [5, 4]]],
      [5, [[4, 3]]],
      [6, [[0, 5], [1, 4], [2, 3]]],
      [4, [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]],
      [7, [[0, 1], [2, 3], [3, 4], [4, 2], [5, 6], [6, 0]]],
    ],
    random: (r) => {
      const n = r.int(2, 20);
      const edges: number[][] = [];
      const m = r.int(1, Math.min(n * (n - 1) / 2, r.pick([3, 8, 20])));
      while (edges.length < m) edges.push(newEdge(r, n, edges)!);
      return [n, edges];
    },
    // a 2,000-node chain: transitive-closure style brute force is ~n^3
    perf: { input: [2000, { shuffle: { edges: "chain", n: 2000 }, seed: 5 }], about: "n = 2,000 with 1,999 edges" },
    slow: `export function countComponents(n: number, edges: number[][]) {
      const reach = Array.from({ length: n }, (_, i) => { const row = new Uint8Array(n); row[i] = 1; return row; });
      for (const [a, b] of edges) reach[a][b] = reach[b][a] = 1;
      for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) if (reach[i][k]) for (let j = 0; j < n; j++) if (reach[k][j]) reach[i][j] = 1;
      let count = 0;
      for (let i = 0; i < n; i++) if (reach[i].indexOf(1) === i) count++;
      return count;
    }`,
  },

  // 1 <= m, n <= 250; cells are only -1 (wall), 0 (gate) or 2147483647 (empty)
  "walls-and-gates": {
    edge: [
      [[[0]]],
      [[[INF]]],
      [[[INF, INF], [INF, INF]]],
      [[[0, -1, INF], [INF, -1, INF]]],
      [[[0, INF, INF, INF, 0]]],
      [[[INF], [INF], [-1], [0], [INF]]],
      [[[0, 0], [0, 0]]],
      [[[INF, -1, INF], [-1, 0, -1], [INF, -1, INF]]],
    ],
    random: (r) => {
      const [m, n] = [r.int(1, 6), r.int(1, 6)];
      const cells = [0, -1, INF, INF, INF, INF];
      return [Array.from({ length: m }, () => Array.from({ length: n }, () => r.pick(cells)))];
    },
    // one gate in the corner of an empty 250×250 grid: "BFS from every room" does ~62,500²/2 steps
    perf: {
      input: [{ concat: [{ list: [{ concat: [[0], { repeat: INF, n: 249 }] }] }, { repeat: { repeat: INF, n: 250 }, n: 249 }] }],
      about: "a 250 × 250 grid with one gate",
    },
    slow: `export function wallsAndGates(rooms: number[][]) {
      const [m, n] = [rooms.length, rooms[0].length];
      for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
        if (rooms[i][j] !== 2147483647) continue;
        const seen = new Set([i * n + j]);
        let q = [[i, j]];
        for (let d = 1; q.length && rooms[i][j] === 2147483647; d++) {
          const next: number[][] = [];
          for (const [a, b] of q) for (const [x, y] of [[a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]]) {
            if (x < 0 || y < 0 || x >= m || y >= n || rooms[x][y] === -1 || seen.has(x * n + y)) continue;
            if (rooms[x][y] === 0) { rooms[i][j] = d; break; }
            seen.add(x * n + y);
            next.push([x, y]);
          }
          q = next;
        }
      }
    }`,
  },

  // 1 <= words <= 100, 1 <= word length <= 100, lowercase. Valid inputs are sorted in some alien order;
  // invalid ones (a contradiction, or a word before its own prefix) must give "".
  "alien-dictionary": {
    edge: [
      [["a"]],
      [["zyx"]],
      [["abc", "ab"]],
      [["ab", "adc"]],
      [["z", "z"]],
      [["ab", "ab", "abc"]],
      [["ac", "ab", "zc", "zb"]],
      [["a", "b", "c", "a"]],
      [["wrt", "wrtkj"]],
      [["baa", "abcd", "abca", "cab", "cad"]],
    ],
    random: (r, i) => {
      const order = r.shuffle([..."abcdefghijklmnopqrstuvwxyz"]).slice(0, r.int(2, 7));
      const rank = new Map(order.map((c, k) => [c, k]));
      const words = Array.from({ length: r.int(1, 10) }, () => Array.from({ length: r.int(1, 5) }, () => r.pick(order)).join(""));
      words.sort((a, b) => {
        for (let k = 0; k < Math.min(a.length, b.length); k++) if (a[k] !== b[k]) return rank.get(a[k]!)! - rank.get(b[k]!)!;
        return a.length - b.length;
      });
      if (i % 3 === 2 && words.length > 1) { // make it (probably) invalid: swap two neighbours
        const k = r.int(0, words.length - 2);
        [words[k], words[k + 1]] = [words[k + 1]!, words[k]!];
      }
      return [words];
    },
    count: 12,
    perf: null, // at most 100 words of 100 letters
  },

  // 1 <= n <= 2000, a != b, all pairs [a, b] distinct ([a, b] and [b, a] may both appear: a cycle)
  "course-schedule-ii": {
    edge: [
      [1, []],
      [3, []],
      [2, [[0, 1]]],
      [2, [[1, 0], [0, 1]]],
      [3, [[0, 1], [1, 2], [2, 0]]],
      [4, [[0, 1], [1, 2], [2, 3]]],
      [5, [[1, 0], [2, 1], [3, 2], [4, 3], [0, 4]]],
      [4, [[1, 0], [2, 0], [3, 0], [2, 1], [3, 2]]],
      [3, [[1, 0], [1, 2], [0, 1]]],
    ],
    random: (r, i) => {
      const n = r.int(1, 12);
      const order = r.shuffle([...Array(n).keys()]);
      const pairs: number[][] = [];
      for (let a = 1; a < n; a++) for (let b = 0; b < a; b++) if (r.bool(0.2)) pairs.push([order[a]!, order[b]!]); // order[b] comes first
      if (i % 3 === 2 && pairs.length) { // a cycle: reverse one prerequisite (or close a longer loop)
        const [x, y] = r.pick(pairs);
        pairs.push([y!, x!]);
      }
      return [n, r.shuffle(pairs)];
    },
    count: 12,
    // a chain of 2,000 courses plus "course i needs i+2" for the first 100: walking prerequisites without
    // remembering finished courses explores ~fib(100) paths
    perf: {
      input: [2000, { concat: [{ shuffle: { edges: "chain", n: 2000 }, seed: 4 }, Array.from({ length: 98 }, (_, i) => [i, i + 2])] }],
      about: "2,000 courses, 2,097 prerequisites",
    },
    slow: `export function findOrder(n: number, prerequisites: number[][]) {
      const pre: number[][] = Array.from({ length: n }, () => []);
      for (const [a, b] of prerequisites) pre[a].push(b);
      const onPath = new Set<number>();
      const ok = (c: number): boolean => {
        if (onPath.has(c)) return false;
        onPath.add(c);
        for (const p of pre[c]) if (!ok(p)) return false;
        onPath.delete(c);
        return true;
      };
      for (let c = 0; c < n; c++) if (!ok(c)) return [];
      const out: number[] = [], done = new Set<number>();
      const visit = (c: number) => { if (done.has(c)) return; done.add(c); for (const p of pre[c]) visit(p); out.push(c); };
      for (let c = 0; c < n; c++) visit(c);
      return out;
    }`,
  },

  // 0 <= strs < 100, 0 <= length < 200, any of the 256 ASCII characters (so delimiters can appear inside)
  "encode-and-decode-strings": {
    edge: [
      [[]],
      [[""]],
      [["", "", "a", ""]],
      [["a,b", "#", "4#abc", "|", "\n", " ", "::", "5#"]],
      [["12#3", "0", "#1#", "##", "99"]],
      [["\u0000", "ÿ\u0080", "\t\r", "\"'\\"]],
      [["x".repeat(199), "", "y".repeat(10)]],
      [Array.from({ length: 99 }, (_, i) => String(i))],
    ],
    random: (r) => {
      const chars = (n: number) => Array.from({ length: n }, () => (r.bool(0.3) ? r.pick([..."#0123456789,;:|/ "]) : String.fromCharCode(r.int(0, 255)))).join("");
      return [Array.from({ length: r.int(0, 8) }, () => chars(r.pick([0, 1, 3, 8, 15])))];
    },
    perf: null, // under 100 strings of under 200 characters
  },

  // 0 <= nodes <= 10^4, -1000 <= val <= 1000 (values may repeat)
  "serialize-and-deserialize-binary-tree": {
    edge: [
      [[1]],
      [[0]],
      [[-10, 200, -1000, null, 7]],
      [[1, 2, null, 3, null, 4]],
      [[1, null, 2, null, 3, null, 4]],
      [[5, 5, 5, 5, null, null, 5]],
      [[-1000, 1000]],
      [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]],
    ],
    random: (r) => {
      const n = r.int(0, 25);
      return [r.tree(n, r.ints(n, r.bool() ? -1000 : -3, r.bool() ? 1000 : 3))];
    },
    perf: { input: [{ bst: 10000 }], about: "a tree of 10,000 nodes (the maximum)" },
  },

  // 0 <= nodes <= 100, values 1..n, undirected (each edge in both lists), no repeated edges or self-loops, connected
  "clone-graph": {
    edge: [
      [[[2], [1]]],
      [[[2, 3, 4], [1, 3, 4], [1, 2, 4], [1, 2, 3]]],
      [[[2], [1, 3], [2, 4], [3, 5], [4]]],
      [[[2, 3, 4, 5], [1], [1], [1], [1]]],
      [[[3, 2], [3, 1], [1, 2]]],
    ],
    random: (r) => {
      const n = r.int(1, 12);
      const edges = randomTree(r, n);
      for (let k = r.int(0, n); k > 0; k--) { const e = newEdge(r, n, edges); if (e) edges.push(e); }
      const adj: number[][] = Array.from({ length: n }, () => []);
      for (const [a, b] of edges) { adj[a!]!.push(b! + 1); adj[b!]!.push(a! + 1); }
      return [adj.map((ns) => r.shuffle(ns))];
    },
    perf: null, // at most 100 nodes
  },

  // 0 <= n <= 1000, -10^4 <= val <= 10^4, random is null or an index in the list
  "copy-list-with-random-pointer": {
    edge: [
      [[]],
      [[[5, 0]]],
      [[[5, null]]],
      [[[1, null], [2, null], [3, null]]],
      [[[1, 2], [2, 2], [3, 2]]],
      [[[-10000, 1], [10000, 0]]],
      [[[4, 3], [3, 2], [2, 1], [1, 0]]],
    ],
    random: (r) => {
      const n = r.int(0, 15);
      return [Array.from({ length: n }, () => [r.int(-10000, 10000), r.bool(0.3) ? null : r.int(0, n - 1)])];
    },
    perf: null, // at most 1,000 nodes
  },

  // 0 <= nodes <= 10^4, -10^5 <= val <= 10^5, pos is -1 or a valid index
  "linked-list-cycle": {
    edge: [
      [[], -1],
      [[1], 0],
      [[1, 2], -1],
      [[1, 2], 1],
      [[1, 1, 1, 1], -1],
      [[1, 1, 1, 1], 3],
      [[-100000, 100000, 0], 0],
      [Array.from({ length: 30 }, (_, i) => i), 29],
    ],
    random: (r, i) => {
      const n = r.int(i < 3 ? 0 : 1, 25);
      return [r.ints(n, -100000, 100000), n === 0 || r.bool(0.4) ? -1 : r.int(0, n - 1)];
    },
    // the tail links back to the head. (No `slow`: at 10^4 nodes even "remember every node in a list" is fast;
    // this still catches a quadratic walk in Python.)
    perf: { input: [{ ints: 10000, lo: -100000, hi: 100000, seed: 2 }, 0], about: "a list of 10,000 nodes (the maximum)" },
  },

  // 2 <= nodes <= 10^5, -10^9 <= val <= 10^9, unique values, p != q, both in the BST
  "lowest-common-ancestor-of-a-binary-search-tree": {
    edge: [
      [[2, 1], 1, 2],
      [[1, null, 2], 2, 1],
      [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 3, 5],
      [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 7, 9],
      [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 3, 7],
      [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 5, 0],
      [[5, 4, null, 3, null, 2, null, 1], 1, 4],
      [[0, -1000000000, 1000000000], -1000000000, 1000000000],
    ],
    random: (r, i) => {
      const n = r.int(2, 25);
      const values = i % 2 ? r.distinct(n, -1000000000, 1000000000) : r.distinct(n, -30, 30);
      const [p, q] = r.shuffle(values).slice(0, 2);
      return [r.bst(values), p, q];
    },
    perf: null, // building the tree and finding p and q is already O(n), so a slower search can't be told apart
  },
});
