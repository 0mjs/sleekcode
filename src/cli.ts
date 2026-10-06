#!/usr/bin/env bun
// SleekCode: `sk` (or `sleek`). Run with no arguments for help.
import { existsSync } from "node:fs";
import { dueNow, loadAttempts, solvedFolders } from "./core/attempts";
import { EDITORS, loadConfig } from "./core/config";
import { LANGUAGES } from "./core/languages";
import { lang } from "./commands/lang";
import { tilde } from "./core/paths";
import { label } from "./core/problem";
import { currentWorkspace, resolveProblem, type Workspace } from "./core/workspace";
import { hint } from "./commands/hint";
import { log } from "./commands/log";
import { add, list, sync, update } from "./commands/manage";
import { next, open, reset, run, start, which } from "./commands/practice";
import { review } from "./commands/review";
import { configure, onboarding } from "./commands/setup";
import { stats } from "./commands/stats";
import { c } from "./ui/colors";
import { ALL, commandHelp, help } from "./ui/help";

const [cmd, ...rest] = process.argv.slice(2);

/** Edit distance, for "did you mean" (counts a swap of two letters as one edit) */
function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0]![j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      d[i]![j] = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i]![j] = Math.min(d[i]![j]!, d[i - 2]![j - 2]! + 1);
    }
  return d[a.length]![b.length]!;
}

async function status(ws: Workspace): Promise<string[]> {
  const attempts = await loadAttempts(ws);
  const solved = (await solvedFolders(ws)).size;
  const due = dueNow(ws, attempts).length;
  const current = await resolveProblem(ws);
  return [
    `  ${c.muted("Workspace")}  ${c.ink(tilde(ws.dir))} ${c.muted(`· ${EDITORS[ws.config.editor]}`)}`,
    `  ${c.muted("Language ")}  ${c.ink(LANGUAGES[ws.language].name)}` +
      (ws.languages.length > 1 ? ` ${c.muted(`· also set up: ${ws.languages.filter((l) => l !== ws.language).map((l) => LANGUAGES[l].name).join(", ")}`)}` : ` ${c.muted("· switch with sk lang")}`),
    `  ${c.muted("Progress ")}  ${c.ink(`${solved}/${ws.problems.length}`)} ${c.muted("solved")}` +
      (due ? ` ${c.muted("·")} ${c.amber(`${due} due for review`)}` : "") +
      (current ? ` ${c.muted("· current:")} ${c.body(label(current))}` : ""),
  ];
}

// Help, before anything that needs a workspace
if (cmd === "help" || cmd === "-h" || cmd === "--help") {
  const one = rest[0] && commandHelp(rest[0]);
  if (one) console.log(one);
  else {
    const ws = await currentWorkspace();
    console.log(help(ws ? await status(ws) : undefined));
  }
  process.exit(0);
}

// First run (or explicit setup)
const config = await loadConfig();
if (cmd === "setup" || !config) {
  await onboarding(cmd === "setup" ? rest : []);
  process.exit(0);
}
if (cmd === "config") {
  await configure(await currentWorkspace());
  process.exit(0);
}
if (cmd === "update") {
  await update(await currentWorkspace());
  process.exit(0);
}

const ws = await currentWorkspace();
if (!ws) {
  console.log(`\n  ${c.amber("Your workspace isn't where SleekCode expected it")} ${c.muted(`(${tilde(config.workspace)})`)}.`);
  console.log(`  ${c.muted("Run")} ${c.ink("sk config")} ${c.muted("to point at it or create a new one.")}\n`);
  process.exit(1);
}
if (!existsSync(ws.dir)) process.exit(1);

switch (cmd) {
  case undefined:
    console.log(help(await status(ws)));
    break;
  case "next": await next(ws, rest); break;
  case "open": await open(ws, rest); break;
  case "which": await which(ws, rest); break;
  case "start": await start(ws, rest); break;
  case "play": await run(ws, "play", rest); break;
  case "test": await run(ws, "test", rest); break;
  case "hint": await hint(ws, rest); break;
  case "log": await log(ws, rest); break;
  case "review": await review(ws, rest); break;
  case "reset": await reset(ws, rest); break;
  case "stats": await stats(ws); break;
  case "list": await list(ws); break;
  case "add": await add(ws, rest); break;
  case "sync": await sync(ws); break;
  case "lang": await lang(ws, rest); break;
  default: {
    const guess = ALL.map((x) => ({ x, d: distance(cmd, x.name) })).sort((a, b) => a.d - b.d).find((g) => g.d <= 2)?.x;
    console.log(`\n  ${c.red(`Unknown command "${cmd}".`)}${guess ? ` ${c.muted("Did you mean")} ${c.ink(`sk ${guess.name}`)}${c.muted("?")}` : ""}`);
    console.log(`  ${c.muted("Run")} ${c.ink("sk")} ${c.muted("to see every command.")}\n`);
    process.exit(1);
  }
}
