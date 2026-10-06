// Maintainer script: regenerates bank/ from LeetCode's API data + NeetCode's list and hints.
//   bun build/build-bank.ts
// Reads the cache in .cache/ (run build/fetch-cache.ts first if it's empty).
// Hand-written problems (MANUAL) are never overwritten.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { python, specFrom, typescript } from "../src/core/generate";

const ROOT = join(import.meta.dir, "..");
const CACHE = join(ROOT, ".cache");
const BANK = join(ROOT, "bank");

const SHORT: Record<string, string> = {
  "two-sum-ii-input-array-is-sorted": "two-sum-ii", "product-of-array-except-self": "product-except-self",
  "encode-and-decode-strings": "encode-decode-strings", "longest-consecutive-sequence": "longest-consecutive",
  "container-with-most-water": "container-water", "best-time-to-buy-and-sell-stock": "buy-sell-stock",
  "longest-substring-without-repeating-characters": "longest-substring",
  "longest-repeating-character-replacement": "char-replacement", "evaluate-reverse-polish-notation": "eval-rpn",
  "largest-rectangle-in-histogram": "largest-rectangle", "search-a-2d-matrix": "search-2d-matrix",
  "find-minimum-in-rotated-sorted-array": "min-rotated-array", "search-in-rotated-sorted-array": "search-rotated-array",
  "time-based-key-value-store": "time-map", "median-of-two-sorted-arrays": "median-two-arrays",
  "merge-two-sorted-lists": "merge-two-lists", "remove-nth-node-from-end-of-list": "remove-nth-node",
  "copy-list-with-random-pointer": "copy-random-list", "find-the-duplicate-number": "find-duplicate",
  "merge-k-sorted-lists": "merge-k-lists", "reverse-nodes-in-k-group": "reverse-k-group",
  "maximum-depth-of-binary-tree": "max-depth-tree", "diameter-of-binary-tree": "tree-diameter",
  "subtree-of-another-tree": "subtree", "lowest-common-ancestor-of-a-binary-search-tree": "lca-bst",
  "binary-tree-level-order-traversal": "level-order", "binary-tree-right-side-view": "right-side-view",
  "count-good-nodes-in-binary-tree": "good-nodes", "validate-binary-search-tree": "validate-bst",
  "kth-smallest-element-in-a-bst": "kth-smallest-bst",
  "construct-binary-tree-from-preorder-and-inorder-traversal": "build-tree",
  "binary-tree-maximum-path-sum": "max-path-sum", "serialize-and-deserialize-binary-tree": "serialize-tree",
  "implement-trie-prefix-tree": "trie", "design-add-and-search-words-data-structure": "word-dictionary",
  "kth-largest-element-in-a-stream": "kth-largest-stream", "k-closest-points-to-origin": "k-closest-points",
  "kth-largest-element-in-an-array": "kth-largest-array", "find-median-from-data-stream": "median-stream",
  "letter-combinations-of-a-phone-number": "phone-letters", "max-area-of-island": "max-area-island",
  "pacific-atlantic-water-flow": "pacific-atlantic",
  "number-of-connected-components-in-an-undirected-graph": "connected-components",
  "min-cost-to-connect-all-points": "min-cost-connect", "cheapest-flights-within-k-stops": "cheapest-flights",
  "longest-palindromic-substring": "longest-palindrome", "maximum-product-subarray": "max-product-subarray",
  "longest-increasing-subsequence": "lis", "partition-equal-subset-sum": "partition-equal-subset",
  "longest-common-subsequence": "lcs", "best-time-to-buy-and-sell-stock-with-cooldown": "stock-cooldown",
  "longest-increasing-path-in-a-matrix": "longest-path-matrix", "regular-expression-matching": "regex-matching",
  "maximum-subarray": "max-subarray", "merge-triplets-to-form-target-triplet": "merge-triplets",
  "minimum-interval-to-include-each-query": "min-interval-query", "powx-n": "pow", "number-of-1-bits": "count-1-bits",
  "sum-of-two-integers": "sum-two-integers", "top-k-frequent-elements": "top-k-frequent",
  "min-cost-climbing-stairs": "min-cost-stairs",
};

