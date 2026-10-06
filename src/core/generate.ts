// Turns LeetCode problem data into starting code + tests, for TypeScript and Python.
// Used by build/build-bank.ts (the NeetCode 150) and `sk add` (anything else).

// ---------- shared parsing ----------

export const decode = (s: string) =>
  s.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();

export function parseOutputs(content: string): string[] {
  const re = /Output:?\s*<\/strong>([\s\S]*?)(?=<strong|<b>|<\/pre>|<\/p>|<\/div>|Explanation)/g;
  return [...content.matchAll(re)].map((m) => decode(m[1]!.replace(/\n/g, "")));
}

type Param = { name: string; type: string };
export type Spec = {
  id: string; title: string; slug: string; difficulty: string; pattern: string; blind75: boolean;
  meta: any; inputs: string[]; outputs: string[]; anyOrder: boolean; deep: boolean;
};

const header = (s: Spec) => [`${s.id}. ${s.title} — ${s.difficulty}${s.blind75 ? " ⭐" : ""}`, `https://leetcode.com/problems/${s.slug}/`, `Pattern: ${s.pattern}`, "", "Full problem + examples in README.md"];

// ---------- TypeScript ----------

const tsArg = (type: string, json: string) =>
  type === "ListNode" ? `toList(${json})` : type === "TreeNode" ? `toTree(${json})` : type === "ListNode[]" ? `${json}.map(toList)` : json;
const tsResult = (type: string, expr: string) =>
  type === "ListNode" ? `fromList(${expr})` : type === "TreeNode" ? `fromTree(${expr})` : expr;

function tsStubBody(snippet: string): string {
  return snippet
    .replace(/\r/g, "")
    .replace(/\/\*\*[\s\S]*?Definition for[\s\S]*?\*\/\n*/, "")
    .replace(/^function /gm, "export function ")
    .replace(/^class /gm, "export class ")
    .replace(/\{\s*\n\s*\n?\s*\}/g, (m) => {
      const indent = m.match(/\n([ ]*)\}$/)?.[1] ?? "";
      return `{\n${indent}  throw new Error("Not implemented");\n${indent}}`;
    })
    .replace(/\n};/g, "\n}")
    .replace(/ {4}/g, "  ")
    .trim();
}

export function typescript(s: Spec, snippet: string): { stub: string; test: string } {
  const { meta } = s;
  const helpers = new Set<string>();
  const tests: string[] = [];
  let play = "";
  const cmp = s.deep ? "anyOrderDeep" : "anyOrder";

  if (meta.classname) {
    s.inputs.forEach((inp, i) => {
      const [ops, args] = inp.split("\n");
      tests.push(`  test("example ${i + 1}", () => {\n    const ops = ${ops};\n    const args = ${args};\n    expect(runOps(${meta.classname}, ops, args)).toEqual(${s.outputs[i]});\n  });`);
      if (i === 0) play = `  console.log(runOps(${meta.classname}, ${ops}, ${args}));`;
    });
    helpers.add("runOps");
  } else {
    const params: Param[] = meta.params;
    const ret: string = meta.return?.type ?? "void";
    s.inputs.forEach((inp, i) => {
      const lines = inp.split("\n");
      const args = params.map((p, j) => tsArg(p.type, lines[j]!));
      const expected = s.outputs[i]!;
      let body: string;
      if (ret === "void") {
        const p0 = params[0]!;
        const call = `${meta.name}(${[p0.name, ...args.slice(1)].join(", ")})`;
        body = `    const ${p0.name} = ${args[0]};\n    ${call};\n    expect(${tsResult(p0.type, p0.name)}).toEqual(${expected});`;
        if (i === 0) play = `  const ${p0.name} = ${args[0]};\n  ${call};\n  console.log(${tsResult(p0.type, p0.name)});`;
      } else {
        let call = tsResult(ret, `${meta.name}(${args.join(", ")})`);
        // JS multiplication can produce -0, which toEqual treats as different from 0
        if (s.slug === "product-of-array-except-self") call += ".map((x) => x + 0)";
        body = ret === "double"
          ? `    expect(${call}).toBeCloseTo(${expected}, 5);`
          : s.anyOrder ? `    expect(${cmp}(${call})).toEqual(${cmp}(${expected}));` : `    expect(${call}).toEqual(${expected});`;
        if (s.anyOrder && ret !== "double") helpers.add(cmp);
        if (i === 0) play = `  console.log(${call});`;
      }
      for (const t of [...params.map((p) => p.type), ret]) {
        if (t === "ListNode" || t === "ListNode[]") helpers.add("toList").add("fromList");
        if (t === "TreeNode") helpers.add("toTree").add("fromTree");
      }
      tests.push(`  test("example ${i + 1}", () => {\n${body}\n  });`);
    });
  }

  const types = ["ListNode", "TreeNode"].filter((t) => snippet.includes(t));
  const playHelpers = [...helpers].filter((h) => new RegExp(`\\b${h}\\b`).test(play));
  const imports = [...types, ...playHelpers];
  const stub =
    (imports.length ? `import { ${imports.join(", ")} } from "../../lib";\n\n` : "") +
    `/**\n${header(s).map((l) => ` *${l ? " " + l : ""}`).join("\n")}\n */\n${tsStubBody(snippet)}\n\n` +
    `// Scratchpad, for your own experiments: \`sk play --scratch\` runs this (\`sk play\` runs the examples)\nif (import.meta.main) {\n${play}\n}\n`;
  return { stub, test: TS_TEST };
}

