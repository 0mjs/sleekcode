// Every `sk log` is stored in <workspace>/attempts.json. Stats, review and LIST.md read it.
import { existsSync, renameSync } from "node:fs";
import { join } from "node:path";
import type { Difficulty } from "./config";
import type { Language } from "./languages";
import type { Workspace } from "./workspace";

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
  notes: string;
  /** Your code at the time, relative to the problem folder (e.g. attempts/2026-10-06.ts) */
  snapshot?: string;
};

export type Help = "none" | "ai" | "lookup" | "person";
export const HELP_LABEL: Record<Help, string> = { none: "on my own", ai: "used AI", lookup: "looked it up", person: "had help" };

const file = (ws: Workspace) => join(ws.dir, "attempts.json");

export async function loadAttempts(ws: Workspace): Promise<Attempt[]> {
  if (!existsSync(file(ws))) return [];
  try {
    const raw: Partial<Attempt>[] = await Bun.file(file(ws)).json();
    // Fill gaps in older or hand-edited records so nothing downstream has to care
    return raw
      .filter((a) => a && a.folder && a.at && !Number.isNaN(Date.parse(a.at)))
      .map((a) => {
        const full = { language: ws.language, pass: 0, total: 0, minutes: null, solo: false, hints: 0, complexity: "", notes: "", difficulty: "Medium", pattern: "", id: "", title: a.folder!, ...a } as Attempt;
        full.help ??= full.solo ? "none" : "lookup";
        full.seconds ??= full.minutes != null ? full.minutes * 60 : null;
        return full;
      })
      .sort((a, b) => a.at.localeCompare(b.at));
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
export const clean = (a: Attempt) => passed(a) && a.help === "none" && a.hints === 0;

export const solvedFolders = async (ws: Workspace) => new Set((await loadAttempts(ws)).filter(passed).map((a) => a.folder));

const DAY = 86_400_000;

export type Review = { folder: string; last: Attempt; due: Date; reason: string; streak: number };

/**
 * Spaced repetition, from your latest attempt of each problem:
 * - failed, or used AI / looked it up / had help → due again after 1 day
 * - used hints, or slower than target          → 3 days
 * - clean and quick                    → reviewDays (7), doubling with each clean repeat (7, 14, 28, …)
 */
export function reviews(ws: Workspace, attempts: Attempt[]): Review[] {
  const byFolder = new Map<string, Attempt[]>();
  for (const a of attempts) byFolder.set(a.folder, [...(byFolder.get(a.folder) ?? []), a]);

  const out: Review[] = [];
  for (const [folder, list] of byFolder) {
    const last = list.at(-1)!;
    let streak = 0;
    for (let i = list.length - 1; i >= 0 && clean(list[i]!); i--) streak++;
    const slow = last.minutes != null && last.minutes > ws.config.targets[last.difficulty];

    let days: number, reason: string;
    if (!passed(last)) [days, reason] = [1, "tests didn't pass"];
    else if (last.help !== "none") [days, reason] = [1, HELP_LABEL[last.help]];
    else if (last.hints) [days, reason] = [3, `used ${last.hints} hint${last.hints > 1 ? "s" : ""}`];
    else if (slow) [days, reason] = [3, `slow (${last.minutes} min)`];
    else [days, reason] = [ws.config.reviewDays * 2 ** Math.max(0, streak - 1), streak > 1 ? `clean ×${streak}` : "clean"];

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
