import { ago, dueNow, loadAttempts, reviews } from "../core/attempts";
import { parse } from "../core/args";
import { label } from "../core/problem";
import type { Workspace } from "../core/workspace";
import { c, diffColor, pad } from "../ui/colors";
import { describe, resetSolution, select } from "./practice";

export async function review(ws: Workspace, args: string[]) {
  const { values } = parse("review", args);
  const attempts = await loadAttempts(ws);
  if (!attempts.length) return console.log(`\n  ${c.muted("Nothing to review yet. Solve something first:")} ${c.ink("sk next")}\n`);

  const due = dueNow(ws, attempts);
  const upcoming = reviews(ws, attempts).filter((r) => r.due > new Date());
  const name = (folder: string) => ws.problems.find((p) => p.folder === folder)!;

  if (!due.length) {
    const soon = upcoming[0]!;
    return console.log(`\n  ✨ ${c.green("Nothing due.")} ${c.muted("Next up:")} ${label(name(soon.folder))} ${c.muted(`(${ago(soon.due)})`)}\n`);
  }

  console.log(`\n  ${c.amber(`🔁 ${due.length} due for review`)}\n`);
  for (const r of due) {
    const p = name(r.folder);
    console.log(`  ${pad(c.ink(label(p)), 44)} ${pad(diffColor[p.difficulty](p.difficulty), 8)} ${pad(c.muted(`last ${ago(new Date(r.last.at))}`), 16)} ${c.body(r.reason)}`);
  }
  if (upcoming.length) console.log(`\n  ${c.muted("Coming up:")} ${upcoming.slice(0, 3).map((r) => `${label(name(r.folder))} ${c.muted(`(${ago(r.due)})`)}`).join(", ")}`);
  if (values.list) return console.log();

  const top = name(due[0]!.folder);
  const saved = await resetSolution(ws, top);
  await select(ws, top);
  console.log(`\n  → Redo ${describe(top)} ${c.muted("from scratch. Your solution file is blank" + (saved ? " (unlogged code saved in attempts/)." : "."))}`);
  console.log(`    ${c.muted("sk start → sk test -w → sk log")}\n`);
}
