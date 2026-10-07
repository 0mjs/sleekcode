// sk (no arguments, in a terminal): the home screen. The next sensible steps for where you are, then everything else.
import * as p from "@clack/prompts";
import { join } from "node:path";
import { dueNow, loadAttempts, solvedFolders } from "../core/attempts";
import { TOOL } from "../core/paths";
import { label } from "../core/problem";
import { readTimer, timerLabel } from "../core/timer";
import { resolveProblem, type Problem, type Workspace } from "../core/workspace";
import { c } from "../ui/colors";
import { header } from "../ui/header";
import { ALL } from "../ui/help";
import { describe } from "./practice";

type Action = { label: string; run: string[]; hint?: string };
const SEP = "__sep";
const MORE = "__more";
const QUIT = "__quit";

/** Runs an sk command as its own process and waits. Ctrl-C stops the command (say, a watcher) but not the menu. */
async function sk(args: string[]): Promise<number> {
  const ignore = () => {};
  process.on("SIGINT", ignore);
  try {
    const proc = Bun.spawn(["bun", join(TOOL, "src", "cli.ts"), ...args], { stdio: ["inherit", "inherit", "inherit"], env: process.env });
    return await proc.exited;
  } finally {
    process.off("SIGINT", ignore);
  }
}

/** The next sensible steps, depending on where you are */
async function suggestions(ws: Workspace, prob: Problem | null, lastTest: Map<string, number>): Promise<Action[]> {
  const attempts = await loadAttempts(ws);
  const due = dueNow(ws, attempts).length;
  const solved = await solvedFolders(ws);
  const timer = prob ? await readTimer(ws, prob) : null;
  const n = prob?.id ?? "";
  const review: Action[] = due ? [{ label: `Review what's due (${due})`, run: ["review"], hint: "sk review" }] : [];

  // Brand new: the tour first
  if (!attempts.length && !prob) {
    return [
      { label: "Take the 2-minute tour", run: ["intro"], hint: "sk intro" },
      { label: "Start your first problem", run: ["next"], hint: "sk next" },
    ];
  }
  // Nothing in progress: pick something to do
  if (!prob || (solved.has(prob.folder) && !timer)) {
    return [
      { label: "Next problem", run: ["next"], hint: "sk next" },
      ...review,
      { label: "Pick a problem by number", run: ["open", "?"], hint: "sk open <number>" },
      { label: "Drill patterns (no coding)", run: ["drill"], hint: "sk drill" },
      { label: "See your stats", run: ["stats"], hint: "sk stats" },
    ];
  }
  // Paused
  if (timer?.pausedAt) {
    return [
      { label: "Resume the timer", run: ["start"], hint: "sk start" },
      { label: "I'm done: log how it went", run: ["log"], hint: "sk log" },
      { label: "Throw the timer away", run: ["start", "-c"], hint: "sk start -c" },
    ];
  }
  // Working on it, tests passing: wrap it up
  if (timer && lastTest.get(prob.folder) === 0) {
    return [
      { label: `I'm done: log how it went ${c.green("(tests pass ✓)")}`, run: ["log"], hint: "sk log" },
      { label: "Run the tests again", run: ["test"], hint: "sk test" },
      { label: "Copy it to submit on LeetCode", run: ["submit"], hint: "sk submit" },
      { label: "Pause the timer", run: ["pause"], hint: "sk pause" },
    ];
  }
  // Working on it
  if (timer) {
    return [
      { label: "Run the examples (see your prints)", run: ["play"], hint: `sk play` },
      { label: "Run the tests", run: ["test"], hint: lastTest.get(prob.folder) ? `sk test · ${c.red("failing last time")}` : "sk test" },
      { label: "Get a hint", run: ["hint"], hint: "sk hint" },
      { label: "I'm done: log how it went", run: ["log"], hint: "sk log" },
      { label: "Keep running the examples on every save", run: ["play", "-w"], hint: "sk play -w · Ctrl-C to come back" },
      { label: "Pause the timer", run: ["pause"], hint: "sk pause" },
    ];
  }
  // Problem open, not started
  return [
    { label: `Start ${label(prob)} (starts the timer)`, run: ["start"], hint: "sk start" },
    { label: "Open the problem in your editor", run: ["open", n], hint: `sk open ${n}` },
    { label: "Skip it: next problem", run: ["next"], hint: "sk next" },
    ...review,
  ];
}

/** Every command, searchable: built from the same list as sk -h, so it's never out of date */
async function everything(): Promise<string[] | null> {
  const name = (cmd: (typeof ALL)[number]) => cmd.name.split(",")[0]!.trim();
  const picked = await p.autocomplete({
    message: "Everything else (type to search)",
    placeholder: "e.g. stats, theme, league",
    maxItems: 10,
    options: ALL.map((cmd) => ({ value: name(cmd), label: cmd.desc.replace(/:$/, ""), hint: `sk ${name(cmd)}${cmd.args ? " " + cmd.args : ""}` })),
    filter: (search, o) => `${o.value} ${o.label}`.toLowerCase().includes(search.toLowerCase()),
  });
  if (p.isCancel(picked)) return null;
  const cmd = ALL.find((x) => name(x) === picked)!;
  // A required argument (sk open <number>, sk add <slug or url>): ask for it
  if (cmd.args?.startsWith("<")) {
    const value = await p.text({ message: cmd.args.slice(1, -1).replace(/^./, (ch) => ch.toUpperCase()) + "?" });
    if (p.isCancel(value) || !value) return null;
    return [String(picked), String(value)];
  }
  return [String(picked)];
}

export async function home(ws: Workspace) {
  console.log(header());
  const lastTest = new Map<string, number>(); // test results this session: what the menu suggests next depends on them
  for (;;) {
    const prob = await resolveProblem(ws);
    const attempts = await loadAttempts(ws);
    const solved = (await solvedFolders(ws)).size;
    const due = dueNow(ws, attempts).length;
    const timer = prob ? await timerLabel(ws, prob) : null;
    if (prob) console.log(`  ${describe(prob)}${timer ? `   ${c.amber(timer)}` : ""}`);
    console.log(`  ${c.muted(`${solved}/${ws.problems.length} solved`)}${due ? ` ${c.muted("·")} ${c.amber(`${due} due for review`)}` : ""}\n`);

    const actions = await suggestions(ws, prob, lastTest);
    const choice = await p.select<string>({
      message: "What do you want to do?",
      maxItems: 12,
      options: [
        ...actions.map((a, i) => ({ value: String(i), label: a.label, hint: a.hint })),
        { value: SEP, label: c.dim("──────────"), disabled: true },
        { value: MORE, label: "Everything else…", hint: "stats, attempts, league, settings, type to search" },
        { value: QUIT, label: "Quit", hint: "Esc · sk -h lists every command" },
      ],
    });
    if (p.isCancel(choice) || choice === QUIT) return p.outro(c.muted("See you next time. sk brings this back."));

    let args: string[] | null;
    if (choice === MORE) args = await everything();
    else {
      args = actions[Number(choice)]!.run;
      if (args.includes("?")) {
        const v = await p.text({ message: "Which problem number?", placeholder: "e.g. 217" });
        args = p.isCancel(v) || !v ? null : args.map((x) => (x === "?" ? String(v) : x));
      }
    }
    if (!args) continue;

    const code = await sk(args);
    if (args[0] === "test" && prob) lastTest.set(prob.folder, code);
    if (args[0] === "log" && prob) lastTest.delete(prob.folder);
    console.log();
  }
}
