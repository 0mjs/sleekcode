// Dynamic programming (1-D and 2-D). Speed checks pair the intended DP with the classic exponential
// brute force (plain recursion without memo) as the `slow` solution.
import { defineSpecs, type Rng } from "../lib";

const I32 = 2n ** 31n - 1n;

/** Retry a generator until its input passes a validity check (e.g. "the answer fits in 32 bits") */
const until = <T>(make: () => T, ok: (x: T) => boolean): T => {
  for (;;) { const x = make(); if (ok(x)) return x; }
};

// Validity checks only (never used as expected outputs): counts that the statement promises fit in 32 bits
const decodeCount = (s: string) => {
  let [a, b] = [1n, 0n]; // ways for s[i+1:], s[i+2:]
  for (let i = s.length - 1; i >= 0; i--) {
    const cur = s[i] === "0" ? 0n : a + (i + 1 < s.length && +s.slice(i, i + 2) <= 26 ? b : 0n);
    [a, b] = [cur, a];
  }
  return a;
};
const changeCount = (amount: number, coins: number[]) => {
  const d = Array<bigint>(amount + 1).fill(0n);
  d[0] = 1n;
  for (const c of coins) for (let a = c; a <= amount; a++) d[a]! += d[a - c]!;
  return d[amount]!;
};
const distinctCount = (s: string, t: string) => {
  const d = Array<bigint>(t.length + 1).fill(0n);
  d[0] = 1n;
  for (const ch of s) for (let j = t.length; j >= 1; j--) if (t[j - 1] === ch) d[j]! += d[j - 1]!;
  return d[t.length]!;
};
const binom = (n: number, k: number) => {
  let r = 1n;
  for (let i = 1; i <= k; i++) r = (r * BigInt(n - k + i)) / BigInt(i);
  return r;
};
/** Every subarray product fits in 32 bits ⇔ every zero-free run's |product| does */
const productsFit = (nums: number[]) => {
  let p = 1n;
  for (const x of nums) {
    if (x === 0) { p = 1n; continue; }
    p *= BigInt(Math.abs(x));
    if (p > I32) return false;
  }
  return true;
};

/** A random interleaving of a and b */
const interleave = (r: Rng, a: string, b: string) => {
  let i = 0, j = 0, out = "";
  while (i < a.length || j < b.length) out += j >= b.length || (i < a.length && r.bool()) ? a[i++] : b[j++];
  return out;
};

/** A valid regex pattern (every '*' follows a letter or '.') of at most maxLen chars */
const pattern = (r: Rng, maxLen: number, alphabet: string) => {
  let p = "";
  const target = r.int(1, maxLen);
  while (p.length < target) {
    const c = r.bool(0.2) ? "." : r.pick([...alphabet]);
    if (p.length + 2 <= maxLen && r.bool(0.4)) p += c + "*";
    else p += c;
  }
  return p;
};
/** A pattern derived from s, so it usually matches (maybe with a tweak) */
const patternFor = (r: Rng, s: string) => {
  let p = "", i = 0;
  while (i < s.length) {
    const c = s[i]!;
    let j = i;
    while (j < s.length && s[j] === c) j++;
    const tok = r.bool(0.2) ? "." : c;
    if (j - i > 1 || r.bool(0.3)) { p += tok + "*"; if (r.bool(0.3)) p += c; }
    else p += tok;
    if (r.bool(0.15)) p += r.pick(["a", "b", "."]) + "*";
    i = j;
  }
  if (r.bool(0.25)) p = p.slice(0, -1) + (p.endsWith("*") ? "" : r.pick(["a", "b", "."]));
  p = p.replace(/^\*+/, "").replace(/\*\*+/g, "*");
  return p.slice(0, 20).replace(/^\*/, "") || "a";
};

