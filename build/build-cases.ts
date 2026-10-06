// Maintainer script: hidden test cases + speed checks, from the specs in build/cases/specs/.
//   bun build/build-cases.ts [slug or folder prefix …]     (no arguments = every spec)
// For each problem: generate inputs from its spec, run BOTH reference solutions (TypeScript + Python),
// keep only the cases where they agree, measure the speed limit, and write build/extra-cases/<folder>.json.
// Then: bun build/build-bank.ts && bun build/validate.ts
import { mkdirSync, readdirSync, rmSync, symlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import { normalize, same } from "../runtime/ts/lib/cases";
import { rng, type CaseSpec } from "./cases/lib";
import { referenceSource, TS_PRELOAD } from "./refs";

const ROOT = join(import.meta.dir, "..");
const BANK = join(ROOT, "bank", "problems");
const WORK = join(ROOT, ".cache", "build-cases", String(process.pid)); // own folder, so runs can happen in parallel
const filters = process.argv.slice(2);

const specs: Record<string, CaseSpec> = {};
for (const f of readdirSync(join(import.meta.dir, "cases", "specs")).filter((f) => f.endsWith(".ts"))) {
  let mod: any;
  try {
    mod = await import(join(import.meta.dir, "cases", "specs", f));
  } catch (e) {
    console.log(`⚠ skipping specs/${f}: ${(e as Error).message.split("\n")[0]}`);
    continue;
  }
  for (const [slug, spec] of Object.entries(mod.specs as Record<string, CaseSpec>)) {
    if (specs[slug]) throw new Error(`${slug} is defined twice (${f})`);
    specs[slug] = spec;
  }
}
const index: any[] = await Bun.file(join(ROOT, "bank", "problems.json")).json();

// Sandboxes: lib/ and sleek/ next to problems/, like a workspace
rmSync(WORK, { recursive: true, force: true });
mkdirSync(join(WORK, "ts", "problems"), { recursive: true });
mkdirSync(join(WORK, "py", "problems"), { recursive: true });
symlinkSync(join(ROOT, "runtime", "ts", "lib"), join(WORK, "ts", "lib"));
symlinkSync(join(ROOT, "node_modules"), join(WORK, "ts", "node_modules"));
symlinkSync(join(ROOT, "runtime", "py", "sleek"), join(WORK, "py", "sleek"));
await Bun.write(join(WORK, "ts", "preload.ts"), TS_PRELOAD);

const key = (v: unknown) => JSON.stringify(v);
const spawn = async (cmd: string[], env: Record<string, string> = {}, timeoutMs = 120_000) => {
  const proc = Bun.spawn(cmd, { stdout: "pipe", stderr: "pipe", env: { ...process.env, ...env }, timeout: timeoutMs });
  const [out, err] = [await new Response(proc.stdout).text(), await new Response(proc.stderr).text()];
  return { code: await proc.exited, out, err, killed: proc.signalCode != null };
};
const pyEnv = { PYTHONPATH: join(WORK, "py"), PYTHONDONTWRITEBYTECODE: "1" };
const PY = ["uv", "run", "--quiet", "--no-project", "python"];

let failures = 0;
for (const [slug, spec] of Object.entries(specs)) {
  const p = index.find((x) => x.slug === slug);
  if (!p) { console.log(`✗ ${slug}: no such problem in bank/problems.json`); failures++; continue; }
  if (filters.length && !filters.some((f) => slug === f || p.folder.startsWith(f))) continue;
  const casesFile = join(BANK, p.folder, "cases.json");
  if (!existsSync(casesFile)) { console.log(`✗ ${p.folder}: hand-written problem, no cases.json`); failures++; continue; }
  const base = await Bun.file(casesFile).json();
  const examples = new Set(base.cases.filter((c: any) => c.name.startsWith("example")).map((c: any) => key(c.input)));
  const arity = base.call.kind === "design" ? 2 : base.call.params.length;

  // 1. Inputs
  const inputs: { name: string; input: unknown[] }[] = [];
  const seen = new Set(examples);
  const add = (name: string, input: unknown[]) => {
    if (!Array.isArray(input) || input.length !== arity) throw new Error(`${p.folder} ${name}: expected ${arity} values, got ${JSON.stringify(input)?.slice(0, 80)}`);
    if (!seen.has(key(input))) { seen.add(key(input)); inputs.push({ name, input }); }
  };
  try {
    (spec.edge ?? []).forEach((input, i) => add(`edge ${i + 1}`, input));
    for (let i = 0; i < (spec.random ? spec.count ?? 10 : 0); i++) add(`random ${i + 1}`, spec.random!(rng(1000 + i * 7919 + slug.length), i));
  } catch (e) {
    console.log(`✗ ${(e as Error).message}`);
    failures++;
    continue;
  }

  // 2. Both references answer every input
  const answers: Record<"ts" | "py", any[]> = { ts: [], py: [] };
  const header = { ...base, cases: [], perf: null };
  for (const lang of ["ts", "py"] as const) {
    const dir = join(WORK, lang, "problems", p.folder);
    mkdirSync(dir, { recursive: true });
    await Bun.write(join(dir, lang === "ts" ? "solution.ts" : "solution.py"), await referenceSource(p, lang));
    await Bun.write(join(dir, "cases.json"), JSON.stringify(header));
    await Bun.write(join(dir, "inputs.json"), JSON.stringify(inputs.map((x) => x.input)));
    const r = lang === "ts"
      ? await spawn(["bun", "--preload", join(WORK, "ts", "preload.ts"), join(import.meta.dir, "cases", "ts-driver.ts"), dir])
      : await spawn([...PY, join(import.meta.dir, "cases", "py_driver.py"), dir], pyEnv);
    try {
      answers[lang] = JSON.parse(r.out);
    } catch {
      console.log(`✗ ${p.folder}: ${lang} reference crashed: ${(r.err || r.out).trim().split("\n").slice(-3).join(" | ").slice(0, 300)}`);
      answers[lang] = inputs.map(() => ({ ok: false, error: "crashed" }));
    }
  }
  const kept: { name: string; input: unknown[]; output: unknown }[] = [];
  const dropped: string[] = [];
  inputs.forEach((x, i) => {
    const [t, py] = [answers.ts[i], answers.py[i]];
    // Keep a case only if both references agree (for validator problems: each answer is valid against the other)
    if (t?.ok && py?.ok && same(base, py.value, t.value, x.input) && same(base, t.value, py.value, x.input)) kept.push({ ...x, output: t.value });
    else dropped.push(`${x.name}: ${!t?.ok ? `ts error ${t?.error}` : !py?.ok ? `py error ${py?.error}` : `disagree ts=${key(t.value).slice(0, 60)} py=${key(py.value).slice(0, 60)}`}`);
  });
  // Rename so the numbering has no gaps
  const counters: Record<string, number> = {};
  for (const c of kept) { const kind = c.name.split(" ")[0]!; c.name = `${kind} ${(counters[kind] = (counters[kind] ?? 0) + 1)}`; }

  // 3. Speed check: time both references on the big input; limit = 10× their time (with a floor)
  let perf: any = null;
  let perfNote = "no speed check";
  if (spec.perf) {
    const times: Record<string, number | string> = {};
    for (const lang of ["ts", "py"] as const) {
      const dir = join(WORK, lang, "problems", p.folder);
      await Bun.write(join(dir, "cases.json"), JSON.stringify({ ...header, perf: { ...spec.perf, limit: { ts: 99, py: 99 } } }));
      const r = lang === "ts"
        ? await spawn(["bun", "--preload", join(WORK, "ts", "preload.ts"), join(ROOT, "runtime", "ts", "lib", "perf.ts"), dir], {}, 60_000)
        : await spawn([...PY, "-m", "sleek.perf", dir], pyEnv, 60_000);
      const last = r.out.trim().split("\n").at(-1) ?? "";
      try { const j = JSON.parse(last); times[lang] = j.error ? `error: ${j.error}` : j.seconds; } catch { times[lang] = r.killed ? "timed out" : `crashed: ${r.err.trim().split("\n").at(-1)?.slice(0, 120)}`; }
    }
    if (typeof times.ts === "number" && typeof times.py === "number") {
      // A NeetCode reference can itself be suboptimal (e.g. indexOf in a loop). The same algorithm is never slower
      // in TypeScript than in Python, and Python is at most ~30× slower, so each limit uses the better evidence.
      const best = { ts: Math.min(times.ts, times.py), py: Math.min(times.py, times.ts * 30) };
      const limit = { ts: Math.max(0.5, +(best.ts * 10).toFixed(2)), py: Math.max(1.5, +(best.py * 10).toFixed(2)) };
      perf = { ...spec.perf, limit };
      perfNote = `speed: ts ${times.ts.toFixed(3)}s→limit ${limit.ts}s, py ${times.py.toFixed(3)}s→limit ${limit.py}s`;
      if (times.ts > 3 || times.py > 5) { perfNote += " ⚠ reference itself is slow, shrink the input"; failures++; }
      // Does the limit catch a deliberately slow solution?
      if (spec.slow) {
        const dir = join(WORK, "ts", "problems", `${p.folder}--slow`);
        mkdirSync(dir, { recursive: true });
        await Bun.write(join(dir, "solution.ts"), spec.slow);
        await Bun.write(join(dir, "cases.json"), JSON.stringify({ ...header, perf }));
        const r = await spawn(["bun", join(ROOT, "runtime", "ts", "lib", "perf.ts"), dir], {}, (limit.ts + 3) * 1000);
        const last = r.out.trim().split("\n").at(-1) ?? "";
        let caught = r.killed;
        try { const j = JSON.parse(last); caught ||= j.seconds > limit.ts; if (j.error) perfNote += ` ⚠ slow solution errored: ${j.error}`; } catch {}
        perfNote += caught ? " · catches the slow solution ✓" : " · ⚠ does NOT catch the slow solution";
        if (!caught) failures++;
      }
    } else {
      perfNote = `⚠ speed check failed: ts ${times.ts}, py ${times.py}`;
      failures++;
    }
  }

  await Bun.write(join(import.meta.dir, "extra-cases", `${p.folder}.json`), JSON.stringify({ cases: kept, perf }, null, 1) + "\n");
  const status = dropped.length > inputs.length / 2 || !kept.length ? "⚠" : "✓";
  if (status === "⚠") failures++;
  console.log(`${status} ${p.folder}: ${kept.length} cases kept${dropped.length ? `, ${dropped.length} dropped` : ""} · ${perfNote}`);
  for (const d of dropped.slice(0, 4)) console.log(`    dropped ${d}`);
}
rmSync(WORK, { recursive: true, force: true });
process.exit(failures ? 1 : 0);
