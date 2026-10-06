// Maintainer script: proves every test in bank/ is correct.
//   bun build/validate.ts [ts|py] [folder-prefix]
// 1. Each test file must FAIL against the blank stub.
// 2. Each test file must PASS against a reference solution:
//    build/refs/<lang>/<folder>.* if present, else NeetCode's solution from .cache/.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const BANK = join(ROOT, "bank", "problems");
const OUT = join(ROOT, ".cache", "validate");
const langs = process.argv[2] === "ts" || process.argv[2] === "py" ? [process.argv[2]] : ["ts", "py"];
const only = process.argv.find((a, i) => i > 1 && a !== "ts" && a !== "py");

const index: any[] = await Bun.file(join(ROOT, "bank", "problems.json")).json();
const nc: any[] = await Bun.file(join(ROOT, ".cache", "neetcode-list.json")).json();
const code = (slug: string) => nc.find((x) => x.link.replace(/\/$/, "") === slug).code;

const PY_PRELUDE = `from typing import *
import collections, heapq, math, bisect, itertools, functools, string, random
from collections import *
from heapq import *
from functools import *
from itertools import *
from bisect import *
from math import inf
from sleek import ListNode, TreeNode
`;

async function pool<T>(items: T[], size: number, fn: (t: T) => Promise<void>) {
  const queue = [...items];
  await Promise.all(Array.from({ length: size }, async () => { while (queue.length) await fn(queue.shift()!); }));
}

let failures = 0;
for (const lang of langs) {
  const dir = join(OUT, lang);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, "problems"), { recursive: true });
  if (lang === "ts") {
    symlinkSync(join(ROOT, "runtime", "ts", "lib"), join(dir, "lib"));
    symlinkSync(join(ROOT, "node_modules"), join(dir, "node_modules"));
    await Bun.write(join(dir, "preload.ts"), `import * as PQ from "@datastructures-js/priority-queue";\nimport { Queue } from "@datastructures-js/queue";\nObject.assign(globalThis, PQ, { Queue });\n`);
  } else {
    symlinkSync(join(ROOT, "runtime", "py", "sleek"), join(dir, "sleek"));
  }

  const problems = index.filter((p) => !only || p.folder.startsWith(only));
  const bad: string[] = [];
  await pool(problems, 8, async (p) => {
    const src = join(BANK, p.folder, lang);
    const testFile = lang === "ts" ? "solution.test.ts" : "test_solution.py";
    const solFile = lang === "ts" ? "solution.ts" : "solution.py";
    if (!existsSync(join(src, testFile))) return void bad.push(`${p.folder}: no ${testFile}`);

    // reference solution
    const override = readdirSync(join(ROOT, "build", "refs", lang)).find((f) => f.startsWith(p.folder + "."));
    let ref: string;
    if (override) ref = await Bun.file(join(ROOT, "build", "refs", lang, override)).text();
    else if (lang === "py") ref = PY_PRELUDE + (await Bun.file(join(ROOT, ".cache", "neetcode-py", `${code(p.slug)}.py`)).text());
    else {
      const base = join(ROOT, ".cache", "neetcode-solutions", code(p.slug));
      ref = await Bun.file(existsSync(base + ".ts") ? base + ".ts" : base + ".js").text();
      const exported = (await Bun.file(join(src, testFile)).text()).match(/import \{ (\w+) \} from "\.\/solution"/)![1]!;
      const needs = ["ListNode", "TreeNode"].filter((t) => ref.includes(t) && !new RegExp(`^(export )?class ${t}\\b`, "m").test(ref));
      ref = (needs.length ? `import { ${needs.join(", ")} } from "../../lib";\n` : "") + ref + `\nexport { ${exported} };\n`;
    }

    const run = async (solution: string) => {
      const d = join(dir, "problems", p.folder);
      rmSync(d, { recursive: true, force: true });
      mkdirSync(d, { recursive: true });
      cpSync(join(src, testFile), join(d, testFile));
      await Bun.write(join(d, solFile), solution);
      const cmd = lang === "ts"
        ? ["bun", "test", "--timeout", "10000", "--preload", join(dir, "preload.ts")]
        : ["uv", "run", "--quiet", "--no-project", "--with", "pytest", "pytest", "-q", "-p", "no:cacheprovider", "--no-header"];
      const proc = Bun.spawn(cmd, { cwd: d, stdout: "pipe", stderr: "pipe", env: { ...process.env, PYTHONPATH: dir, PYTHONDONTWRITEBYTECODE: "1" } });
      const out = (await new Response(proc.stdout).text()) + (await new Response(proc.stderr).text());
      return { ok: (await proc.exited) === 0, out };
    };

    const stub = await run(await Bun.file(join(src, solFile)).text());
    if (stub.ok) bad.push(`${p.folder}: passes against the blank stub`);
    const good = await run(ref);
    if (!good.ok) {
      const why = good.out.split("\n").find((l) => /Error|error:|assert|FAILED|fail\)/.test(l))?.trim().slice(0, 160);
      bad.push(`${p.folder}: fails against reference: ${why}`);
    }
  });
  failures += bad.length;
  console.log(`${lang}: ${problems.length - bad.length}/${problems.length} OK`);
  for (const b of bad.sort()) console.log(`  ✗ ${b}`);
}
process.exit(failures ? 1 : 0);
