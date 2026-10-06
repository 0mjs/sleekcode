import { homedir } from "node:os";
import { join } from "node:path";

/** Where SleekCode itself is installed (this repo) */
export const TOOL = join(import.meta.dir, "..", "..");
export const BANK = join(TOOL, "bank");
export const RUNTIME = join(TOOL, "runtime");
export const TEMPLATES = join(TOOL, "templates");

/** User settings. SLEEKCODE_CONFIG_DIR overrides it (handy for testing). */
export const CONFIG_DIR = process.env.SLEEKCODE_CONFIG_DIR ?? join(homedir(), ".config", "sleekcode");
export const CONFIG_FILE = join(CONFIG_DIR, "config.json");

/** ~/foo instead of /Users/me/foo, for display */
export const tilde = (p: string) => (p.startsWith(homedir()) ? "~" + p.slice(homedir().length) : p);
