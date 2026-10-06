// Binary search, linked lists and trees.
import { defineSpecs, type Rng } from "../lib";

// ---- small helpers --------------------------------------------------------------------------------------------

type N = { v: number; l: N | null; r: N | null };

/** LeetCode level-order array → nodes */
function parse(arr: (number | null)[]): N | null {
  if (!arr.length || arr[0] === null) return null;
  const root: N = { v: arr[0]!, l: null, r: null };
  const q: N[] = [root];
  let i = 1;
  for (let h = 0; h < q.length && i < arr.length; h++) {
    const n = q[h]!;
    for (const side of ["l", "r"] as const) {
      if (i >= arr.length) break;
      const v = arr[i++];
      if (v !== null && v !== undefined) { n[side] = { v, l: null, r: null }; q.push(n[side]!); }
    }
  }
  return root;
}

/** nodes → LeetCode level-order array (trailing nulls trimmed) */
function serialize(root: N | null): (number | null)[] {
  const out: (number | null)[] = [];
  const q: (N | null)[] = [root];
  for (let i = 0; i < q.length; i++) {
    const n = q[i]!;
    out.push(n ? n.v : null);
    if (n) q.push(n.l, n.r);
  }
  while (out.length && out.at(-1) === null) out.pop();
  return out;
}

const nodes = (root: N | null): N[] => {
  const out: N[] = [];
  const st = root ? [root] : [];
  while (st.length) { const n = st.pop()!; out.push(n); if (n.l) st.push(n.l); if (n.r) st.push(n.r); }
  return out;
};
const preorder = (n: N | null, out: number[] = []): number[] => { if (n) { out.push(n.v); preorder(n.l, out); preorder(n.r, out); } return out; };
const inorder = (n: N | null, out: number[] = []): number[] => { if (n) { inorder(n.l, out); out.push(n.v); inorder(n.r, out); } return out; };

/** random tree of n nodes with values drawn from [lo, hi] (duplicates allowed) */
const treeVals = (r: Rng, n: number, lo: number, hi: number) => r.tree(n, r.ints(n, lo, hi));

/** sorted distinct values, rotated left by k */
const rotated = (r: Rng, n: number, lo: number, hi: number) => {
  const sorted = r.distinct(n, lo, hi).sort((a, b) => a - b);
  const k = r.int(0, n - 1);
  return [...sorted.slice(k), ...sorted.slice(0, k)];
};

const sortedInts = (r: Rng, n: number, lo: number, hi: number) => r.ints(n, lo, hi).sort((a, b) => a - b);

/** a non-negative number as a reversed digit list with no leading zeros */
const digits = (r: Rng, n: number) => {
  if (n === 1 && r.bool(0.2)) return [0];
  const d = r.ints(n, 0, 9);
  d[n - 1] = r.int(1, 9);
  return d;
};

// ---- specs ----------------------------------------------------------------------------------------------------

