// Arrays & Hashing, Two Pointers, Sliding Window and Stack problems.
import { defineSpecs, type Rng } from "../lib";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** All windows of s of minimal length that contain t (with multiplicity); [] when none */
function minWindows(s: string, t: string): string[] {
  const need: Record<string, number> = {};
  for (const c of t) need[c] = (need[c] ?? 0) + 1;
  let best = Infinity;
  const found: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const have: Record<string, number> = {};
    let missing = t.length;
    for (let j = i; j < s.length; j++) {
      const c = s[j]!;
      have[c] = (have[c] ?? 0) + 1;
      if (have[c]! <= (need[c] ?? 0)) missing--;
      if (missing === 0) {
        const len = j - i + 1;
        if (len < best) { best = len; found.length = 0; }
        if (len === best) found.push(s.slice(i, j + 1));
        break;
      }
    }
  }
  return found;
}
/** Minimum Window Substring promises a unique answer: no window, or exactly one window of minimal length */
const uniqueMinWindow = (s: string, t: string) => minWindows(s, t).length <= 1;

/** A random valid RPN expression (no division by zero, every intermediate value fits in 32 bits) */
function rpn(r: Rng, leaves: number): string[] {
  for (;;) {
    const build = (n: number): { tokens: string[]; value: number } => {
      if (n === 1) { const v = r.int(-200, 200); return { tokens: [String(v)], value: v }; }
      const left = r.int(1, n - 1);
      const a = build(left), b = build(n - left);
      let op = r.pick(["+", "-", "*", "/"]);
      if (op === "/" && b.value === 0) op = "+";
      const value = op === "+" ? a.value + b.value : op === "-" ? a.value - b.value : op === "*" ? a.value * b.value : Math.trunc(a.value / b.value);
      return { tokens: [...a.tokens, ...b.tokens, op], value };
    };
    const ok = (tokens: string[]) => {
      const st: number[] = [];
      for (const tk of tokens) {
        if (!"+-*/".includes(tk) || tk.length > 1) { st.push(+tk); continue; }
        const b = st.pop()!, a = st.pop()!;
        if (tk === "/" && b === 0) return false;
        const v = tk === "+" ? a + b : tk === "-" ? a - b : tk === "*" ? a * b : Math.trunc(a / b);
        if (v > 2 ** 31 - 1 || v < -(2 ** 31)) return false;
        st.push(v);
      }
      return true;
    };
    const { tokens } = build(leaves);
    if (ok(tokens)) return tokens;
  }
}

/** A solved sudoku (a shifted pattern with relabelled digits, shuffled rows/columns within bands) */
function solvedSudoku(r: Rng): string[][] {
  const digits = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const order = () => r.shuffle([0, 1, 2]).flatMap((b) => r.shuffle([0, 1, 2]).map((x) => b * 3 + x));
  const rows = order(), cols = order();
  return rows.map((rr) => cols.map((cc) => String(digits[(rr * 3 + Math.floor(rr / 3) + cc) % 9])));
}

