// Hidden test cases: what a problem's spec looks like, plus seeded random helpers.
// Specs live in build/cases/specs/*.ts; build/build-cases.ts turns them into bank cases.
//
// The answers are NEVER written by hand: build-cases runs both reference solutions (TypeScript and
// Python) on every input and keeps a case only if they agree. Your job in a spec is to produce
// inputs that are VALID for the problem (respect every constraint and guarantee in its README).

export type Rng = ReturnType<typeof rng>;

export type CaseSpec = {
  /**
   * Hand-picked tricky inputs, each in LeetCode's JSON form: one value per parameter, in order
   * (the same shape as the examples in bank/problems/<folder>/cases.json). Design problems: [ops, args].
   * Think: smallest allowed size, all equal, already sorted / reverse sorted, negatives, duplicates,
   * the answer at the very start or end, the "no answer" case if the problem has one.
   */
  edge?: unknown[][];
  /** One small, valid random input (keep it to ~30 elements so the cases file stays small). */
  random?: (r: Rng, i: number) => unknown[];
  /** How many random inputs (default 10) */
  count?: number;
  /**
   * The speed check: one recipe per parameter (see runtime/ts/lib/recipe.ts for the recipe types), sized
   * near the top of the problem's constraints so the obvious brute force is too slow, plus a short
   * description like "nums of length 100,000". null/omitted = no speed check.
   */
  perf?: { input: unknown[]; about: string } | null;
  /**
   * Optional but encouraged: a deliberately slow (but correct) TypeScript solution, as module source
   * exporting the same function/class. build-cases checks the speed limit really catches it.
   */
  slow?: string;
};

export const defineSpecs = (specs: Record<string, CaseSpec>) => specs;

/** Seeded random numbers (mulberry32), so builds are repeatable */
export function rng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1));
  const self = {
    next,
    int,
    bool: (p = 0.5) => next() < p,
    pick: <T>(xs: readonly T[]): T => xs[Math.floor(next() * xs.length)]!,
    shuffle: <T>(xs: T[]): T[] => {
      const a = xs.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; }
      return a;
    },
    ints: (n: number, lo: number, hi: number) => Array.from({ length: n }, () => int(lo, hi)),
    /** n different ints in [lo, hi] (needs hi - lo + 1 >= n) */
    distinct: (n: number, lo: number, hi: number) => {
      const seen = new Set<number>();
      while (seen.size < n) seen.add(int(lo, hi));
      return [...seen];
    },
    string: (n: number, alphabet = "abcdefghijklmnopqrstuvwxyz") => Array.from({ length: n }, () => alphabet[Math.floor(next() * alphabet.length)]).join(""),
    /** Random binary tree with n nodes in LeetCode level order (values from `values`, or 1..n shuffled) */
    tree: (n: number, values?: number[]) => {
      if (n === 0) return [];
      const vals = values ?? self.shuffle(Array.from({ length: n }, (_, i) => i + 1));
      type N = { v: number; l?: N; r?: N };
      const root: N = { v: vals[0]! };
      const nodes = [root];
      for (let i = 1; i < n; i++) {
        for (;;) {
          const parent = self.pick(nodes);
          const side = self.bool() ? "l" : "r";
          if (!parent[side]) { parent[side] = { v: vals[i]! }; nodes.push(parent[side]!); break; }
        }
      }
      return levelOrder(root);
    },
    /** Random valid BST holding the given distinct values (any insertion order), in level order */
    bst: (values: number[]) => {
      type N = { v: number; l?: N; r?: N };
      let root: N | undefined;
      for (const v of self.shuffle(values)) {
        if (!root) { root = { v }; continue; }
        let n = root;
        for (;;) {
          const side = v < n.v ? "l" : "r";
          if (!n[side]) { n[side] = { v }; break; }
          n = n[side]!;
        }
      }
      return root ? levelOrder(root) : [];
    },
  };
  return self;
}

/** {v, l, r} nodes → LeetCode level-order array with trailing nulls trimmed */
function levelOrder(root: { v: number; l?: any; r?: any }): (number | null)[] {
  const out: (number | null)[] = [];
  const q: any[] = [root];
  for (let i = 0; i < q.length; i++) {
    const n = q[i];
    out.push(n ? n.v : null);
    if (n) q.push(n.l ?? null, n.r ?? null);
  }
  while (out.at(-1) === null) out.pop();
  return out;
}
