import { THEME } from "./theme";

// Truecolor helpers. Respects NO_COLOR and non-terminal output.
const enabled = !process.env.NO_COLOR && (process.stdout.isTTY || process.env.FORCE_COLOR === "1");

export const rgb = (hex: string) => (s: string | number) => {
  if (!enabled) return String(s);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `\x1b[38;2;${r};${g};${b}m${s}\x1b[39m`;
};

export const c = {
  ink: rgb(THEME.ink),
  body: rgb(THEME.body),
  muted: rgb(THEME.muted),
  dim: rgb(THEME.dim),
  accent: rgb(THEME.accent),
  green: rgb(THEME.success),
  teal: rgb(THEME.accent2),
  blue: rgb(THEME.blue),
  amber: rgb(THEME.warn),
  red: rgb(THEME.fail),
};
export const bold = (s: string) => (enabled ? `\x1b[1m${s}\x1b[22m` : s);
export const diffColor = { Easy: c.green, Medium: c.amber, Hard: c.red } as const;

export const visible = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, "").length;
export const pad = (s: string, n: number) => s + " ".repeat(Math.max(0, n - visible(s)));
export const padL = (s: string, n: number) => " ".repeat(Math.max(0, n - visible(s))) + s;

/** Linear blend between two hex colours, t in 0..1 */
export function mix(a: string, b: string, t: number) {
  const ch = (h: string, i: number) => parseInt(h.slice(i, i + 2), 16);
  const v = [1, 3, 5].map((i) => Math.round(ch(a, i) + (ch(b, i) - ch(a, i)) * t).toString(16).padStart(2, "0"));
  return `#${v.join("")}`;
}
