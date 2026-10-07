// Every `sk log` is stored in <workspace>/attempts.json. Stats, review and LIST.md read it.
import { existsSync, renameSync } from "node:fs";
import { join } from "node:path";
import type { Difficulty } from "./config";
import type { Language } from "./languages";
import { aboveTarget } from "./complexity";
import { hintsFile, type Workspace } from "./workspace";

export type Attempt = {
  at: string; // ISO timestamp
  folder: string;
  id: string;
  title: string;
  difficulty: Difficulty;
  pattern: string;
  language: Language;
  pass: number;
  total: number;
  /** Exact time taken (from the timer, or what you typed) */
  seconds: number | null;
  /** Rounded, for charts and older records */
  minutes: number | null;
  /** How you got there. Hints are tracked separately and don't count as help here. */
  help: Help;
  /** true when help is "none" (kept for older records) */
  solo: boolean;
  hints: number;
  complexity: string;
  /** Your complexity is worse than the problem's target (null = couldn't tell) */
  aboveTarget: boolean | null;
  /** How you felt about your solution */
  feel: Feel;
  notes: string;
  /** Your code at the time, relative to the problem folder (e.g. attempts/2026-10-06.ts) */
  snapshot?: string;
};

export type Help = "none" | "ai" | "lookup" | "person";
export type Feel = "unhappy" | "fine" | "nailed";
export const FEEL_LABEL: Record<Feel, string> = { unhappy: "not happy with it", fine: "fine", nailed: "nailed it" };
export const HELP_LABEL: Record<Help, string> = { none: "on my own", ai: "used AI", lookup: "looked it up", person: "had help" };

const file = (ws: Workspace) => join(ws.dir, "attempts.json");

export async function loadAttempts(ws: Workspace): Promise<Attempt[]> {
  if (!existsSync(file(ws))) return [];
  try {
    const raw: Partial<Attempt>[] = await Bun.file(file(ws)).json();
    // Fill gaps in older or hand-edited records so nothing downstream has to care
    const attempts = raw
      .filter((a) => a && a.folder && a.at && !Number.isNaN(Date.parse(a.at)))
      .map((a) => {
        const full = { language: ws.language, pass: 0, total: 0, minutes: null, solo: false, hints: 0, complexity: "", notes: "", difficulty: "Medium", pattern: "", id: "", title: a.folder!, ...a } as Attempt;
        full.help ??= full.solo ? "none" : "lookup";
        full.seconds ??= full.minutes != null ? full.minutes * 60 : null;
        full.feel ??= "fine";
        return full;
      })
      .sort((a, b) => a.at.localeCompare(b.at));
    // Older attempts: work out "above target" from the complexity you logged
    const targets = new Map<string, string | null>();
    for (const a of attempts) {
      if (a.aboveTarget !== undefined) continue;
      if (!targets.has(a.folder)) {
        const p = ws.problems.find((x) => x.folder === a.folder);
        const file = p ? hintsFile(ws, p) : "";
        targets.set(a.folder, file && existsSync(file) ? (await Bun.file(file).json()).target : null);
      }
      a.aboveTarget = a.complexity ? aboveTarget(a.complexity, targets.get(a.folder)).above : null;
    }
    return attempts;
  } catch {
    return [];
  }
}

async function saveAttempts(ws: Workspace, attempts: Attempt[]) {
  // Write a temp file, then rename over the real one: a crash mid-write can't corrupt your history
  const tmp = file(ws) + ".tmp";
  await Bun.write(tmp, JSON.stringify(attempts, null, 2) + "\n");
  renameSync(tmp, file(ws));
}

export async function addAttempt(ws: Workspace, a: Attempt) {
  await saveAttempts(ws, [...(await loadAttempts(ws)), a]);
}

/** Attempts are identified by their timestamp */
export async function updateAttempt(ws: Workspace, at: string, change: Partial<Attempt> | null) {
  const all = await loadAttempts(ws);
  await saveAttempts(ws, change === null ? all.filter((a) => a.at !== at) : all.map((a) => (a.at === at ? { ...a, ...change } : a)));
}