// ---------- Python ----------

/** JSON value -> Python literal */
function py(v: unknown): string {
  if (v === null) return "None";
  if (v === true) return "True";
  if (v === false) return "False";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(py).join(", ")}]`;
  throw new Error(`can't convert ${JSON.stringify(v)}`);
}
const pyLit = (json: string) => py(JSON.parse(json));
const pyArg = (type: string, json: string) =>
  type === "ListNode" ? `to_list(${pyLit(json)})` : type === "TreeNode" ? `to_tree(${pyLit(json)})`
    : type === "ListNode[]" ? `[to_list(x) for x in ${pyLit(json)}]` : pyLit(json);
const pyResult = (type: string, expr: string) =>
  type === "ListNode" ? `from_list(${expr})` : type === "TreeNode" ? `from_tree(${expr})` : expr;

function pyStubBody(snippet: string): string {
  const lines = snippet.replace(/\r/g, "").split("\n");
  // Drop LeetCode's "# Definition for ..." comment block (we import the real classes)
  const start = lines[0]?.startsWith("# Definition for") ? lines.findIndex((l) => !l.startsWith("#")) : 0;
  const out: string[] = [];
  const body = lines.slice(start);
  for (let i = 0; i < body.length; i++) {
    const line = body[i]!;
    if (/^\s+$/.test(line)) continue; // LeetCode leaves whitespace-only lines as the empty bodies
    out.push(line);
    const def = line.match(/^(\s*)def .*:\s*$/);
    if (def) {
      const next = body.slice(i + 1).find((l) => l.trim() !== "");
      const nextIndent = next ? next.match(/^\s*/)![0].length : -1;
      if (!next || nextIndent <= def[1]!.length) out.push(`${def[1]}    raise NotImplementedError("Not implemented")`);
    }
  }
  // Blank line between methods
  // A method whose body is only a docstring ("Do not return anything…") still needs a raise
  for (let i = 0; i < out.length; i++) {
    const def = out[i]!.match(/^(\s*)def .*:\s*$/);
    if (!def || !/^\s+"""/.test(out[i + 1] ?? "")) continue;
    let end = i + 1;
    if (!/""".*"""/.test(out[end]!.trim()) || out[end]!.trim() === '"""') while (end + 1 < out.length && !out[++end]!.includes('"""'));
    const after = out.slice(end + 1).find((l) => l.trim() !== "");
    if (!after || after.match(/^\s*/)![0].length <= def[1]!.length)
      out.splice(end + 1, 0, `${def[1]}    raise NotImplementedError("Not implemented")`);
  }
  return out
    .join("\n")
    .replace(/(raise NotImplementedError\("Not implemented"\))\n(\s+def )/g, "$1\n\n$2")
    .replace(/\n{3,}(?=\s+def )/g, "\n\n")
    .trim();
}

export function python(s: Spec, snippet: string): { stub: string; test: string } {
  const { meta } = s;
  const helpers = new Set<string>();
  const tests: string[] = [];
  let play = "";
  let needsPytest = false;
  const cmp = s.deep ? "any_order_deep" : "any_order";

  if (meta.classname) {
    s.inputs.forEach((inp, i) => {
      const [ops, args] = inp.split("\n");
      tests.push(`def test_example_${i + 1}():\n    ops = ${pyLit(ops!)}\n    args = ${pyLit(args!)}\n    assert run_ops(${meta.classname}, ops, args) == ${pyLit(s.outputs[i]!)}`);
      if (i === 0) play = `    print(run_ops(${meta.classname}, ${pyLit(ops!)}, ${pyLit(args!)}))`;
    });
    helpers.add("run_ops");
  } else {
    const params: Param[] = meta.params;
    const ret: string = meta.return?.type ?? "void";
    s.inputs.forEach((inp, i) => {
      const lines = inp.split("\n");
      const args = params.map((p, j) => pyArg(p.type, lines[j]!));
      const expected = pyLit(s.outputs[i]!);
      let body: string;
      if (ret === "void") {
        const p0 = params[0]!;
        const call = `Solution().${meta.name}(${[p0.name, ...args.slice(1)].join(", ")})`;
        body = `    ${p0.name} = ${args[0]}\n    ${call}\n    assert ${pyResult(p0.type, p0.name)} == ${expected}`;
        if (i === 0) play = `    ${p0.name} = ${args[0]}\n    ${call}\n    print(${pyResult(p0.type, p0.name)})`;
      } else {
        const call = pyResult(ret, `Solution().${meta.name}(${args.join(", ")})`);
        if (ret === "double") needsPytest = true;
        body = ret === "double"
          ? `    assert ${call} == pytest.approx(${expected})`
          : s.anyOrder ? `    assert ${cmp}(${call}) == ${cmp}(${expected})` : `    assert ${call} == ${expected}`;
        if (s.anyOrder && ret !== "double") helpers.add(cmp);
        if (i === 0) play = `    print(${call})`;
      }
      for (const t of [...params.map((p) => p.type), ret]) {
        if (t === "ListNode" || t === "ListNode[]") helpers.add("to_list").add("from_list");
        if (t === "TreeNode") helpers.add("to_tree").add("from_tree");
      }
      tests.push(`def test_example_${i + 1}():\n${body}`);
    });
  }

  const body = pyStubBody(snippet);
  const typing = ["List", "Optional"].filter((t) => new RegExp(`\\b${t}\\[`).test(body));
  const types = ["ListNode", "TreeNode"].filter((t) => body.includes(t));
  const playHelpers = [...helpers].filter((h) => new RegExp(`\\b${h}\\(`).test(play));
  const imports = [...types, ...playHelpers];
  const stub =
    `"""\n${header(s).join("\n")}\n"""\n\n` +
    (typing.length ? `from typing import ${typing.join(", ")}\n\n` : "") +
    (imports.length ? `from sleek import ${imports.join(", ")}\n\n` : "") +
    `\n${body}\n\n\n# Scratchpad, for your own experiments: \`sk play --scratch\` runs this (\`sk play\` runs the examples)\nif __name__ == "__main__":\n${play}\n`;
  return { stub, test: PY_TEST };
}

// ---------- cases.json: the data every test, `sk play` and the speed check run from ----------

/** Problems where several different answers are correct: a validator decides (runtime cases.ts / cases.py) */
const COMPARE_OVERRIDE: Record<string, CaseFile["compare"]> = {
  "longest-palindromic-substring": "validator:longestPalindrome",
};

export type CaseFile = {
  title: string;
  call:
    | { kind: "function"; name: string; params: Param[]; returns: string }
    | { kind: "design"; className: string }
    | { kind: "custom"; adapter: string; params: Param[]; exports: string[] };
  compare: "exact" | "anyOrder" | "anyOrderDeep" | "float" | `validator:${string}`;
  cases: { name: string; input: unknown[]; output: unknown }[];
  perf: { input: unknown[]; about: string; limit: { ts: number; py: number } } | null;
};

/** The problem's examples as data; extra edge/random cases and the speed check are added by build/build-cases.ts */
export function caseFile(s: Spec): CaseFile {
  const { meta } = s;
  const ret: string = meta.return?.type ?? "void";
  return {
    title: `${s.id}. ${s.title}`,
    call: meta.classname
      ? { kind: "design", className: meta.classname }
      : { kind: "function", name: meta.name, params: meta.params.map((p: Param) => ({ name: p.name, type: p.type })), returns: ret },
    compare: COMPARE_OVERRIDE[s.slug] ?? (ret === "double" ? "float" : s.deep ? "anyOrderDeep" : s.anyOrder ? "anyOrder" : "exact"),
    cases: s.inputs.map((inp, i) => ({
      name: `example ${i + 1}`,
      input: inp.split("\n").map((line) => JSON.parse(line)),
      output: JSON.parse(s.outputs[i]!),
    })),
    perf: null,
  };
}

export const TS_TEST = `// Runs every case in cases.json (the examples plus hidden edge and random cases) and a speed check.
import { suite } from "../../lib/testing";
import cases from "./cases.json";
import * as solution from "./solution";

suite(cases, solution, import.meta.path);
`;

export const PY_TEST = `# Runs every case in cases.json (the examples plus hidden edge and random cases) and a speed check.
import pytest

import solution
from sleek.testing import check, check_perf, ids, load

FILE = load(__file__)


@pytest.mark.parametrize("case", FILE["cases"], ids=ids(FILE))
def test_case(case):
    check(FILE, solution, case)


def test_fast_enough():
    check_perf(FILE, __file__)
`;

/** Builds a Spec from a LeetCode API question */
export function specFrom(q: any, p: { id: string; title: string; slug: string; difficulty: string; pattern: string; blind75: boolean },
  opts: { anyOrder?: boolean; deep?: boolean } = {}): Spec {
  const meta = JSON.parse(q.metaData);
  const ret: string = meta.return?.type ?? "";
  const deep = !!opts.deep;
  return {
    ...p, meta, inputs: q.exampleTestcaseList, outputs: parseOutputs(q.content), deep,
    anyOrder: deep || !!opts.anyOrder || (/any order/i.test(q.content) && /\[\]|list</.test(ret)),
  };
}
