// Runs a reference solution on many inputs: bun ts-driver.ts <problem dir with solution.ts, cases.json, inputs.json>
import { join } from "node:path";
import { run } from "../../runtime/ts/lib/cases";

const dir = process.argv[2]!;
const file = await Bun.file(join(dir, "cases.json")).json();
const inputs: unknown[][] = await Bun.file(join(dir, "inputs.json")).json();
const mod = await import(join(dir, "solution.ts"));
for (const m of ["log", "info", "debug", "warn"] as const) console[m] = () => {};
const out = inputs.map((input) => {
  try {
    return { ok: true, value: run(file, mod, input) ?? null };
  } catch (e) {
    return { ok: false, error: String((e as Error).message).slice(0, 200) };
  }
});
process.stdout.write(JSON.stringify(out));