export const passed = (a: Attempt) => a.total > 0 && a.pass === a.total;
/** Passed, on your own, no hints */
/** Passed, on your own, no hints, complexity on target, and you were happy with it */
export const clean = (a: Attempt) => passed(a) && a.help === "none" && a.hints === 0 && a.aboveTarget !== true && a.feel !== "unhappy";

export const solvedFolders = async (ws: Workspace) => new Set((await loadAttempts(ws)).filter(passed).map((a) => a.folder));

const DAY = 86_400_000;

export type Review = { folder: string; last: Attempt; due: Date; reason: string; streak: number };

const slow = (ws: Workspace, a: Attempt) => a.minutes != null && a.minutes > ws.config.targets[a.difficulty];
/** A solve that earns the full schedule: clean, and within your target time */
const onSchedule = (ws: Workspace, a: Attempt) => clean(a) && !slow(ws, a);

/** Clean solves in a row at the end of a problem's history */
function streakOf(ws: Workspace, list: Attempt[]): number {
  let streak = 0;
  for (let i = list.length - 1; i >= 0 && onSchedule(ws, list[i]!); i--) streak++;
  return streak;
}

/** Problems you've mastered: graduateAfter (4) clean solves in a row. They leave the review queue. */
export function masteredFolders(ws: Workspace, attempts: Attempt[]): Set<string> {
  const byFolder = new Map<string, Attempt[]>();
  for (const a of attempts) byFolder.set(a.folder, [...(byFolder.get(a.folder) ?? []), a]);
  return new Set([...byFolder].filter(([, list]) => streakOf(ws, list) >= ws.config.graduateAfter).map(([f]) => f));
}

/**
 * Spaced repetition, from your latest attempt of each problem:
 * - failed, or used AI / looked it up / had help → due again after 1 day
 * - you weren't happy with it                  → 2 days
 * - complexity above target, used hints, or slower than target → 3 days
 * - "nailed it" doubles the clean interval
 * - clean and quick                    → reviewDays (7), doubling with each clean repeat (7, 14, 28, …)
 * - graduateAfter (4) clean solves in a row → mastered: out of the queue for good (until you log a non-clean redo)
 */
export function reviews(ws: Workspace, attempts: Attempt[]): Review[] {
  const byFolder = new Map<string, Attempt[]>();
  for (const a of attempts) byFolder.set(a.folder, [...(byFolder.get(a.folder) ?? []), a]);

  const out: Review[] = [];
  for (const [folder, list] of byFolder) {
    const last = list.at(-1)!;
    const streak = streakOf(ws, list);
    if (streak >= ws.config.graduateAfter) continue; // mastered

    let days: number, reason: string;
    if (!passed(last)) [days, reason] = [1, "tests didn't pass"];
    else if (last.help !== "none") [days, reason] = [1, HELP_LABEL[last.help]];
    else if (last.feel === "unhappy") [days, reason] = [2, "you weren't happy with it"];
    else if (last.aboveTarget) [days, reason] = [3, "complexity above target"];
    else if (last.hints) [days, reason] = [3, `used ${last.hints} hint${last.hints > 1 ? "s" : ""}`];
    else if (slow(ws, last)) [days, reason] = [3, `slow (${last.minutes} min)`];
    else [days, reason] = [ws.config.reviewDays * 2 ** Math.max(0, streak - 1) * (last.feel === "nailed" ? 2 : 1), `clean ${streak}/${ws.config.graduateAfter}${last.feel === "nailed" ? ", nailed it" : ""}`];

    out.push({ folder, last, due: new Date(new Date(last.at).getTime() + days * DAY), reason, streak });
  }
  return out.sort((a, b) => a.due.getTime() - b.due.getTime());
}

export const dueNow = (ws: Workspace, attempts: Attempt[], now = new Date()) => reviews(ws, attempts).filter((r) => r.due <= now);

export function ago(d: Date, now = new Date()) {
  const days = Math.round((now.getTime() - d.getTime()) / DAY);
  if (days === 0) return "today";
  if (days > 0) return days === 1 ? "1 day ago" : `${days} days ago`;
  return days === -1 ? "in 1 day" : `in ${-days} days`;
}