export const specs = defineSpecs({
  // ---------- binary search (constraints are small: O(n) passes too fast to time) ----------
  "binary-search": {
    edge: [
      [[5], 5],
      [[5], -5],
      [[-9999, 9999], -9999],
      [[-9999, 9999], 9999],
      [[-9999, 9999], 0],
      [[1, 2, 3, 4, 5, 6, 7, 8], 8],
      [[1, 2, 3, 4, 5, 6, 7, 8], 1],
      [[1, 3, 5, 7], 4],
    ],
    random: (r) => {
      const nums = r.distinct(r.int(1, 30), -9999, 9999).sort((a, b) => a - b);
      return [nums, r.bool() ? r.pick(nums) : r.int(-9999, 9999)];
    },
    perf: null,
  },

  "search-a-2d-matrix": {
    edge: [
      [[[1]], 1],
      [[[1]], 2],
      [[[-10000, 10000]], 10000],
      [[[1], [3], [5]], 3],
      [[[1], [3], [5]], 4],
      [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 60],
      [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], -10000],
      [[[2, 2, 2], [3, 3, 3]], 3],
    ],
    random: (r) => {
      const m = r.int(1, 5), n = r.int(1, 6);
      // non-decreasing rows, each row strictly above the previous one: distinct row starts work out by sorting
      // m*n values and nudging each row's first value above the previous row's last
      const flat = sortedInts(r, m * n, -50, 50);
      const rows: number[][] = [];
      let prev = -Infinity;
      for (let i = 0; i < m; i++) {
        const row = flat.slice(i * n, (i + 1) * n);
        const shift = row[0]! <= prev ? prev - row[0]! + 1 : 0;
        const fixed = row.map((x) => x + shift);
        rows.push(fixed);
        prev = fixed.at(-1)!;
      }
      const all = rows.flat();
      return [rows, r.bool() ? r.pick(all) : r.int(all[0]! - 3, all.at(-1)! + 3)];
    },
    perf: null,
  },

  "koko-eating-bananas": {
    edge: [
      [[1], 1],
      [[1000000000], 1],
      [[1000000000], 1000000000],
      [[1000000000, 1000000000], 3],
      [[312884470], 312884469],
      [[1, 1, 1, 1], 4],
      [[3, 6, 7, 11], 4],
      [[805306368, 805306368, 805306368], 1000000000],
    ],
    random: (r) => {
      const piles = r.ints(r.int(1, 20), 1, r.pick([10, 100, 1000000000]));
      const sum = piles.reduce((a, b) => a + b, 0);
      return [piles, r.int(piles.length, Math.min(1000000000, Math.max(piles.length, sum + 5)))];
    },
    perf: { input: [{ ints: 10000, lo: 1, hi: 1000000000, seed: 1 }, 10000], about: "10,000 piles of up to 10^9 bananas, h = 10,000" },
    slow: `export function minEatingSpeed(piles: number[], h: number) {
      for (let k = 1; ; k++) { let t = 0; for (const p of piles) t += Math.ceil(p / k); if (t <= h) return k; }
    }`,
  },

  "find-minimum-in-rotated-sorted-array": {
    edge: [
      [[1]],
      [[2, 1]],
      [[1, 2]],
      [[-5000, 5000]],
      [[5000, -5000]],
      [[1, 2, 3, 4, 5]],
      [[2, 3, 4, 5, 1]],
      [[5, 1, 2, 3, 4]],
    ],
    random: (r) => [rotated(r, r.int(1, 30), -5000, 5000)],
    perf: null,
  },

  "search-in-rotated-sorted-array": {
    edge: [
      [[1], 1],
      [[1], 0],
      [[3, 1], 1],
      [[3, 1], 3],
      [[3, 1], 2],
      [[1, 3], 3],
      [[5, 1, 3], 5],
      [[-10000, 10000], 10000],
      [[4, 5, 6, 7, 8, 1, 2, 3], 8],
    ],
    random: (r) => {
      const nums = rotated(r, r.int(1, 30), -10000, 10000);
      return [nums, r.bool(0.6) ? r.pick(nums) : r.int(-10000, 10000)];
    },
    perf: null,
  },

  // set timestamps are strictly increasing across all calls
  "time-based-key-value-store": {
    edge: [
      [["TimeMap", "get"], [[], ["a", 1]]],
      [["TimeMap", "set", "get", "get"], [[], ["a", "x", 10000000], ["a", 9999999], ["a", 10000000]]],
      [["TimeMap", "set", "set", "get", "get", "get"], [[], ["a", "one", 1], ["b", "two", 2], ["a", 2], ["b", 1], ["c", 5]]],
      [["TimeMap", "set", "set", "set", "get", "get", "get", "get"], [[], ["k", "v1", 5], ["k", "v2", 10], ["k", "v3", 20], ["k", 4], ["k", 5], ["k", 15], ["k", 100]]],
      [["TimeMap", "set", "set", "get"], [[], ["love", "high", 10], ["love", "low", 20], ["love", 19]]],
    ],
    random: (r) => {
      const ops = ["TimeMap"], args: unknown[][] = [[]];
      const keys = ["a", "b", "foo", "k1"];
      let t = r.int(1, 5);
      for (let i = 0; i < 25; i++) {
        if (r.bool(0.5)) {
          ops.push("set");
          args.push([r.pick(keys), r.string(r.int(1, 4), "abcxyz0123456789"), t]);
          t += r.int(1, 4);
        } else {
          ops.push("get");
          args.push([r.pick(keys), r.int(1, t + 3)]);
        }
      }
      return [ops, args];
    },
    // perf: null — set needs strictly increasing timestamps, which the recipes can't express without storing
    // hundreds of thousands of literal calls
    perf: null,
  },

  "median-of-two-sorted-arrays": {
    edge: [
      [[1], []],
      [[], [1]],
      [[], [2, 3]],
      [[1000000], [-1000000]],
      [[1, 1, 1], [1, 1, 1]],
      [[1, 2], [3, 4, 5, 6, 7]],
      [[5, 6, 7], [1, 2, 3, 4]],
      [[-5, 3, 6, 12, 15], [-12, -10, -6, -3, 4, 10]],
    ],
    random: (r) => {
      const m = r.int(0, 15), n = r.int(m === 0 ? 1 : 0, 15);
      const range = r.pick([5, 1000, 1000000]);
      return [sortedInts(r, m, -range, range), sortedInts(r, n, -range, range)];
    },
    perf: null,
  },

  // ---------- linked lists ----------
  "merge-two-sorted-lists": {
    edge: [
      [[], [0]],
      [[0], []],
      [[1], [1]],
      [[-100, 100], [-100, 100]],
      [[1, 2, 3], [4, 5, 6]],
      [[4, 5, 6], [1, 2, 3]],
      [[5, 5, 5], [5]],
    ],
    random: (r) => [sortedInts(r, r.int(0, 15), -100, 100), sortedInts(r, r.int(0, 15), -100, 100)],
    perf: null,
  },

  "reorder-list": {
    edge: [[[1]], [[1, 2]], [[1, 2, 3]], [[7, 7, 7, 7]], [[1000, 1, 1000, 1, 1000]], [[1, 2, 3, 4, 5, 6]]],
    random: (r) => [r.ints(r.int(1, 25), 1, 1000)],
    perf: { input: [{ ints: 50000, lo: 1, hi: 1000, seed: 1 }], about: "a list of 50,000 nodes (the maximum)" },
    slow: `import { ListNode } from "../../lib";
    export function reorderList(head: ListNode | null): void {
      // walk to the tail every time: O(n^2)
      let cur = head;
      while (cur && cur.next && cur.next.next) {
        let prev = cur;
        while (prev.next!.next) prev = prev.next!;
        const tail = prev.next!;
        prev.next = null;
        tail.next = cur.next;
        cur.next = tail;
        cur = tail.next;
      }
    }`,
  },

  "remove-nth-node-from-end-of-list": {
    edge: [
      [[1], 1],
      [[1, 2], 1],
      [[1, 2], 2],
      [[0, 0, 0], 2],
      [[1, 2, 3, 4, 5], 5],
      [[1, 2, 3, 4, 5], 1],
      [[100, 0, 100], 3],
    ],
    random: (r) => {
      const n = r.int(1, 30);
      return [r.ints(n, 0, 100), r.int(1, n)];
    },
    perf: null,
  },

  "add-two-numbers": {
    edge: [
      [[0], [0]],
      [[0], [5]],
      [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]],
      [[5], [5]],
      [[1], [9, 9, 9]],
      [[2, 4, 3], [5, 6, 4]],
      [Array(100).fill(9), [1]],
    ],
    random: (r) => [digits(r, r.int(1, 25)), digits(r, r.int(1, 25))],
    perf: null,
  },

  // values in [1, n], length n + 1, exactly one value repeated (possibly many times)
  "find-the-duplicate-number": {
    edge: [
      [[1, 1]],
      [[1, 1, 1]],
      [[2, 2, 2, 2, 2]],
      [[1, 2, 3, 4, 4]],
      [[5, 1, 2, 3, 4, 5]],
      [[3, 1, 3, 4, 2]],
      [[2, 5, 9, 6, 9, 3, 8, 9, 7, 1]],
    ],
    random: (r) => {
      const n = r.int(1, 25);
      const dup = r.int(1, n);
      const others = r.shuffle(Array.from({ length: n }, (_, i) => i + 1).filter((x) => x !== dup));
      const keep = others.slice(0, r.int(Math.max(0, n - 4), n - 1)); // drop a few others; their slots become extra dups
      return [r.shuffle([...keep, ...Array(n + 1 - keep.length).fill(dup)])];
    },
    perf: { input: [{ shuffle: { concat: [{ range: [1, 100001] }, [77777]] }, seed: 5 }], about: "nums of length 100,001" },
    slow: `export function findDuplicate(nums: number[]) {
      for (let i = 0; i < nums.length; i++) for (let j = i + 1; j < nums.length; j++) if (nums[i] === nums[j]) return nums[i];
      return -1;
    }`,
  },

  "lru-cache": {
    edge: [
      [["LRUCache", "get", "put", "get"], [[1], [0], [0, 0], [0]]],
      [["LRUCache", "put", "put", "get", "get"], [[1], [1, 1], [2, 2], [1], [2]]],
      [["LRUCache", "put", "put", "put", "get", "put", "get", "get"], [[2], [1, 1], [2, 2], [1, 10], [2], [3, 3], [1], [2]]],
      [["LRUCache", "put", "put", "get", "put", "get", "get", "get"], [[2], [10000, 100000], [0, 0], [10000], [5, 5], [0], [10000], [5]]],
      [["LRUCache", "put", "get", "put", "get", "put", "get"], [[3], [1, 1], [1], [1, 2], [1], [1, 3], [1]]],
    ],
    random: (r) => {
      const ops = ["LRUCache"], args: number[][] = [[r.int(1, 4)]];
      for (let i = 0; i < 25; i++) {
        const op = r.pick(["put", "put", "get"]);
        ops.push(op);
        args.push(op === "put" ? [r.int(0, 5), r.int(0, 100000)] : [r.int(0, 5)]);
      }
      return [ops, args];
    },
    perf: {
      input: [
        { concat: [["LRUCache"], { repeat: "put", n: 50000 }, { repeat: "get", n: 50000 }, { repeat: "put", n: 50000 }, { repeat: "get", n: 49999 }] },
        { concat: [[[3000]], { grid: [50000, 2], lo: 0, hi: 10000, seed: 1 }, { grid: [50000, 1], lo: 0, hi: 10000, seed: 2 }, { grid: [50000, 2], lo: 0, hi: 10000, seed: 3 }, { grid: [49999, 1], lo: 0, hi: 10000, seed: 4 }] },
      ],
      about: "capacity 3,000, about 200,000 get/put calls",
    },
    slow: `export class LRUCache {
      cap: number; keys: number[] = []; vals = new Map<number, number>();
      constructor(capacity: number) { this.cap = capacity; }
      touch(key: number) { const i = this.keys.indexOf(key); if (i >= 0) this.keys.splice(i, 1); this.keys.push(key); }
      get(key: number) { if (!this.vals.has(key)) return -1; this.touch(key); return this.vals.get(key)!; }
      put(key: number, value: number) {
        this.vals.set(key, value); this.touch(key);
        if (this.keys.length > this.cap) this.vals.delete(this.keys.shift()!);
      }
    }`,
  },

  "merge-k-sorted-lists": {
    edge: [
      [[[]]],
      [[[], []]],
      [[[1]]],
      [[[], [1], []]],
      [[[5, 5], [5], [5, 5, 5]]],
      [[[-10000, 10000], [0]]],
      [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
    ],
    random: (r) => [Array.from({ length: r.int(0, 6) }, () => sortedInts(r, r.int(0, 6), -20, 20))],
    perf: { input: [{ grid: [10000, 1], lo: -10000, hi: 10000, seed: 1 }], about: "10,000 lists of one node each" },
    // no `slow`: even the O(N·k) brute force takes only ~0.2s in TypeScript at these constraints (under the 0.5s floor);
    // the limit still catches it in Python
  },

  "reverse-nodes-in-k-group": {
    edge: [
      [[1], 1],
      [[1, 2], 2],
      [[1, 2], 1],
      [[1, 2, 3], 3],
      [[1, 2, 3, 4, 5, 6], 3],
      [[1, 2, 3, 4, 5, 6, 7], 3],
      [[0, 1000, 0, 1000], 4],
    ],
    random: (r) => {
      const n = r.int(1, 25);
      return [r.ints(n, 0, 1000), r.int(1, n)];
    },
    perf: null,
  },

  // ---------- trees ----------
  "invert-binary-tree": {
    edge: [[[]], [[1]], [[1, 2]], [[1, null, 2]], [[-100, 100, -100]], [[1, 2, 3, 4, 5, 6, 7]], [[1, 2, null, 3, null, 4]]],
    random: (r) => [treeVals(r, r.int(0, 25), -100, 100)],
    perf: null,
  },

  "diameter-of-binary-tree": {
    edge: [
      [[1]],
      [[1, 2]],
      [[1, null, 2]],
      [[1, 2, 3]],
      [[1, 2, null, 3, null, 4]],
      [[1, 2, null, 3, 4, 5, null, null, 6, 7, null, null, 8]],
      [[-100, -100, -100, -100, -100, -100, -100]],
    ],
    random: (r) => [treeVals(r, r.int(1, 30), -100, 100)],
    // node values are capped at ±100, so the 1..n recipes can't build a big valid tree; brute force is fine at this size anyway
    perf: null,
  },

  "balanced-binary-tree": {
    edge: [
      [[]],
      [[1]],
      [[1, 2]],
      [[1, 2, null, 3]],
      [[1, null, 2, null, 3]],
      [[1, 2, 2, 3, null, null, 3, 4, null, null, 4]],
      [[1, 2, 3, 4, 5, null, 6, 7]],
      [[1, 2, 3, 4, 5, 6, null, 8]],
    ],
    random: (r) => {
      const n = r.int(0, 15);
      // random BSTs of small size are balanced often enough to give a mix of true and false
      const vals = r.distinct(n, -10000, 10000);
      return [r.bool() ? r.bst(vals) : r.tree(n, vals)];
    },
    perf: { input: [{ bst: 5000 }], about: "a tree of 5,000 nodes (the maximum)" },
  },

  "same-tree": {
    edge: [
      [[], []],
      [[1], []],
      [[], [1]],
      [[1], [1]],
      [[1], [2]],
      [[1, 2, 1], [1, 1, 2]],
      [[1, null, 2], [1, null, 2]],
      [[-10000, 10000], [-10000, null, 10000]],
    ],
    random: (r, i) => {
      const t = treeVals(r, r.int(0, 20), -5, 5);
      const root = parse(t);
      const all = nodes(root);
      if (i % 3 === 0 || !all.length) return [t, t];
      if (i % 3 === 1) { r.pick(all).v += r.pick([-1, 1]); return [t, serialize(root)]; }
      // structural change: move a leaf to the other side, or drop it
      const parent = all.find((n) => (n.l && !n.l.l && !n.l.r) || (n.r && !n.r.l && !n.r.r));
      if (parent) { if (parent.l && !parent.l.l && !parent.l.r && !parent.r) { parent.r = parent.l; parent.l = null; } else if (parent.l && !parent.l.l && !parent.l.r) parent.l = null; else parent.r = null; }
      else root!.v += 1;
      return [t, serialize(root)];
    },
    count: 12,
    perf: null,
  },

  "subtree-of-another-tree": {
    edge: [
      [[1], [1]],
      [[1], [2]],
      [[1, 1], [1]],
      [[1, 2, 3], [1, 2]],
      [[1, 2, 3], [3]],
      [[12], [2]],
      [[3, 4, 5, 1, 2], [3, 4, 5, 1, 2]],
      [[1, null, 1, null, 1, null, 1, null, 1, 2], [1, null, 1, 2]],
    ],
    random: (r, i) => {
      const root = parse(treeVals(r, r.int(1, 25), -3, 3));
      const pickNode = r.pick(nodes(root));
      const sub = parse(serialize(pickNode)); // copy of a real subtree
      if (i % 2 === 1) {
        // tweak it: change a value, or drop a leaf (if the subtree has more than one node)
        const subNodes = nodes(sub);
        const leafParent = subNodes.find((n) => (n.l && !n.l.l && !n.l.r) || (n.r && !n.r.l && !n.r.r));
        if (leafParent && r.bool()) { if (leafParent.l && !leafParent.l.l && !leafParent.l.r) leafParent.l = null; else leafParent.r = null; }
        else r.pick(subNodes).v += r.pick([-1, 1]);
      }
      return [serialize(root), serialize(sub)];
    },
    count: 12,
    perf: null,
  },

  "binary-tree-level-order-traversal": {
    edge: [[[]], [[0]], [[1, 2]], [[1, null, 2]], [[1, 2, 3, 4, null, null, 5]], [[-1000, 1000, -1000, null, 1000]], [[1, 2, null, 3, null, 4, null, 5]]],
    random: (r) => [treeVals(r, r.int(0, 25), -1000, 1000)],
    perf: null,
  },

  "binary-tree-right-side-view": {
    edge: [[[]], [[1]], [[1, 2]], [[1, null, 2]], [[1, 2, 3, 4]], [[1, 2, 3, null, 5, null, 4]], [[1, 2, 3, 4, null, null, null, 5]], [[-100, 100]]],
    random: (r) => [treeVals(r, r.int(0, 25), -100, 100)],
    perf: null,
  },

  "count-good-nodes-in-binary-tree": {
    edge: [
      [[1]],
      [[-10000]],
      [[5, 5, 5, 5, 5]],
      [[10000, -10000, 9999, null, null, 10000]],
      [[1, 2, 3, 4, 5, 6, 7]],
      [[7, 6, 5, 4, 3, 2, 1]],
      [[2, null, 4, 10, 8, null, null, 4]],
    ],
    random: (r) => [treeVals(r, r.int(1, 25), -5, 5)],
    perf: { input: [{ bst: 10000 }], about: "a tree of 10,000 nodes" },
  },

  "validate-binary-search-tree": {
    edge: [
      [[2147483647]],
      [[-2147483648]],
      [[-2147483648, null, 2147483647]],
      [[2147483647, 2147483647]],
      [[1, 1]],
      [[1, null, 1]],
      [[5, 4, 6, null, null, 3, 7]],
      [[3, 1, 5, 0, 2, 4, 6, null, null, null, 3]],
    ],
    random: (r, i) => {
      const n = r.int(1, 20);
      const vals = r.distinct(n, -50, 50);
      const root = parse(r.bst(vals));
      const all = nodes(root);
      if (i % 3 === 1 && n >= 2) {
        // swap two values: no longer a BST
        const [a, b] = r.shuffle(all).slice(0, 2);
        [a!.v, b!.v] = [b!.v, a!.v];
      } else if (i % 3 === 2 && n >= 2) {
        // copy one value onto another node (duplicates break strictness, or worse)
        r.pick(all).v = r.pick(all).v;
      }
      return [serialize(root)];
    },
    count: 12,
    perf: { input: [{ bst: 10000 }], about: "a valid BST of 10,000 nodes" },
  },

  // values are distinct (a proper BST), 1 <= k <= n
  "kth-smallest-element-in-a-bst": {
    edge: [
      [[0], 1],
      [[10000], 1],
      [[2, 1], 1],
      [[2, 1], 2],
      [[1, null, 2, null, 3], 3],
      [[5, 3, 6, 2, 4, null, null, 1], 6],
      [[4, 2, 6, 1, 3, 5, 7], 4],
    ],
    random: (r) => {
      const n = r.int(1, 25);
      return [r.bst(r.distinct(n, 0, 10000)), r.int(1, n)];
    },
    perf: { input: [{ bst: 10000 }, 7500], about: "a BST of 10,000 nodes, k = 7,500" },
  },

  // tree values are distinct
  "construct-binary-tree-from-preorder-and-inorder-traversal": {
    edge: [
      [[3000], [3000]],
      [[1, 2], [2, 1]],
      [[1, 2], [1, 2]],
      [[1, 2, 3], [3, 2, 1]],
      [[1, 2, 3], [1, 2, 3]],
      [[1, 2, 4, 5, 3, 6, 7], [4, 2, 5, 1, 6, 3, 7]],
      [[-3000, 0, 3000], [0, -3000, 3000]],
    ],
    random: (r) => {
      const n = r.int(1, 25);
      const root = parse(r.tree(n, r.distinct(n, -3000, 3000)));
      return [preorder(root), inorder(root)];
    },
    perf: null,
  },

  "binary-tree-maximum-path-sum": {
    edge: [
      [[-1000]],
      [[1000]],
      [[-3, -2, -1]],
      [[2, -1]],
      [[-1, 2]],
      [[1, -2, 3]],
      [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]],
      [[-10, 9, 20, null, null, 15, 7]],
    ],
    random: (r, i) => [treeVals(r, r.int(1, 25), i % 3 === 0 ? -1000 : -100, i % 3 === 1 ? -1 : 100)],
    count: 12,
    perf: null,
  },
});
