// Big inputs for the "fast enough?" test, described by small recipes instead of stored megabytes.
// Each language has the same recipe interpreter (runtime/py/sleek/recipe.py). Inputs only need to be
// valid and large, not identical across languages: the time limit is measured per language.

export type Recipe = unknown;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Recipes (any other value is used as-is):
 *  {range:[start, stop, step?]}          [start, start+step, …) up to stop
 *  {ints:n, lo, hi, seed}                 n random ints in [lo, hi]
 *  {distinct:n, lo, hi, seed}             n different random ints in [lo, hi]
 *  {sorted: recipe} / {reverse: recipe}   sort ascending / reverse a list
 *  {shuffle: recipe, seed}
 *  {repeat: recipe, n}                    n copies of a value
 *  {concat: [recipes]}                    lists joined
 *  {list: [recipes]}                      a list of evaluated recipes
 *  {string:n, alphabet, seed}             random string
 *  {text: "ab", n}                        "abab…" of length n
 *  {words:n, min, max, alphabet, seed}    list of random words
 *  {grid:[rows, cols], lo, hi, seed}      matrix of random ints
 *  {charGrid:[rows, cols], alphabet, seed} matrix of single-character strings
 *  {intervals:n, lo, hi, maxLen, seed}    [[start, end], …] with start ≤ end
 *  {edges:"chain"|"tree", n, seed}        n-1 undirected edges over nodes 0..n-1
 *  {bst:n}                                level-order array of a balanced BST holding 1..n
 *  {chainTree:n}                          level-order array of a right-leaning chain 1..n
 */
export function build(r: Recipe): unknown {
  if (r === null || typeof r !== "object") return r;
  if (Array.isArray(r)) return r.map(build);
  const o = r as Record<string, any>;
  const R = rng(o.seed ?? 1);
  const int = (lo: number, hi: number) => lo + Math.floor(R() * (hi - lo + 1));
  if ("range" in o) {
    const [start, stop, step = 1] = o.range;
    const out: number[] = [];
    for (let x = start; step > 0 ? x < stop : x > stop; x += step) out.push(x);
    return out;
  }
  if ("ints" in o) return Array.from({ length: o.ints }, () => int(o.lo, o.hi));
  if ("distinct" in o) {
    const seen = new Set<number>();
    while (seen.size < o.distinct) seen.add(int(o.lo, o.hi));
    return [...seen];
  }
  if ("sorted" in o) return (build(o.sorted) as any[]).slice().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  if ("reverse" in o) return (build(o.reverse) as any[]).slice().reverse();
  if ("shuffle" in o) {
    const xs = (build(o.shuffle) as any[]).slice();
    for (let i = xs.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [xs[i], xs[j]] = [xs[j], xs[i]]; }
    return xs;
  }
  if ("repeat" in o) return Array.from({ length: o.n }, () => structuredClone(build(o.repeat)));
  if ("concat" in o) return (o.concat as Recipe[]).flatMap((x) => build(x) as any[]);
  if ("list" in o) return (o.list as Recipe[]).map(build);
  if ("string" in o) return Array.from({ length: o.string }, () => o.alphabet[Math.floor(R() * o.alphabet.length)]).join("");
  if ("text" in o) return o.text.repeat(Math.ceil(o.n / o.text.length)).slice(0, o.n);
  if ("words" in o) return Array.from({ length: o.words }, () => Array.from({ length: int(o.min, o.max) }, () => o.alphabet[Math.floor(R() * o.alphabet.length)]).join(""));
  if ("grid" in o) return Array.from({ length: o.grid[0] }, () => Array.from({ length: o.grid[1] }, () => int(o.lo, o.hi)));
  if ("charGrid" in o) return Array.from({ length: o.charGrid[0] }, () => Array.from({ length: o.charGrid[1] }, () => o.alphabet[Math.floor(R() * o.alphabet.length)]));
  if ("intervals" in o) return Array.from({ length: o.intervals }, () => { const s = int(o.lo, o.hi - 1); return [s, Math.min(o.hi, s + int(1, o.maxLen))]; });
  if ("edges" in o) return Array.from({ length: o.n - 1 }, (_, i) => (o.edges === "chain" ? [i, i + 1] : [int(0, i), i + 1]));
  if ("bst" in o) {
    // balanced BST over 1..n in level order (nulls where a slot is empty)
    const out: (number | null)[] = [];
    let level: [number, number][] = [[1, o.bst]];
    while (level.some(([a, b]) => a <= b)) {
      const next: [number, number][] = [];
      for (const [a, b] of level) {
        if (a > b) { out.push(null); continue; }
        const m = (a + b) >> 1;
        out.push(m);
        next.push([a, m - 1], [m + 1, b]);
      }
      level = next;
    }
    while (out.at(-1) === null) out.pop();
    return out;
  }
  if ("chainTree" in o) return Array.from({ length: o.chainTree }, (_, i) => i + 1).flatMap((v, i) => (i === 0 ? [v] : [null, v]));
  throw new Error(`Unknown recipe ${JSON.stringify(o).slice(0, 80)}`);
}
