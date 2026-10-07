// The active theme. Read once at startup, before anything is coloured: SLEEKCODE_THEME (for previews), then your config.
import { existsSync, readFileSync } from "node:fs";
import { CONFIG_FILE } from "../core/paths";
import { DEFAULT_THEME, findTheme, THEMES } from "./themes";

function chosen(): string {
  const fromEnv = findTheme(process.env.SLEEKCODE_THEME);
  if (fromEnv) return fromEnv;
  try {
    if (existsSync(CONFIG_FILE)) return findTheme(JSON.parse(readFileSync(CONFIG_FILE, "utf8")).theme) ?? DEFAULT_THEME;
  } catch {}
  return DEFAULT_THEME;
}

export const THEME_ID = chosen();
export const THEME = THEMES[THEME_ID]!.palette;
