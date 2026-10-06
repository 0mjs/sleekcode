// sk stats: full-screen dashboard. ←/→ or 1-4 to switch tabs, q to quit.
import { ago, clean, dueNow, loadAttempts, passed, reviews, type Attempt } from "../core/attempts";
import type { Problem, Workspace } from "../core/workspace";
import { bold, c as C, diffColor, pad, padL, rgb } from "../ui/colors";
import { small } from "../ui/header";

export async function stats(ws: Workspace) {
const problems = ws.problems;
const attempts = await loadAttempts(ws);
const TARGET_MINUTES = ws.config.targets;

// ---------- layout helpers ----------
const bar = (value: number, max: number, width: number, color: (s: string) => string) => {
  const filled = max ? Math.round((value / max) * width) : 0;
  return color("█".repeat(filled)) + C.dim("░".repeat(width - filled));
};
const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : "–");
const fmtMinutes = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; // local date

// ---------- derived data ----------
const solved = new Set(attempts.filter(passed).map((a) => a.folder));
const isSolved = (p: Problem) => solved.has(p.folder);
const totalMinutes = attempts.reduce((s, a) => s + (a.minutes ?? 0), 0);
const soloRate = pct(attempts.filter(clean).length, attempts.length);
const daysWithActivity = new Set(attempts.map((a) => dayKey(new Date(a.at))));
let streak = 0;
const cursor = new Date();
if (!daysWithActivity.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1); // today not done yet: count from yesterday
while (daysWithActivity.has(dayKey(cursor))) {
  streak++;
  cursor.setDate(cursor.getDate() - 1);
}
const avgMinutes = (as: Attempt[]) => {
  const ms = as.map((a) => a.minutes).filter((m): m is number => m != null);
  return ms.length ? Math.round(ms.reduce((a, b) => a + b, 0) / ms.length) : null;
};

// ---------- tabs ----------
const TABS = ["Overview", "Patterns", "History", "Review"] as const;
let tab = 0;

function header(width: number): string[] {
  const tabs = TABS.map((t, i) => (i === tab ? bold(C.ink(` ${i + 1} ${t} `)) : C.muted(` ${i + 1} ${t} `))).join(C.dim("│"));
  const underline = TABS.map((t, i) => (i === tab ? C.green("▔".repeat(t.length + 4)) : " ".repeat(t.length + 4))).join(" ");
  return ["", `  ${bold(small())}   ${tabs}`, `              ${underline}`, C.dim("  " + "─".repeat(Math.max(10, width - 4)))];
}

function empty(): string[] {
  return ["", C.muted("  No attempts logged yet."), "", `  ${C.body("Solve one, then record it:")}  ${C.ink("sk next → sk test -w → sk log")}`];
}

function overview(width: number): string[] {
  const out: string[] = [""];
  const blind = problems.filter((p) => p.blind75);
  const kpis: [string, string][] = [
    ["solved", `${solved.size}${C.muted(`/${problems.length}`)}`],
    ["blind 75", `${blind.filter(isSolved).length}${C.muted(`/${blind.length}`)}`],
    ["attempts", String(attempts.length)],
    ["time", fmtMinutes(totalMinutes)],
    ["clean solves", soloRate],
    ["streak", `${streak}${C.muted(streak === 1 ? " day" : " days")}`],
  ];
  out.push("  " + kpis.map(([k]) => pad(C.muted(k), 15)).join(""));
  out.push("  " + kpis.map(([, v]) => pad(bold(C.ink(v)), 15)).join(""), "");

  out.push(`  ${C.muted("BY DIFFICULTY")}`);
  const barW = Math.min(40, width - 36);
  for (const d of ["Easy", "Medium", "Hard"] as const) {
    const ps = problems.filter((p) => p.difficulty === d);
    const done = ps.filter(isSolved).length;
    out.push(`  ${pad(diffColor[d](d), 8)} ${bar(done, ps.length, barW, diffColor[d])}  ${C.ink(String(done))}${C.muted(`/${ps.length}`)}`);
  }

  // GitHub-style activity grid: last ~16 weeks, one column per week
  const weeks = Math.min(26, Math.floor((width - 10) / 2));
  out.push("", `  ${C.muted(`ACTIVITY · last ${weeks} weeks`)}`);
  const perDay = new Map<string, number>();
  for (const a of attempts) perDay.set(dayKey(new Date(a.at)), (perDay.get(dayKey(new Date(a.at))) ?? 0) + 1);
  const start = new Date();
  start.setDate(start.getDate() - start.getDay() - (weeks - 1) * 7); // Sunday, `weeks` weeks ago
  const shade = (n: number) => (n === 0 ? C.dim("·") : n === 1 ? rgb("#2a6b52")("■") : n === 2 ? rgb("#2aa876")("■") : C.green("■"));
  ["S", "M", "T", "W", "T", "F", "S"].forEach((label, dow) => {
    let row = `  ${C.dim(label)} `;
    for (let w = 0; w < weeks; w++) {
      const d = new Date(start);
      d.setDate(start.getDate() + w * 7 + dow);
      row += d > new Date() ? "  " : shade(perDay.get(dayKey(d)) ?? 0) + " ";
    }
    out.push(row);
  });
  out.push(`    ${C.dim("less")} ${C.dim("·")} ${rgb("#2a6b52")("■")} ${rgb("#2aa876")("■")} ${C.green("■")} ${C.dim("more")}`);
  return out;
}