/** Answer order isn't specified, even if the text doesn't say "any order". */
const FORCE_ANY_ORDER = new Set(["word-search-ii", "generate-parentheses", "palindrome-partitioning", "pacific-atlantic-water-flow"]);
/** Answers that are sets of sets: inner order doesn't matter either. */
const DEEP_ANY_ORDER = new Set(["subsets", "subsets-ii", "combination-sum", "combination-sum-ii", "3sum", "group-anagrams"]);
/** Stubs + tests for these are hand-written in bank/ (premium-only or unusual input formats). */
export const MANUAL = new Set([
  "encode-and-decode-strings", "walls-and-gates", "number-of-connected-components-in-an-undirected-graph",
  "graph-valid-tree", "alien-dictionary", "meeting-rooms", "meeting-rooms-ii",
  "serialize-and-deserialize-binary-tree", "clone-graph", "lowest-common-ancestor-of-a-binary-search-tree",
  "linked-list-cycle", "copy-list-with-random-pointer", "course-schedule-ii",
]);

// ---------- main ----------

const nc: any[] = (await Bun.file(join(CACHE, "neetcode-list.json")).json()).filter((x: any) => x.neetcode150);
const hintMap: Record<string, string> = await Bun.file(join(import.meta.dir, "neetcode-hint-names.json")).json(); // hand-checked, 1:1
const htmlText = (html: string) =>
  html.replace(/<code>([\s\S]*?)<\/code>/g, "`$1`").replace(/<br\s*\/?>/g, "\n").replace(/<li>/g, "\n- ").replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .split("\n").map((l) => l.trim()).join("\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();

const index: any[] = [];
const report: string[] = [];

for (const x of nc) {
  const slug = x.link.replace(/\/$/, "");
  const q = await Bun.file(join(CACHE, "leetcode", `${slug}.json`)).json();
  const id = String(Number(x.code.slice(0, 4)));
  const folder = `${id}-${SHORT[slug] ?? slug}`;
  const dir = join(BANK, "problems", folder);
  mkdirSync(join(dir, "ts"), { recursive: true });
  mkdirSync(join(dir, "py"), { recursive: true });
  index.push({ id, title: q?.title ?? x.problem, slug, folder, difficulty: x.difficulty, pattern: x.pattern, blind75: !!x.blind75, video: x.video, paid: !q?.content });

  // Hints (NeetCode, MIT): target complexity + progressive hints
  const hintName = Object.entries(hintMap).find(([f]) => f === folder)?.[1];
  const md = await Bun.file(join(CACHE, "neetcode-hints", `${hintName}.md`)).text();
  const blocks = [...md.matchAll(/<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map((m) => ({ title: htmlText(m[1]!), body: htmlText(m[2]!) }));
  await Bun.write(join(dir, "hints.json"), JSON.stringify({
    source: `https://github.com/neetcode-gh/leetcode/blob/main/hints/${hintName}.md`,
    target: blocks.find((b) => /complexity/i.test(b.title))?.body ?? null,
    hints: blocks.filter((b) => /^hint/i.test(b.title)).map((b) => b.body),
  }, null, 2) + "\n");

  if (MANUAL.has(slug) || !q?.content) continue;

  const spec = specFrom(q, { id, title: q.title, slug, difficulty: x.difficulty, pattern: x.pattern, blind75: !!x.blind75 },
    { anyOrder: FORCE_ANY_ORDER.has(slug), deep: DEEP_ANY_ORDER.has(slug) });
  if (spec.inputs.length !== spec.outputs.length) report.push(`${folder}: ${spec.inputs.length} inputs, ${spec.outputs.length} outputs`);

  const snippet = (lang: string) => q.codeSnippets.find((c: any) => c.langSlug === lang).code;
  const ts = typescript(spec, snippet("typescript"));
  await Bun.write(join(dir, "ts", "solution.ts"), ts.stub);
  await Bun.write(join(dir, "ts", "solution.test.ts"), ts.test);
  try {
    const p = python(spec, snippet("python3"));
    await Bun.write(join(dir, "py", "solution.py"), p.stub);
    await Bun.write(join(dir, "py", "test_solution.py"), p.test);
  } catch (e) {
    report.push(`${folder}: python: ${(e as Error).message}`);
  }
}

await Bun.write(join(BANK, "problems.json"), JSON.stringify(index, null, 2) + "\n");
console.log(report.join("\n") || "no issues");
console.log(`bank: ${index.length} problems`);
