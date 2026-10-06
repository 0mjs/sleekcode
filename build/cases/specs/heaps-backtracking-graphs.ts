// Tries, heaps, backtracking and graphs.
import { build } from "../../../runtime/ts/lib/recipe";
import { defineSpecs, type Rng } from "../lib";

const assert = (ok: boolean, what: string) => {
  if (!ok) throw new Error(`invalid input: ${what}`);
};
const range = (n: number, from = 0) => Array.from({ length: n }, (_, i) => i + from);

// ---- validity checks shared by edge + random inputs ----

/** k-closest: the k-th and (k+1)-th smallest distances differ, so the answer set is unique */
const kClosestUnique = (points: number[][], k: number) => {
  const d = points.map(([x, y]) => x! * x! + y! * y!).sort((a, b) => a - b);
  return k === d.length || d[k - 1]! < d[k]!;
};
const checkKClosest = (input: [number[][], number]) => {
  const [p, k] = input;
  assert(k >= 1 && k <= p.length && kClosestUnique(p, k), `k-closest ${JSON.stringify(input)}`);
  return input;
};

/** Number of unique combinations (multisets) of candidates summing to target */
const countCombos = (cands: number[], target: number) => {
  const ways = Array(target + 1).fill(0);
  ways[0] = 1;
  for (const c of cands) for (let s = c; s <= target; s++) ways[s] += ways[s - c];
  return ways[target];
};
const checkComboSum = (input: [number[], number]) => {
  const [c, t] = input;
  assert(new Set(c).size === c.length && c.every((x) => x >= 2 && x <= 40) && t >= 1 && t <= 40 && countCombos(c, t) < 150, `combination-sum ${JSON.stringify(input)}`);
  return input;
};

/** redundant-connection: a tree on 1..n plus one extra edge, ai < bi, no repeats */
const checkRedundant = (edges: number[][]) => {
  const n = edges.length;
  const keys = new Set(edges.map(([a, b]) => `${a},${b}`));
  assert(n >= 3 && keys.size === n && edges.every(([a, b]) => a! >= 1 && a! < b! && b! <= n), `redundant ${JSON.stringify(edges)}`);
  // connected
  const parent = range(n + 1);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x]!)));
  for (const [a, b] of edges) parent[find(a!)] = find(b!);
  assert(range(n, 1).every((v) => find(v) === find(1)), "redundant: not connected");
  return [edges];
};

/** reconstruct-itinerary: tickets from a walk starting at JFK (so a valid itinerary using all of them exists) */
const AIRPORTS = ["JFK", "ATL", "SFO", "LHR", "MUC", "AAA", "AAB", "KUL", "NRT", "ZZZ"];
const walkTickets = (r: Rng, len: number, airports: string[]) => {
  const tickets: string[][] = [];
  let at = "JFK";
  for (let i = 0; i < len; i++) {
    let next = r.pick(airports);
    while (next === at) next = r.pick(airports);
    tickets.push([at, next]);
    at = next;
  }
  return r.shuffle(tickets);
};

/** Self-avoiding random path on a board (for word-search inputs whose word exists) */
const boardPath = (r: Rng, board: string[][], len: number) => {
  const m = board.length, n = board[0]!.length;
  let cr = r.int(0, m - 1), cc = r.int(0, n - 1);
  const seen = new Set([`${cr},${cc}`]);
  let word = board[cr]![cc]!;
  while (word.length < len) {
    const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      .map(([dr, dc]) => [cr + dr!, cc + dc!] as const)
      .filter(([a, b]) => a >= 0 && a < m && b >= 0 && b < n && !seen.has(`${a},${b}`));
    if (!opts.length) break;
    [cr, cc] = r.pick(opts);
    seen.add(`${cr},${cc}`);
    word += board[cr]![cc]!;
  }
  return word;
};
const charBoard = (r: Rng, m: number, n: number, alphabet: string) => Array.from({ length: m }, () => [...r.string(n, alphabet)]);

// ---- speed-check inputs that need a validity check ----

// k-th largest in a stream: 10,000 initial scores, then 10,000 adds
const kthStreamPerf = {
  input: [
    { concat: [["KthLargest"], { repeat: "add", n: 10000 }] },
    { concat: [[[5000, { ints: 10000, lo: -10000, hi: 10000, seed: 1 }]], { grid: [10000, 1], lo: -10000, hi: 10000, seed: 2 }] },
  ],
  about: "10,000 starting scores, k = 5,000, then 10,000 adds",
};

// find-median: 50,000 calls, in blocks of 5,000 addNum then 5,000 findMedian
const medianBlocks = range(5);
const medianPerf = {
  input: [
    { concat: [["MedianFinder"], ...medianBlocks.flatMap(() => [{ repeat: "addNum", n: 5000 }, { repeat: "findMedian", n: 5000 }])] },
    { concat: [[[]], ...medianBlocks.flatMap((i) => [{ grid: [5000, 1], lo: -100000, hi: 100000, seed: i + 1 }, { repeat: [], n: 5000 }])] },
  ],
  about: "50,000 calls (25,000 addNum, 25,000 findMedian)",
};

