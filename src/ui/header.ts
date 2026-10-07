// The SleekCode wordmark: rounded neon letters shading top to bottom like a sunset, over a retro horizon grid.
import pkg from "../../package.json";
import { bold, c, mix, rgb } from "./colors";
import { THEME } from "./theme";

const GLYPHS: Record<string, [string, string, string]> = {
  s: ["╭──╴", "╰──╮", "╶──╯"],
  l: ["╷   ", "│   ", "╰──╴"],
  e: ["╭──╴", "├─╴ ", "╰──╴"],
  k: ["╷ ╭╴", "├─┴╮", "╵  ╵"],
  c: ["╭──╴", "│   ", "╰──╴"],
  o: ["╭──╮", "│  │", "╰──╯"],
  d: ["┬──╮", "│  │", "┴──╯"],
};

const { top, middle, bottom, grid, night } = THEME.header;
const ROWS = [top, middle, bottom];
const WORD = "sleekcode";
const WIDTH = WORD.length * 5 - 1;

/** The horizon: a grid line that fades out towards both edges */
function horizon(): string {
  const line = [...Array(WIDTH + 7)].map((_, i) => (i % 6 === 3 ? "┼" : "─"));
  const mid = (line.length - 1) / 2;
  return line.map((ch, i) => rgb(mix(night, grid, 1 - Math.abs(i - mid) / mid))(ch)).join("");
}

const TAGLINE = "leetcode practice, in your terminal";

/** Big header if the terminal is wide enough, otherwise a one-liner */
export function header(): string {
  const width = process.stdout.columns || Number(process.env.COLUMNS) || 100;
  if (width >= WIDTH + 14) {
    const letters = [0, 1, 2].map((r) => "      " + [...WORD].map((ch) => rgb(ROWS[r]!)(GLYPHS[ch]![r]!)).join(" "));
    return ["", ...letters, "  " + horizon(), "", `      ${c.muted(TAGLINE)}  ${c.dim(`v${pkg.version}`)}`, ""].join("\n");
  }
  return `\n  ${small()}  ${c.muted("· " + TAGLINE)}\n`;
}

/** One-line wordmark for narrow terminals and the stats title */
export const small = () => [...WORD].map((ch, i) => rgb(mix(top, bottom, i / (WORD.length - 1)))(ch)).join("");

/** A sample of the active theme: the header, then each kind of text */
export function preview(): string {
  return [
    header(),
    `  ${bold(c.accent("HEADINGS"))}  ${c.accent("━━━━━━━━━━")}${c.dim("━━━━━")}  ${c.accent("●")} ${c.teal("-w, --watch")}`,
    `  ${c.green("✓ passed")}  ${c.amber("hint used")}  ${c.red("✗ failed")}  ${c.ink("text")}  ${c.body("body")}  ${c.muted("muted")}  ${c.dim("dim")}`,
    "",
  ].join("\n");
}
