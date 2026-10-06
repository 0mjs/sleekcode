// Greedy, intervals, math & geometry, and bit manipulation problems.
import { defineSpecs, type Rng } from "../lib";

const INT_MAX = 2147483647;
const INT_MIN = -2147483648;

/** Can index n-1 be reached? (jump games) */
const reachable = (nums: number[]) => {
  let far = 0;
  for (let i = 0; i < nums.length && i <= far; i++) far = Math.max(far, i + nums[i]!);
  return far >= nums.length - 1;
};

/** Every valid starting station (gas station's answer must be unique when it exists) */
const gasStarts = (gas: number[], cost: number[]) => {
  const n = gas.length, out: number[] = [];
  for (let s = 0; s < n; s++) {
    let tank = 0, ok = true;
    for (let k = 0; k < n && ok; k++) { const i = (s + k) % n; tank += gas[i]! - cost[i]!; if (tank < 0) ok = false; }
    if (ok) out.push(s);
  }
  return out;
};

/** Sorted, pairwise non-overlapping (no shared point) intervals in [0, hi] */
const disjointIntervals = (r: Rng, n: number, hi: number) => {
  const out: number[][] = [];
  let cur = r.int(0, 5);
  for (let i = 0; i < n; i++) {
    const s = cur + (i === 0 ? 0 : r.int(1, 6));
    const e = s + r.int(0, 6);
    if (e > hi) break;
    out.push([s, e]);
    cur = e;
  }
  return out;
};

/** Digit string with no leading zero */
const digits = (r: Rng, n: number) => (n === 1 ? r.string(1, "0123456789") : r.string(1, "123456789") + r.string(n - 1, "0123456789"));

