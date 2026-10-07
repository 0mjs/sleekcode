// The look: every colour SleekCode uses, in one place. The wordmark's shape lives in header.ts.
export const THEME = {
  name: "Mint",
  /** Brand: headings, progress bars, "you are here" marks */
  accent: "#6fd3a8",
  /** Flags in help */
  accent2: "#5fc3c8",
  /** Meaning: passed, warning, failed */
  success: "#6fd3a8",
  warn: "#e3b04b",
  fail: "#f07a7a",
  blue: "#6aa9ef",
  /** Text, brightest to faintest */
  ink: "#eef0f2",
  body: "#c2c7cd",
  muted: "#868e97",
  dim: "#4f565e",
  /** The wordmark: "sleek" runs from → to, "code" is in `code`; speed lines fade in from `night` */
  header: { from: "#6fd3a8", to: "#6aa9ef", code: "#eef0f2", night: "#1f2a27" },
};
