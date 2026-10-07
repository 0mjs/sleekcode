// sk intro: a short tour of what SleekCode is and how to use it, in plain English. Also offered after setup.
import { DEFAULTS, type Config } from "../core/config";
import { LANGUAGES } from "../core/languages";
import type { Workspace } from "../core/workspace";
import { bold, c, pad, visible } from "../ui/colors";
import { small } from "../ui/header";

type Screen = { title: string; lines: string[] };

const cmd = (s: string) => c.ink(s);
const box = (title: string, rows: string[], width: number) => [
  c.dim(`┌─ ${title} ${"─".repeat(Math.max(0, width - visible(title) - 4))}┐`),
  ...rows.map((r) => `${c.dim("│")} ${pad(r, width - 2)}${c.dim("│")}`),
  c.dim(`└${"─".repeat(width - 1)}┘`),
];
const side = (a: string[], b: string[]) => a.map((l, i) => `${l}   ${b[i] ?? ""}`);

function screens(ws: Workspace | null, config: Config | null): Screen[] {
  const lang = LANGUAGES[ws?.language ?? "py"];
  const print = lang.id === "py" ? "print()" : "console.log()";
  const days = config?.reviewDays ?? DEFAULTS.reviewDays;
  const mastered = config?.graduateAfter ?? DEFAULTS.graduateAfter;
  const ladder = Array.from({ length: mastered - 1 }, (_, i) => `${days * 2 ** i} days`);

  return [
    {
      title: "What SleekCode is",
      lines: [
        `${bold("LeetCode, on your own laptop.")}`,
        "",
        `150 classic coding-interview problems (the NeetCode 150), one folder each.`,
        `You write your answer in your editor, in ${c.ink(lang.name)}.`,
        `SleekCode runs it, checks it, and keeps score.`,
        "",
        `The big difference from the website: put a ${c.ink(print)} anywhere`,
        `and you'll see exactly what your code is doing.`,
        "",
        c.muted("Everything happens by typing short commands that start with sk."),
      ],
    },
    {
      title: "One problem, start to finish",
      lines: [
        `${cmd("sk next")} ${c.dim("──▶")} ${cmd("sk start")} ${c.dim("──▶")} ${cmd("sk play")} ${c.dim("──▶")} ${cmd("sk test")} ${c.dim("──▶")} ${cmd("sk log")}`,
        c.muted("pick one    timer on    try it      check it    write it down"),
        "",
        `${pad(cmd("sk next"), 10)} opens the next problem: the question, and a file to write in`,
        `${pad(cmd("sk start"), 10)} starts a timer ${c.muted("(sk pause if you step away)")}`,
        `${pad(cmd("sk play"), 10)} runs the examples and shows your ${print}s`,
        `${pad(cmd("sk test"), 10)} the real check: does it work, every time, fast enough?`,
        `${pad(cmd("sk log"), 10)} a few quick questions about how it went`,
        "",
        c.muted(`Tip: add -w (sk play -w) and it re-runs every time you save.`),
      ],
    },
    {
      title: "play vs test",
      lines: [
        ...side(
          box("sk play", [`Example 1`, c.amber(`seen = {2: 0}`) + c.muted("  ← you"), c.green("✓ [0, 1]")], 24),
          box("sk test", [c.green("✓ examples      3/3"), c.green("✓ hidden cases 40/40"), c.green("✓ fast enough")], 24),
        ),
        "",
        `${cmd("play")} is for exploring: ${c.muted("what is my code actually doing?")}`,
        `${cmd("test")} is for finishing: ${c.muted("tricky inputs you can't see, and a speed check.")}`,
        "",
        `Passing play but failing test is normal. That's the interesting part.`,
      ],
    },
    {
      title: "Stuck?",
      lines: [
        `${cmd("sk hint")} gives you one hint at a time.`,
        `The first is just how fast it should be ${c.muted("(like O(n): it grows in step with the input)")}.`,
        `Each one after gives a little more away.`,
        "",
        `Hints are fine. They're noted, and the problem comes back a bit sooner.`,
        "",
        `Still stuck after all of them? Look up the answer, make sure you get it,`,
        `and say so when you ${cmd("sk log")}. It comes back tomorrow for another go.`,
        c.muted("Honest logs = useful stats. Nobody's marking you."),
      ],
    },
    {
      title: "Problems come back",
      lines: [
        `${c.green("solve")} ${c.dim("──▶")} ${ladder.join(` ${c.dim("──▶")} `)} ${c.dim("──▶")} ${c.green("✅ mastered")}`,
        "",
        `Solve it cleanly ${c.muted("(on your own, on time)")} and it comes back later and later,`,
        `so you remember how, not just that you once did it.`,
        `${mastered} clean solves in a row and it's mastered: done for good.`,
        `Needed help? It comes back tomorrow.`,
        "",
        `${pad(cmd("sk review"), 11)} what's due today`,
        `${pad(cmd("sk stats"), 11)} how you're doing, by topic`,
      ],
    },
    {
      title: "That's it",
      lines: [
        `${pad(cmd("sk league"), 11)} a private leaderboard with friends ${c.muted("(needs a GitHub account)")}`,
        `${pad("", 11)} ${c.muted("shares what you solved, how and how fast. Never your code.")}`,
        `${pad(cmd("sk submit"), 11)} copies a passing solution to paste into LeetCode`,
        `${pad(cmd("sk"), 11)} every command, any time`,
        `${pad(cmd("sk intro"), 11)} this tour again`,
        "",
        c.muted("SleekCode updates itself, so there's nothing to maintain."),
        "",
        `${bold("Ready?")} Type ${c.green("sk next")}.`,
      ],
    },
  ];
}

function render(s: Screen, i: number, total: number): string {
  const dots = Array.from({ length: total }, (_, j) => (j === i ? c.green("●") : c.dim("○"))).join(" ");
  const keys = i === total - 1 ? "Enter: done" : "Enter: next";
  return [
    "",
    `  ${small()}  ${c.muted("·")} ${c.muted("a quick tour")}`,
    "",
    `  ${bold(c.green(s.title))}`,
    "",
    ...s.lines.map((l) => (l ? `  ${l}` : "")),
    "",
    `  ${dots}   ${c.muted(`${keys} · ←: back · q: quit`)}`,
  ].join("\n");
}

/** One keypress (raw mode, no Enter needed) */
function key(): Promise<string> {
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  return new Promise((done) =>
    stdin.once("data", (d) => {
      stdin.setRawMode(false);
      stdin.pause();
      done(d.toString());
    }),
  );
}

export async function intro(ws: Workspace | null, config: Config | null) {
  const all = screens(ws, config);
  // Not a terminal (piped, or a script): just print it all
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    for (const [i, s] of all.entries()) console.log(render(s, i, all.length));
    return console.log();
  }
  process.stdout.write("\x1b[?1049h\x1b[?25l"); // own screen, hide cursor: your scrollback stays as it was
  let i = 0;
  try {
    for (;;) {
      process.stdout.write("\x1b[2J\x1b[H" + render(all[i]!, i, all.length));
      const k = await key();
      if (k === "q" || k === "\x1b" || k === "\x03") break;
      if (k === "\x1b[D" || k === "b" || k === "\x7f") i = Math.max(0, i - 1);
      else if (++i >= all.length) break;
    }
  } finally {
    process.stdout.write("\x1b[?25h\x1b[?1049l");
  }
  console.log(`\n  ${c.muted("Tour over. See it again any time:")} ${cmd("sk intro")}  ${c.muted("·")}  ${c.muted("start with")} ${c.green("sk next")}\n`);
}
