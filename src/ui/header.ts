// The SleekCode wordmark: slanted line-drawn letters with speed lines trailing behind.
import pkg from "../../package.json";
import { c, mix, rgb } from "./colors";
import { THEME } from "./theme";

const GLYPHS: Record<string, [string, string, string]> = {
  s: ["┏━━╸", "┗━━┓", "╺━━┛"],
  l: ["╻   ", "┃   ", "┗━━╸"],
  e: ["┏━━╸", "┣━╸ ", "┗━━╸"],
  k: ["╻ ┏╸", "┣━┻┓", "╹  ╹"],
  c: ["┏━━╸", "┃   ", "┗━━╸"],
  o: ["┏━━┓", "┃  ┃", "┗━━┛"],
  d: ["┳━━┓", "┃  ┃", "┻━━┛"],
};

const { from: MINT, to: BLUE, code: WHITE, night: NIGHT } = THEME.header;

// Each row trails off to the left; gaps make it read as motion
const SPEED = ["   ━━━━━ ━━ ━", " ━━━━━━━━ ━━ ", "━━━━━ ━━━  ━ "];

/** Speed lines fade in from near-black to mint as they approach the letters */
const speed = (line: string) => [...line].map((ch, i) => rgb(mix(NIGHT, MINT, (i / (line.length - 1)) ** 1.6))(ch)).join("");

/** "sleek" runs mint → blue, "code" is white */
const letterColor = (i: number) => (i < 5 ? mix(MINT, BLUE, i / 4) : WHITE);

function wordmark(): string[] {
  const word = "sleekcode";
  return [0, 1, 2].map((row) => {
    const letters = [...word].map((ch, i) => rgb(letterColor(i))(GLYPHS[ch]![row]!)).join(" ");
    return `${speed(SPEED[row]!)}  ${" ".repeat(2 - row)}${letters}`; // shift each row right → italic slant
  });
}

const TAGLINE = "leetcode practice, in your terminal";

/** Big header if the terminal is wide enough, otherwise a one-liner */
export function header(): string {
  const width = process.stdout.columns || Number(process.env.COLUMNS) || 100;
  if (width >= 66) {
    const indent = " ".repeat(2 + SPEED[0]!.length + 4);
    return ["", ...wordmark().map((l) => "  " + l), "", `${indent}${c.muted(TAGLINE)}  ${c.dim(`v${pkg.version}`)}`, ""].join("\n");
  }
  return `\n  ${small()}  ${c.muted("· " + TAGLINE)}\n`;
}

/** One-line wordmark for narrow terminals and the stats title */
export const small = () => [..."sleek"].map((ch, i) => rgb(letterColor(i))(ch)).join("") + rgb(WHITE)("code");
