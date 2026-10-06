import * as p from "@clack/prompts";
import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { addAttempt, type Help } from "../core/attempts";
import { parse } from "../core/args";
import { formatDuration, parseDuration } from "../core/duration";
import { LANGUAGES } from "../core/languages";
import { renderRecords } from "../core/records";
import { label, needProblem } from "../core/problem";
import { runOnce } from "../core/run";
import { hintsFile, problemDir, solutionFile, type Workspace } from "../core/workspace";
import { c } from "../ui/colors";
import type { Hints } from "./hint";

/** The usual suspects, slowest-growing first. Override with "complexities" in ~/.config/sleekcode/config.json */
export const COMPLEXITIES = ["O(1)", "O(log n)", "O(√n)", "O(n)", "O(n log n)", "O(n log k)", "O(n · k)", "O(n + m)", "O(m · n)", "O(V + E)", "O(n²)", "O(n³)", "O(2ⁿ)", "O(n!)"];

const OTHER = "__other__";
const SKIP = "__skip__";

const bail = () => {
  p.cancel("Nothing logged.");
  process.exit(0);
};
export const ask = <T>(v: T): Exclude<T, symbol> => (p.isCancel(v) ? bail() : v) as Exclude<T, symbol>;

/** O(N²) / O(n^2) / O(n*n) → one comparable form */
export function norm(s: string): string {
  return s.toLowerCase().replace(/\s|\*|·|×/g, "").replace(/²/g, "^2").replace(/³/g, "^3").replace(/ⁿ/g, "^n")
    .replace(/√n|sqrt\(n\)/g, "sqrtn").replace(/n\^2|n\.n|nn(?!a)/g, "n^2");
}
/** Position on the usual growth ladder, or -1 if it isn't a simple one-variable class */
const LADDER = ["o(1)", "o(logn)", "o(sqrtn)", "o(n)", "o(nlogn)", "o(n^2)", "o(n^3)", "o(2^n)", "o(n!)"];
const rank = (s: string) => LADDER.indexOf(norm(s));

/** Same complexity? Also treats O(m·n) and O(n·m) as the same */
export const same = (a: string, b: string) => norm(a) === norm(b) || [...norm(a)].sort().join("") === [...norm(b)].sort().join("");

export async function pickComplexity(kind: "time" | "space", options: string[], current?: string): Promise<string> {
  const known = current ? options.find((o) => same(o, current)) : undefined;
  const v = ask(await p.select({
    message: `${kind === "time" ? "Time" : "Space"} complexity of your solution?`,
    initialValue: known ?? (current ? OTHER : current === "" ? SKIP : kind === "time" ? "O(n)" : "O(1)"),
    maxItems: 9,
    options: [
      ...options.map((o) => ({ value: o, label: o })),
      { value: OTHER, label: "Other…", hint: "type it" },
      { value: SKIP, label: "Not sure", hint: "skip" },
    ],
  }));
  if (v === SKIP) return "";
  if (v !== OTHER) return v as string;
  return ask(await p.text({ message: `${kind === "time" ? "Time" : "Space"} complexity`, placeholder: "e.g. O(n · 2ⁿ)", initialValue: known ? "" : current ?? "", defaultValue: "" })) as string;
}

