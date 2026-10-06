// next, open, which, start, play, test, reset
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { dueNow, loadAttempts, solvedFolders } from "../core/attempts";
import { parse } from "../core/args";
import { openInEditor } from "../core/editor";
import { ensureProblemFiles } from "../core/materialize";
import { label, needProblem } from "../core/problem";
import { runOnce, runWatching, type Kind } from "../core/run";
import { problemDir, setCurrent, solutionFile, stubFile, type Problem, type Workspace } from "../core/workspace";
import { bold, c, diffColor } from "../ui/colors";

export const describe = (p: Problem) =>
  `${bold(c.ink(label(p)))} ${c.muted("·")} ${diffColor[p.difficulty](p.difficulty)} ${c.muted("·")} ${c.body(p.pattern)}${p.blind75 ? c.amber(" ⭐") : ""}`;

export async function select(ws: Workspace, p: Problem) {
  await ensureProblemFiles(ws, p);
  await setCurrent(ws, p);
  openInEditor(ws, [join(problemDir(ws, p), "README.md"), solutionFile(ws, p)]);
}

export async function next(ws: Workspace, args: string[]) {
  const { values } = parse("next", args);
  const attempts = await loadAttempts(ws);
  const due = dueNow(ws, attempts).length;
  if (due) console.log(`\n  ${c.amber(`🔁 ${due} problem${due > 1 ? "s" : ""} due for review.`)} ${c.muted("Consider")} ${c.ink("sk review")} ${c.muted("first.")}`);
  const solved = await solvedFolders(ws);
  const p = ws.problems.find((x) => !solved.has(x.folder) && (!values.blind || x.blind75));
  if (!p) return console.log(`\n  🎉 ${c.green("Nothing left. You've solved them all!")}\n`);
  console.log(`\n  → ${describe(p)}`);
  console.log(`    ${c.muted("sk start → sk test -w / sk play -w → sk hint (if stuck) → sk log")}\n`);
  await select(ws, p);
}

export async function open(ws: Workspace, args: string[]) {
  const { positionals } = parse("open", args);
  if (!positionals[0]) return console.log(`\n  ${c.amber("Which one?")} e.g. ${c.ink("sk open 217")}\n`);
  const p = await needProblem(ws, positionals[0]);
  console.log(`\n  → ${describe(p)}\n`);
  await select(ws, p);
}

export async function which(ws: Workspace, args: string[]) {
  const p = await needProblem(ws, parse("which", args).positionals[0]);
  console.log(`\n  ${describe(p)}\n  ${c.muted(problemDir(ws, p))}\n`);
}

export async function start(ws: Workspace, args: string[]) {
  const p = await needProblem(ws, parse("start", args).positionals[0]);
  await Bun.write(join(problemDir(ws, p), ".started"), String(Date.now()));
  await setCurrent(ws, p);
  console.log(`\n  ⏱  ${c.green("Timer started")} for ${describe(p)}`);
  console.log(`     ${c.muted("Then:")} ${c.ink("sk test -w")} ${c.muted("·")} ${c.ink("sk play -w")} ${c.muted("·")} ${c.ink("sk hint")} ${c.muted("·")} ${c.ink("sk log")}\n`);
}

export async function run(ws: Workspace, command: "test" | "play", args: string[]) {
  const { values, positionals } = parse(command, args);
  const p = await needProblem(ws, positionals[0]);
  // Problems with custom checks (no cases.json) have no example runner: play runs the scratchpad
  const kind: Kind = command === "play" && (values.scratch || !existsSync(join(problemDir(ws, p), "cases.json"))) ? "scratch" : command;
  console.log(c.muted(`→ ${label(p)}${kind === "scratch" && command === "play" ? " (your scratchpad)" : ""}`));
  if (values.watch) await runWatching(ws, p, kind);
  process.exit((await runOnce(ws, p, kind)).code);
}

/** Puts the blank stub back, saving your code to attempts/ first if it isn't already saved there */
export async function resetSolution(ws: Workspace, p: Problem): Promise<string | null> {
  const solution = solutionFile(ws, p);
  const current = await Bun.file(solution).text();
  const snapshots = join(problemDir(ws, p), "attempts");
  const saved =
    current === (await Bun.file(stubFile(ws, p)).text()) ||
    (existsSync(snapshots) && (await Promise.all(readdirSync(snapshots).map((f) => Bun.file(join(snapshots, f)).text()))).includes(current));
  let savedTo: string | null = null;
  if (!saved) {
    mkdirSync(snapshots, { recursive: true });
    const ext = solution.split(".").pop();
    const date = new Date().toISOString().slice(0, 10);
    savedTo = join(snapshots, `${date}-unlogged.${ext}`);
    for (let i = 2; existsSync(savedTo); i++) savedTo = join(snapshots, `${date}-unlogged-${i}.${ext}`);
    copyFileSync(solution, savedTo);
  }
  copyFileSync(stubFile(ws, p), solution);
  return savedTo;
}

export async function reset(ws: Workspace, args: string[]) {
  const p = await needProblem(ws, parse("reset", args).positionals[0]);
  const saved = await resetSolution(ws, p);
  console.log(`\n  🧹 ${label(p)}: ${c.green("solution is blank again.")}`);
  console.log(`     ${c.muted(saved ? `Your previous code was saved to attempts/${saved.split("/").pop()}` : "Your previous code was already saved in attempts/.")}\n`);
}
