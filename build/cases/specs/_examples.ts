// Worked examples of case specs. The other files in this folder follow the same shape.
import { defineSpecs } from "../lib";

export const specs = defineSpecs({
  // Exactly one valid answer is guaranteed, so random inputs plant one pair and keep every other sum different
  "two-sum": {
    edge: [
      [[1, 2], 3],
      [[0, 4, 3, 0], 0],
      [[-3, 4, 3, 90], 0],
      [[-1, -2, -3, -4, -5], -8],
      [[5, 75, 25], 100],
    ],
    random: (r) => {
      const n = r.int(2, 20);
      const nums = r.distinct(n, -1000, 1000).map((x) => x * 4); // multiples of 4…
      const [i, j] = r.shuffle([...nums.keys()]).slice(0, 2);
      nums[j!] = nums[j!]! + 1; // …except one, so only nums[i] + nums[j] can hit an odd target
      return [nums, nums[i!]! + nums[j!]!];
    },
    perf: { input: [{ range: [0, 100000] }, 199997], about: "nums of length 100,000" },
    slow: `export function twoSum(nums: number[], target: number) {
      for (let i = 0; i < nums.length; i++) for (let j = i + 1; j < nums.length; j++) if (nums[i] + nums[j] === target) return [i, j];
      return [];
    }`,
  },

  "valid-anagram": {
    edge: [["a", "a"], ["a", "b"], ["ab", "a"], ["aacc", "ccac"], ["abc", "cba"], ["aabbcc", "abcabc"]],
    random: (r) => {
      const s = r.string(r.int(1, 25), "abcde");
      const t = r.bool() ? r.shuffle([...s]).join("") : r.string(s.length, "abcde");
      return [s, t];
    },
    perf: { input: [{ string: 50000, alphabet: "abcdefghijklmnopqrstuvwxyz", seed: 1 }, { string: 50000, alphabet: "abcdefghijklmnopqrstuvwxyz", seed: 2 }], about: "strings of length 50,000" },
  },

  // ListNode input and output
  "reverse-linked-list": {
    edge: [[[]], [[1]], [[1, 2]], [[5, 5, 5]], [[-5000, 0, 5000]]],
    random: (r) => [r.ints(r.int(0, 25), -5000, 5000)],
    perf: { input: [{ ints: 5000, lo: -5000, hi: 5000, seed: 3 }], about: "a list of 5,000 nodes (the maximum)" },
  },

  // TreeNode input
  "maximum-depth-of-binary-tree": {
    edge: [[[]], [[0]], [[1, 2]], [[1, null, 2, null, 3]], [[1, 2, 3, 4, 5, 6, 7]]],
    random: (r) => [r.tree(r.int(0, 25)).map((v) => (v === null ? null : v - 50))],
    perf: { input: [{ bst: 10000 }], about: "a tree of 10,000 nodes" },
  },

  // Design problem: [ops, args]
  "min-stack": {
    edge: [
      [["MinStack", "push", "getMin", "top", "pop", "push", "getMin"], [[], [5], [], [], [], [-3], []]],
      [["MinStack", "push", "push", "push", "getMin", "pop", "getMin", "pop", "getMin"], [[], [2], [2], [1], [], [], [], [], []]],
    ],
    random: (r) => {
      const ops = ["MinStack"], args: number[][] = [[]];
      let size = 0;
      for (let i = 0; i < 25; i++) {
        const op = size === 0 ? "push" : r.pick(["push", "push", "pop", "top", "getMin"]);
        ops.push(op);
        args.push(op === "push" ? [r.int(-20, 20)] : []);
        size += op === "push" ? 1 : op === "pop" ? -1 : 0;
      }
      return [ops, args];
    },
    perf: null,
  },

  // In-place (void) problem: the mutated first argument is compared
  "rotate-image": {
    edge: [[[[1]]], [[[1, 2], [3, 4]]], [[[-1000, 1000], [0, 0]]]],
    random: (r) => { const n = r.int(1, 6); return [Array.from({ length: n }, () => r.ints(n, -1000, 1000))]; },
    perf: null,
  },
});