function patterns(width: number): string[] {
  const groups = new Map<string, Problem[]>();
  for (const p of problems) groups.set(p.pattern, [...(groups.get(p.pattern) ?? []), p]);
  const barW = Math.max(10, Math.min(30, width - 70));
  const out = ["", `  ${pad(C.muted("PATTERN"), 26)}${pad(C.muted("PROGRESS"), barW + 10)}${padL(C.muted("AVG"), 6)}${padL(C.muted("HINTS"), 8)}${padL(C.muted("CLEAN"), 8)}`];
  for (const [name, ps] of groups) {
    const folders = new Set(ps.map((p) => p.folder));
    const as = attempts.filter((a) => folders.has(a.folder));
    const done = ps.filter(isSolved).length;
    const avg = avgMinutes(as);
    const hinted = as.filter((a) => a.hints > 0).length;
    const color = done === ps.length ? C.green : done ? C.blue : C.dim;
    const weak = as.length >= 2 && hinted / as.length >= 0.5;
    out.push(
      `  ${pad((done ? C.ink : C.muted)(name.length > 23 ? name.slice(0, 22) + "…" : name), 26)}` +
        `${bar(done, ps.length, barW, color)} ${pad(`${C.ink(String(done))}${C.muted(`/${ps.length}`)}`, 8)}` +
        `${padL(avg == null ? C.dim("–") : C.body(`${avg}m`), 6)}` +
        `${padL(as.length ? (weak ? C.amber : C.body)(pct(hinted, as.length)) : C.dim("–"), 8)}` +
        `${padL(as.length ? C.body(pct(as.filter(clean).length, as.length)) : C.dim("–"), 8)}`,
    );
  }
  out.push("", C.dim("  AVG = average minutes per attempt · HINTS = attempts that used hints (amber = 50%+, worth revisiting)"));
  return out;
}

