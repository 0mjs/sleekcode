// Durations: parse what people type, print them nicely.

/**
 * "25" → 25 min · "25m" · "90s" · "1h" · "1h 10m" · "2m30s" · "1.5h" · "12:30" (min:sec) · "1:05:00" (h:min:sec)
 * Returns seconds, or null if it can't be read.
 */
export function parseDuration(input: string): number | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  if (/^\d+(\.\d+)?$/.test(s)) return Math.round(Number(s) * 60); // a bare number means minutes
  const clock = s.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
  if (clock) {
    const [a, b, c] = [Number(clock[1]), Number(clock[2]), clock[3] ? Number(clock[3]) : null];
    return c == null ? a * 60 + b : a * 3600 + b * 60 + c;
  }
  let total = 0;
  let matched = "";
  for (const m of s.matchAll(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hours?|m|min|mins|minutes?|s|sec|secs|seconds?)(?![a-z])/g)) {
    const n = Number(m[1]);
    total += m[2]!.startsWith("h") ? n * 3600 : m[2]!.startsWith("m") ? n * 60 : n;
    matched += m[0];
  }
  // Every non-space character must have been understood
  return matched.replace(/\s/g, "").length === s.replace(/\s/g, "").length && total > 0 ? Math.round(total) : null;
}

/** 45s · 12m 34s · 1h 05m */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h) return `${h}h ${String(m).padStart(2, "0")}m`;
  return s ? `${m}m ${String(s).padStart(2, "0")}s` : `${m}m`;
}
