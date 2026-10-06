// Runs a problem's cases (examples + extra edge/random cases) against your solution.
// Shared by `sk test` (testing.ts), `sk play` (play.ts) and the speed check (perf.ts).
import { anyOrder, anyOrderDeep } from "./compare";
import { runOps } from "./design";
import { fromGraph, graphNodes, toGraph } from "./graph";
import { fromList, toCycleList, toList } from "./list";
import { fromRandomList, randomListNodes, toRandomList } from "./random-list";
import { findNode, fromTree, toTree } from "./tree";

export type Param = { name: string; type: string };
export type Call =
  | { kind: "function"; name: string; params: Param[]; returns: string }
  | { kind: "design"; className: string }
  /** Problems whose input or check needs special handling (see ADAPTERS) */
  | { kind: "custom"; adapter: string; params: Param[]; exports: string[] };
export type Compare = "exact" | "anyOrder" | "anyOrderDeep" | "float" | `validator:${string}`;
export type Case = { name: string; input: unknown[]; output: unknown };
export type Perf = { input: unknown[]; about: string; limit: { ts: number; py: number } };
export type CaseFile = { title: string; call: Call; compare: Compare; cases: Case[]; perf: Perf | null };

const toArg = (type: string, v: any) =>
  type === "ListNode" ? toList(v) : type === "TreeNode" ? toTree(v) : type === "ListNode[]" ? (v as number[][]).map(toList) : v;
const fromValue = (type: string, v: any) =>
  type === "ListNode" ? fromList(v) : type === "TreeNode" ? fromTree(v) : v;

/**
 * How LeetCode runs the problems that need more than "call a function, compare the result".
 * Each returns the answer in JSON form, or a message saying what's wrong (which then won't match).
 * (Same set in runtime/py/sleek/cases.py.)
 */
export const ADAPTERS: Record<string, (mod: Record<string, any>, input: any[]) => unknown> = {
  // 141: the input is the list's values plus `pos`, where the tail links back to (-1 = no cycle)
  hasCycle: (mod, [values, pos]) => mod.hasCycle(toCycleList(values, pos)),
  // 235: p and q are given as values; your function receives those nodes. The answer is the LCA's value.
  lowestCommonAncestor: (mod, [tree, p, q]) => {
    const root = toTree(tree);
    return mod.lowestCommonAncestor(root, findNode(root, p), findNode(root, q))?.val ?? null;
  },
  // 133: must be a deep copy: same shape, no nodes shared with the original
  cloneGraph: (mod, [adj]) => {
    const original = toGraph(adj);
    const copy = mod.cloneGraph(original);
    const originals = new Set(graphNodes(original));
    if (graphNodes(copy).some((n) => originals.has(n))) return "not a copy: it shares nodes with the original graph";
    return fromGraph(copy);
  },
  // 138: same values and random links, no nodes shared with the original, original left unchanged
  copyRandomList: (mod, [pairs]) => {
    const original = toRandomList(pairs);
    const copy = mod.copyRandomList(original);
    const originals = new Set(randomListNodes(original));
    if (randomListNodes(copy).some((n) => originals.has(n) || (n.random && originals.has(n.random)))) return "not a copy: it points into the original list";
    if (JSON.stringify(fromRandomList(original)) !== JSON.stringify(pairs)) return "the original list was changed";
    return fromRandomList(copy);
  },
  // 297: any format works, as long as deserialize(serialize(tree)) rebuilds the same tree
  serializeTree: (mod, [tree]) => {
    const data = mod.serialize(toTree(tree));
    if (typeof data !== "string") return "serialize must return a string";
    return fromTree(mod.deserialize(data));
  },
  // 271: any encoding works, as long as decode(encode(strs)) gives back strs
  encodeDecode: (mod, [strs]) => {
    const encoded = mod.encode(structuredClone(strs));
    if (typeof encoded !== "string") return "encode must return a single string";
    return mod.decode(encoded);
  },
};

