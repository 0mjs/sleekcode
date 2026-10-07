// The themes `sk config -t` offers: the classic editor palettes, mapped onto what SleekCode colours.
// Dark themes only: SleekCode never sets your terminal's background, so it uses the theme's text colours on yours.

export type Palette = {
  /** Brand: headings, progress bars, "you are here" marks */
  accent: string;
  /** Flags in help */
  accent2: string;
  /** Meaning: passed, warning, failed */
  success: string;
  warn: string;
  fail: string;
  blue: string;
  /** Text, brightest to faintest */
  ink: string;
  body: string;
  muted: string;
  dim: string;
  /** The wordmark: letters shade top → middle → bottom over a horizon grid fading into `night` (the theme's background) */
  header: { top: string; middle: string; bottom: string; grid: string; night: string };
};

type Spec = Omit<Palette, "body" | "header"> & { bg: string; sunset: [string, string, string]; grid?: string; body?: string };

/** Fills in what most themes don't need to spell out: body text sits between ink and muted */
function theme(s: Spec): Palette {
  const { bg, sunset, grid, ...rest } = s;
  return {
    ...rest,
    body: s.body ?? blend(s.ink, s.muted, 0.35),
    header: { top: sunset[0], middle: sunset[1], bottom: sunset[2], grid: grid ?? sunset[1], night: bg },
  };
}

function blend(a: string, b: string, t: number) {
  const ch = (h: string, i: number) => parseInt(h.slice(i, i + 2), 16);
  return `#${[1, 3, 5].map((i) => Math.round(ch(a, i) + (ch(b, i) - ch(a, i)) * t).toString(16).padStart(2, "0")).join("")}`;
}

export const DEFAULT_THEME = "tokyo-night";

