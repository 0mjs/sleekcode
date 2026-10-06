import { existsSync, mkdirSync } from "node:fs";
import { CONFIG_DIR, CONFIG_FILE } from "./paths";

export type { Language } from "./languages";
export { LANGUAGES } from "./languages";
export type Editor = "zed" | "vscode" | "cursor" | "terminal" | "none";
export type Difficulty = "Easy" | "Medium" | "Hard";

export type Config = {
  /** The active workspace (used when you're not inside one) */
  workspace: string;
  editor: Editor;
  /** Base spaced-repetition interval for a clean solve */
  reviewDays: number;
  /** "Comfortable" minutes per difficulty; slower counts as shaky */
  targets: Record<Difficulty, number>;
  /** Optional: replace the complexity choices `sk log` offers */
  complexities?: string[];
};

export const DEFAULTS: Omit<Config, "workspace"> = {
  editor: "none",
  reviewDays: 7,
  targets: { Easy: 15, Medium: 30, Hard: 45 },
};

export const EDITORS: Record<Editor, string> = { zed: "Zed", vscode: "VS Code", cursor: "Cursor", terminal: "Terminal editor", none: "No editor" };

export async function loadConfig(): Promise<Config | null> {
  if (!existsSync(CONFIG_FILE)) return null;
  const saved = await Bun.file(CONFIG_FILE).json();
  return { ...DEFAULTS, ...saved, targets: { ...DEFAULTS.targets, ...saved.targets } };
}

export async function saveConfig(config: Config) {
  mkdirSync(CONFIG_DIR, { recursive: true });
  await Bun.write(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");
}
