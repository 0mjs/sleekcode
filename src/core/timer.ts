// The per-problem timer (sk start / sk pause / sk start -c), stored in <problem>/.started.
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { formatDuration } from "./duration";
import { problemDir, type Problem, type Workspace } from "./workspace";

/** startedAt: when it first started · pausedAt: set while paused · pausedMs: total time spent paused */
type Timer = { startedAt: number; pausedAt: number | null; pausedMs: number };

const file = (ws: Workspace, p: Problem) => join(problemDir(ws, p), ".started");

export async function readTimer(ws: Workspace, p: Problem): Promise<Timer | null> {
  if (!existsSync(file(ws, p))) return null;
  const raw = (await Bun.file(file(ws, p)).text()).trim();
  if (/^\d+$/.test(raw)) return { startedAt: Number(raw), pausedAt: null, pausedMs: 0 }; // older plain-timestamp format
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const save = (ws: Workspace, p: Problem, t: Timer) => Bun.write(file(ws, p), JSON.stringify(t));

/** Solving time so far, in seconds (paused time doesn't count) */
export const elapsed = (t: Timer, now = Date.now()) =>
  Math.max(0, Math.round(((t.pausedAt ?? now) - t.startedAt - t.pausedMs) / 1000));

/** Starts a new timer, or resumes a paused one. Returns what happened. */
export async function startTimer(ws: Workspace, p: Problem): Promise<"started" | "resumed" | "running"> {
  const t = await readTimer(ws, p);
  if (!t) {
    await save(ws, p, { startedAt: Date.now(), pausedAt: null, pausedMs: 0 });
    return "started";
  }
  if (t.pausedAt == null) return "running";
  await save(ws, p, { ...t, pausedMs: t.pausedMs + (Date.now() - t.pausedAt), pausedAt: null });
  return "resumed";
}

export async function pauseTimer(ws: Workspace, p: Problem): Promise<"paused" | "already" | "none"> {
  const t = await readTimer(ws, p);
  if (!t) return "none";
  if (t.pausedAt != null) return "already";
  await save(ws, p, { ...t, pausedAt: Date.now() });
  return "paused";
}

export const clearTimer = (ws: Workspace, p: Problem) => rmSync(file(ws, p), { force: true });

/** "⏱ 14m 03s running" / "⏸ paused at 22m", for status lines */
export async function timerLabel(ws: Workspace, p: Problem): Promise<string | null> {
  const t = await readTimer(ws, p);
  if (!t) return null;
  return t.pausedAt != null ? `⏸ paused at ${formatDuration(elapsed(t))}` : `⏱ ${formatDuration(elapsed(t))} running`;
}