function history(width: number): string[] {
  if (!attempts.length) return empty();
  const out = [""];
  // Minutes per attempt, newest on the right, coloured by difficulty
  const chartW = Math.min(attempts.length, Math.floor((width - 12) / 2));
  const recent = attempts.slice(-chartW);
  const max = Math.max(...recent.map((a) => a.minutes ?? 0), 1);
  const H = 8;
  out.push(`  ${C.muted(`MINUTES PER ATTEMPT · last ${recent.length}`)}`);
  for (let row = H; row >= 1; row--) {
    const label = row === H ? padL(String(max), 4) : row === 1 ? padL("0", 4) : "    ";
    let line = `  ${C.dim(label)} ${C.dim("│")}`;
    for (const a of recent) {
      const h = ((a.minutes ?? 0) / max) * H;
      const cell = h >= row ? "█" : h >= row - 0.5 ? "▄" : " ";
      line += (passed(a) ? diffColor[a.difficulty] : C.red)(cell) + " ";
    }
    out.push(line);
  }
  out.push(`       ${C.dim("└" + "─".repeat(recent.length * 2))}`);
  out.push(`        ${C.green("■")} ${C.muted("easy")}  ${C.amber("■")} ${C.muted("medium")}  ${C.red("■")} ${C.muted("hard / failed")}`);

  const avgs = (["Easy", "Medium", "Hard"] as const).map((d) => {
    const avg = avgMinutes(attempts.filter((a) => a.difficulty === d && passed(a)));
    return `${diffColor[d](d)} ${avg == null ? C.dim("–") : C.ink(`${avg}m`)} ${C.dim(`(aim ≤${TARGET_MINUTES[d]})`)}`;
  });
  out.push("", `  ${C.muted("AVG SOLVE")}  ${avgs.join("   ")}`, "", `  ${C.muted("RECENT")}`);
  for (const a of attempts.slice(-10).reverse()) {
    const result = passed(a) ? C.green("✓") : C.red("✗");
    const help = a.hints ? C.amber(`${a.hints} hint${a.hints > 1 ? "s" : ""}`) : a.solo ? C.muted("solo") : C.amber("help");
    out.push(
      `  ${C.dim(a.at.slice(0, 10))}  ${result} ${pad(C.ink(`${a.id}. ${a.title}`.slice(0, 34)), 36)}${pad(diffColor[a.difficulty](a.difficulty), 8)}` +
        `${padL(a.minutes == null ? C.dim("–") : C.body(`${a.minutes}m`), 5)}  ${pad(help, 9)} ${C.muted(a.complexity)}`,
    );
  }
  return out;
}

function review(): string[] {
  if (!attempts.length) return empty();
  const due = dueNow(ws, attempts);
  const upcoming = reviews(ws, attempts).filter((r) => r.due > new Date()).slice(0, 8);
  const row = (r: (typeof due)[number], when: string) => {
    const p = problems.find((x) => x.folder === r.folder)!;
    return `  ${pad(C.ink(`${p.id}. ${p.title}`.slice(0, 38)), 40)}${pad(diffColor[p.difficulty](p.difficulty), 8)}${pad(C.body(when), 18)}${C.muted(r.reason)}`;
  };
  const out = ["", `  ${due.length ? C.amber(bold(`${due.length} DUE NOW`)) : C.green("Nothing due 🎉")}`];
  for (const r of due) out.push(row(r, `due ${ago(r.due)}`));
  if (upcoming.length) {
    out.push("", `  ${C.muted("COMING UP")}`);
    for (const r of upcoming) out.push(row(r, ago(r.due)));
  }
  out.push("", C.dim("  failed / hints → 1 day · slow → 3 days · clean → 7 days, doubling each clean repeat"), C.dim("  Run `sk review` to redo the most overdue one."));
  return out;
}

// ---------- render loop ----------
function render() {
  const width = Math.min(process.stdout.columns || 100, 110);
  const body = !attempts.length && tab !== 1 ? empty() : [overview, patterns, history, review][tab]!(width);
  const footer = ["", C.dim("  ←/→ or 1-4 switch tabs · q quit")];
  process.stdout.write("\x1b[H\x1b[2J" + [...header(width), ...body, ...footer].join("\n"));
}

if (!process.stdout.isTTY || !process.stdin.isTTY) {
  // Piped or non-interactive: print every tab once
  const width = 100;
  for (tab = 0; tab < TABS.length; tab++) console.log([...header(width), ...(attempts.length || tab === 1 ? [overview, patterns, history, review][tab]!(width) : empty())].join("\n"));
  process.exit(0);
}

const quit = () => {
  process.stdout.write("\x1b[?25h\x1b[?1049l");
  process.exit(0);
};
process.stdout.write("\x1b[?1049h\x1b[?25l"); // alternate screen, hide cursor
process.stdin.setRawMode(true);
process.stdin.on("data", (buf) => {
  const k = buf.toString();
  if (k === "q" || k === "\x1b" || k === "\x03") return quit();
  if (k === "\x1b[C" || k === "\t" || k === "l") tab = (tab + 1) % TABS.length;
  else if (k === "\x1b[D" || k === "\x1b[Z" || k === "h") tab = (tab + TABS.length - 1) % TABS.length;
  else if (/^[1-4]$/.test(k)) tab = Number(k) - 1;
  render();
});
process.stdout.on("resize", render);
process.on("SIGINT", quit);
render();
}
