// The speed check, run in its own process so a too-slow solution can be stopped:
//   bun lib/perf.ts <problem folder>   → prints {"seconds": …} or {"error": …}
import { join, resolve } from "node:path";
import { run, type CaseFile } from "./cases";
import { build } from "./recipe";

for (const m of ["log", "info", "debug", "warn"] as const) console[m] = () => {}; // your logs would slow it down

const dir = resolve(process.argv[2] ?? ".");
const file: CaseFile = await Bun.file(join(dir, "cases.json")).json();
const mod = await import(join(dir, "solution.ts"));
const input = build(file.perf!.input) as unknown[];
const start = performance.now();
try {
  run(file, mod, input);
  process.stdout.write(JSON.stringify({ seconds: (performance.now() - start) / 1000 }) + "\n");
} catch (e) {
  process.stdout.write(JSON.stringify({ error: (e as Error).message }) + "\n");
}