export const THEMES: Record<string, { name: string; palette: Palette }> = {
  "tokyo-night": {
    name: "Tokyo Night",
    palette: theme({
      bg: "#1a1b26", ink: "#c0caf5", muted: "#737aa2", dim: "#414868",
      accent: "#bb9af7", accent2: "#7dcfff", success: "#9ece6a", warn: "#e0af68", fail: "#f7768e", blue: "#7aa2f7",
      sunset: ["#7dcfff", "#7aa2f7", "#bb9af7"],
    }),
  },
  dracula: {
    name: "Dracula",
    palette: theme({
      bg: "#282a36", ink: "#f8f8f2", muted: "#7f8ab8", dim: "#44475a",
      accent: "#bd93f9", accent2: "#8be9fd", success: "#50fa7b", warn: "#ffb86c", fail: "#ff5555", blue: "#8be9fd",
      sunset: ["#ff79c6", "#bd93f9", "#8be9fd"],
    }),
  },
  "one-dark": {
    name: "One Dark",
    palette: theme({
      bg: "#282c34", ink: "#d7dae0", muted: "#7f848e", dim: "#3e4451",
      accent: "#61afef", accent2: "#56b6c2", success: "#98c379", warn: "#e5c07b", fail: "#e06c75", blue: "#61afef",
      sunset: ["#c678dd", "#61afef", "#56b6c2"],
    }),
  },
  monokai: {
    name: "Monokai",
    palette: theme({
      bg: "#272822", ink: "#f8f8f2", muted: "#8f8b77", dim: "#49483e",
      accent: "#fd971f", accent2: "#66d9ef", success: "#a6e22e", warn: "#e6db74", fail: "#f92672", blue: "#66d9ef",
      sunset: ["#f92672", "#fd971f", "#e6db74"],
    }),
  },
  gruvbox: {
    name: "Gruvbox",
    palette: theme({
      bg: "#282828", ink: "#ebdbb2", muted: "#928374", dim: "#504945",
      accent: "#fe8019", accent2: "#8ec07c", success: "#b8bb26", warn: "#fabd2f", fail: "#fb4934", blue: "#83a598",
      sunset: ["#fb4934", "#fe8019", "#fabd2f"],
    }),
  },
  nord: {
    name: "Nord",
    palette: theme({
      bg: "#2e3440", ink: "#eceff4", muted: "#8a93a5", dim: "#4c566a",
      accent: "#88c0d0", accent2: "#81a1c1", success: "#a3be8c", warn: "#ebcb8b", fail: "#bf616a", blue: "#5e81ac",
      sunset: ["#8fbcbb", "#88c0d0", "#81a1c1"],
    }),
  },
  catppuccin: {
    name: "Catppuccin Mocha",
    palette: theme({
      bg: "#1e1e2e", ink: "#cdd6f4", muted: "#7f849c", dim: "#45475a",
      accent: "#cba6f7", accent2: "#89dceb", success: "#a6e3a1", warn: "#f9e2af", fail: "#f38ba8", blue: "#89b4fa",
      sunset: ["#f5c2e7", "#cba6f7", "#89b4fa"],
    }),
  },
  solarized: {
    name: "Solarized Dark",
    palette: theme({
      bg: "#002b36", ink: "#eee8d5", body: "#93a1a1", muted: "#6c8a91", dim: "#2e4f58",
      accent: "#268bd2", accent2: "#2aa198", success: "#859900", warn: "#b58900", fail: "#dc322f", blue: "#268bd2",
      sunset: ["#d33682", "#6c71c4", "#268bd2"],
    }),
  },
  "github-dark": {
    name: "GitHub Dark",
    palette: theme({
      bg: "#0d1117", ink: "#e6edf3", muted: "#8b949e", dim: "#484f58",
      accent: "#58a6ff", accent2: "#79c0ff", success: "#3fb950", warn: "#d29922", fail: "#f85149", blue: "#58a6ff",
      sunset: ["#ff7b72", "#d2a8ff", "#79c0ff"],
    }),
  },
  "rose-pine": {
    name: "Rosé Pine",
    palette: theme({
      bg: "#191724", ink: "#e0def4", muted: "#908caa", dim: "#524f67",
      accent: "#ebbcba", accent2: "#c4a7e7", success: "#9ccfd8", warn: "#f6c177", fail: "#eb6f92", blue: "#9ccfd8",
      sunset: ["#eb6f92", "#ebbcba", "#f6c177"],
    }),
  },
  kanagawa: {
    name: "Kanagawa",
    palette: theme({
      bg: "#1f1f28", ink: "#dcd7ba", muted: "#8a8980", dim: "#54546d",
      accent: "#957fb8", accent2: "#7fb4ca", success: "#98bb6c", warn: "#e6c384", fail: "#e46876", blue: "#7e9cd8",
      sunset: ["#e46876", "#ffa066", "#e6c384"],
    }),
  },
  everforest: {
    name: "Everforest",
    palette: theme({
      bg: "#2d353b", ink: "#d3c6aa", muted: "#859289", dim: "#4f585e",
      accent: "#83c092", accent2: "#7fbbb3", success: "#a7c080", warn: "#dbbc7f", fail: "#e67e80", blue: "#7fbbb3",
      sunset: ["#a7c080", "#83c092", "#7fbbb3"],
    }),
  },
  "night-owl": {
    name: "Night Owl",
    palette: theme({
      bg: "#011627", ink: "#d6deeb", muted: "#7e8e9e", dim: "#2c4a63",
      accent: "#c792ea", accent2: "#7fdbca", success: "#addb67", warn: "#ffcb8b", fail: "#ef5350", blue: "#82aaff",
      sunset: ["#c792ea", "#82aaff", "#7fdbca"],
    }),
  },
  "synthwave-84": {
    name: "SynthWave '84",
    palette: theme({
      bg: "#262335", ink: "#f4f1fb", body: "#cdc8e3", muted: "#848bbd", dim: "#4f4a73",
      accent: "#ff7edb", accent2: "#36f9f6", success: "#72f1b8", warn: "#fede5d", fail: "#fe4450", blue: "#03edf9",
      sunset: ["#ff7edb", "#b381c5", "#36f9f6"], grid: "#9a5fd6",
    }),
  },
  ayu: {
    name: "Ayu Mirage",
    palette: theme({
      bg: "#1f2430", ink: "#cccac2", muted: "#7f8a9c", dim: "#4a5263",
      accent: "#ffcc66", accent2: "#5ccfe6", success: "#d5ff80", warn: "#ffad66", fail: "#f28779", blue: "#73d0ff",
      sunset: ["#f28779", "#ffad66", "#ffcc66"],
    }),
  },
};

/** "Tokyo Night", "tokyo-night", "tokyonight" → "tokyo-night"; "synthwave" works without the '84 */
export function findTheme(name: string | undefined): string | null {
  if (!name) return null;
  const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const key = squash(name);
  return Object.keys(THEMES).find((id) => [id, THEMES[id]!.name].some((n) => squash(n) === key || squash(n).replace(/\d/g, "") === key)) ?? null;
}
