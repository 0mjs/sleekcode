import * as p from "@clack/prompts";
import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { addAttempt } from "../core/attempts";
import { parse } from "../core/args";
import { renderList } from "../core/list";
import { label, needProblem } from "../core/problem";
import { runOnce } from "../core/run";
import { hintsFile, problemDir, solutionFile, type Workspace } from "../core/workspace";
import { c } from "../ui/colors";
import type { Hints } from "./hint";

const cancelled = (v: unknown): v is symbol => p.isCancel(v);
const bail = () => {
  p.cancel("Nothing logged.");
  process.exit(0);
};

export async function log(ws: Workspace, args: string[]) {
  const { values, positionals } = parse("log", args);
  const prob = await needProblem(ws, positionals[0]);
  const dir = problemDir(ws, prob);

  // 1. Run the tests
  const spin = p.spinner();
  spin.start(`Running the tests for ${label(prob)}`);
  const output = (await runOnce(ws, prob, "test", true)).output.replace(/\x1b\[[0-9;]*m/g, "");
  const pass = Number(output.match(/(\d+) pass(ed)?/)?.[1] ?? 0);
  const fail = Number(output.match(/(\d+) fail(ed)?/)?.[1] ?? 0) + Number(output.match(/(\d+) error/)?.[1] ?? 0);
  const total = pass + fail;
  const ok = total > 0 && fail === 0;
  spin.stop(`Tests: ${ok ? c.green(`${pass}/${total} passed ✓`) : c.red(`${pass}/${total} passed`)}`);

  // 2. Timer + hints used
  const startedFile = join(dir, ".started");
  const elapsed = existsSync(startedFile) ? Math.round((Date.now() - Number(await Bun.file(startedFile).text())) / 60_000) : null;
  const usedFile = join(dir, ".hints-used");
  const hintData: Hints | null = existsSync(hintsFile(ws, prob)) ? await Bun.file(hintsFile(ws, prob)).json() : null;
  const steps = existsSync(usedFile) ? Number(await Bun.file(usedFile).text()) : 0;
  const hintsUsed = Math.max(0, steps - (hintData?.target ? 1 : 0)); // the target complexity isn't counted as help

  // 3. A few questions (skipped for anything passed as a flag)
  let minutes = values.minutes as string | undefined;
  if (minutes === undefined) {
    const v = await p.text({
      message: "How many minutes did it take?",
      placeholder: elapsed != null ? String(elapsed) : "e.g. 20",
      defaultValue: elapsed != null ? String(elapsed) : "",
      validate: (s) => (s && !/^\d+$/.test(s) ? "Just a number, please" : undefined),
    });
    if (cancelled(v)) bail();
    minutes = v as string;
  }

  let solo: boolean;
  if (values.solo !== undefined) solo = String(values.solo).toLowerCase().startsWith("y");
  else {
    const v = await p.confirm({
      message: hintsUsed ? `You used ${hintsUsed} hint${hintsUsed > 1 ? "s" : ""}. Did you solve it without other help?` : "Did you solve it on your own (no hints, no looking it up)?",
      initialValue: hintsUsed === 0,
    });
    if (cancelled(v)) bail();
    solo = v as boolean;
  }

  let complexity = values.complexity as string | undefined;
  if (complexity === undefined) {
    const v = await p.text({ message: "Time / space complexity of your solution?", placeholder: "e.g. O(n) / O(1)", defaultValue: "" });
    if (cancelled(v)) bail();
    complexity = v as string;
  }
  if (hintData?.target) p.note(hintData.target.replace(/`/g, ""), "🎯 NeetCode's target, how did you do?");

  let notes = values.notes as string | undefined;
  if (notes === undefined) {
    const v = await p.text({ message: "Notes? (optional)", placeholder: "the trick, a gotcha, what you'd do differently", defaultValue: "" });
    if (cancelled(v)) bail();
    notes = v as string;
  }

  // 4. Save everywhere
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  await addAttempt(ws, {
    at: now.toISOString(), folder: prob.folder, id: prob.id, title: prob.title, difficulty: prob.difficulty, pattern: prob.pattern,
    language: ws.language, pass, total, minutes: minutes ? Number(minutes) : null, solo, hints: hintsUsed, complexity, notes,
  });
  const esc = (s: string) => s.replaceAll("|", "\\|");
  const tests = `${pass}/${total} ${ok ? "✅" : "❌"}`;
  const soloCell = `${solo ? "✅" : "❌"}${hintsUsed ? ` 💡${hintsUsed}` : ""}`;
  const readme = join(dir, "README.md");
  await Bun.write(readme, (await Bun.file(readme).text()).trimEnd() + `\n| ${date} | ${tests} | ${minutes || "–"} | ${soloCell} | ${esc(complexity)} | ${esc(notes)} |\n`);
  const logFile = join(ws.dir, "LOG.md");
  await Bun.write(logFile, (await Bun.file(logFile).text()).trimEnd() +
    `\n| ${date} | [${label(prob)}](problems/${prob.folder}/README.md) | ${prob.difficulty} | ${tests} | ${minutes || "–"} | ${soloCell} | ${esc(complexity)} | ${esc(notes)} |\n`);

  const snapshots = join(dir, "attempts");
  mkdirSync(snapshots, { recursive: true });
  const ext = solutionFile(ws, prob).split(".").pop();
  let snap = join(snapshots, `${date}.${ext}`);
  for (let i = 2; existsSync(snap); i++) snap = join(snapshots, `${date}-${i}.${ext}`);
  copyFileSync(solutionFile(ws, prob), snap);

  await renderList(ws);
  rmSync(startedFile, { force: true });
  rmSync(usedFile, { force: true });
  p.outro(`${c.green("Logged.")} ${c.muted(`Your code is saved in attempts/. ${ok ? "Next one: sk next" : "Have another go, then sk log again."}`)}`);
}
