// Every `sk log` is stored in <workspace>/attempts.json. Stats, review and LIST.md read it.
import { existsSync } from "node:fs";
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
  minutes: number | null;
  solo: boolean;
  hints: number;
  complexity: string;
  notes: string;
};

const file = (ws: Workspace) => join(ws.dir, "attempts.json");

export async function loadAttempts(ws: Workspace): Promise<Attempt[]> {
  if (!existsSync(file(ws))) return [];
  try {
    const raw: Partial<Attempt>[] = await Bun.file(file(ws)).json();
    // Fill gaps in older or hand-edited records so nothing downstream has to care
    return raw
      .filter((a) => a && a.folder && a.at && !Number.isNaN(Date.parse(a.at)))
      .map((a) => ({ language: ws.language, pass: 0, total: 0, minutes: null, solo: false, hints: 0, complexity: "", notes: "", difficulty: "Medium", pattern: "", id: "", title: a.folder!, ...a }) as Attempt)
      .sort((a, b) => a.at.localeCompare(b.at));
  } catch {
    return [];
  }
}

export async function addAttempt(ws: Workspace, a: Attempt) {
  await Bun.write(file(ws), JSON.stringify([...(await loadAttempts(ws)), a], null, 2) + "\n");
}

export const passed = (a: Attempt) => a.total > 0 && a.pass === a.total;
/** Passed, on your own, no hints */
export const clean = (a: Attempt) => passed(a) && a.solo && a.hints === 0;

export const solvedFolders = async (ws: Workspace) => new Set((await loadAttempts(ws)).filter(passed).map((a) => a.folder));

const DAY = 86_400_000;

export type Review = { folder: string; last: Attempt; due: Date; reason: string; streak: number };

/**
 * Spaced repetition, from your latest attempt of each problem:
 * - failed, used hints, or needed help → due again after 1 day
 * - passed solo but slower than target → 3 days
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
    else if (last.hints || !last.solo) [days, reason] = [1, last.hints ? `used ${last.hints} hint${last.hints > 1 ? "s" : ""}` : "needed help"];
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
