// sk attempts [n] [-a]: view, edit or delete logged attempts.  sk undo: delete the most recent one.
import * as p from "@clack/prompts";
import { existsSync, renameSync } from "node:fs";
import { join } from "node:path";
import { HELP_LABEL, loadAttempts, passed, updateAttempt, type Attempt, type Feel } from "../core/attempts";
import { aboveTarget } from "../core/complexity";
import { parse } from "../core/args";
import { formatDuration, parseDuration } from "../core/duration";
import { openInEditor } from "../core/editor";
import { LANGUAGES } from "../core/languages";
import { needProblem } from "../core/problem";
import { renderRecords } from "../core/records";
import { publishInBackground } from "../core/league";
import { hintsFile, problemDir, type Workspace } from "../core/workspace";
import { c, rgb, visible } from "../ui/colors";
import { ask, COMPLEXITIES, pickComplexity, pickHelp } from "./log";

const when = (a: Attempt) => {
  const d = new Date(a.at);
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
};

/** Cuts a coloured string to `width` visible characters, ending in … */
function fit(s: string, width: number): string {
  let out = "", n = 0;
  for (const part of s.split(/(\x1b\[[0-9;]*m)/)) {
    if (part.startsWith("\x1b[")) { out += part; continue; }
    for (const ch of part) {
      if (n >= width - 1) return out + "…\x1b[0m";
      out += ch;
      n++;
    }
  }
  return out;
}

/** One line describing an attempt */
function summary(a: Attempt, withTitle = false): string {
  const lang = LANGUAGES[a.language];
  return [
    withTitle ? c.ink(`${a.id}. ${a.title}`) : null,
    c.muted(when(a)),
    lang ? rgb(lang.color)(lang.tag) : a.language,
    passed(a) ? c.green(`✓ ${a.pass}/${a.total}`) : c.red(`✗ ${a.pass}/${a.total}`),
    a.seconds == null ? c.dim("no time") : c.body(formatDuration(a.seconds)),
    a.help === "none" ? c.body(a.hints ? `on my own · ${a.hints} hint${a.hints > 1 ? "s" : ""}` : "on my own") : c.amber(HELP_LABEL[a.help]),
    a.complexity ? (a.aboveTarget ? c.amber(`${a.complexity} (above target)`) : c.body(a.complexity)) : null,
    a.feel === "unhappy" ? "😬" : a.feel === "nailed" ? "😎" : null,
  ].filter(Boolean).join(c.dim(" · "));
}

/** Deletes an attempt. Its code snapshot is kept, renamed so it's clearly not a logged attempt any more. */
async function remove(ws: Workspace, a: Attempt) {
  if (a.snapshot && existsSync(join(problemDir(ws, a as never), a.snapshot))) {
    const from = join(problemDir(ws, a as never), a.snapshot);
    let to = from.replace(/(\.\w+)$/, "-deleted$1");
    for (let i = 2; existsSync(to); i++) to = from.replace(/(\.\w+)$/, `-deleted-${i}$1`);
    renameSync(from, to);
  }
  await updateAttempt(ws, a.at, null);
  await renderRecords(ws, [a.folder]);
  if (ws.config.league) publishInBackground();
}

async function edit(ws: Workspace, a: Attempt) {
  p.log.message(c.muted("Change what you need. Each question starts on what you logged."));
  const timeText = ask(await p.text({
    message: "How long did it take?",
    initialValue: a.seconds == null ? "" : formatDuration(a.seconds),
    placeholder: "25  ·  1h 10m  ·  90s  (empty = not recorded)",
    validate: (s) => (s && parseDuration(s) == null ? "Try something like 25, 25m, 1h 10m or 90s" : undefined),
  }));
  const seconds = timeText ? parseDuration(timeText) : null;
  const help = await pickHelp(a.hints, a.help);
  const [t, s] = a.complexity ? a.complexity.split("/").map((x) => x.trim()) : ["", ""];
  const options = ws.config.complexities?.length ? ws.config.complexities : COMPLEXITIES;
  const time = await pickComplexity("time", options, t ?? "");
  const space = await pickComplexity("space", options, s ?? "");
  const feel = ask(await p.select<Feel>({
    message: "How do you feel about your solution?",
    initialValue: a.feel,
    options: [
      { value: "unhappy", label: "😬 Not happy with it", hint: "back in 2 days" },
      { value: "fine", label: "👍 Fine" },
      { value: "nailed", label: "😎 Nailed it", hint: "twice as long before review" },
    ],
  }));
  const notes = ask(await p.text({ message: "Notes", initialValue: a.notes, placeholder: "(none)", defaultValue: "" }));

  const complexity = [time, space].filter(Boolean).join(" / ");
  const prob = ws.problems.find((x) => x.folder === a.folder);
  const target = prob && existsSync(hintsFile(ws, prob)) ? (await Bun.file(hintsFile(ws, prob)).json()).target : null;
  await updateAttempt(ws, a.at, {
    seconds, minutes: seconds == null ? null : Math.max(1, Math.round(seconds / 60)),
    help, solo: help === "none", complexity, aboveTarget: aboveTarget(complexity, target).above, feel, notes,
  });
  await renderRecords(ws, [a.folder]);
  if (ws.config.league) publishInBackground();
  const updated = (await loadAttempts(ws)).find((x) => x.at === a.at)!;
  p.outro(`${c.green("Updated.")} ${summary(updated)}`);
}

export async function attempts(ws: Workspace, args: string[]) {
  const { values, positionals } = parse("attempts", args);
  const everything = await loadAttempts(ws);
  let list: Attempt[];
  let heading: string;
  if (values.all) {
    list = [...everything].reverse();
    heading = "All attempts, newest first";
  } else {
    const prob = await needProblem(ws, positionals[0]);
    list = everything.filter((a) => a.folder === prob.folder).reverse();
    heading = `${prob.id}. ${prob.title}`;
    if (!list.length) return console.log(`\n  ${c.muted(`No attempts logged for ${heading} yet.`)} ${c.muted("See every problem's with")} ${c.ink("sk attempts --all")}\n`);
  }
  if (!list.length) return console.log(`\n  ${c.muted("Nothing logged yet.")}\n`);

  p.intro(heading);
  const picked = ask(await p.select({
    message: "Which attempt?",
    maxItems: 10,
    options: [
      ...list.map((a) => {
        // Fit each row on one line: the summary first, then as much of the note as there's room for
        const room = (process.stdout.columns || 100) - 16; // clack adds a prefix and trims long rows itself
        let label = summary(a, !!values.all);
        if (visible(label) > room) label = fit(label, room);
        const left = room - visible(label) - 3;
        const hint = a.notes && left >= 8 ? (a.notes.length > left ? a.notes.slice(0, left - 1).trimEnd() + "…" : a.notes) : undefined;
        return { value: a.at, label, hint };
      }),
      { value: "", label: c.muted("Cancel") },
    ],
  }));
  if (!picked) return p.outro(c.muted("No changes."));
  const a = list.find((x) => x.at === picked)!;

  const action = ask(await p.select({
    message: "What do you want to do?",
    options: [
      { value: "edit", label: "Edit it", hint: "time, how you solved it, complexity, how it felt, notes" },
      { value: "delete", label: "Delete it" },
      ...(a.snapshot ? [{ value: "code", label: "Open the code you logged", hint: a.snapshot }] : []),
      { value: "cancel", label: c.muted("Cancel") },
    ],
  }));
  if (action === "edit") return edit(ws, a);
  if (action === "code") {
    openInEditor(ws, [join(problemDir(ws, a as never), a.snapshot!)]);
    return p.outro(c.muted(a.snapshot!));
  }
  if (action === "delete") {
    const sure = ask(await p.confirm({ message: "Delete this attempt? (Your code snapshot is kept, renamed to …-deleted.)", initialValue: false }));
    if (sure) {
      await remove(ws, a);
      return p.outro(c.green("Deleted. LOG.md, the README and your stats are updated."));
    }
  }
  p.outro(c.muted("No changes."));
}

export async function undo(ws: Workspace) {
  const last = (await loadAttempts(ws)).at(-1);
  if (!last) return console.log(`\n  ${c.muted("Nothing to undo. You haven't logged anything yet.")}\n`);
  p.intro("Undo your last log");
  p.log.message(summary(last, true));
  const sure = ask(await p.confirm({ message: "Delete it?", initialValue: true }));
  if (!sure) return p.outro(c.muted("No changes."));
  await remove(ws, last);
  p.outro(`${c.green("Done.")} ${c.muted("Log it again whenever you're ready: sk log")}`);
}
