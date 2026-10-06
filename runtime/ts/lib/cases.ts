// Runs a problem's cases (examples + extra edge/random cases) against your solution.
// Shared by `sk test` (testing.ts), `sk play` (play.ts) and the speed check (perf.ts).
import { anyOrder, anyOrderDeep } from "./compare";
import { runOps } from "./design";
import { fromList, toList } from "./list";
import { fromTree, toTree } from "./tree";

export type Param = { name: string; type: string };
export type Call =
  | { kind: "function"; name: string; params: Param[]; returns: string }
  | { kind: "design"; className: string };
export type Compare = "exact" | "anyOrder" | "anyOrderDeep" | "float" | `validator:${string}`;
export type Case = { name: string; input: unknown[]; output: unknown };
export type Perf = { input: unknown[]; about: string; limit: { ts: number; py: number } };
export type CaseFile = { title: string; call: Call; compare: Compare; cases: Case[]; perf: Perf | null };

const toArg = (type: string, v: any) =>
  type === "ListNode" ? toList(v) : type === "TreeNode" ? toTree(v) : type === "ListNode[]" ? (v as number[][]).map(toList) : v;
const fromValue = (type: string, v: any) =>
  type === "ListNode" ? fromList(v) : type === "TreeNode" ? fromTree(v) : v;

/** Calls your solution with a case's input and returns its answer in LeetCode's JSON form */
export function run(file: CaseFile, mod: Record<string, any>, input: unknown[]): unknown {
  const call = file.call;
  if (call.kind === "design") return runOps(mod[call.className], input[0] as string[], input[1] as unknown[][]);
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
  const params = file.call.params;
  return params.map((p, i) => `${p.name} = ${short(input[i], Math.max(12, Math.floor(n / params.length)))}`).join(", ");
}
export { short };
