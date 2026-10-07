// sk drill: flashcards for the first two minutes of an interview. Read a problem, name the pattern and the
// target complexity, no coding. Uses data we already have (problem text, pattern, NeetCode target) — no AI.
import * as p from "@clack/prompts";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { same, targetParts, verdict } from "../core/complexity";
import { parse } from "../core/args";
import { diffColor } from "../ui/colors";
import { hintsFile, problemDir, type Problem, type Workspace } from "../core/workspace";
import { solvedFolders } from "../core/attempts";
import { bold, c } from "../ui/colors";
import { COMPLEXITIES, pickComplexity, ask } from "./log";

type Drill = { at: string; folder: string; pattern: { correct: boolean }; time: boolean | null; space: boolean | null };

const drillsFile = (ws: Workspace) => join(ws.dir, ".sleekcode", "drills.json");
const loadDrills = async (ws: Workspace): Promise<Drill[]> =>
  existsSync(drillsFile(ws)) ? Bun.file(drillsFile(ws)).json().catch(() => []) : [];
async function saveDrill(ws: Workspace, d: Drill) {
  const all = [...(await loadDrills(ws)), d];
  mkdirSync(join(ws.dir, ".sleekcode"), { recursive: true });
  await Bun.write(drillsFile(ws), JSON.stringify(all, null, 2) + "\n");
}

/** The problem statement and examples only — no pattern (it's in the header) and no follow-up (it leaks the target). */
function statement(readme: string): string {
  const start = readme.search(/^##\s+Problem/im);
  let body = start >= 0 ? readme.slice(readme.indexOf("\n", start) + 1) : readme;
  const stop = body.search(/^#{2,3}\s+(Constraints|Follow[\s-]?up)/im);
  if (stop >= 0) body = body.slice(0, stop);
  const clean = body.replace(/\*\*/g, "").replace(/`/g, "").replace(/\b_([^_]+)_\b/g, "$1").replace(/\\([[\]()*_~`#>+\-.!])/g, "$1").trim();
  const lines = clean.split("\n");
  return (lines.length > 26 ? [...lines.slice(0, 26), c.dim("  …")] : lines).join("\n");
}

/** Grade a complexity guess against the target part: true/false, or null when there's no target to check. */
function grade(guess: string, target?: string): boolean | null {
  if (!target) return null;
  if (!guess) return false; // "not sure"
  return same(guess, target) || verdict(guess, target) === "met";
}
const mark = (ok: boolean | null) => (ok === null ? c.dim("—") : ok ? c.green("✓") : c.red("✗"));

export async function drill(ws: Workspace, args: string[]) {
  const { values } = parse("drill", args);
  const patterns = [...new Set(ws.problems.map((x) => x.pattern))]; // study order

  // The pool: all problems by default, or one pattern, or only solved ones (--solved)
  let pool = ws.problems.filter((x) => !x.paid); // paid problems have no statement to show
  if (values.pattern) {
    const want = String(values.pattern).toLowerCase();
    const match = patterns.find((p) => p.toLowerCase().includes(want));
    if (!match) return console.log(`\n  ${c.amber(`No pattern matching "${values.pattern}".`)} ${c.muted("Try one of:")} ${patterns.map((p) => c.ink(p)).join(c.muted(", "))}\n`);
    pool = pool.filter((x) => x.pattern === match);
  }
  if (values.solved) {
    const solved = await solvedFolders(ws);
    pool = pool.filter((x) => solved.has(x.folder));
    if (!pool.length) return console.log(`\n  ${c.muted("You haven't solved anything matching that yet.")} ${c.muted("Drop --solved to drill from every problem.")}\n`);
  }
  const count = Math.min(Number(values.count) || 5, pool.length);
  const picks = [...pool].sort(() => Math.random() - 0.5).slice(0, count);

  p.intro(`${bold("Pattern drill")} ${c.muted(`· ${count} card${count > 1 ? "s" : ""} · name the pattern and the target, no coding`)}`);
  let gotPattern = 0, gotTime = 0, timeGradable = 0;

  for (const [i, prob] of picks.entries()) {
    const readme = await Bun.file(join(problemDir(ws, prob), "README.md")).text().catch(() => "");
    const target = existsSync(hintsFile(ws, prob)) ? (await Bun.file(hintsFile(ws, prob)).json().catch(() => null))?.target : null;
    const [tTime, tSpace] = targetParts(target);

    // Show the problem — difficulty yes, pattern no
    p.log.message(`${c.muted(`${i + 1}/${count}`)}  ${bold(c.ink(prob.title))}  ${diffColor[prob.difficulty](prob.difficulty)}\n\n${c.body(statement(readme))}`);

    const opts = ws.config.complexities?.length ? ws.config.complexities : COMPLEXITIES;
    const guessPattern = ask(await p.select({
      message: "Which pattern?",
      maxItems: 10,
      options: patterns.map((p) => ({ value: p, label: p })),
    }));
    const guessTime = await pickComplexity("time", opts);
    const guessSpace = await pickComplexity("space", opts);

    // Grade
    const okPattern = guessPattern === prob.pattern;
    const okTime = grade(guessTime, tTime);
    const okSpace = grade(guessSpace, tSpace);
    if (okPattern) gotPattern++;
    if (okTime !== null) { timeGradable++; if (okTime) gotTime++; }

    const lines = [
      `${okPattern ? c.green("✓ Pattern") : c.red("✗ Pattern")}  ${okPattern ? c.body(prob.pattern) : `you said ${c.amber(String(guessPattern))}, it's ${c.ink(prob.pattern)}`}`,
      `${mark(okTime)} Time      ${tTime ? (okTime ? c.body(tTime) : `you said ${c.amber(guessTime || "not sure")}, target ${c.ink(tTime)}`) : c.dim("no target recorded")}`,
      `${mark(okSpace)} Space     ${tSpace ? (okSpace ? c.body(tSpace) : `you said ${c.amber(guessSpace || "not sure")}, target ${c.ink(tSpace)}`) : c.dim("no target recorded")}`,
    ];
    p.log[okPattern && okTime !== false ? "success" : "warn"](lines.join("\n"));
    await saveDrill(ws, { at: new Date().toISOString(), folder: prob.folder, pattern: { correct: okPattern }, time: okTime, space: okSpace });
  }

  // Session score, plus lifetime pattern accuracy so weak patterns stand out
  const history = await loadDrills(ws);
  const byPattern = new Map<string, { n: number; ok: number }>();
  for (const d of history) {
    const pat = ws.problems.find((x) => x.folder === d.folder)?.pattern;
    if (!pat) continue;
    const e = byPattern.get(pat) ?? { n: 0, ok: 0 };
    byPattern.set(pat, { n: e.n + 1, ok: e.ok + (d.pattern.correct ? 1 : 0) });
  }
  const weak = [...byPattern.entries()].filter(([, v]) => v.n >= 3 && v.ok / v.n < 0.6).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n);
  p.outro(
    `${c.green("Done.")} This session: pattern ${c.ink(`${gotPattern}/${count}`)}${timeGradable ? `, time ${c.ink(`${gotTime}/${timeGradable}`)}` : ""}.` +
      (weak.length ? `\n  ${c.muted("Worth more drilling:")} ${weak.slice(0, 3).map(([p]) => c.amber(p)).join(c.muted(", "))} ${c.muted("(sk drill -p …)")}` : ""),
  );
}
