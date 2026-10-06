// sk stats: a full-screen dashboard.
//   ←/→ or 1-5   switch tabs        l   filter by language
//   ↑/↓ or j/k   scroll             q   quit
import { ago, clean, dueNow, HELP_LABEL, loadAttempts, passed, reviews, type Attempt } from "../core/attempts";
import { formatDuration } from "../core/duration";
import { LANGUAGES, type Language } from "../core/languages";
import { label } from "../core/problem";
import type { Problem, Workspace } from "../core/workspace";
import { bold, c, diffColor, mix, pad, padL, rgb, visible } from "../ui/colors";
import { small } from "../ui/header";

const DIFFS = ["Easy", "Medium", "Hard"] as const;
const TABS = ["Overview", "Patterns", "Languages", "History", "Review"] as const;
const DAY = 86_400_000;

// ---------- small drawing helpers ----------

const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, Math.max(0, n - 1)) + "…" : s);
const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : "–");
const fmtMin = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);
const minutesOf = (as: Attempt[]) => as.map((a) => a.minutes).filter((m): m is number => m != null);

function bar(value: number, max: number, width: number, color: (s: string) => string) {
  const filled = max ? Math.min(width, Math.round((value / max) * width)) : 0;
  return color("━".repeat(filled)) + c.dim("━".repeat(width - filled));
}

/** One bar made of coloured segments, e.g. easy/medium/hard solved out of 150 */
function stacked(parts: { n: number; color: (s: string) => string }[], total: number, width: number) {
  let used = 0;
  let out = "";
  for (const part of parts) {
    const w = Math.min(total ? Math.round((part.n / total) * width) : 0, width - used);
    out += part.color("█".repeat(w));
    used += w;
  }
  return out + c.dim("░".repeat(width - used));
}

const SPARK = "▁▂▃▄▅▆▇█";
const sparkline = (xs: number[], color: (s: string) => string) => {
  if (!xs.length) return c.dim("–");
  const max = Math.max(...xs), min = Math.min(...xs);
  return color(xs.map((x) => SPARK[max === min ? 3 : Math.round(((x - min) / (max - min)) * 7)]).join(""));
};

/** Rounded cards: title on the border, a big value, a small line underneath. Wraps onto more rows when narrow. */
function cards(items: { title: string; value: string; sub: string }[], width: number): string[] {
  const perRow = Math.max(1, Math.min(items.length, Math.floor((width + 1) / 16)));
  const w = Math.floor((width - (perRow - 1)) / perRow);
  const out: string[] = [];
  for (let i = 0; i < items.length; i += perRow) {
    const row = items.slice(i, i + perRow);
    out.push(
      row.map((it) => { const t = truncate(it.title, w - 5); return c.dim("╭─ ") + c.muted(t) + c.dim(" " + "─".repeat(Math.max(0, w - 5 - t.length)) + "╮"); }).join(" "),
      row.map((it) => c.dim("│ ") + pad(it.value, w - 4) + c.dim(" │")).join(" "),
      row.map((it) => c.dim("│ ") + pad(it.sub, w - 4) + c.dim(" │")).join(" "),
      row.map(() => c.dim("╰" + "─".repeat(w - 2) + "╯")).join(" "),
    );
  }
  return out;
}

const section = (title: string, right = "") => `${bold(c.green(title.toUpperCase()))}${right ? "  " + c.muted(right) : ""}`;

// ---------- the dashboard ----------