export const specs = defineSpecs({
  "climbing-stairs": {
    edge: [[1], [4], [5], [10], [30], [44], [45]],
    random: (r) => [r.int(1, 45)],
    perf: { input: [45], about: "n = 45 (the maximum)" },
    slow: `export function climbStairs(n: number): number { return n <= 2 ? n : climbStairs(n - 1) + climbStairs(n - 2); }`,
  },

  "min-cost-climbing-stairs": {
    edge: [[[0, 0]], [[999, 999]], [[0, 999]], [[999, 0]], [[5, 5, 5, 5, 5]], [[0, 999, 0, 999, 0]], [[999, 0, 999, 0, 999, 0]], [[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]]],
    random: (r) => [r.ints(r.int(2, 30), 0, r.pick([9, 100, 999]))],
    perf: { input: [{ ints: 1000, lo: 0, hi: 999, seed: 7 }], about: "cost of length 1,000" },
    slow: `export function minCostClimbingStairs(cost: number[]): number {
      const go = (i: number): number => i >= cost.length ? 0 : cost[i] + Math.min(go(i + 1), go(i + 2));
      return Math.min(go(0), go(1));
    }`,
  },

  "house-robber": {
    edge: [[[0]], [[400]], [[1, 2]], [[2, 1]], [[0, 0, 0]], [[400, 0, 0, 400]], [[2, 1, 1, 2]], [[1, 3, 1, 3, 100]]],
    random: (r) => [r.ints(r.int(1, 30), 0, r.pick([10, 400]))],
    perf: { input: [{ ints: 100, lo: 0, hi: 400, seed: 3 }], about: "nums of length 100 (the maximum)" },
    slow: `export function rob(nums: number[]): number {
      const go = (i: number): number => i >= nums.length ? 0 : Math.max(nums[i] + go(i + 2), go(i + 1));
      return go(0);
    }`,
  },

  "house-robber-ii": {
    edge: [[[5]], [[0]], [[1, 2]], [[1000, 1000]], [[1, 3, 1]], [[2, 1, 1, 2]], [[0, 0, 0, 0]], [[200, 3, 140, 20, 10]], [[1, 2, 1, 1]]],
    random: (r) => [r.ints(r.int(1, 30), 0, r.pick([10, 1000]))],
    perf: { input: [{ ints: 100, lo: 0, hi: 1000, seed: 3 }], about: "nums of length 100 (the maximum)" },
    slow: `export function rob(nums: number[]): number {
      if (nums.length === 1) return nums[0];
      const line = (a: number[]) => { const go = (i: number): number => i >= a.length ? 0 : Math.max(a[i] + go(i + 2), go(i + 1)); return go(0); };
      return Math.max(line(nums.slice(1)), line(nums.slice(0, -1)));
    }`,
  },

  // compare is validator:longestPalindrome, so any longest palindrome is accepted
  "longest-palindromic-substring": {
    edge: [["a"], ["ab"], ["aa"], ["Aa"], ["abcba"], ["abccba"], ["racecar1"], ["aaaaa"], ["9z9"], ["abcde"], ["xabbay"]],
    random: (r) => [r.string(r.int(1, 30), r.pick(["ab", "abc", "aA1", "abcdefghijklmnopqrstuvwxyz0123456789"]))],
    perf: { input: [{ text: "a", n: 1000 }], about: 'a string of 1,000 "a"s' },
    slow: `export function longestPalindrome(s: string): string {
      let best = "";
      for (let i = 0; i < s.length; i++) for (let j = i + 1; j <= s.length; j++) {
        const sub = s.slice(i, j);
        if (sub === [...sub].reverse().join("") && sub.length > best.length) best = sub;
      }
      return best;
    }`,
  },

  "palindromic-substrings": {
    edge: [["a"], ["ab"], ["aa"], ["aaaa"], ["abcba"], ["abba"], ["abcd"], ["zzazz"]],
    random: (r) => [r.string(r.int(1, 30), r.pick(["ab", "abc", "abcdefghijklmnopqrstuvwxyz"]))],
    perf: { input: [{ text: "a", n: 1000 }], about: 'a string of 1,000 "a"s' },
    slow: `export function countSubstrings(s: string): number {
      let count = 0;
      for (let i = 0; i < s.length; i++) for (let j = i + 1; j <= s.length; j++) {
        const sub = s.slice(i, j);
        if (sub === [...sub].reverse().join("")) count++;
      }
      return count;
    }`,
  },

  // The answer must fit in 32 bits
  "decode-ways": {
    edge: [["0"], ["1"], ["10"], ["27"], ["100"], ["101"], ["230"], ["2101"], ["1201234"], ["11106"], ["301"], ["2611055971756562"], ["1".repeat(44) + "9".repeat(56)]],
    random: (r) =>
      [until(() => {
        if (r.bool(0.3)) return r.string(r.int(1, 30), "0123456789");
        let s = "";
        const len = r.int(1, 30);
        while (s.length < len) s += r.pick(["1", "2", "1", "2", "10", "20", "26", "27", "3", "7", "9", "0"]);
        return s.slice(0, len);
      }, (s) => decodeCount(s) <= I32)],
    perf: { input: ["1".repeat(44) + "9".repeat(56)], about: "a 100-digit string with 1,836,311,903 decodings" },
    slow: `export function numDecodings(s: string): number {
      const go = (i: number): number => {
        if (i === s.length) return 1;
        if (s[i] === "0") return 0;
        return go(i + 1) + (i + 1 < s.length && +s.slice(i, i + 2) <= 26 ? go(i + 2) : 0);
      };
      return go(0);
    }`,
  },

  "coin-change": {
    edge: [[[1], 0], [[2], 1], [[1], 10000], [[2147483647], 2], [[186, 419, 83, 408], 6249], [[3, 7], 5], [[5, 3], 7], [[2, 5, 10, 1], 27], [[1, 2147483647], 2]],
    random: (r) => [r.ints(r.int(1, 6), 1, r.pick([10, 50])), r.int(0, 200)],
    perf: { input: [[7, 13, 29, 41, 53, 97, 101, 211, 307, 409, 503, 997], 10000], about: "12 coins, amount 10,000" },
    slow: `export function coinChange(coins: number[], amount: number): number {
      const go = (a: number): number => {
        if (a === 0) return 0;
        let best = Infinity;
        for (const c of coins) if (c <= a) best = Math.min(best, 1 + go(a - c));
        return best;
      };
      const r = go(amount);
      return r === Infinity ? -1 : r;
    }`,
  },

  // Every subarray product fits in 32 bits. The O(n²) brute force is fast enough at n = 20,000, so no speed check.
  "maximum-product-subarray": {
    edge: [[[-2]], [[0]], [[10]], [[-10]], [[-2, 0, -1]], [[-2, 3, -4]], [[0, 2]], [[-1, -1]], [[2, -5, -2, -4, 3]], [[-10, -10, -10, 0, 9]], [[0, 0, 0]], [[3, -1, 4]]],
    random: (r) => [until(() => r.ints(r.int(1, 30), -10, 10).map((x) => (Math.abs(x) > 3 && r.bool(0.6) ? Math.sign(x) * r.int(1, 2) : x)), productsFit)],
    perf: null,
  },

  "word-break": {
    edge: [
      ["a", ["a"]],
      ["a", ["b"]],
      ["aaaaaaa", ["aaaa", "aaa"]],
      ["cars", ["car", "ca", "rs"]],
      ["ab", ["a", "b", "ab"]],
      ["aaaaaaab", ["a", "aa", "aaa"]],
      ["bb", ["a", "b", "bbb", "bbbb"]],
      ["goalspecial", ["go", "goal", "goals", "special"]],
    ],
    random: (r) => {
      const alphabet = r.pick(["ab", "abc"]);
      const words = [...new Set(Array.from({ length: r.int(1, 8) }, () => r.string(r.int(1, 4), alphabet)))];
      let s = "";
      const len = r.int(1, 30);
      while (s.length < len) s += r.pick(words);
      s = s.slice(0, Math.max(len, 1));
      if (r.bool(0.3)) { const i = r.int(0, s.length - 1); s = s.slice(0, i) + r.pick([...alphabet]) + s.slice(i + 1); }
      return [s, r.shuffle(words)];
    },
    perf: {
      input: ["a".repeat(299) + "b", Array.from({ length: 20 }, (_, i) => "a".repeat(i + 1))],
      about: '"aaa…ab" (300 letters) with words "a" … "aaaaaaaaaaaaaaaaaaaa"',
    },
    slow: `export function wordBreak(s: string, wordDict: string[]): boolean {
      const go = (i: number): boolean => i === s.length || wordDict.some((w) => s.startsWith(w, i) && go(i + w.length));
      return go(0);
    }`,
  },

  "longest-increasing-subsequence": {
    edge: [[[1]], [[1, 2]], [[2, 1]], [[5, 5, 5]], [[-10000, 10000]], [[1, 3, 6, 7, 9, 4, 10, 5, 6]], [[4, 10, 4, 3, 8, 9]], [[3, 2, 1]], [[1, 2, 3, 4, 5, 6]]],
    random: (r) => [r.ints(r.int(1, 30), r.pick([-10000, 0]), r.pick([10, 10000]))],
    perf: { input: [{ ints: 2500, lo: -10000, hi: 10000, seed: 5 }], about: "nums of length 2,500 (the maximum)" },
    slow: `export function lengthOfLIS(nums: number[]): number {
      const go = (i: number, prev: number): number => {
        if (i === nums.length) return 0;
        let best = go(i + 1, prev);
        if (prev < 0 || nums[i] > nums[prev]) best = Math.max(best, 1 + go(i + 1, i));
        return best;
      };
      return go(0, -1);
    }`,
  },

  "partition-equal-subset-sum": {
    edge: [[[1]], [[2, 2]], [[1, 2]], [[100, 100]], [[1, 1, 1, 1]], [[3, 3, 3, 4, 5]], [[2, 2, 3, 5]], [[1, 2, 5]], [[100]], [[1, 1, 2, 2, 100]]],
    random: (r) => [r.ints(r.int(1, 30), 1, r.pick([10, 100]))],
    perf: { input: [{ concat: [{ repeat: 100, n: 199 }, [2]] }], about: "200 numbers that can't be split evenly" },
    slow: `export function canPartition(nums: number[]): boolean {
      const total = nums.reduce((a, b) => a + b, 0);
      if (total % 2) return false;
      const go = (i: number, left: number): boolean => left === 0 || (i < nums.length && left > 0 && (go(i + 1, left - nums[i]) || go(i + 1, left)));
      return go(0, total / 2);
    }`,
  },

  // The answer is at most 2·10⁹
  "unique-paths": {
    edge: [[1, 1], [1, 100], [100, 1], [2, 2], [100, 7], [7, 100], [18, 17], [10, 10], [2, 100]],
    random: (r) => until(() => [r.int(1, r.pick([10, 100])), r.int(1, r.pick([10, 100]))], ([m, n]) => binom(m! + n! - 2, m! - 1) <= 2_000_000_000n),
    perf: { input: [18, 17], about: "m = 18, n = 17 (1,166,803,110 paths)" },
    slow: `export function uniquePaths(m: number, n: number): number { return m === 1 || n === 1 ? 1 : uniquePaths(m - 1, n) + uniquePaths(m, n - 1); }`,
  },

  "longest-common-subsequence": {
    edge: [["a", "a"], ["a", "b"], ["abc", "cba"], ["aaaa", "aa"], ["bl", "yby"], ["abcdef", "fedcba"], ["ezupkr", "ubmrapg"], ["oxcpqrsvwf", "shmtulqrypy"]],
    random: (r) => { const a = r.pick(["ab", "abc", "abcdef"]); return [r.string(r.int(1, 25), a), r.string(r.int(1, 25), a)]; },
    perf: {
      input: [{ string: 1000, alphabet: "abcd", seed: 1 }, { string: 1000, alphabet: "abcd", seed: 2 }],
      about: "two strings of length 1,000",
    },
    slow: `export function longestCommonSubsequence(a: string, b: string): number {
      const go = (i: number, j: number): number =>
        i === a.length || j === b.length ? 0 : a[i] === b[j] ? 1 + go(i + 1, j + 1) : Math.max(go(i + 1, j), go(i, j + 1));
      return go(0, 0);
    }`,
  },

  "best-time-to-buy-and-sell-stock-with-cooldown": {
    edge: [[[1]], [[1, 2]], [[2, 1]], [[5, 5, 5]], [[1, 2, 4]], [[0, 1000]], [[1000, 0, 1000]], [[6, 1, 6, 4, 3, 0, 2]], [[1, 4, 2, 7]], [[5, 4, 3, 2, 1]]],
    random: (r) => [r.ints(r.int(1, 30), 0, r.pick([10, 1000]))],
    perf: { input: [{ ints: 5000, lo: 0, hi: 1000, seed: 9 }], about: "prices of length 5,000 (the maximum)" },
    slow: `export function maxProfit(prices: number[]): number {
      const go = (i: number, holding: boolean): number => {
        if (i >= prices.length) return 0;
        const wait = go(i + 1, holding);
        return holding ? Math.max(wait, prices[i] + go(i + 2, false)) : Math.max(wait, go(i + 1, true) - prices[i]);
      };
      return go(0, false);
    }`,
  },

  // Coins are distinct; the answer fits in 32 bits
  "coin-change-ii": {
    edge: [[0, [1]], [0, [7]], [1, [2]], [5000, [5000]], [100, [1, 2]], [7, [2, 4]], [500, [3, 5, 7, 8, 9, 10, 11]], [5000, [1, 5000]]],
    random: (r) =>
      until(() => [r.int(0, 300), r.distinct(r.int(1, 8), 1, r.pick([20, 100]))] as [number, number[]], ([a, c]) => changeCount(a, c) <= I32),
    perf: { input: [5000, { distinct: 300, lo: 200, hi: 5000, seed: 1 }], about: "300 coins, amount 5,000 (946,163,539 ways)" },
    slow: `export function change(amount: number, coins: number[]): number {
      const go = (i: number, left: number): number => {
        if (left === 0) return 1;
        if (i === coins.length) return 0;
        return go(i + 1, left) + (coins[i] <= left ? go(i, left - coins[i]) : 0);
      };
      return go(0, amount);
    }`,
  },

  // n ≤ 20: the 2ⁿ brute force is fine on LeetCode too, so no speed check
  "target-sum": {
    edge: [[[0], 0], [[0], 1], [[0, 0, 0], 0], [[1000], -1000], [[1000], 1000], [[1, 2, 3], 7], [[1, 0], 1], [[1, 1, 1, 1, 1], -3], [[7, 9, 3, 8, 0, 2, 4, 8, 3, 9], 0]],
    random: (r) => {
      const nums = r.ints(r.int(1, 20), 0, r.pick([1, 5, 50]));
      const sum = nums.reduce((a, b) => a + b, 0);
      return [nums, Math.max(-1000, Math.min(1000, r.int(-sum - 2, sum + 2)))];
    },
    perf: null,
  },

  "interleaving-string": {
    edge: [["a", "", "a"], ["", "b", "b"], ["a", "b", "ab"], ["a", "b", "ba"], ["a", "b", "aa"], ["a", "b", "abc"], ["", "", "a"], ["ab", "", "ba"], ["aa", "ab", "aaba"], ["abc", "abc", "aabbcc"]],
    random: (r) => {
      const a = r.pick(["ab", "abc"]);
      const s1 = r.string(r.int(0, 15), a), s2 = r.string(r.int(0, 15), a);
      let s3 = interleave(r, s1, s2);
      if (s3.length >= 2 && r.bool(0.5)) {
        const i = r.int(0, s3.length - 1);
        s3 = r.bool() ? s3.slice(0, i) + r.pick([...a]) + s3.slice(i + 1) : s3.slice(0, i) + s3.slice(i + 1) + s3[i];
      }
      return [s1, s2, s3];
    },
    perf: { input: ["a".repeat(100), "a".repeat(100), "a".repeat(199) + "b"], about: 's1, s2 of length 100, s3 of length 200 ("aaa…ab")' },
    slow: `export function isInterleave(s1: string, s2: string, s3: string): boolean {
      if (s1.length + s2.length !== s3.length) return false;
      const go = (i: number, j: number): boolean =>
        i + j === s3.length || (i < s1.length && s1[i] === s3[i + j] && go(i + 1, j)) || (j < s2.length && s2[j] === s3[i + j] && go(i, j + 1));
      return go(0, 0);
    }`,
  },

  "longest-increasing-path-in-a-matrix": {
    edge: [[[[1]]], [[[1, 1], [1, 1]]], [[[1, 2], [4, 3]]], [[[2147483647, 0]]], [[[1, 2, 3, 4, 5]]], [[[5], [4], [3]]], [[[7, 8, 9], [9, 7, 6], [7, 2, 3]]], [[[0, 1, 2], [5, 4, 3], [6, 7, 8]]]],
    random: (r) => {
      const [m, n, hi] = [r.int(1, 6), r.int(1, 6), r.pick([2, 9, 2147483647])];
      return [Array.from({ length: m }, () => r.ints(n, 0, hi))];
    },
    // value 7i + 3j: every right/down step increases, so there are astronomically many increasing paths (longest: 399)
    perf: { input: [{ list: Array.from({ length: 200 }, (_, i) => ({ range: [7 * i, 7 * i + 600, 3] })) }], about: "a 200×200 matrix" },
    slow: `export function longestIncreasingPath(matrix: number[][]): number {
      const m = matrix.length, n = matrix[0].length;
      const go = (i: number, j: number): number => {
        let best = 1;
        for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const [a, b] = [i + di, j + dj];
          if (a >= 0 && a < m && b >= 0 && b < n && matrix[a][b] > matrix[i][j]) best = Math.max(best, 1 + go(a, b));
        }
        return best;
      };
      let best = 0;
      for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) best = Math.max(best, go(i, j));
      return best;
    }`,
  },

  // The answer fits in 32 bits
  "distinct-subsequences": {
    edge: [["a", "a"], ["a", "b"], ["a", "aa"], ["aaa", "a"], ["aaaa", "aa"], ["AbAb", "Ab"], ["abc", "abc"], ["aAaA", "aa"], ["a".repeat(1000), "a".repeat(997)]],
    random: (r) =>
      until(() => { const a = r.pick(["ab", "abc", "aA"]); return [r.string(r.int(1, 30), a), r.string(r.int(1, 6), a)]; }, ([s, t]) => distinctCount(s!, t!) <= I32),
    perf: { input: [{ text: "a", n: 1000 }, { text: "a", n: 997 }], about: 's of 1,000 "a"s, t of 997 "a"s (166,167,000 ways)' },
    slow: `export function numDistinct(s: string, t: string): number {
      const go = (i: number, j: number): number => j === t.length ? 1 : i === s.length ? 0 : go(i + 1, j) + (s[i] === t[j] ? go(i + 1, j + 1) : 0);
      return go(0, 0);
    }`,
  },

  "edit-distance": {
    edge: [["", ""], ["", "abc"], ["abc", ""], ["a", "a"], ["a", "b"], ["ab", "ba"], ["sea", "eat"], ["kitten", "sitting"], ["aaaa", "a"], ["zoologicoarchaeologist", "zoogeologist"]],
    random: (r) => { const a = r.pick(["ab", "abc", "abcdefghij"]); return [r.string(r.int(0, 20), a), r.string(r.int(0, 20), a)]; },
    perf: { input: [{ string: 500, alphabet: "abcd", seed: 1 }, { string: 500, alphabet: "abcd", seed: 2 }], about: "two words of length 500 (the maximum)" },
    slow: `export function minDistance(a: string, b: string): number {
      const go = (i: number, j: number): number => {
        if (i === a.length) return b.length - j;
        if (j === b.length) return a.length - i;
        if (a[i] === b[j]) return go(i + 1, j + 1);
        return 1 + Math.min(go(i + 1, j), go(i, j + 1), go(i + 1, j + 1));
      };
      return go(0, 0);
    }`,
  },

  "burst-balloons": {
    edge: [[[0]], [[5]], [[100]], [[0, 0, 0]], [[100, 100, 100]], [[7, 9, 8, 0, 7, 1, 3, 5, 5, 2]], [[1, 2, 3, 4, 5]], [[9, 0, 9]]],
    random: (r) => [r.ints(r.int(1, 12), 0, r.pick([10, 100]))],
    perf: { input: [{ ints: 300, lo: 0, hi: 100, seed: 4 }], about: "nums of length 300 (the maximum)" },
    slow: `export function maxCoins(nums: number[]): number {
      const go = (a: number[]): number => {
        let best = 0;
        for (let i = 0; i < a.length; i++) {
          const gain = (a[i - 1] ?? 1) * a[i] * (a[i + 1] ?? 1);
          best = Math.max(best, gain + go([...a.slice(0, i), ...a.slice(i + 1)]));
        }
        return best;
      };
      return go(nums);
    }`,
  },

  // |s|, |p| ≤ 20: plain backtracking is fine on LeetCode too, so no speed check
  "regular-expression-matching": {
    edge: [
      ["a", "a"], ["a", "."], ["a", "b*a"], ["aab", "c*a*b"], ["mississippi", "mis*is*p*."], ["ab", ".*c"], ["aaa", "a*a"], ["aaa", "ab*a*c*a"],
      ["a", ".*..a*"], ["aaaaaaaaaaaaaaaaaaab", "a*a*a*a*a*a*a*a*a*c"], ["ab", ".*"], ["a", "ab*"], ["bbbba", ".*a*a"], ["abcd", "d*"],
    ],
    random: (r) => {
      const s = r.string(r.int(1, 20), r.pick(["ab", "abc"]));
      return [s, r.bool(0.6) ? patternFor(r, s) : pattern(r, 20, "abc")];
    },
    count: 14,
    perf: null,
  },
});
