// What a problem's test file runs (`sk test`): every case, plus a speed check.
import { describe, expect, test } from "bun:test";
import { dirname, join } from "node:path";
import { close, normalize, preview, run, VALIDATORS, type CaseFile } from "./cases";

/** A failure that's about your solution, not this file: no stack trace pointing in here */
function fail(message: string): never {
  const e = new Error(message);
  e.stack = `Error: ${message}`;
  throw e;
}

export function suite(data: unknown, mod: Record<string, any>, testFile: string) {
  const file = data as CaseFile;
  describe(file.title, () => {
    for (const c of file.cases) {
      test(`${c.name}: ${preview(file, c.input, 60)}`, () => {
        const actual = run(file, mod, c.input);
        if (file.compare.startsWith("validator:")) {
          if (!VALIDATORS[file.compare.slice(10)]!(c.input, actual, c.output))
            fail(`${JSON.stringify(actual)} isn't a correct answer (one correct answer: ${JSON.stringify(c.output)})`);
          return;
        }
        if (file.compare === "float") {
          if (!close(normalize("exact", actual), c.output)) fail(`Expected ${JSON.stringify(c.output)} (within 0.00001), got ${JSON.stringify(actual)}`);
          return;
        }
        expect(normalize(file.compare, actual)).toEqual(normalize(file.compare, c.output));
      });
    }
    const perf = file.perf;
    if (perf) {
      test(`fast enough: ${perf.about}`, () => {
        const dir = dirname(testFile);
        const proc = Bun.spawnSync(["bun", join(import.meta.dir, "perf.ts"), dir], {
          stdout: "pipe", stderr: "pipe", timeout: (perf.limit.ts + 5) * 1000,
        });
        const out = proc.stdout.toString().trim();
        if (proc.exitCode !== 0 && !out) {
          if (proc.signalCode) fail(`Too slow: still running after ${perf.limit.ts + 5}s on ${perf.about}. LeetCode would say Time Limit Exceeded.`);
          fail(proc.stderr.toString().trim().split("\n").slice(-6).join("\n") || "the speed check crashed");
        }
        const { seconds, error } = JSON.parse(out.split("\n").at(-1)!);
        if (error) fail(`On the big input (${perf.about}): ${error}`);
        if (seconds > perf.limit.ts)
          fail(`Too slow: ${seconds.toFixed(2)}s on ${perf.about} (limit ${perf.limit.ts}s). LeetCode would say Time Limit Exceeded. Try \`sk hint\` for the target complexity.`);
      }, (perf.limit.ts + 10) * 1000);
    }
  });
}