export async function stats(ws: Workspace) {
  const all = await loadAttempts(ws);
  const known = new Map(ws.problems.map((p) => [p.folder, p]));
  const usedLangs = [...new Set(all.map((a) => a.language))].filter((l): l is Language => l in LANGUAGES);
  const filters: (Language | "all")[] = ["all", ...usedLangs];
  let filter = 0;
  let tab = 0;
  let scroll = 0;

  const view = () => {
    const lang = filters[filter]!;
    const attempts = lang === "all" ? all : all.filter((a) => a.language === lang);
    const solvedSet = new Set(attempts.filter(passed).map((a) => a.folder));
    return { lang, attempts, solvedSet, isSolved: (p: Problem) => solvedSet.has(p.folder) };
  };

  // ----- 1. Overview -----
  function overview(width: number): string[] {
    const { attempts, solvedSet, isSolved } = view();
    if (!attempts.length) return empty();

    // Streaks, counted in local days
    const dayStart = (t: number) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
    const days = [...new Set(attempts.map((a) => dayStart(Date.parse(a.at))))].sort((a, b) => a - b);
    let best = 0, run = 0;
    days.forEach((t, i) => { run = i && Math.round((t - days[i - 1]!) / DAY) === 1 ? run + 1 : 1; best = Math.max(best, run); });
    const daySet = new Set(days);
    let streak = 0;
    let cur = dayStart(Date.now());
    if (!daySet.has(cur)) cur = dayStart(cur - DAY / 2); // today isn't over yet: count from yesterday
    while (daySet.has(cur)) { streak++; cur = dayStart(cur - DAY / 2); }

    const now = Date.now();
    const thisWeek = attempts.filter((a) => now - Date.parse(a.at) < 7 * DAY && passed(a)).length;
    const lastWeek = attempts.filter((a) => { const d = now - Date.parse(a.at); return d >= 7 * DAY && d < 14 * DAY && passed(a); }).length;
    const blind = ws.problems.filter((p) => p.blind75);
    const totalMin = minutesOf(attempts).reduce((a, b) => a + b, 0);
    const trend = thisWeek - lastWeek;

    const out = [""];
    out.push(...cards([
      { title: "solved", value: bold(c.ink(String(solvedSet.size))) + c.muted(` / ${ws.problems.length}`), sub: c.muted(pct(solvedSet.size, ws.problems.length) + " done") },
      { title: "blind 75", value: bold(c.amber(String(blind.filter(isSolved).length))) + c.muted(` / ${blind.length}`), sub: c.muted("must-knows") },
      { title: "streak", value: bold(c.green(`${streak}`)) + c.muted(streak === 1 ? " day" : " days"), sub: c.muted(`best ${best}`) },
      { title: "this week", value: bold(c.ink(String(thisWeek))) + c.muted(" solves"), sub: trend > 0 ? c.green(`▲ ${trend} vs last`) : trend < 0 ? c.red(`▼ ${-trend} vs last`) : c.muted("= last week") },
      { title: "clean", value: bold(c.ink(pct(attempts.filter(clean).length, attempts.length))), sub: c.muted(`${attempts.filter((a) => a.help === "ai").length} with AI`) },
      { title: "time in", value: bold(c.ink(fmtMin(totalMin))), sub: c.muted(`${attempts.length} tr${attempts.length === 1 ? "y" : "ies"}`) },
    ], width));

    out.push("", section("progress"), "");
    const barW = Math.max(20, width - 26);
    const byDiff = DIFFS.map((d) => ({ d, total: ws.problems.filter((p) => p.difficulty === d).length, done: ws.problems.filter((p) => p.difficulty === d && isSolved(p)).length }));
    out.push(`${pad(c.body("All"), 8)} ${stacked(byDiff.map((x) => ({ n: x.done, color: diffColor[x.d] })), ws.problems.length, barW)}  ${c.ink(String(solvedSet.size))}${c.muted(`/${ws.problems.length}`)}`);
    for (const x of byDiff) out.push(`${pad(diffColor[x.d](x.d), 8)} ${bar(x.done, x.total, barW, diffColor[x.d])}  ${c.ink(String(x.done))}${c.muted(`/${x.total}`)}`);

    // Activity: one column per week, months labelled on top
    const weeks = Math.max(8, Math.min(26, Math.floor((width - 6) / 2)));
    const perDay = new Map<string, number>();
    for (const a of attempts) perDay.set(dayKey(new Date(a.at)), (perDay.get(dayKey(new Date(a.at))) ?? 0) + 1);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay() - (weeks - 1) * 7);
    out.push("", section("activity", `last ${weeks} weeks`), "");
    let months = "    ";
    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
      const d = new Date(start);
      d.setDate(start.getDate() + w * 7);
      if (d.getMonth() !== lastMonth && months.length <= 4 + w * 2) {
        months = months.padEnd(4 + w * 2) + d.toLocaleString("en", { month: "short" });
        lastMonth = d.getMonth();
      }
    }
    out.push(c.muted(months));
    const shades = [c.dim("·"), rgb("#2a6b52")("■"), rgb("#3fa37b")("■"), c.green("■")];
    ["", "Mon", "", "Wed", "", "Fri", ""].forEach((name, dow) => {
      let row = c.dim(name.padEnd(4));
      for (let w = 0; w < weeks; w++) {
        const d = new Date(start);
        d.setDate(start.getDate() + w * 7 + dow);
        row += d.getTime() > Date.now() ? "  " : shades[Math.min(3, perDay.get(dayKey(d)) ?? 0)]! + " ";
      }
      out.push(row);
    });
    out.push(`    ${c.dim("less")} ${shades.join(" ")} ${c.dim("more")}`);
    return out;
  }

  // ----- 2. Patterns -----
  function patterns(width: number): string[] {
    const { attempts, isSolved } = view();
    const groups = new Map<string, Problem[]>();
    for (const p of ws.problems) groups.set(p.pattern, [...(groups.get(p.pattern) ?? []), p]);
    const barW = Math.max(10, Math.min(28, width - 66));
    const out = ["", `${pad(c.muted("PATTERN"), 25)}${pad(c.muted("PROGRESS"), barW + 9)}${pad(c.muted("LEVEL"), 14)}${padL(c.muted("AVG"), 5)}${padL(c.muted("HINTS"), 7)}${padL(c.muted("CLEAN"), 7)}`];
    const levels: { name: string; clean: number; started: boolean; done: number; total: number }[] = [];
    for (const [name, ps] of groups) {
      const folders = new Set(ps.map((p) => p.folder));
      const as = attempts.filter((a) => folders.has(a.folder));
      const done = ps.filter(isSolved).length;
      const cleanRate = as.length ? as.filter(clean).length / as.length : 0;
      const level =
        !as.length ? c.dim("· not started")
          : done === ps.length && cleanRate >= 0.7 ? c.green("● mastered")
            : done / ps.length >= 0.5 ? c.blue("◕ practising")
              : c.amber("◔ learning");
      const hinted = as.filter((a) => a.hints > 0).length;
      const color = done === ps.length ? c.green : done ? c.blue : c.dim;
      out.push(
        `${pad((as.length ? c.ink : c.muted)(truncate(name, 23)), 25)}${bar(done, ps.length, barW, color)} ${pad(`${c.ink(String(done))}${c.muted(`/${ps.length}`)}`, 8)}` +
          `${pad(level, 14)}${padL(as.length ? c.body(`${avg(minutesOf(as)) ?? "–"}m`) : c.dim("–"), 5)}` +
          `${padL(as.length ? (hinted / as.length >= 0.5 ? c.amber : c.body)(pct(hinted, as.length)) : c.dim("–"), 7)}` +
          `${padL(as.length ? c.body(pct(as.filter(clean).length, as.length)) : c.dim("–"), 7)}`,
      );
      levels.push({ name, clean: cleanRate, started: as.length > 0, done, total: ps.length });
    }
    const weak = levels.filter((l) => l.started && l.done < l.total).sort((a, b) => a.clean - b.clean).slice(0, 2);
    const nextNew = levels.find((l) => !l.started);
    const focus = [...weak.map((w) => w.name), ...(nextNew && weak.length < 2 ? [nextNew.name] : [])];
    out.push("", `${c.green("→")} ${c.muted("Focus next:")} ${focus.length ? focus.map((f) => c.ink(f)).join(c.muted(", ")) : c.green("you've covered everything 🎉")}`);
    out.push(c.dim("learning = under half solved · practising = half or more · mastered = all solved, 70%+ clean"));
    return out;
  }

  // ----- 3. Languages (always across every attempt) -----
  function languages(width: number): string[] {
    if (!all.length) return empty();
    const out = [""];
    const langs = usedLangs.length ? usedLangs : [ws.language];
    const solvedBy = new Map<Language, Set<string>>(langs.map((l) => [l, new Set(all.filter((a) => a.language === l && passed(a)).map((a) => a.folder))]));
    const barW = Math.max(12, Math.min(30, width - 62));

    out.push(section("by language"), "");
    out.push(`${pad(c.muted("LANGUAGE"), 14)}${pad(c.muted("SHARE OF ATTEMPTS"), barW + 7)}${padL(c.muted("SOLVED"), 7)}${padL(c.muted("AVG"), 6)}${padL(c.muted("CLEAN"), 7)}  ${c.muted("RECENT TIMES")}`);
    for (const l of langs) {
      const spec = LANGUAGES[l];
      const col = rgb(spec.color);
      const as = all.filter((a) => a.language === l);
      out.push(
        `${pad(bold(col(spec.name)), 14)}${bar(as.length, all.length, barW, col)} ${pad(c.body(pct(as.length, all.length)), 6)}` +
          `${padL(c.ink(String(solvedBy.get(l)!.size)), 7)}${padL(c.body(`${avg(minutesOf(as)) ?? "–"}m`), 6)}${padL(c.body(pct(as.filter(clean).length, as.length)), 7)}  ` +
          sparkline(minutesOf(as.filter(passed)).slice(-12), col),
      );
    }

    if (langs.length > 1) {
      // Overlap: problems solved in just one language vs in all of them
      const everyFolder = new Set([...solvedBy.values()].flatMap((s) => [...s]));
      const inAll = new Set([...everyFolder].filter((f) => langs.every((l) => solvedBy.get(l)!.has(f))));
      const only = langs.map((l) => ({ l, n: [...solvedBy.get(l)!].filter((f) => !inAll.has(f)).length }));
      const both = rgb(mix(LANGUAGES[langs[0]!].color, LANGUAGES[langs[1]!].color, 0.5));
      out.push("", section("overlap", "problems solved in each"), "");
      out.push(stacked([
        { n: only[0]!.n, color: rgb(LANGUAGES[only[0]!.l].color) },
        { n: inAll.size, color: both },
        ...only.slice(1).map((s) => ({ n: s.n, color: rgb(LANGUAGES[s.l].color) })),
      ], Math.max(1, everyFolder.size), Math.max(20, width - 4)));
      out.push([
        `${rgb(LANGUAGES[only[0]!.l].color)("■")} ${c.body(`${LANGUAGES[only[0]!.l].name} only`)} ${c.ink(String(only[0]!.n))}`,
        `${both("■")} ${c.body(langs.length > 2 ? "all" : "both")} ${c.ink(String(inAll.size))}`,
        ...only.slice(1).map((s) => `${rgb(LANGUAGES[s.l].color)("■")} ${c.body(`${LANGUAGES[s.l].name} only`)} ${c.ink(String(s.n))}`),
      ].join(c.dim("   ·   ")));
    }

    out.push("", section("solved by difficulty"), "");
    out.push(`${pad("", 9)}${langs.map((l) => padL(rgb(LANGUAGES[l].color)(LANGUAGES[l].name), 13)).join("")}`);
    for (const d of DIFFS) {
      const total = ws.problems.filter((p) => p.difficulty === d).length;
      out.push(`${pad(diffColor[d](d), 9)}${langs.map((l) => {
        const n = [...solvedBy.get(l)!].filter((f) => known.get(f)?.difficulty === d).length;
        return padL(`${c.ink(String(n))}${c.muted(`/${total}`)}`, 13);
      }).join("")}`);
    }

    if (langs.length === 1) {
      const other = (Object.keys(LANGUAGES) as Language[]).find((l) => l !== langs[0]);
      if (other) out.push("", `${c.muted("Re-solving problems in another language is great practice. Try")} ${c.ink(`sk lang ${LANGUAGES[other].aliases[0]}`)}`, c.muted("Your progress and notes are shared, and this tab will compare the two."));
    }
    return out;
  }

  // ----- 4. History -----
  function history(width: number): string[] {
    const { attempts } = view();
    if (!attempts.length) return empty();
    const out = [""];
    const recent = attempts.slice(-Math.min(attempts.length, Math.floor((width - 10) / 2)));
    const max = Math.max(...recent.map((a) => a.minutes ?? 0), 1);
    const H = 8;
    out.push(section("minutes per attempt", `last ${recent.length}, newest on the right`), "");
    for (let row = H; row >= 1; row--) {
      let line = `${c.dim(padL(row === H ? String(max) : row === 1 ? "0" : "", 4))} ${c.dim("┤")}`;
      for (const a of recent) {
        const h = ((a.minutes ?? 0) / max) * H;
        line += (passed(a) ? diffColor[a.difficulty] : c.red)(h >= row ? "█" : h >= row - 0.5 ? "▄" : " ") + " ";
      }
      out.push(line);
    }
    out.push(`     ${c.dim("└" + "─".repeat(recent.length * 2))}`);
    out.push(`      ${c.green("■")} ${c.muted("easy")}  ${c.amber("■")} ${c.muted("medium")}  ${c.red("■")} ${c.muted("hard, or not passed")}`);

    out.push("", section("solve time vs target"), "");
    for (const d of DIFFS) {
      const ok = attempts.filter((a) => a.difficulty === d && passed(a));
      const a = avg(minutesOf(ok));
      const target = ws.config.targets[d];
      const fastest = ok.filter((x) => x.minutes != null).sort((x, y) => x.minutes! - y.minutes!)[0];
      out.push(
        `${pad(diffColor[d](d), 8)} ${a == null ? c.dim(pad("–", 6)) : (a <= target ? c.green : c.amber)(pad(`${a}m`, 6))} ${c.dim(pad(`aim ≤${target}m`, 11))}  ` +
          (fastest ? `${c.muted("best")} ${c.ink(`${fastest.minutes}m`)} ${c.muted(truncate(fastest.title, Math.max(10, width - 44)))}` : ""),
      );
    }

    out.push("", section("recent"), "");
    const titleW = Math.max(16, width - 46);
    for (const a of attempts.slice(-12).reverse()) {
      const spec = LANGUAGES[a.language];
      const help = a.help !== "none" ? c.red(HELP_LABEL[a.help]) : a.hints ? c.amber(`${a.hints} hint${a.hints > 1 ? "s" : ""}`) : c.muted("on my own");
      out.push(
        `${c.dim(a.at.slice(5, 10))} ${passed(a) ? c.green("✓") : c.red("✗")} ${rgb(spec?.color ?? "#868e97")(pad(spec?.tag ?? "?", 3))}` +
          `${pad(c.ink(truncate(`${a.id}. ${a.title}`, titleW)), titleW + 1)}${pad(diffColor[a.difficulty](a.difficulty), 7)}` +
          `${padL(a.seconds == null ? c.dim("–") : c.body(formatDuration(a.seconds)), 8)}  ${help}`,
      );
    }
    return out;
  }

  // ----- 5. Review -----
  function review(width: number): string[] {
    const { attempts } = view();
    if (!attempts.length) return empty();
    const due = dueNow(ws, attempts);
    const schedule = reviews(ws, attempts);
    const out = ["", due.length ? bold(c.amber(`${due.length} DUE NOW`)) + c.muted("  ·  sk review starts the most overdue") : c.green("Nothing due right now ✓"), ""];
    const titleW = Math.max(16, width - 50);
    const row = (r: (typeof schedule)[number], when: string) => {
      const p = known.get(r.folder);
      return `${pad(c.ink(truncate(p ? label(p) : r.folder, titleW)), titleW + 2)}${pad(diffColor[r.last.difficulty](r.last.difficulty), 8)}${pad(c.body(when), 18)}${c.muted(r.reason)}`;
    };
    for (const r of due.slice(0, 12)) out.push(row(r, `due ${ago(r.due)}`));
    if (due.length > 12) out.push(c.muted(`…and ${due.length - 12} more`));

    // The next 14 days: how many problems come back each day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const counts = Array.from({ length: 14 }, (_, i) =>
      schedule.filter((r) => r.due.getTime() > Date.now() && Math.floor((r.due.getTime() - today.getTime()) / DAY) === i).length);
    const peak = Math.max(1, ...counts);
    out.push("", section("next 14 days"), "");
    out.push(counts.map((n) => ` ${n ? c.blue(SPARK[Math.round((n / peak) * 7)]!) : c.dim("·")} `).join(""));
    out.push(Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today.getTime() + i * DAY).toLocaleString("en", { weekday: "short" }).slice(0, 2);
      return i === 0 ? c.ink(pad(d, 3)) : c.dim(pad(d, 3));
    }).join(""));
    out.push(counts.map((n) => c.muted(pad(n ? String(n) : "", 3))).join(""));

    const upcoming = schedule.filter((r) => r.due.getTime() > Date.now()).slice(0, 6);
    if (upcoming.length) {
      out.push("", section("coming up"), "");
      for (const r of upcoming) out.push(row(r, ago(r.due)));
    }
    out.push("", c.dim(`Not passed or hints → 1 day · slow → 3 days · clean → ${ws.config.reviewDays} days, doubling each clean repeat.`));
    return out;
  }

  function empty(): string[] {
    const { lang } = view();
    return [
      "",
      c.muted(lang === "all" ? "Nothing logged yet." : `No ${LANGUAGES[lang].name} attempts yet.`),
      "",
      `${c.body("Solve a problem, then record it:")}  ${c.ink("sk next → sk test -w → sk log")}`,
    ];
  }

  // ---------- frame ----------

  function frame(width: number, height: number): string[] {
    const { lang } = view();
    const tabLine = TABS.map((t, i) => (i === tab ? bold(c.ink(` ${i + 1} ${t} `)) : c.muted(` ${i + 1} ${t} `))).join(c.dim("│"));
    const underline = TABS.map((t, i) => (i === tab ? c.green("━".repeat(t.length + 4)) : " ".repeat(t.length + 4))).join(" ");
    const langLabel = lang === "all" ? c.ink("all languages") : bold(rgb(LANGUAGES[lang].color)(LANGUAGES[lang].name));
    const filterText = filters.length > 1 ? `${c.dim("[l]")} ${langLabel}` : "";
    const title = `  ${bold(small())}  ${c.muted("stats")}`;
    const head = ["", title + " ".repeat(Math.max(2, width - visible(title) - visible(filterText) - 2)) + filterText, "", `  ${tabLine}`, `  ${underline}`];
    const body = [overview, patterns, languages, history, review][tab]!(width - 4).map((l) => "  " + l);
    const room = Math.max(3, height - head.length - 2);
    scroll = Math.max(0, Math.min(scroll, body.length - room));
    const shown = body.slice(scroll, scroll + room);
    const hint = `←/→ tabs · ${filters.length > 1 ? "l language · " : ""}${body.length > room ? "↑/↓ scroll · " : ""}q quit`;
    const more = body.length > room ? c.muted(`   ${scroll > 0 ? "↑" : " "}${scroll + room < body.length ? "↓ more below" : ""}`) : "";
    if (height >= 10_000) return [...head, ...body, ""]; // printing, not a live screen
    return [...head, ...shown, ...Array<string>(Math.max(0, room - shown.length)).fill(""), "", `  ${c.dim(hint)}${more}`];
  }

  // Not a terminal (piped, CI…): print every tab once and stop
  if (!process.stdout.isTTY || !process.stdin.isTTY) {
    for (tab = 0; tab < TABS.length; tab++) console.log(frame(100, 10_000).join("\n"));
    return;
  }

  const draw = () => {
    const width = Math.min(process.stdout.columns || 100, 112);
    const height = process.stdout.rows || 40;
    if (width < 64 || height < 16) {
      process.stdout.write("\x1b[H\x1b[2J" + `\n  ${c.amber("Make the terminal a little bigger")} ${c.muted(`(at least 64×16, now ${width}×${height})`)}\n  ${c.dim("q to quit")}`);
      return;
    }
    process.stdout.write("\x1b[H\x1b[2J" + frame(width, height).join("\n"));
  };

  const quit = () => {
    process.stdout.write("\x1b[?25h\x1b[?1049l");
    process.exit(0);
  };
  process.stdout.write("\x1b[?1049h\x1b[?25l"); // alternate screen, hide cursor
  process.stdin.setRawMode(true);
  process.stdin.on("data", (buf) => {
    const k = buf.toString();
    if (k === "q" || k === "\x1b" || k === "\x03") return quit();
    if (k === "\x1b[C" || k === "\t") { tab = (tab + 1) % TABS.length; scroll = 0; }
    else if (k === "\x1b[D" || k === "\x1b[Z") { tab = (tab + TABS.length - 1) % TABS.length; scroll = 0; }
    else if (/^[1-5]$/.test(k)) { tab = Number(k) - 1; scroll = 0; }
    else if (k === "l" && filters.length > 1) { filter = (filter + 1) % filters.length; scroll = 0; }
    else if (k === "\x1b[B" || k === "j") scroll++;
    else if (k === "\x1b[A" || k === "k") scroll = Math.max(0, scroll - 1);
    else if (k === "g") scroll = 0;
    draw();
  });
  process.stdout.on("resize", draw);
  process.on("SIGINT", quit);
  draw();
  await new Promise(() => {});
}
