import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { parse } from "../core/args";
import { label, needProblem } from "../core/problem";
import { hintsFile, problemDir, type Workspace } from "../core/workspace";
import { bold, c } from "../ui/colors";

export type Hints = { source: string; target: string | null; hints: string[] };

/** `code` spans → highlighted */
const fmt = (s: string) => s.replace(/`([^`]+)`/g, (_m, x) => c.ink(x));

export async function hint(ws: Workspace, args: string[]) {
  const { values, positionals } = parse("hint", args);
  const p = await needProblem(ws, positionals[0]);
  const used = join(problemDir(ws, p), ".hints-used");
  if (values.reset) {
    rmSync(used, { force: true });
    return console.log(`\n  ${c.muted("Hints reset for")} ${label(p)}\n`);
  }
  if (!existsSync(hintsFile(ws, p))) return console.log(`\n  ${c.muted("No hints for this one.")}\n`);
  const { target, hints }: Hints = await Bun.file(hintsFile(ws, p)).json();
  const steps = [
    ...(target ? [{ title: "🎯 Target complexity", body: target }] : []),
    ...hints.map((h, i) => ({ title: `💡 Hint ${i + 1} of ${hints.length}`, body: h })),
  ];
  const n = existsSync(used) ? Number(await Bun.file(used).text()) : 0;
  if (n >= steps.length) {
    console.log(`\n  ${c.muted(`No more hints for ${label(p)}.`)}`);
    if (p.video) console.log(`  ${c.muted("Still stuck? Video walkthrough:")} ${c.blue(`https://www.youtube.com/watch?v=${p.video}`)}`);
    return console.log();
  }
  await Bun.write(used, String(n + 1));
  const step = steps[n]!;
  const width = Math.min(process.stdout.columns || 90, 90) - 6;
  const wrapped = fmt(step.body).split("\n").flatMap((para) => wrap(para, width));
  console.log(`\n  ${bold(c.amber(step.title))}  ${c.muted(label(p))}\n`);
  for (const line of wrapped) console.log(`  ${c.body(line)}`);
  const left = steps.length - n - 1;
  console.log(`\n  ${c.dim(left ? `${left} more · run sk hint again for the next one` : "That was the last one.")}\n`);
}

function wrap(text: string, width: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const len = (line + " " + word).replace(/\x1b\[[0-9;]*m/g, "").length;
    if (line && len > width) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line || !lines.length) lines.push(line);
  return lines;
}