export const specs = defineSpecs({
  "maximum-subarray": {
    edge: [
      [[-1]],
      [[10000]],
      [[-5, -2, -3, -4]],
      [[0, 0, 0]],
      [[5, 4, -1, 7, 8]],
      [[-10000, 10000, -10000]],
      [[1, 2, 3, 4, 5]],
      [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
    ],
    random: (r) => [r.ints(r.int(1, 30), r.pick([-50, -10, -10000]), r.pick([50, 10, 10000]))],
    perf: { input: [{ ints: 100000, lo: -10000, hi: 10000, seed: 7 }], about: "nums of length 100,000" },
    slow: `export function maxSubArray(nums: number[]) {
      let best = -Infinity;
      for (let i = 0; i < nums.length; i++) { let s = 0; for (let j = i; j < nums.length; j++) { s += nums[j]; if (s > best) best = s; } }
      return best;
    }`,
  },

  "jump-game": {
    edge: [
      [[0]],
      [[1, 0]],
      [[0, 1]],
      [[2, 0, 0]],
      [[1, 1, 0, 1]],
      [[100000, 0, 0, 0]],
      [[3, 2, 1, 0, 4]],
      [[1, 1, 1, 1, 1]],
    ],
    random: (r) => [r.ints(r.int(1, 25), 0, r.pick([2, 3, 5]))],
    // Lots of choices but the end is out of reach: hopeless for plain recursion, linear for greedy.
    // 5,000 keeps memoized recursion (one frame per index) reasonable.
    perf: { input: [{ concat: [{ repeat: 5, n: 4990 }, { repeat: 0, n: 10 }] }], about: "nums of length 5,000 (end unreachable)" },
    slow: `export function canJump(nums: number[]): boolean {
      const go = (i: number): boolean => {
        if (i >= nums.length - 1) return true;
        for (let j = 1; j <= nums[i]; j++) if (go(i + j)) return true;
        return false;
      };
      return go(0);
    }`,
  },

  "jump-game-ii": {
    edge: [
      [[0]],
      [[1, 1]],
      [[1000, 1, 1]],
      [[2, 3, 0, 1, 4]],
      [[1, 1, 1, 1, 1]],
      [[1, 2, 1, 1, 1]],
      [[5, 9, 3, 2, 1, 0, 2, 3, 3, 1, 0, 0]],
      [[2, 0, 2, 0, 1]],
    ],
    // The end must be reachable: retry until it is
    random: (r) => {
      for (;;) {
        const nums = r.ints(r.int(1, 25), 0, r.pick([3, 4, 6]));
        if (reachable(nums)) return [nums];
      }
    },
    perf: { input: [{ repeat: 2, n: 5000 }], about: "nums of length 5,000" },
    slow: `export function jump(nums: number[]): number {
      const go = (i: number): number => {
        if (i >= nums.length - 1) return 0;
        let best = Infinity;
        for (let j = 1; j <= nums[i]; j++) best = Math.min(best, 1 + go(i + j));
        return best;
      };
      return go(0);
    }`,
  },

  // The answer is unique when it exists: every input is checked to have at most one valid start
  "gas-station": {
    edge: [
      [[5], [4]],
      [[0], [0]],
      [[1], [2]],
      [[2, 3, 4], [3, 4, 3]],
      [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]],
      [[0, 0, 0, 0, 10], [1, 1, 1, 1, 1]],
      [[3, 1, 1], [1, 2, 2]],
      [[10000, 0, 0], [0, 1, 10000]],
    ],
    random: (r) => {
      for (;;) {
        const n = r.int(1, 20), hi = r.pick([5, 10, 10000]);
        const gas = r.ints(n, 0, hi), cost = r.ints(n, 0, hi);
        if (gasStarts(gas, cost).length <= 1) return [gas, cost];
      }
    },
    // gas == cost everywhere except a deficit at n-2 made up at n-1: the only start is the last station,
    // so trying every start costs O(n²)
    perf: {
      input: [
        { concat: [{ ints: 99998, lo: 0, hi: 10000, seed: 5 }, [0, 2]] },
        { concat: [{ ints: 99998, lo: 0, hi: 10000, seed: 5 }, [1, 0]] },
      ],
      about: "100,000 stations",
    },
    slow: `export function canCompleteCircuit(gas: number[], cost: number[]): number {
      const n = gas.length;
      for (let s = 0; s < n; s++) {
        let tank = 0, ok = true;
        for (let k = 0; k < n; k++) { const i = (s + k) % n; tank += gas[i] - cost[i]; if (tank < 0) { ok = false; break; } }
        if (ok) return s;
      }
      return -1;
    }`,
  },

  "hand-of-straights": {
    edge: [
      [[1], 1],
      [[5, 1, 3], 1],
      [[1, 2, 3, 4, 5], 4],
      [[1, 1, 2, 2, 3, 3], 3],
      [[1, 2, 4], 3],
      [[0, 1000000000], 2],
      [[1000000000, 999999998, 999999999], 3],
      [[1, 2, 3, 3, 4, 4, 5, 6], 4],
    ],
    random: (r) => {
      const k = r.int(1, 5), groups = r.int(1, 6), base = r.pick([0, 1, 10, 999999980]);
      const hand: number[] = [];
      for (let g = 0; g < groups; g++) { const s = base + r.int(0, 8); for (let j = 0; j < k; j++) hand.push(s + j); }
      if (r.bool(0.5)) { const i = r.int(0, hand.length - 1); hand[i] = Math.max(0, hand[i]! + r.pick([-1, 1, 2])); }
      return [r.shuffle(hand), k];
    },
    perf: null,
  },

  "merge-triplets-to-form-target-triplet": {
    edge: [
      [[[1, 1, 1]], [1, 1, 1]],
      [[[1, 1, 2]], [1, 1, 1]],
      [[[2, 5, 3], [1, 8, 4], [1, 7, 5]], [2, 7, 5]],
      [[[3, 4, 5], [4, 5, 6]], [3, 2, 5]],
      [[[2, 5, 3], [2, 3, 4], [1, 2, 5], [5, 2, 3]], [5, 5, 5]],
      [[[1000, 1, 1], [1, 1000, 1], [1, 1, 1000]], [1000, 1000, 1000]],
      [[[1, 3, 1], [1, 1, 1], [3, 1, 1]], [3, 3, 2]],
    ],
    random: (r) => {
      const n = r.int(1, 15);
      const triplets = Array.from({ length: n }, () => r.ints(3, 1, 8));
      let target = r.ints(3, 1, 8);
      if (r.bool(0.6)) {
        const sub = triplets.filter(() => r.bool());
        if (sub.length) target = [0, 1, 2].map((k) => Math.max(...sub.map((t) => t[k]!)));
      }
      return [triplets, target];
    },
    perf: null,
  },

  "partition-labels": {
    edge: [["a"], ["aaaa"], ["abcdef"], ["abca"], ["zyxzyx"], ["ababcbacadefegdehijhklij"], ["eccbbbbdec"], ["abcdefghijklmnopqrstuvwxyza"]],
    random: (r) => [r.string(r.int(1, 30), r.pick(["ab", "abcd", "abcdefgh", "abcdefghijklmnopqrstuvwxyz"]))],
    perf: null,
  },

  "valid-parenthesis-string": {
    edge: [["*"], ["("], [")"], ["(*))"], ["((*"], ["*)"], [")*("], ["**(("], ["(((((*)))"], ["(".repeat(50) + "*".repeat(50)], ["(".repeat(51) + "*".repeat(49)]],
    random: (r) => [r.string(r.int(1, 30), r.pick(["()*", "(()*)", "()**", "()"]))],
    // 50 stars then 50 unmatched '(': false, and trying all 3 meanings of every star is hopeless
    perf: { input: ["*".repeat(50) + "(".repeat(50)], about: "s of length 100 with 50 '*'" },
    slow: `export function checkValidString(s: string): boolean {
      const go = (i: number, open: number): boolean => {
        if (open < 0) return false;
        if (i === s.length) return open === 0;
        if (s[i] === "(") return go(i + 1, open + 1);
        if (s[i] === ")") return go(i + 1, open - 1);
        return go(i + 1, open + 1) || go(i + 1, open - 1) || go(i + 1, open);
      };
      return go(0, 0);
    }`,
  },

  // intervals are sorted and never share a point
  "insert-interval": {
    edge: [
      [[], [5, 7]],
      [[[1, 5]], [2, 3]],
      [[[1, 5]], [6, 8]],
      [[[1, 5]], [0, 0]],
      [[[1, 5]], [5, 7]],
      [[[3, 5], [12, 15]], [6, 6]],
      [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [0, 100000]],
      [[[0, 0]], [0, 0]],
      [[[1, 2], [5, 6]], [3, 4]],
      [[[1, 2], [99999, 100000]], [100000, 100000]],
    ],
    random: (r) => {
      const intervals = disjointIntervals(r, r.int(0, 15), 100000);
      const top = (intervals.at(-1)?.[1] ?? 20) + 5;
      const s = r.int(0, top), e = s + r.int(0, r.pick([0, 3, 15]));
      return [intervals, [s, e]];
    },
    perf: null,
  },

  "merge-intervals": {
    edge: [
      [[[1, 4]]],
      [[[1, 4], [4, 5]]],
      [[[1, 4], [0, 4]]],
      [[[1, 4], [2, 3]]],
      [[[0, 0], [0, 0]]],
      [[[5, 6], [1, 2], [3, 4]]],
      [[[0, 10000], [5, 5], [10000, 10000]]],
      [[[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]]],
    ],
    random: (r) => {
      const hi = r.pick([10, 30, 10000]);
      return [Array.from({ length: r.int(1, 20) }, () => { const s = r.int(0, hi); return [s, Math.min(hi, s + r.int(0, Math.ceil(hi / 6)))]; })];
    },
    perf: null,
  },

  "non-overlapping-intervals": {
    edge: [
      [[[1, 2]]],
      [[[1, 2], [2, 3]]],
      [[[1, 2], [1, 2], [1, 2]]],
      [[[-50000, 50000], [1, 2], [3, 4]]],
      [[[1, 100], [11, 22], [1, 11], [2, 12]]],
      [[[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]]],
      [[[-3, -1], [-2, 0], [-1, 1]]],
    ],
    random: (r) => {
      const hi = r.pick([10, 30, 50000]), lo = r.pick([0, -hi]);
      return [Array.from({ length: r.int(1, 20) }, () => { const s = r.int(lo, hi - 1); return [s, Math.min(hi, s + r.int(1, Math.ceil((hi - lo) / 5)))]; })];
    },
    perf: { input: [{ intervals: 100000, lo: -50000, hi: 50000, maxLen: 1000, seed: 3 }], about: "100,000 intervals" },
    slow: `export function eraseOverlapIntervals(intervals: number[][]): number {
      const iv = [...intervals].sort((a, b) => a[0] - b[0]);
      const dp = new Array(iv.length).fill(1);
      let best = 0;
      for (let i = 0; i < iv.length; i++) {
        for (let j = 0; j < i; j++) if (iv[j][1] <= iv[i][0] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
        best = Math.max(best, dp[i]);
      }
      return iv.length - best;
    }`,
  },

  "minimum-interval-to-include-each-query": {
    edge: [
      [[[1, 1]], [1]],
      [[[1, 1]], [2]],
      [[[1, 10000000]], [1, 10000000, 5000000]],
      [[[1, 4], [2, 4], [3, 6], [4, 4]], [2, 3, 4, 5]],
      [[[2, 3], [2, 5], [1, 8], [20, 25]], [2, 19, 5, 22]],
      [[[5, 5], [5, 5], [1, 9]], [5, 5, 4, 10]],
      [[[1, 3], [6, 8]], [4, 5, 9, 1]],
    ],
    random: (r) => {
      const hi = r.pick([10, 30, 10000000]);
      const intervals = Array.from({ length: r.int(1, 15) }, () => { const s = r.int(1, hi); return [s, Math.min(hi, s + r.int(0, Math.ceil(hi / 5)))]; });
      return [intervals, r.ints(r.int(1, 15), 1, hi)];
    },
    perf: {
      input: [{ intervals: 100000, lo: 1, hi: 10000000, maxLen: 100000, seed: 4 }, { ints: 100000, lo: 1, hi: 10000000, seed: 6 }],
      about: "100,000 intervals and 100,000 queries",
    },
    slow: `export function minInterval(intervals: number[][], queries: number[]): number[] {
      return queries.map((q) => {
        let best = -1;
        for (const [l, r] of intervals) if (l <= q && q <= r && (best === -1 || r - l + 1 < best)) best = r - l + 1;
        return best;
      });
    }`,
  },

  "spiral-matrix": {
    edge: [
      [[[1]]],
      [[[1, 2, 3, 4]]],
      [[[1], [2], [3], [4]]],
      [[[1, 2], [3, 4]]],
      [[[1, 2, 3], [4, 5, 6]]],
      [[[1, 2], [3, 4], [5, 6]]],
      [[[-100, 100, 0], [7, 8, 9], [1, 2, 3], [4, 5, 6]]],
      [Array.from({ length: 10 }, (_, i) => Array.from({ length: 10 }, (_, j) => i * 10 + j - 50))],
    ],
    random: (r) => { const m = r.int(1, 7), n = r.int(1, 7); return [Array.from({ length: m }, () => r.ints(n, -100, 100))]; },
    perf: null,
  },

  // In place: the mutated matrix is compared
  "set-matrix-zeroes": {
    edge: [
      [[[0]]],
      [[[5]]],
      [[[1, 0]]],
      [[[0], [1]]],
      [[[0, 0], [0, 0]]],
      [[[INT_MIN, INT_MAX], [0, 5]]],
      [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]],
      [[[1, 2, 3], [4, 0, 6], [7, 8, 9], [10, 11, 0]]],
    ],
    random: (r) => {
      const m = r.int(1, 7), n = r.int(1, 7), p = r.pick([0.05, 0.15, 0.3]), big = r.bool(0.3);
      return [Array.from({ length: m }, () => Array.from({ length: n }, () => (r.bool(p) ? 0 : big ? r.int(INT_MIN, INT_MAX) : r.int(-9, 9))))];
    },
    perf: null,
  },

  "happy-number": {
    edge: [[1], [7], [2], [4], [10], [100], [1111111], [INT_MAX]],
    random: (r) => [r.bool() ? r.int(1, 1000) : r.int(1, INT_MAX)],
    perf: null,
  },

  // No leading zeros (a lone [0] is fine)
  "plus-one": {
    edge: [[[0]], [[9]], [[9, 9, 9]], [[1, 0, 0]], [[8, 9, 9]], [[1, 2, 9]], [Array(100).fill(9)], [[1, ...Array(99).fill(0)]]],
    random: (r) => {
      const n = r.int(1, 30);
      const d = digits(r, n).split("").map(Number);
      const nines = r.pick([0, 0, 1, 3, n]);
      for (let i = Math.max(n === 1 ? 0 : 1, n - nines); i < n; i++) d[i] = 9;
      return [d];
    },
    perf: null,
  },

  // -100 < x < 100, |x^n| <= 10^4, and x is not zero unless n > 0
  "powx-n": {
    edge: [
      [2, 10],
      [2.1, 3],
      [2, -2],
      [0, 5],
      [1, INT_MIN],
      [-1, INT_MAX],
      [-1, INT_MIN],
      [2, INT_MIN],
      [0.5, INT_MAX],
      [-2, 13],
      [99.99, 2],
      [-99.5, -1],
      [7, 0],
      [0.5, -13],
    ],
    random: (r) => {
      for (;;) {
        let x: number, n: number;
        if (r.bool(0.3)) {
          // huge |n| whose result is ~0 or exactly ±1
          x = r.pick([1, -1, Math.round(r.int(-99999, 99999)) / 100000, r.int(2, 9999) / 100 * r.pick([1, -1])]);
          const big = r.int(100000, INT_MAX);
          n = Math.abs(x) < 1 ? big : Math.abs(x) > 1 ? -big : r.pick([big, -big]);
        } else {
          x = r.int(-9999, 9999) / r.pick([1, 10, 100, 1000]);
          n = r.int(-12, 12);
        }
        if (!(x > -100 && x < 100)) continue;
        if (x === 0 && n <= 0) continue;
        if (Math.abs(x) ** n > 1e4) continue;
        return [x, n];
      }
    },
    perf: { input: [0.99999, INT_MAX], about: "n = 2,147,483,647" },
    slow: `export function myPow(x: number, n: number): number {
      let out = 1;
      const m = Math.abs(n);
      for (let i = 0; i < m; i++) out *= x;
      return n < 0 ? 1 / out : out;
    }`,
  },

  // No leading zeros except "0" itself
  "multiply-strings": {
    edge: [
      ["0", "0"],
      ["0", "12345"],
      ["98765", "0"],
      ["1", "1"],
      ["9", "9"],
      ["123456789", "987654321"],
      ["9".repeat(200), "9".repeat(200)],
      ["1" + "0".repeat(199), "1"],
    ],
    random: (r) => [r.bool(0.1) ? "0" : digits(r, r.int(1, 30)), digits(r, r.int(1, 30))],
    perf: null,
  },

  "detect-squares": {
    edge: [
      [["DetectSquares", "add", "add", "add", "count", "count", "add", "count"], [[], [[3, 10]], [[11, 2]], [[3, 2]], [[11, 10]], [[14, 8]], [[11, 2]], [[11, 10]]]],
      [["DetectSquares", "count", "add", "count"], [[], [[0, 0]], [[1, 1]], [[0, 0]]]],
      // a query on an existing point must not count zero-area "squares"
      [["DetectSquares", "add", "add", "add", "count", "count"], [[], [[5, 5]], [[5, 5]], [[5, 5]], [[5, 5]], [[6, 6]]]],
      [
        ["DetectSquares", "add", "add", "add", "add", "add", "add", "count", "count", "count"],
        [[], [[0, 0]], [[0, 1000]], [[1000, 0]], [[0, 0]], [[1000, 0]], [[1000, 1000]], [[0, 0]], [[1000, 1000]], [[0, 1000]]],
      ],
      [
        ["DetectSquares", "add", "add", "add", "add", "add", "add", "count", "count"],
        [[], [[1, 1]], [[1, 2]], [[2, 1]], [[1, 0]], [[0, 1]], [[0, 0]], [[2, 2]], [[0, 2]]],
      ],
    ],
    random: (r) => {
      const ops = ["DetectSquares"], args: number[][][] = [[]];
      const step = r.pick([1, 3, 250]);
      const pt = () => [r.int(0, 4) * step, r.int(0, 4) * step];
      for (let i = 0; i < 30; i++) {
        const op = r.bool(0.65) ? "add" : "count";
        ops.push(op);
        args.push([pt()]);
      }
      return [ops, args];
    },
    perf: null,
  },

  // Every value appears exactly twice except one
  "single-number": {
    edge: [[[1]], [[-30000]], [[30000, -30000, 30000]], [[0, 1, 0]], [[-1, -1, -2]], [[4, 1, 2, 1, 2]], [[7, 7, 3, 3, 0]]],
    random: (r) => {
      const k = r.int(0, 14);
      const vals = r.distinct(k + 1, r.pick([-30000, -20]), r.pick([20, 30000]));
      return [r.shuffle([...vals.slice(1), ...vals])];
    },
    perf: {
      input: [{ concat: [{ shuffle: { concat: [{ range: [1, 15000] }, { range: [1, 15000] }] }, seed: 2 }, [-30000]] }],
      about: "nums of length 29,999",
    },
  },

  "number-of-1-bits": {
    edge: [[1], [2], [11], [128], [INT_MAX], [1073741824], [2147483645], [1431655765]],
    random: (r) => [r.bool() ? r.int(1, 1000) : r.int(1, INT_MAX)],
    perf: null,
  },

  "counting-bits": {
    edge: [[0], [1], [2], [5], [16], [31], [64]],
    random: (r) => [r.int(0, 30)],
    perf: null,
  },

  // 0 <= n <= 2^31 - 2 and n is even
  "reverse-bits": {
    edge: [[0], [2], [43261596], [2147483644], [2147483646], [1073741824], [1431655764], [65536]],
    random: (r) => [r.int(0, 1073741823) * 2],
    perf: null,
  },

  // n distinct numbers from 0..n
  "missing-number": {
    edge: [[[0]], [[1]], [[0, 1]], [[1, 2]], [[2, 0]], [[3, 0, 1]], [[9, 6, 4, 2, 3, 5, 7, 0, 1]], [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]],
    random: (r) => {
      const n = r.int(1, 30), gone = r.int(0, n);
      return [r.shuffle(Array.from({ length: n + 1 }, (_, i) => i).filter((v) => v !== gone))];
    },
    perf: null,
  },

  "sum-of-two-integers": {
    edge: [[0, 0], [1, 2], [-1, 1], [-1000, -1000], [1000, 1000], [-1000, 1000], [1000, -1], [-5, 3], [-1, -1]],
    random: (r) => [r.int(-1000, 1000), r.int(-1000, 1000)],
    perf: null,
  },

  // x is a 32-bit int; answer is 0 when the reversal overflows
  "reverse-integer": {
    edge: [[0], [123], [-123], [120], [-10], [INT_MAX], [INT_MIN], [1534236469], [1463847412], [-1463847412], [1563847412], [-2147483412], [1000000003]],
    random: (r) => [r.pick([() => r.int(-1000, 1000), () => r.int(INT_MIN, INT_MAX), () => r.int(1000000000, INT_MAX) * r.pick([1, -1])])()],
    perf: null,
  },
});