// course-schedule: a random tree DAG over 2,000 courses plus a 40-layer, 2-wide "ladder" (2^39 paths) at the top ids.
// Every edge is [smaller, larger], so there is no cycle; the pairs must all be unique.
const ladder = range(39).flatMap((i) => [0, 1].flatMap((x) => [0, 1].map((y) => [1920 + 2 * i + x, 1920 + 2 * i + 2 + y])));
const courseSeed = (() => {
  const lad = new Set(ladder.map((e) => e.join(",")));
  for (let seed = 1; ; seed++) {
    const tree = build({ edges: "tree", n: 2000, seed }) as number[][];
    if (tree.every((e) => !lad.has(e.join(",")))) return seed;
  }
})();
const coursePerf = {
  input: [2000, { concat: [{ edges: "tree", n: 2000, seed: courseSeed }, ladder] }],
  about: `2,000 courses, ${1999 + ladder.length} prerequisites (with a deep layered section)`,
};

// min-cost-to-connect-all-points: 1,000 distinct points
const mstPoints = { grid: [1000, 2], lo: -1000000, hi: 1000000, seed: 7 };
assert(new Set((build(mstPoints) as number[][]).map((p) => p.join(","))).size === 1000, "min-cost perf points not distinct");

export const specs = defineSpecs({
  // ---------------- Tries ----------------

  "implement-trie-prefix-tree": {
    edge: [
      [["Trie", "search", "startsWith"], [[], ["a"], ["a"]]],
      [["Trie", "insert", "search", "startsWith", "search", "startsWith"], [[], ["a"], ["a"], ["a"], ["aa"], ["b"]]],
      [["Trie", "insert", "insert", "search", "search", "startsWith"], [[], ["abc"], ["abc"], ["abc"], ["ab"], ["abcd"]]],
      [["Trie", "insert", "insert", "search", "search", "search", "startsWith"], [[], ["ab"], ["abcd"], ["abc"], ["ab"], ["abcd"], ["abc"]]],
      [["Trie", "insert", "startsWith", "search", "startsWith"], [[], ["z".repeat(2000)], ["z".repeat(1999)], ["z".repeat(1999)], ["z".repeat(2000)]]],
    ],
    random: (r) => {
      const ops = ["Trie"], args: string[][] = [[]];
      const words: string[] = [];
      for (let i = 0; i < 25; i++) {
        const op = r.pick(["insert", "insert", "search", "startsWith"]);
        let w = r.string(r.int(1, 5), "abc");
        if (op !== "insert" && words.length && r.bool(0.6)) {
          const base = r.pick(words);
          w = r.bool() ? base : base.slice(0, r.int(1, base.length));
        }
        if (op === "insert") words.push(w);
        ops.push(op);
        args.push([w]);
      }
      return [ops, args];
    },
    perf: null,
  },

  "design-add-and-search-words-data-structure": {
    edge: [
      [["WordDictionary", "search", "addWord", "search", "search"], [[], ["a"], ["a"], ["."], [".."]]],
      [["WordDictionary", "addWord", "addWord", "search", "search", "search", "search"], [[], ["ab"], ["abc"], ["a."], ["a.."], [".b."], ["..."]]],
      [["WordDictionary", "addWord", "search", "search", "search"], [[], ["a".repeat(25)], ["a".repeat(23) + ".."], ["a".repeat(24)], ["." + "a".repeat(23) + "."]]],
      [["WordDictionary", "addWord", "addWord", "search", "search", "search"], [[], ["bad"], ["bad"], ["bad"], ["ba"], ["bade"]]],
      [["WordDictionary", "addWord", "addWord", "search", "search"], [[], ["xy"], ["yx"], [".x"], ["x."]]],
    ],
    random: (r) => {
      const ops = ["WordDictionary"], args: string[][] = [[]];
      const words: string[] = [];
      for (let i = 0; i < 25; i++) {
        const op = words.length === 0 || r.bool(0.4) ? "addWord" : "search";
        let w = r.string(r.int(1, 4), "abc");
        if (op === "search") {
          if (r.bool(0.6)) w = r.pick(words);
          const chars = [...w];
          for (const j of r.shuffle(range(chars.length)).slice(0, r.int(0, 2))) chars[j] = ".";
          w = chars.join("");
        } else words.push(w);
        ops.push(op);
        args.push([w]);
      }
      return [ops, args];
    },
    perf: null,
  },

  // Backtracking over the board: no speed check
  "word-search-ii": {
    edge: [
      [[["a"]], ["a"]],
      [[["a"]], ["b"]],
      [[["a", "a"]], ["aaa", "aa", "a"]],
      [[["a", "b"], ["c", "d"]], ["abdc", "acdb", "abcd", "dcba", "ab", "ba"]],
      [[["a", "b", "c"], ["a", "e", "d"], ["a", "f", "g"]], ["abcdefg", "gfedcbaaa", "eaabcdgfa", "befa", "dgc", "ade"]],
      [[["o", "a", "b", "n"], ["o", "t", "a", "e"], ["a", "h", "k", "r"], ["a", "f", "l", "v"]], ["oa", "oaa"]],
    ],
    random: (r) => {
      const m = r.int(1, 5), n = r.int(1, 5);
      const alphabet = r.pick(["ab", "abc", "abcde"]);
      const board = charBoard(r, m, n, alphabet);
      const words = new Set<string>();
      const want = r.int(1, 12);
      while (words.size < want) words.add(r.bool() ? boardPath(r, board, r.int(1, 8)) : r.string(r.int(1, 6), alphabet));
      return [board, [...words]];
    },
    perf: null,
  },

  // ---------------- Heaps ----------------

  "kth-largest-element-in-a-stream": {
    edge: [
      [["KthLargest", "add", "add", "add"], [[1, []], [-3], [-5], [10]]],
      [["KthLargest", "add", "add"], [[2, [1]], [0], [2]]],
      [["KthLargest", "add", "add", "add"], [[3, [5, 5, 5]], [5], [4], [6]]],
      [["KthLargest", "add", "add", "add", "add"], [[1, [-10000, 10000]], [10000], [-10000], [0], [9999]]],
      [["KthLargest", "add", "add", "add"], [[4, [1, 2, 3, 4]], [0], [0], [0]]],
    ],
    random: (r) => {
      const nums = r.ints(r.int(0, 15), -10, 10).map((x) => (r.bool(0.3) ? x * 1000 : x));
      const k = r.int(1, nums.length + 1);
      const ops = ["KthLargest"], args: unknown[][] = [[k, nums]];
      for (let i = r.int(1, 15); i > 0; i--) { ops.push("add"); args.push([r.int(-12, 12)]); }
      return [ops, args];
    },
    perf: kthStreamPerf,
    slow: `export class KthLargest {
      k: number; a: number[];
      constructor(k: number, nums: number[]) { this.k = k; this.a = [...nums]; }
      add(val: number) { this.a.push(val); return [...this.a].sort((x, y) => y - x)[this.k - 1]; }
    }`,
  },

  // stones.length <= 30: too small for a speed check
  "last-stone-weight": {
    edge: [[[1000]], [[5, 5]], [[1000, 1]], [[2, 2, 2]], [Array(30).fill(7)], [range(30, 1)], [[1, 1, 1, 1000]]],
    random: (r) => [r.ints(r.int(1, 30), 1, r.pick([5, 20, 1000]))],
    perf: null,
  },

  // Brute force (sort, or repeated selection) is fast enough at 10^4 points, so no speed check
  "k-closest-points-to-origin": {
    edge: [
      checkKClosest([[[0, 0]], 1]),
      checkKClosest([[[10000, -10000], [-10000, 10000]], 2]),
      checkKClosest([[[1, 1], [1, 1], [3, 3]], 2]),
      checkKClosest([[[0, 1], [1, 0], [0, -1], [-1, 0], [2, 2]], 4]),
      checkKClosest([[[-5, 4], [0, 0], [10000, 10000], [-1, -1]], 1]),
      checkKClosest([[[3, 4], [5, 5], [-6, 0], [1, -8]], 3]),
    ],
    random: (r) => {
      const hi = r.pick([10, 100, 10000]);
      for (;;) {
        const pts = Array.from({ length: r.int(1, 25) }, () => [r.int(-hi, hi), r.int(-hi, hi)]);
        const k = r.int(1, pts.length);
        if (kClosestUnique(pts, k)) return [pts, k];
      }
    },
    perf: null,
  },

  "kth-largest-element-in-an-array": {
    edge: [
      [[1], 1],
      [[-10000, 10000], 1],
      [[-10000, 10000], 2],
      [[7, 7, 7, 7, 7], 3],
      [range(10, 1), 10],
      [range(10, 1).reverse(), 2],
      [[3, 2, 3, 1, 2, 4, 5, 5, 6], 1],
    ],
    random: (r) => {
      const nums = r.ints(r.int(1, 25), r.pick([-5, -10000]), r.pick([5, 10000]));
      return [nums, r.int(1, nums.length)];
    },
    perf: { input: [{ ints: 100000, lo: -10000, hi: 10000, seed: 5 }, 50000], about: "nums of length 100,000, k = 50,000" },
    slow: `export function findKthLargest(nums: number[], k: number) {
      const a = [...nums];
      let best = 0;
      for (let t = 0; t < k; t++) {
        let bi = 0;
        for (let i = 1; i < a.length; i++) if (a[i] > a[bi]) bi = i;
        best = a[bi]; a[bi] = -Infinity;
      }
      return best;
    }`,
  },

  // At most 10^4 tasks and n <= 100: a simple simulation is fast, so no speed check
  "task-scheduler": {
    edge: [
      [["A"], 0],
      [["A"], 100],
      [["A", "A"], 100],
      [["A", "A", "A", "A"], 0],
      [[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"], 100],
      [[..."AAABBBCCCDDE"], 2],
      [[..."AAAAAABCDEFG"], 2],
      [[..."AABBCCDDEE"], 1],
    ],
    random: (r) => [[...r.string(r.int(1, 30), r.pick(["AB", "ABC", "ABCDEF", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"]))], r.pick([0, 1, 2, 3, r.int(0, 10), r.int(0, 100)])],
    perf: null,
  },

  "design-twitter": {
    edge: [
      [["Twitter", "getNewsFeed"], [[], [1]]],
      [["Twitter", "postTweet", "getNewsFeed", "getNewsFeed"], [[], [500, 10000], [500], [1]]],
      [["Twitter", ...Array(12).fill("postTweet"), "getNewsFeed"], [[], ...range(12).map((i) => [1, i]), [1]]],
      [["Twitter", "postTweet", "follow", "postTweet", "postTweet", "getNewsFeed", "getNewsFeed", "unfollow", "getNewsFeed"], [[], [1, 0], [2, 1], [2, 5], [1, 3], [2], [1], [2, 1], [2]]],
      [["Twitter", "follow", "follow", "postTweet", "postTweet", "postTweet", "getNewsFeed", "unfollow", "getNewsFeed"], [[], [1, 2], [2, 1], [2, 7], [3, 8], [1, 9], [1], [1, 2], [2]]],
      [["Twitter", ...Array(6).fill("postTweet"), "follow", ...Array(6).fill("postTweet"), "getNewsFeed"], [[], ...range(6).map((i) => [1, 100 + i]), [1, 2], ...range(6).map((i) => [2, 200 + i]), [1]]],
    ],
    random: (r) => {
      const users = r.int(2, 5);
      const ids = r.distinct(40, 0, 10000);
      const following = new Set<string>();
      const ops = ["Twitter"], args: number[][] = [[]];
      for (let i = 0; i < 35; i++) {
        let op = r.pick(["postTweet", "postTweet", "postTweet", "getNewsFeed", "getNewsFeed", "follow", "unfollow"]);
        const a = r.int(1, users);
        let b = r.int(1, users - 1);
        if (b >= a) b++;
        if (op === "follow" && following.has(`${a},${b}`)) op = "getNewsFeed";
        if (op === "unfollow") {
          const pairs = [...following];
          if (!pairs.length) op = "postTweet";
          else {
            const [x, y] = r.pick(pairs).split(",").map(Number);
            following.delete(`${x},${y}`);
            ops.push(op);
            args.push([x!, y!]);
            continue;
          }
        }
        if (op === "follow") following.add(`${a},${b}`);
        ops.push(op);
        args.push(op === "postTweet" ? [a, ids.pop()!] : op === "getNewsFeed" ? [a] : [a, b]);
      }
      return [ops, args];
    },
    perf: null,
  },

  "find-median-from-data-stream": {
    edge: [
      [["MedianFinder", "addNum", "findMedian"], [[], [-100000], []]],
      [["MedianFinder", "addNum", "addNum", "findMedian"], [[], [100000], [-100000], []]],
      [["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"], [[], [1], [2], [], [2], []]],
      [["MedianFinder", "addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian"], [[], [5], [], [4], [], [3], [], [2], []]],
      [["MedianFinder", "addNum", "addNum", "addNum", "addNum", "findMedian"], [[], [7], [7], [7], [7], []]],
      [["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "addNum", "findMedian"], [[], [-1], [-2], [], [-3], [-4], []]],
    ],
    random: (r) => {
      const hi = r.pick([10, 100000]);
      const ops = ["MedianFinder", "addNum"], args: number[][] = [[], [r.int(-hi, hi)]];
      for (let i = 0; i < 25; i++) {
        const op = r.bool(0.6) ? "addNum" : "findMedian";
        ops.push(op);
        args.push(op === "addNum" ? [r.int(-hi, hi)] : []);
      }
      return [ops, args];
    },
    perf: medianPerf,
    slow: `export class MedianFinder {
      a: number[] = [];
      addNum(n: number) { this.a.push(n); }
      findMedian() { const a = [...this.a].sort((x, y) => x - y), m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; }
    }`,
  },

  // ---------------- Backtracking (exponential by nature: small inputs, no speed check) ----------------

  subsets: {
    edge: [[[-10]], [[10, -10]], [[0, 1]], [[5, 4, 3, 2, 1]], [range(8)]],
    random: (r) => [r.distinct(r.int(1, 7), -10, 10)],
    perf: null,
  },

  "combination-sum": {
    edge: [
      checkComboSum([[40], 40]),
      checkComboSum([[2, 3], 1]),
      checkComboSum([[39, 40], 38]),
      checkComboSum([[2], 40]),
      checkComboSum([[7, 3, 2], 18]),
      checkComboSum([[5, 10, 15, 20, 25, 30, 35, 40], 40]),
    ],
    random: (r) => {
      for (;;) {
        const c = r.distinct(r.int(1, 8), 2, r.pick([10, 40]));
        const t = r.int(1, 40);
        if (countCombos(c, t) < 150) return [c, t];
      }
    },
    perf: null,
  },

  permutations: {
    edge: [[[-10]], [[10, -10]], [[0, -1, 1]], [range(5, 1)]],
    random: (r) => [r.distinct(r.int(1, 5), -10, 10)],
    perf: null,
  },

  "subsets-ii": {
    edge: [[[5, 5, 5, 5]], [[-10, 10, -10, 10]], [Array(10).fill(0)], [[1, 1, 2, 2, 3, 3]], [[4, 4, 4, 1, 4]], [[3, 1, 2]]],
    random: (r) => [r.ints(r.int(1, 8), -r.pick([1, 3, 10]), r.pick([1, 3, 10]))],
    perf: null,
  },

  "combination-sum-ii": {
    edge: [
      [[1], 1],
      [[2], 1],
      [[50], 30],
      [Array(100).fill(1), 30],
      [range(100).map((i) => 25 + (i % 26)), 30],
      [[1, 1, 1, 1, 2, 2, 3], 4],
      [[10, 20, 30, 5, 5, 5, 15], 30],
    ],
    random: (r) => [r.ints(r.int(1, 20), 1, r.pick([5, 15, 50])), r.int(1, 30)],
    perf: null,
  },

  "word-search": {
    edge: [
      [[["a"]], "a"],
      [[["a"]], "A"],
      [[["a"]], "aa"],
      [[["A", "B"], ["D", "C"]], "ABCD"],
      [[["A", "B"], ["D", "C"]], "ABCDA"],
      [[["A", "A", "A"], ["A", "A", "A"], ["A", "A", "A"]], "AAAAAAAAB"],
      [[["A", "A", "A"], ["A", "A", "A"], ["A", "A", "A"]], "AAAAAAAAA"],
      [[["a", "b", "c", "d", "e", "f"]], "fedcba"],
    ],
    random: (r) => {
      const board = charBoard(r, r.int(1, 4), r.int(1, 4), r.pick(["AB", "ABab", "abc"]));
      const word = r.bool() ? boardPath(r, board, r.int(1, 10)) : r.string(r.int(1, 8), "ABab");
      return [board, word];
    },
    perf: null,
  },

  "palindrome-partitioning": {
    edge: [["z"], ["aaaaaaaa"], ["abcba"], ["abcdefgh"], ["aabb"], ["abacaba"]],
    random: (r) => [r.string(r.int(1, 10), r.pick(["ab", "abc"]))],
    perf: null,
  },

  "letter-combinations-of-a-phone-number": {
    edge: [["7"], ["9"], ["79"], ["2345"], ["7979"], ["22"]],
    random: (r) => [r.string(r.int(1, 4), "23456789")],
    perf: null,
  },

  "n-queens": {
    edge: [[2], [3], [5], [6], [7], [8]],
    perf: null,
  },

  // ---------------- Graphs ----------------

  "number-of-islands": {
    edge: [
      [[["0"]]],
      [[["1"]]],
      [[["1", "1", "1"], ["1", "1", "1"], ["1", "1", "1"]]],
      [[["1", "0", "1"], ["0", "1", "0"], ["1", "0", "1"]]],
      [[["1", "0", "1", "1", "0", "1"]]],
      [[["1"], ["1"], ["0"], ["1"]]],
      [[["1", "1", "1"], ["0", "1", "0"], ["1", "1", "1"]]],
    ],
    random: (r) => [charBoard(r, r.int(1, 8), r.int(1, 8), r.pick(["01", "001", "011"]))],
    // Half land: the islands stay small (recursion depth < 200) but there are ~45,000 land cells to visit
    perf: { input: [{ charGrid: [300, 300], alphabet: "01", seed: 1 }], about: "a 300 × 300 grid" },
    slow: `export function numIslands(grid: string[][]) {
      const visited: string[] = []; // a list instead of a set: every lookup is a scan
      let count = 0;
      for (let r = 0; r < grid.length; r++) for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] !== "1" || visited.includes(r + "," + c)) continue;
        count++;
        const stack = [[r, c]];
        visited.push(r + "," + c);
        while (stack.length) {
          const [i, j] = stack.pop()!;
          for (const [a, b] of [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]]) {
            if (a < 0 || b < 0 || a >= grid.length || b >= grid[0].length || grid[a][b] !== "1" || visited.includes(a + "," + b)) continue;
            visited.push(a + "," + b);
            stack.push([a, b]);
          }
        }
      }
      return count;
    }`,
  },

  // 50 × 50 at most: too small for a speed check
  "max-area-of-island": {
    edge: [[[[0]]], [[[1]]], [[[1, 1], [1, 1]]], [[[1, 0, 1], [0, 1, 0], [1, 0, 1]]], [[[1, 1, 0, 1, 1, 1]]], [[[0], [1], [1]]]],
    random: (r) => { const m = r.int(1, 8), n = r.int(1, 8), p = r.pick([0.3, 0.5, 0.7]); return [Array.from({ length: m }, () => Array.from({ length: n }, () => (r.bool(p) ? 1 : 0)))]; },
    perf: null,
  },

  "pacific-atlantic-water-flow": {
    edge: [
      [[[0]]],
      [[[1, 2, 3, 4]]],
      [[[4], [3], [2], [1]]],
      [[[5, 5, 5], [5, 5, 5], [5, 5, 5]]],
      [[[3, 3, 3], [3, 1, 3], [3, 3, 3]]],
      [[[1, 1], [1, 100000]]],
      [[[10, 1, 10], [1, 1, 1], [10, 1, 10]]],
    ],
    random: (r) => { const m = r.int(1, 6), n = r.int(1, 6), hi = r.pick([3, 10, 100000]); return [Array.from({ length: m }, () => r.ints(n, 0, hi))]; },
    // Random heights keep every cell's reachable area tiny, so even the per-cell brute force is fast on any
    // recipe-generated grid: no speed check
    perf: null,
  },

  "surrounded-regions": {
    edge: [
      [[["O"]]],
      [[["O", "O", "O"], ["O", "O", "O"], ["O", "O", "O"]]],
      [[["X", "X", "X"], ["X", "O", "X"], ["X", "X", "X"]]],
      [[["X", "O", "X"], ["X", "O", "X"], ["X", "X", "X"]]],
      [[["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "O", "X", "X"], ["X", "O", "X", "X"]]],
      [[["O", "X", "O", "X", "O"]]],
      [[["X", "X", "X", "X", "X"], ["X", "O", "X", "O", "X"], ["X", "X", "O", "X", "X"], ["X", "O", "X", "O", "X"], ["X", "X", "X", "X", "X"]]],
    ],
    random: (r) => [charBoard(r, r.int(1, 7), r.int(1, 7), r.pick(["XO", "XXO", "XOO"]))],
    // 60% 'O': one big region (~19,000 cells) touches the edge, with recursion depth < 1,400 in any neighbor order
    perf: { input: [{ charGrid: [200, 200], alphabet: "XXOOO", seed: 6 }], about: "a 200 × 200 board" },
    slow: `export function solve(board: string[][]) {
      const m = board.length, n = board[0].length;
      const capture: number[][] = [];
      for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
        if (board[r][c] !== "O") continue;
        // explore this cell's whole region again, from scratch, to see if it reaches the edge
        const seen = new Set([r * n + c]), stack = [[r, c]];
        let edge = false;
        while (stack.length) {
          const [i, j] = stack.pop()!;
          if (i === 0 || j === 0 || i === m - 1 || j === n - 1) edge = true;
          for (const [a, b] of [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]]) {
            if (a < 0 || b < 0 || a >= m || b >= n || board[a][b] !== "O" || seen.has(a * n + b)) continue;
            seen.add(a * n + b);
            stack.push([a, b]);
          }
        }
        if (!edge) capture.push([r, c]);
      }
      for (const [r, c] of capture) board[r][c] = "X";
    }`,
  },

  // 10 × 10 at most: too small for a speed check
  "rotting-oranges": {
    edge: [[[[0]]], [[[1]]], [[[2]]], [[[1, 2]]], [[[0, 0], [0, 0]]], [[[2, 0, 1]]], [[[2, 1, 1, 1, 1, 1, 1, 1, 1, 1]]], [[[2, 1, 2], [1, 1, 1], [2, 1, 2]]]],
    random: (r) => { const m = r.int(1, 6), n = r.int(1, 6); const w = r.pick([[0, 1, 1, 2], [0, 1, 1, 1, 1, 2], [0, 0, 1, 2]]); return [Array.from({ length: m }, () => Array.from({ length: n }, () => r.pick(w)))]; },
    perf: null,
  },

  "course-schedule": {
    edge: [
      [1, []],
      [2, [[0, 1]]],
      [3, [[0, 1], [1, 2], [2, 0]]],
      [5, [[1, 0], [2, 1], [3, 2], [4, 3]]],
      [5, [[1, 0], [2, 1], [3, 2], [4, 3], [1, 4]]],
      [4, [[1, 0], [2, 0], [3, 1], [3, 2]]],
      [6, [[1, 0], [0, 1], [3, 2], [4, 3], [5, 4]]],
    ],
    random: (r) => {
      const n = r.int(1, 10);
      const order = r.shuffle(range(n)); // a DAG follows this order, unless we add a back edge
      const pos = new Map(order.map((v, i) => [v, i]));
      const pairs = new Map<string, number[]>();
      const want = r.int(0, Math.min(15, (n * (n - 1)) / 2));
      while (pairs.size < want) {
        let a = r.int(0, n - 1), b = r.int(0, n - 1);
        if (a === b) continue;
        if (pos.get(a)! < pos.get(b)!) [a, b] = [b, a];
        pairs.set(`${a},${b}`, [a, b]);
      }
      const list = [...pairs.values()];
      if (n >= 2 && r.bool(0.5) && list.length) {
        const [a, b] = r.pick(list); // reverse a path to (maybe) create a cycle
        if (!pairs.has(`${b},${a}`)) list.push([b!, a!]);
      }
      return [n, r.shuffle(list)];
    },
    perf: coursePerf,
    slow: `export function canFinish(numCourses: number, prerequisites: number[][]) {
      const adj: number[][] = Array.from({ length: numCourses }, () => []);
      for (const [a, b] of prerequisites) adj[a].push(b);
      const onPath = new Set<number>();
      const ok = (c: number): boolean => {
        if (onPath.has(c)) return false;
        onPath.add(c);
        for (const p of adj[c]) if (!ok(p)) return false;
        onPath.delete(c);
        return true;
      };
      for (let c = 0; c < numCourses; c++) if (!ok(c)) return false;
      return true;
    }`,
  },

  // n <= 1000: the brute force (try removing each edge) is fast enough, so no speed check
  "redundant-connection": {
    edge: [
      checkRedundant([[1, 2], [2, 3], [1, 3]]),
      checkRedundant([[1, 3], [2, 3], [1, 2]]),
      checkRedundant([[1, 2], [2, 3], [3, 4], [4, 5], [1, 5]]),
      checkRedundant([[1, 5], [1, 2], [2, 3], [3, 4], [4, 5]]),
      checkRedundant([[1, 2], [1, 3], [1, 4], [1, 5], [4, 5], [5, 6]]),
      checkRedundant([[3, 4], [1, 2], [2, 4], [3, 5], [2, 5]]),
    ],
    random: (r) => {
      const n = r.int(3, 15);
      const label = r.shuffle(range(n, 1));
      const keys = new Set<string>();
      const edges: number[][] = [];
      const add = (a: number, b: number) => { const e = [Math.min(a, b), Math.max(a, b)]; keys.add(e.join(",")); edges.push(e); };
      for (let i = 1; i < n; i++) add(label[r.int(0, i - 1)]!, label[i]!);
      for (;;) {
        const a = r.int(1, n), b = r.int(1, n);
        if (a !== b && !keys.has(`${Math.min(a, b)},${Math.max(a, b)}`)) { add(a, b); break; }
      }
      return checkRedundant(r.shuffle(edges));
    },
    perf: null,
  },

  // Unique random words can't be described by a recipe at this scale, and pairwise brute force is quick on
  // random words, so no speed check
  "word-ladder": {
    edge: [
      ["a", "c", ["a", "b", "c"]],
      ["hot", "dog", ["hot", "dog"]],
      ["hit", "hot", ["hot"]],
      ["hit", "cog", ["hot", "dot", "dog", "lot", "log"]],
      ["abc", "abd", ["abd", "abc"]],
      ["aaaa", "bbbb", ["baaa", "bbaa", "bbba", "bbbb", "abbb"]],
      ["ab", "ba", ["aa", "bb", "cc"]],
    ],
    random: (r) => {
      const len = r.int(1, 3), alphabet = r.pick(["abc", "abcd"]);
      const total = alphabet.length ** len;
      const words = new Set<string>();
      const want = r.int(1, Math.min(20, total));
      while (words.size < want) words.add(r.string(len, alphabet));
      const list = [...words];
      const begin = r.string(len, alphabet);
      let end = r.bool(0.75) ? r.pick(list) : r.string(len, alphabet);
      while (end === begin) end = r.string(len, alphabet);
      return [begin, end, r.shuffle(list)];
    },
    perf: null,
  },

  // Tickets come from a walk that starts at JFK, so a valid itinerary always exists. No speed check (300 tickets).
  "reconstruct-itinerary": {
    edge: [
      [[["JFK", "AAA"]]],
      [[["JFK", "KUL"], ["JFK", "NRT"], ["NRT", "JFK"]]],
      [[["JFK", "ATL"], ["ATL", "JFK"], ["JFK", "ATL"], ["ATL", "JFK"]]],
      [[["JFK", "SFO"], ["SFO", "JFK"], ["JFK", "AAA"], ["AAA", "JFK"], ["JFK", "ZZZ"]]],
      [[["EZE", "AXA"], ["TIA", "ANU"], ["ANU", "JFK"], ["JFK", "ANU"], ["ANU", "EZE"], ["TIA", "ANU"], ["AXA", "TIA"], ["TIA", "JFK"], ["ANU", "TIA"], ["JFK", "TIA"]]],
    ],
    random: (r, i) => [walkTickets(r, r.int(1, 20), AIRPORTS.slice(0, i % 2 ? 4 : 10))],
    perf: null,
  },

  "min-cost-to-connect-all-points": {
    edge: [
      [[[0, 0]]],
      [[[-1000000, -1000000], [1000000, 1000000]]],
      [[[0, 0], [1, 0], [2, 0], [3, 0]]],
      [[[0, 0], [0, 1], [1, 0], [1, 1]]],
      [[[1000000, -1000000], [-1000000, 1000000], [0, 0]]],
    ],
    random: (r) => {
      const hi = r.pick([5, 100, 1000000]);
      const pts = new Map<string, number[]>();
      const want = r.int(1, Math.min(20, (2 * hi + 1) ** 2));
      while (pts.size < want) { const p = [r.int(-hi, hi), r.int(-hi, hi)]; pts.set(p.join(","), p); }
      return [[...pts.values()]];
    },
    perf: { input: [mstPoints], about: "1,000 points" },
    slow: `export function minCostConnectPoints(points: number[][]) {
      const n = points.length, inTree = new Array(n).fill(false);
      inTree[0] = true;
      let total = 0;
      for (let added = 1; added < n; added++) {
        let best = Infinity, pick = -1;
        for (let i = 0; i < n; i++) if (inTree[i]) for (let j = 0; j < n; j++) if (!inTree[j]) {
          const d = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
          if (d < best) { best = d; pick = j; }
        }
        inTree[pick] = true; total += best;
      }
      return total;
    }`,
  },

  // n <= 100: too small for a speed check
  "network-delay-time": {
    edge: [
      [[[1, 2, 0]], 2, 1],
      [[[1, 2, 100], [2, 1, 100]], 2, 2],
      [[[1, 2, 1]], 3, 1],
      [[[1, 2, 10], [1, 3, 1], [3, 2, 1]], 3, 1],
      [[[2, 1, 5], [3, 1, 5]], 3, 1],
      [[[1, 2, 0], [2, 3, 0], [3, 4, 0]], 4, 1],
    ],
    random: (r) => {
      const n = r.int(2, 8);
      const edges = new Map<string, number[]>();
      const want = r.int(1, Math.min(20, n * (n - 1)));
      const hi = r.pick([3, 100]);
      while (edges.size < want) {
        const u = r.int(1, n), v = r.int(1, n);
        if (u !== v) edges.set(`${u},${v}`, [u, v, r.int(0, hi)]);
      }
      return [[...edges.values()], n, r.int(1, n)];
    },
    perf: null,
  },

  // n <= 50: too small for a speed check
  "swim-in-rising-water": {
    edge: [
      [[[0]]],
      [[[3, 2], [0, 1]]],
      [[[0, 1], [2, 3]]],
      [[[8, 1, 2], [3, 4, 5], [6, 7, 0]]],
      [[[0, 8, 7], [1, 6, 2], [3, 4, 5]]],
    ],
    random: (r) => { const n = r.int(1, 6); const vals = r.shuffle(range(n * n)); return [range(n).map((i) => vals.slice(i * n, i * n + n))]; },
    perf: null,
  },

  // n <= 100: too small for a speed check
  "cheapest-flights-within-k-stops": {
    edge: [
      [2, [], 0, 1, 0],
      [2, [[0, 1, 10000]], 0, 1, 0],
      [2, [[0, 1, 5]], 1, 0, 1],
      [4, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 3, 100]], 0, 3, 1],
      [4, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 3, 100]], 0, 3, 2],
      [5, [[0, 1, 5], [1, 2, 5], [0, 3, 2], [3, 1, 2], [1, 4, 1], [4, 2, 1]], 0, 2, 2],
      [3, [[0, 1, 2], [1, 2, 1], [2, 0, 10]], 1, 0, 0],
    ],
    random: (r) => {
      const n = r.int(2, 8);
      const flights = new Map<string, number[]>();
      const want = r.int(0, Math.min(16, (n * (n - 1)) / 2));
      const hi = r.pick([10, 10000]);
      while (flights.size < want) {
        const u = r.int(0, n - 1), v = r.int(0, n - 1);
        if (u !== v && !flights.has(`${v},${u}`)) flights.set(`${u},${v}`, [u, v, r.int(1, hi)]);
      }
      const src = r.int(0, n - 1);
      let dst = r.int(0, n - 2);
      if (dst >= src) dst++;
      return [n, [...flights.values()], src, dst, r.int(0, n - 1)];
    },
    perf: null,
  },
});
