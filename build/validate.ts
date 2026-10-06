// Maintainer script: proves every test in bank/ is correct.
//   bun build/validate.ts [ts|py] [folder-prefix]
// 1. Each test file must FAIL against the blank stub.
// 2. Each test file must PASS against a reference solution:
//    build/refs/<lang>/<folder>.* if present, else NeetCode's solution from .cache/.
import { cpSync, existsSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import { referenceSource, TS_PRELOAD } from "./refs";

const ROOT = join(import.meta.dir, "..");
const BANK = join(ROOT, "bank", "problems");
const OUT = join(ROOT, ".cache", "validate");
const langs = process.argv[2] === "ts" || process.argv[2] === "py" ? [process.argv[2]] : ["ts", "py"];
const only = process.argv.find((a, i) => i > 1 && a !== "ts" && a !== "py");

const index: any[] = await Bun.file(join(ROOT, "bank", "problems.json")).json();

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
    await Bun.write(join(dir, "preload.ts"), TS_PRELOAD);
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

    let ref = await referenceSource(p, lang as "ts" | "py");
    if (lang === "ts" && /PriorityQueue|\bQueue\b/.test(ref)) ref = `import "../../preload.ts";\n` + ref;

    const run = async (solution: string) => {
      const d = join(dir, "problems", p.folder);
      rmSync(d, { recursive: true, force: true });
      mkdirSync(d, { recursive: true });
      cpSync(join(src, testFile), join(d, testFile));
      if (existsSync(join(BANK, p.folder, "cases.json"))) cpSync(join(BANK, p.folder, "cases.json"), join(d, "cases.json"));
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
      const lines = good.out.split("\n");
      const why = (lines.find((l) => /^error:|^E\s|FAILED|Too slow/.test(l.trim())) ?? lines.find((l) => /Error|assert|fail\)/.test(l)))?.trim().slice(0, 200);
      bad.push(`${p.folder}: fails against reference: ${why}`);
    }
  });
  failures += bad.length;
  console.log(`${lang}: ${problems.length - bad.length}/${problems.length} OK`);
  for (const b of bad.sort()) console.log(`  ✗ ${b}`);
}
process.exit(failures ? 1 : 0);
