// The SleekCode wordmark: a chunky pixel font drawn with half blocks.
// Each glyph is 10 sub-rows tall (2 ascender + 8 x-height); each pixel is 2 columns wide → 5 terminal lines.
import { c, mix, rgb } from "./colors";

const GLYPHS: Record<string, string[]> = {
  s: ["....", "....", "####", "####", "#...", "####", "...#", "...#", "####", "####"],
  l: ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  e: ["....", "....", "####", "####", "#..#", "#..#", "####", "#...", "####", "####"],
  k: ["#...", "#...", "#..#", "#..#", "###.", "###.", "#..#", "#..#", "#..#", "#..#"],
  c: ["....", "....", "####", "####", "#...", "#...", "#...", "#...", "####", "####"],
  o: ["....", "....", "####", "####", "#..#", "#..#", "#++#", "#++#", "####", "####"],
  d: ["...#", "...#", "####", "####", "#..#", "#..#", "#++#", "#++#", "####", "####"],
};

// "sleek" fades green → blue, "code" is white with grey shading inside the counters
const SLEEK_FROM = "#6fd3a8";
const SLEEK_TO = "#6aa9ef";
const CODE = "#eef0f2";
const SHADE = "#5b626a";

type Cell = { on: boolean; color: string };

function grid(): Cell[][] {
  const rows: Cell[][] = Array.from({ length: 10 }, () => []);
  const word = "sleekcode";
  [...word].forEach((ch, i) => {
    const g = GLYPHS[ch]!;
    const base = i < 5 ? mix(SLEEK_FROM, SLEEK_TO, i / 4) : CODE;
    for (let r = 0; r < 10; r++) {
      for (const px of g[r]!) {
        const cell = { on: px !== ".", color: px === "+" ? SHADE : base };
        rows[r]!.push(cell, cell);
      }
      if (i < word.length - 1) rows[r]!.push({ on: false, color: "" }, { on: false, color: "" });
    }
  });
  return rows;
}

const ANSI = !process.env.NO_COLOR && (process.stdout.isTTY || process.env.FORCE_COLOR === "1");

/** The big wordmark (84 columns wide) */
export function wordmark(): string[] {
  const rows = grid();
  const lines: string[] = [];
  for (let r = 0; r < 10; r += 2) {
    let line = "";
    for (let col = 0; col < rows[0]!.length; col++) {
      const t = rows[r]![col]!, b = rows[r + 1]![col]!;
      if (!t.on && !b.on) line += " ";
      else if (t.on && b.on && t.color === b.color) line += rgb(t.color)("█");
      else if (t.on && b.on) line += ANSI ? `\x1b[48;2;${hex(b.color)}m${rgb(t.color)("▀")}\x1b[49m` : "█";
      else if (t.on) line += rgb(t.color)("▀");
      else line += rgb(b.color)("▄");
    }
    lines.push(line);
  }
  return lines;
}

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(";");

export const TAGLINE = "LeetCode practice in your terminal";

/** Big header if the terminal is wide enough, otherwise a one-line version */
export function header(): string {
  const width = process.stdout.columns || Number(process.env.COLUMNS) || 100;
  if (width >= 90) return ["", ...wordmark().map((l) => "  " + l), "", `  ${c.muted(TAGLINE)}`, ""].join("\n");
  return `\n  ${small()}  ${c.muted("· " + TAGLINE)}\n`;
}

/** One-line wordmark for narrow terminals and compact screens */
export const small = () =>
  [..."sleek"].map((ch, i) => rgb(mix(SLEEK_FROM, SLEEK_TO, i / 4))(ch)).join("") + c.ink("code");