export async function pickHelp(hintsUsed: number, current: Help = "none"): Promise<Help> {
  return ask(await p.select<Help>({
    message: hintsUsed ? `How did you solve it? ${c.muted(`(${hintsUsed} hint${hintsUsed > 1 ? "s" : ""} used, that's fine)`)}` : "How did you solve it?",
    initialValue: current,
    options: [
      { value: "none", label: "On my own", hint: "no AI, no looking up the answer" },
      { value: "ai", label: "Used AI", hint: "ChatGPT, Claude, Copilot…" },
      { value: "lookup", label: "Looked at a solution or video" },
      { value: "person", label: "Someone helped me" },
    ],
  }));
}

export async function log(ws: Workspace, args: string[]) {
  const { values, positionals } = parse("log", args);
  const prob = await needProblem(ws, positionals[0]);
  const dir = problemDir(ws, prob);
  const lang = LANGUAGES[ws.language];

  // 1. Run the tests
  const spin = p.spinner();
  spin.start(`Running the ${lang.name} tests for ${label(prob)}`);
  const output = (await runOnce(ws, prob, "test", true)).output.replace(/\x1b\[[0-9;]*m/g, "");
  const pass = Number(output.match(/(\d+) pass(ed)?/)?.[1] ?? 0);
  const fail = Number(output.match(/(\d+) fail(ed)?/)?.[1] ?? 0) + Number(output.match(/(\d+) error/)?.[1] ?? 0);
  const total = pass + fail;
  const ok = total > 0 && fail === 0;
  spin.stop(`Tests: ${ok ? c.green(`${pass}/${total} passed ✓`) : c.red(`${pass}/${total} passed`)}`);

  // 2. Time: from the timer if it's running, otherwise ask (any format)
  const startedFile = join(dir, ".started");
  let seconds: number | null = null;
  if (values.time !== undefined) {
    seconds = parseDuration(String(values.time));
  } else if (existsSync(startedFile)) {
    seconds = Math.max(1, Math.round((Date.now() - Number(await Bun.file(startedFile).text())) / 1000));
    p.log.info(`Time: ${c.ink(formatDuration(seconds))} ${c.muted("(from your timer)")}`);
  } else {
    const v = ask(await p.text({
      message: "How long did it take?",
      placeholder: "25  ·  1h 10m  ·  90s   (Enter to skip; sk start times it for you)",
      defaultValue: "",
      validate: (s) => (s && parseDuration(s) == null ? "Try something like 25, 25m, 1h 10m or 90s" : undefined),
    }));
    seconds = v ? parseDuration(v) : null;
  }

  // 3. How did you solve it? (Hints are tracked on their own and are fine to use)
  const usedFile = join(dir, ".hints-used");
  const hintData: Hints | null = existsSync(hintsFile(ws, prob)) ? await Bun.file(hintsFile(ws, prob)).json() : null;
  const steps = existsSync(usedFile) ? Number(await Bun.file(usedFile).text()) : 0;
  const hintsUsed = Math.max(0, steps - (hintData?.target ? 1 : 0)); // the target complexity isn't counted
  let help: Help;
  if (values.solo !== undefined) help = String(values.solo).toLowerCase().startsWith("y") ? "none" : "lookup";
  else {
    help = await pickHelp(hintsUsed);
  }

  // 4. Complexity, then a check against NeetCode's target
  let complexity = values.complexity as string | undefined;
  let time = "", space = "";
  if (complexity === undefined) {
    const options = ws.config.complexities?.length ? ws.config.complexities : COMPLEXITIES;
    time = await pickComplexity("time", options);
    space = await pickComplexity("space", options);
    complexity = [time, space].filter(Boolean).join(" / ");
  } else [time = "", space = ""] = complexity.split("/").map((x) => x.trim());

  if (hintData?.target) {
    const [tTime, tSpace] = hintData.target.match(/O\([^)]*\)/g) ?? [];
    const verdict = (yours: string, target?: string) => {
      if (!target) return "";
      if (!yours) return `${c.muted("target")} ${c.ink(target)}`;
      if (same(yours, target)) return `${c.green("✓")} ${c.ink(target)}`;
      const [y, t] = [rank(yours), rank(target)];
      if (y >= 0 && t >= 0 && y < t) return `${c.green("✓✓")} ${c.ink(yours)} ${c.muted(`· better than the target ${target}`)}`;
      return `${c.amber("✗")} ${c.muted("you")} ${c.ink(yours)} ${c.muted("· target")} ${c.ink(target)}`;
    };
    if (tTime || tSpace) p.log.message(`🎯 ${c.muted("Time")}  ${verdict(time, tTime)}     ${c.muted("Space")}  ${verdict(space, tSpace)}`);
  }

  let notes = values.notes as string | undefined;
  if (notes === undefined) notes = ask(await p.text({ message: "Notes? (optional)", placeholder: "the trick, a gotcha, what you'd do differently", defaultValue: "" })) as string;

  // 5. Save: snapshot your code, record the attempt, regenerate LOG.md / README / LIST.md
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  mkdirSync(join(dir, "attempts"), { recursive: true });
  let snapshot = `attempts/${date}.${lang.ext}`;
  for (let i = 2; existsSync(join(dir, snapshot)); i++) snapshot = `attempts/${date}-${i}.${lang.ext}`;
  copyFileSync(solutionFile(ws, prob), join(dir, snapshot));

  await addAttempt(ws, {
    at: now.toISOString(), folder: prob.folder, id: prob.id, title: prob.title, difficulty: prob.difficulty, pattern: prob.pattern,
    language: ws.language, pass, total, seconds, minutes: seconds == null ? null : Math.max(1, Math.round(seconds / 60)),
    help, solo: help === "none", hints: hintsUsed, complexity, notes, snapshot,
  });
  await renderRecords(ws, [prob.folder]);
  rmSync(startedFile, { force: true });
  rmSync(usedFile, { force: true });
  p.outro(`${c.green("Logged.")} ${c.muted(ok ? "Next one: sk next" : "Have another go, then sk log again.")}`);
}
