// Reference solutions (maintainer tooling): NeetCode's, or ours in build/refs/<lang>/ where theirs is missing/broken.
// Used by validate.ts (tests must pass on them) and build-cases.ts (they compute the expected answers).
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const BANK = join(ROOT, "bank", "problems");

export const PY_PRELUDE = `from typing import *
import collections, heapq, math, bisect, itertools, functools, string, random
from collections import *
from heapq import *
from functools import *
from itertools import *
from bisect import *
from math import inf
from sleek import ListNode, TreeNode
`;

let nc: any[] | null = null;
async function neetcodeCode(slug: string): Promise<string> {
  nc ??= await Bun.file(join(ROOT, ".cache", "neetcode-list.json")).json();
  return nc!.find((x) => x.link.replace(/\/$/, "") === slug).code;
}

/** Source for a reference solution, ready to save as solution.ts / solution.py inside a problem folder */
export async function referenceSource(p: { folder: string; slug: string }, lang: "ts" | "py"): Promise<string> {
  const override = readdirSync(join(ROOT, "build", "refs", lang)).find((f) => f.startsWith(p.folder + "."));
  if (override) return Bun.file(join(ROOT, "build", "refs", lang, override)).text();
  const code = await neetcodeCode(p.slug);
  if (lang === "py") return PY_PRELUDE + (await Bun.file(join(ROOT, ".cache", "neetcode-py", `${code}.py`)).text());
  const base = join(ROOT, ".cache", "neetcode-solutions", code);
  let ref = await Bun.file(existsSync(base + ".ts") ? base + ".ts" : base + ".js").text();
  const casesFile = join(BANK, p.folder, "cases.json");
  const testFile = join(BANK, p.folder, "ts", "solution.test.ts");
  const exported = existsSync(casesFile)
    ? ((c) => (c.call.kind === "design" ? c.call.className : c.call.name))(await Bun.file(casesFile).json())
    : (await Bun.file(testFile).text()).match(/import \{ (\w+) \} from "\.\/solution"/)![1]!;
  const needs = ["ListNode", "TreeNode"].filter((t) => ref.includes(t) && !new RegExp(`^(export )?class ${t}\\b`, "m").test(ref));
  return (needs.length ? `import { ${needs.join(", ")} } from "../../lib";\n` : "") + ref + `\nexport { ${exported} };\n`;
}

/** NeetCode's TypeScript solutions use LeetCode's global priority queues */
export const TS_PRELOAD = `import * as PQ from "@datastructures-js/priority-queue";\nimport { Queue } from "@datastructures-js/queue";\nObject.assign(globalThis, PQ, { Queue });\n`;