/** Calls your solution with a case's input and returns its answer in LeetCode's JSON form */
export function run(file: CaseFile, mod: Record<string, any>, input: unknown[]): unknown {
  const call = file.call;
  if (call.kind === "design") return runOps(mod[call.className], input[0] as string[], input[1] as unknown[][]);
  if (call.kind === "custom") return ADAPTERS[call.adapter]!(mod, structuredClone(input) as any[]);
  const fn = mod[call.name];
  if (typeof fn !== "function") throw new Error(`solution has no exported function "${call.name}"`);
  const args = call.params.map((p, i) => toArg(p.type, structuredClone(input[i])));
  const result = fn(...args);
  return call.returns === "void" ? fromValue(call.params[0]!.type, args[0]) : fromValue(call.returns, result);
}

/** What gets compared: -0 → 0, floats rounded, order removed where order doesn't matter */
export function normalize(compare: Compare, v: unknown): unknown {
  const clean = (x: unknown): unknown =>
    typeof x === "number" ? (Object.is(x, -0) ? 0 : x) : Array.isArray(x) ? x.map(clean) : x === undefined ? null : x;
  const x = clean(v);
  if (compare === "anyOrder" && Array.isArray(x)) return anyOrder(x);
  if (compare === "anyOrderDeep") return anyOrderDeep(x);
  return x;
}

/**
 * For the few problems where more than one answer is correct, a validator decides instead of an exact match.
 * (Same set in runtime/py/sleek/cases.py.)
 */
export const VALIDATORS: Record<string, (input: any[], actual: any, expected: any) => boolean> = {
  // 5. Longest Palindromic Substring: any palindrome in s of the longest length is accepted ("bab" or "aba")
  longestPalindrome: ([s], actual, expected) =>
    typeof actual === "string" && actual.length === expected.length && s.includes(actual) && actual === [...actual].reverse().join(""),
  // 210. Course Schedule II: any order that puts every prerequisite first; [] exactly when it's impossible
  courseOrder: ([n, prereqs], actual, expected) => {
    if (!Array.isArray(actual)) return false;
    if (expected.length === 0) return actual.length === 0;
    if (actual.length !== n || [...actual].sort((a, b) => a - b).some((x, i) => x !== i)) return false;
    const at = new Map(actual.map((c: number, i: number) => [c, i]));
    return prereqs.every(([course, pre]: [number, number]) => at.get(pre)! < at.get(course)!);
  },
  // 269. Alien Dictionary: any letter order consistent with the words; "" exactly when there's none
  alienOrder: ([words], actual, expected) => {
    if (typeof actual !== "string") return false;
    if (expected === "") return actual === "";
    const letters = [...new Set(words.join(""))].sort().join("");
    if ([...actual].sort().join("") !== letters) return false;
    const rank = new Map([...actual].map((ch, i) => [ch, i]));
    for (let i = 0; i + 1 < words.length; i++) {
      const [a, b] = [words[i], words[i + 1]];
      const j = [...a].findIndex((ch: string, k: number) => ch !== b[k]);
      if (j !== -1 && j < b.length && rank.get(a[j])! > rank.get(b[j])!) return false;
    }
    return true;
  },
};

/** Numbers within 1e-5 (absolute or relative) count as equal, like LeetCode's checker for decimal answers */
export function close(a: unknown, b: unknown): boolean {
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) <= 1e-5 * Math.max(1, Math.abs(b));
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => close(x, b[i]));
  return JSON.stringify(a) === JSON.stringify(b);
}

export function same(file: CaseFile, actual: unknown, expected: unknown, input: unknown[] = []): boolean {
  if (file.compare.startsWith("validator:")) return VALIDATORS[file.compare.slice(10)]!(input, actual, expected);
  if (file.compare === "float") return close(normalize("exact", actual), expected);
  return JSON.stringify(normalize(file.compare, actual)) === JSON.stringify(normalize(file.compare, expected));
}

const short = (v: unknown, n = 70) => {
  const s = JSON.stringify(v) ?? "null";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
};

/** nums = [2,7,11,15], target = 9 */
export function preview(file: CaseFile, input: unknown[], n = 70): string {
  if (file.call.kind === "design") return short(input[0], n);
  const params = file.call.params; // function and custom calls both name their inputs
  return params.map((p, i) => `${p.name} = ${short(input[i], Math.max(12, Math.floor(n / params.length)))}`).join(", ");
}
export { short };