export const specs = defineSpecs({
  "contains-duplicate": {
    edge: [[[1]], [[7, 7]], [[-1000000000, 1000000000]], [[1000000000, -5, 1000000000]], [[5, 1, 2, 3, 4, 5]], [[1, 2, 3, 4, 4]], [[0, -1, 1, -2, 2]]],
    random: (r, i) => {
      const n = r.int(1, 25);
      const nums = i % 3 === 0 ? r.distinct(n, -1000000000, 1000000000) : r.distinct(n, -30, 30);
      if (n > 1 && i % 2 === 0) nums[r.int(0, n - 1)] = nums[r.int(0, n - 1)]!; // maybe plant a duplicate
      return [nums];
    },
    perf: { input: [{ distinct: 100000, lo: -1000000000, hi: 1000000000, seed: 1 }], about: "nums of length 100,000, all different" },
    slow: `export function containsDuplicate(nums: number[]) {
      for (let i = 0; i < nums.length; i++) for (let j = i + 1; j < nums.length; j++) if (nums[i] === nums[j]) return true;
      return false;
    }`,
  },

  "group-anagrams": {
    edge: [[[""]], [["a"]], [["", ""]], [["", "b", ""]], [["a", "a", "a"]], [["abc", "bca", "cab", "xyz", "zyx", "q"]], [["ab", "ba", "aab", "aba", "baa", "abb"]]],
    random: (r) => {
      const n = r.int(1, 20);
      return [Array.from({ length: n }, () => r.string(r.int(0, 4), "abc"))];
    },
    perf: { input: [{ words: 10000, min: 1, max: 100, alphabet: "abcde", seed: 1 }], about: "10,000 words of up to 100 letters" },
    slow: `export function groupAnagrams(strs: string[]) {
      const groups: string[][] = [];
      const isAnagram = (a: string, b: string) => a.length === b.length && [...a].sort().join("") === [...b].sort().join("");
      for (const s of strs) {
        const g = groups.find((g) => isAnagram(g[0], s));
        if (g) g.push(s); else groups.push([s]);
      }
      return groups;
    }`,
  },

  // The answer is guaranteed unique: the k-th and (k+1)-th largest frequencies always differ
  "top-k-frequent-elements": {
    edge: [[[1], 1], [[1, 2], 2], [[-1, -1, 5], 1], [[4, 4, 4, -3, -3, 7], 2], [[4, 4, 4, -3, -3, 7], 3], [[10000, -10000, -10000], 1], [[3, 0, 1, 0, 1, 0], 1]],
    random: (r) => {
      const m = r.int(1, 8);
      const vals = r.distinct(m, -10000, 10000);
      const counts = vals.map(() => r.int(1, 5)).sort((a, b) => b - a);
      const ks = [...Array(m).keys()].map((i) => i + 1).filter((k) => k === m || counts[k - 1]! > counts[k]!);
      const nums = r.shuffle(vals.flatMap((v, i) => Array(counts[i]!).fill(v)));
      return [nums, r.pick(ks)];
    },
    // -10000..10000 four times each, 0..1999 five more times: the top 2,000 are 0..1999
    perf: {
      input: [{ shuffle: { concat: [{ range: [-10000, 10001] }, { range: [-10000, 10001] }, { range: [-10000, 10001] }, { range: [-10000, 10001] }, { range: [0, 2000] }, { range: [0, 2000] }, { range: [0, 2000] }, { range: [0, 2000] }, { range: [0, 2000] }] }, seed: 1 }, 2000],
      about: "nums of length 90,004 with 20,001 different values, k = 2,000",
    },
    slow: `export function topKFrequent(nums: number[], k: number) {
      const uniq = [...new Set(nums)];
      const count = (v: number) => { let c = 0; for (const x of nums) if (x === v) c++; return c; };
      return uniq.map((v) => [v, count(v)]).sort((a, b) => b[1] - a[1]).slice(0, k).map((p) => p[0]);
    }`,
  },

  // Every answer[i] must fit in 32 bits
  "product-of-array-except-self": {
    edge: [[[1, 2]], [[0, 0]], [[0, 5]], [[-30, 30]], [[2, 0, 3, 0]], [[-1, -1, -1, -1]], [[1, 2, 3, 0, 4]], [[30, 30, 30, 30, 30, 30]]],
    random: (r, i) => {
      for (;;) {
        const n = r.int(2, 15);
        const nums = Array.from({ length: n }, () => (r.bool(0.2) ? r.int(-30, 30) : r.int(-3, 3)));
        if (i % 3 !== 0) for (let j = 0; j < n; j++) if (nums[j] === 0) nums[j] = r.pick([1, -1, 2]);
        const ok = nums.every((_, j) => { const p = nums.reduce((acc, x, k) => (k === j ? acc : acc * x), 1); return Math.abs(p) <= 2 ** 31 - 1; });
        if (ok) return [nums];
      }
    },
    perf: { input: [{ shuffle: { concat: [{ repeat: 1, n: 50000 }, { repeat: -1, n: 49980 }, { repeat: 2, n: 20 }] }, seed: 1 }], about: "nums of length 100,000" },
    slow: `export function productExceptSelf(nums: number[]) {
      return nums.map((_, i) => { let p = 1; for (let j = 0; j < nums.length; j++) if (j !== i) p *= nums[j]; return p; });
    }`,
  },

  "valid-sudoku": {
    edge: (() => {
      const empty = () => Array.from({ length: 9 }, () => Array(9).fill("."));
      const one = empty(); one[4]![4] = "5";
      const row = empty(); row[0]![0] = "3"; row[0]![8] = "3";
      const col = empty(); col[0]![2] = "7"; col[8]![2] = "7";
      const box = empty(); box[6]![6] = "9"; box[8]![8] = "9"; // same box, different row and column
      const fine = empty(); fine[0]![0] = "1"; fine[1]![3] = "1"; fine[2]![6] = "1"; fine[3]![1] = "1";
      const full = [
        "534678912", "672195348", "198342567", "859761423", "426853791", "713924856", "961537284", "287419635", "345286179",
      ].map((s) => [...s]);
      const fullBad = full.map((r) => r.slice()); fullBad[8]![8] = "8";
      return [[empty()], [one], [row], [col], [box], [fine], [full], [fullBad]];
    })(),
    random: (r, i) => {
      const board = solvedSudoku(r).map((row) => row.map((c) => (r.bool(0.55) ? "." : c)));
      if (i % 2 === 0) { board[r.int(0, 8)]![r.int(0, 8)] = String(r.int(1, 9)); } // may or may not break it
      return [board];
    },
    count: 12,
    perf: null,
  },

  "longest-consecutive-sequence": {
    edge: [[[]], [[0]], [[1, 1, 1]], [[-1000000000, 1000000000]], [[1000000000, 999999999, -1000000000]], [[1, 2, 0, 1]], [[-3, -1, -2, 5]], [[5, 4, 3, 2, 1]]],
    random: (r, i) => {
      const n = r.int(0, 25);
      const off = i % 3 === 0 ? r.int(-999999000, 999999000) : 0;
      return [r.ints(n, -15, 15).map((x) => x + off)];
    },
    perf: { input: [{ shuffle: { concat: [{ range: [-50000, 50000] }] }, seed: 1 }], about: "nums of length 100,000 forming one long run" },
    slow: `export function longestConsecutive(nums: number[]) {
      const set = new Set(nums);
      let best = 0;
      for (const x of nums) { let len = 1; while (set.has(x + len)) len++; best = Math.max(best, len); }
      return best;
    }`,
  },

  "valid-palindrome": {
    edge: [[" "], ["a"], [".,"], ["0P"], ["ab_a"], ["Aa"], ["1a2"], ["No 'x' in Nixon"], ["a.b,.B A"]],
    random: (r, i) => {
      const junk = " ,.:;!?'-_@#";
      const n = r.int(1, 10);
      let core = r.string(n, "abcAB01");
      if (i % 2 === 0) core = core + [...core].reverse().join(""); // a palindrome once cleaned up…
      const flip = (c: string) => (r.bool() ? c.toUpperCase() : c.toLowerCase()); // …in any letter case
      let s = "";
      for (const c of core) { s += flip(c); while (r.bool(0.3)) s += r.pick([...junk]); }
      if (i % 4 === 1) s = s.slice(0, Math.max(1, s.length - 1)) + "x";
      return [s];
    },
    perf: { input: [{ text: "Ab1, 1bA ", n: 199998 }], about: "a palindrome of 200,000 characters" },
    slow: `export function isPalindrome(s: string) {
      const clean: string[] = [];
      for (const c of s.toLowerCase()) if (/[a-z0-9]/.test(c)) clean.push(c);
      const rev: string[] = [];
      for (const c of clean) rev.unshift(c);
      return clean.join("") === rev.join("");
    }`,
  },

  // Exactly one solution: as in Two Sum, every value is a multiple of 4 except one, and the odd target needs it
  "two-sum-ii-input-array-is-sorted": {
    edge: [[[1, 2], 3], [[-1, 0], -1], [[0, 0, 3, 4], 0], [[5, 25, 75], 100], [[1, 2, 3, 4, 4, 9, 56, 90], 8], [[-1000, -1, 0, 1000], -1000], [[-1000, 1000], 0], [[-3, -1, 0, 2, 1000], 999]],
    random: (r) => {
      for (;;) {
        const n = r.int(2, 20);
        const nums = r.ints(n, -249, 249).map((x) => x * 4);
        const [i, j] = r.shuffle([...nums.keys()]).slice(0, 2) as [number, number];
        nums[j] = nums[j]! + 1;
        const target = nums[i]! + nums[j]!;
        if (Math.abs(target) > 1000) continue;
        if (nums.filter((x) => x === nums[i]).length > 1) continue; // the partner must be one index only
        return [nums.sort((a, b) => a - b), target];
      }
    },
    // n ≤ 30,000 is too small for TS brute force to miss the 0.5s floor, but this still catches it in Python
    perf: { input: [{ concat: [{ repeat: -1000, n: 29998 }, [1, 2]] }, 3], about: "numbers of length 30,000, the pair at the very end" },
  },

  "3sum": {
    edge: [[[0, 0, 0]], [[0, 1, 1]], [[0, 0, 0, 0]], [[-100000, 50000, 50000]], [[1, 2, -2, -1]], [[-2, 0, 1, 1, 2]], [[3, 0, -2, -1, 1, 2]], [[-1, -1, -1, 2, 2, 2]]],
    random: (r) => [r.ints(r.int(3, 25), -10, 10)],
    perf: { input: [{ ints: 3000, lo: -100000, hi: 100000, seed: 1 }], about: "nums of length 3,000" },
    slow: `export function threeSum(nums: number[]) {
      const seen = new Set<string>(), out: number[][] = [];
      for (let i = 0; i < nums.length; i++) for (let j = i + 1; j < nums.length; j++) for (let k = j + 1; k < nums.length; k++)
        if (nums[i] + nums[j] + nums[k] === 0) {
          const t = [nums[i], nums[j], nums[k]].sort((a, b) => a - b), key = t.join(",");
          if (!seen.has(key)) { seen.add(key); out.push(t); }
        }
      return out;
    }`,
  },

  "container-with-most-water": {
    edge: [[[1, 1]], [[0, 0]], [[0, 10000]], [[1, 2, 3, 4, 5]], [[5, 4, 3, 2, 1]], [[10000, 0, 0, 10000]], [[2, 3, 10, 5, 7, 8, 9]], [[1, 2, 1]]],
    random: (r, i) => [r.ints(r.int(2, 25), 0, i % 2 ? 10 : 10000)],
    perf: { input: [{ ints: 100000, lo: 0, hi: 10000, seed: 1 }], about: "height of length 100,000" },
    slow: `export function maxArea(height: number[]) {
      let best = 0;
      for (let i = 0; i < height.length; i++) for (let j = i + 1; j < height.length; j++) best = Math.max(best, (j - i) * Math.min(height[i], height[j]));
      return best;
    }`,
  },

  "trapping-rain-water": {
    edge: [[[0]], [[5]], [[1, 0, 1]], [[0, 0, 0]], [[3, 2, 1]], [[1, 2, 3]], [[5, 0, 0, 0, 5]], [[100000, 0, 100000]], [[2, 0, 3, 0, 1, 0, 4]]],
    random: (r, i) => [r.ints(r.int(1, 25), 0, i % 2 ? 6 : 100000)],
    // n ≤ 20,000 is too small for TS brute force to miss the 0.5s floor, but this still catches it in Python
    perf: { input: [{ ints: 20000, lo: 0, hi: 100000, seed: 1 }], about: "height of length 20,000" },
  },

  "best-time-to-buy-and-sell-stock": {
    edge: [[[1]], [[1, 2]], [[2, 1]], [[3, 3, 3]], [[0, 10000]], [[2, 1, 2, 0, 1]], [[2, 4, 1, 7]], [[3, 8, 1, 6]]],
    random: (r, i) => [r.ints(r.int(1, 25), 0, i % 2 ? 20 : 10000)],
    perf: { input: [{ ints: 100000, lo: 0, hi: 10000, seed: 1 }], about: "prices of length 100,000" },
    slow: `export function maxProfit(prices: number[]) {
      let best = 0;
      for (let i = 0; i < prices.length; i++) for (let j = i + 1; j < prices.length; j++) best = Math.max(best, prices[j] - prices[i]);
      return best;
    }`,
  },

  "longest-substring-without-repeating-characters": {
    edge: [[""], [" "], ["au"], ["dvdf"], ["abba"], ["tmmzuxt"], ["aaaa"], ["a1!b2@ c3#"]],
    random: (r, i) => [r.string(r.int(0, 25), i % 2 ? "abcde" : "abcdefghij 0123!@#ABC")],
    perf: { input: [{ string: 100000, alphabet: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~", seed: 1 }], about: "s of length 100,000" },
    slow: `export function lengthOfLongestSubstring(s: string) {
      let best = 0;
      for (let i = 0; i < s.length; i++)
        for (let j = i; j < s.length; j++) {
          const sub = s.slice(i, j + 1);
          if (new Set(sub).size !== sub.length) break;
          best = Math.max(best, sub.length);
        }
      return best;
    }`,
  },

  "longest-repeating-character-replacement": {
    edge: [["A", 0], ["A", 1], ["AAAA", 0], ["ABCD", 0], ["ABCD", 4], ["ABBB", 2], ["AABABBA", 1], ["BAAAB", 2]],
    random: (r) => {
      const s = r.string(r.int(1, 25), r.pick(["AB", "ABC", "ABCDE"]));
      return [s, r.int(0, Math.min(s.length, 6))];
    },
    perf: { input: [{ string: 100000, alphabet: "ABCDE", seed: 1 }, 20000], about: "s of length 100,000, k = 20,000" },
    slow: `export function characterReplacement(s: string, k: number) {
      let best = 0;
      for (let i = 0; i < s.length; i++) {
        const count = new Array(26).fill(0);
        let maxf = 0;
        for (let j = i; j < s.length; j++) {
          maxf = Math.max(maxf, ++count[s.charCodeAt(j) - 65]);
          if (j - i + 1 - maxf > k) break;
          best = Math.max(best, j - i + 1);
        }
      }
      return best;
    }`,
  },

  "permutation-in-string": {
    edge: [["a", "a"], ["a", "b"], ["ab", "a"], ["adc", "dcda"], ["abc", "ccccbbbbaaaa"], ["hello", "ooolleoooleh"], ["ab", "ab"], ["abc", "xyzbca"]],
    random: (r, i) => {
      const alpha = r.pick(["ab", "abc", "abcd"]);
      const s1 = r.string(r.int(1, 5), alpha);
      let s2 = r.string(r.int(1, 25), alpha);
      if (i % 2 === 0) { const at = r.int(0, s2.length); s2 = s2.slice(0, at) + r.shuffle([...s1]).join("") + s2.slice(at); }
      return [s1, s2.slice(0, 30)];
    },
    // Lengths are at most 10,000: even sorting every window runs in ~0.5s (LeetCode accepts it), so no speed check
    perf: null,
  },

  // The answer is guaranteed unique: every input has no window or exactly one shortest window
  "minimum-window-substring": {
    edge: (() => {
      const edges = [["a", "a"], ["a", "aa"], ["a", "b"], ["ab", "b"], ["bba", "ab"], ["aA", "a"], ["abc", "cba"], ["aaflslflsldkalskaaa", "aaa"], ["cabwefgewcwaefgcf", "cae"], ["ABBBBBCA", "AB"]];
      for (const [s, t] of edges) if (!uniqueMinWindow(s!, t!)) throw new Error(`minimum-window-substring edge ${s},${t} has several answers`);
      return edges;
    })(),
    random: (r, i) => {
      for (;;) {
        const alpha = i % 2 ? "abcAB" : "abcdefXYZ";
        const s = r.string(r.int(1, 25), alpha), t = r.string(r.int(1, 4), alpha);
        if (uniqueMinWindow(s, t)) return [s, t];
      }
    },
    // s = "abab…ab", t = "abab…a" (50,000 a's, 49,999 b's): only s without its last letter contains t
    perf: { input: [{ text: "ab", n: 100000 }, { text: "ab", n: 99999 }], about: "s of length 100,000, t of length 99,999" },
    slow: `export function minWindow(s: string, t: string) {
      const need = new Map<string, number>();
      for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
      let best = "";
      for (let i = 0; i < s.length; i++) {
        const have = new Map<string, number>();
        let missing = t.length;
        for (let j = i; j < s.length; j++) {
          const c = s[j], h = (have.get(c) ?? 0) + 1;
          have.set(c, h);
          if (h <= (need.get(c) ?? 0)) missing--;
          if (missing === 0) { if (!best || j - i + 1 < best.length) best = s.slice(i, j + 1); break; }
        }
      }
      return best;
    }`,
  },

  "sliding-window-maximum": {
    edge: [[[1], 1], [[1, -1], 1], [[9, 11], 2], [[4, -2], 2], [[7, 2, 4], 2], [[1, 3, 1, 2, 0, 5], 3], [[5, 4, 3, 2, 1], 3], [[1, 2, 3, 4, 5], 5], [[-10000, -10000, 10000], 2]],
    random: (r, i) => {
      const nums = r.ints(r.int(1, 25), i % 2 ? -5 : -10000, i % 2 ? 5 : 10000);
      return [nums, r.int(1, nums.length)];
    },
    perf: { input: [{ ints: 100000, lo: -10000, hi: 10000, seed: 1 }, 50000], about: "nums of length 100,000, k = 50,000" },
    slow: `export function maxSlidingWindow(nums: number[], k: number) {
      const out: number[] = [];
      for (let i = 0; i + k <= nums.length; i++) { let m = -Infinity; for (let j = i; j < i + k; j++) m = Math.max(m, nums[j]); out.push(m); }
      return out;
    }`,
  },

  // Linear by nature with tiny limits (LeetCode accepts the repeated-replace approach), so no speed check
  "valid-parentheses": {
    edge: [["("], [")"], ["]"], ["(]"], ["([)]"], ["{[]}"], ["(("], ["(){}}{"], ["[({})]()"]],
    random: (r, i) => {
      const pairs = ["()", "[]", "{}"];
      const gen = (n: number): string => {
        if (n === 0) return "";
        const inner = r.int(0, n - 1), p = r.pick(pairs);
        return p[0] + gen(inner) + p[1] + gen(n - 1 - inner);
      };
      let s = gen(r.int(1, 10));
      if (i % 2 === 1) { // break it: swap, change or drop a character
        const at = r.int(0, s.length - 1);
        s = r.bool() ? s.slice(0, at) + r.pick([..."()[]{}"]) + s.slice(at + 1) : s.slice(0, at) + s.slice(at + 1) || "(";
      }
      return [s];
    },
    perf: null,
  },

  // Valid RPN only: no division by zero and every intermediate value fits in 32 bits.
  // Linear by nature (no brute force to tell apart), so no speed check.
  "evaluate-reverse-polish-notation": {
    edge: [[["1"]], [["-200"]], [["200", "200", "*"]], [["7", "-3", "/"]], [["-7", "2", "/"]], [["0", "3", "/"]], [["3", "-4", "-"]], [["2", "3", "4", "*", "-"]], [["1", "2", "+", "3", "4", "+", "*", "5", "-"]]],
    random: (r) => [rpn(r, r.int(1, 12))],
    perf: null,
  },

  // Exponential by nature (Catalan many answers), so no speed check
  "generate-parentheses": {
    edge: [[1], [2], [4], [5], [6], [7], [8]],
    perf: null,
  },

  "daily-temperatures": {
    edge: [[[30]], [[100, 30]], [[30, 100]], [[50, 50, 50]], [[30, 40, 50, 60]], [[60, 50, 40, 30]], [[89, 62, 70, 58, 47, 47, 46, 76, 100, 70]], [[55, 38, 53, 81, 61, 93, 97, 32, 43, 78]]],
    random: (r, i) => [r.ints(r.int(1, 25), 30, i % 2 ? 40 : 100)],
    // non-increasing, then one warmer day at the very end: everyone waits for the last day
    perf: { input: [{ concat: [{ reverse: { sorted: { ints: 99999, lo: 30, hi: 99, seed: 1 } } }, [100]] }], about: "temperatures of length 100,000, falling until the last day" },
    slow: `export function dailyTemperatures(t: number[]) {
      return t.map((x, i) => { for (let j = i + 1; j < t.length; j++) if (t[j] > x) return j - i; return 0; });
    }`,
  },

  // Positions are distinct and below target
  "car-fleet": {
    edge: [[10, [3], [3]], [1, [0], [1]], [12, [0, 6], [2, 1]], [1000000, [0, 999999], [1000000, 1]], [10, [0, 4, 2], [2, 1, 3]], [10, [6, 8], [3, 2]], [10, [0, 1, 2, 3], [4, 3, 2, 1]], [10, [0, 1, 2, 3], [1, 2, 3, 4]]],
    random: (r, i) => {
      const target = i % 3 === 0 ? r.int(1, 1000000) : r.int(1, 30);
      const n = r.int(1, Math.min(15, target));
      const position = r.distinct(n, 0, target - 1);
      const speed = r.ints(n, 1, i % 3 === 0 ? 1000000 : 6);
      return [target, position, speed];
    },
    // all speeds equal: nobody catches up, so every car is its own fleet (checking each car against all the others is n²)
    perf: { input: [1000000, { distinct: 100000, lo: 0, hi: 999999, seed: 1 }, { repeat: 1, n: 100000 }], about: "100,000 cars" },
    slow: `export function carFleet(target: number, position: number[], speed: number[]) {
      const time = position.map((p, i) => (target - p) / speed[i]);
      let fleets = 0;
      for (let i = 0; i < position.length; i++) {
        let leads = true;
        for (let j = 0; j < position.length; j++) if (position[j] > position[i] && time[j] >= time[i]) { leads = false; break; }
        if (leads) fleets++;
      }
      return fleets;
    }`,
  },

  "largest-rectangle-in-histogram": {
    edge: [[[0]], [[5]], [[2, 4]], [[1, 1, 1, 1]], [[1, 2, 3, 4, 5]], [[5, 4, 3, 2, 1]], [[0, 0, 0]], [[2, 1, 2]], [[10000, 10000]], [[6, 2, 5, 4, 5, 1, 6]]],
    random: (r, i) => [r.ints(r.int(1, 25), 0, i % 2 ? 10 : 10000)],
    // ascending heights: expanding from every bar walks to the end
    perf: { input: [{ sorted: { ints: 100000, lo: 0, hi: 10000, seed: 1 } }], about: "heights of length 100,000, ascending" },
    slow: `export function largestRectangleArea(heights: number[]) {
      let best = 0;
      for (let i = 0; i < heights.length; i++) {
        let l = i, r = i;
        while (l > 0 && heights[l - 1] >= heights[i]) l--;
        while (r < heights.length - 1 && heights[r + 1] >= heights[i]) r++;
        best = Math.max(best, heights[i] * (r - l + 1));
      }
      return best;
    }`,
  },
});
