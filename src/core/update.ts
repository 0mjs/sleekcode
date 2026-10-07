// Updating SleekCode: `sk update` does it now; otherwise it happens by itself, at most once a day, in the background.
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Config } from "./config";
import { installDeps, refreshWorkspace } from "./create";
import { CONFIG_DIR, TOOL } from "./paths";
import { syncReadmes } from "./sync";
import type { Workspace } from "./workspace";
import { c } from "../ui/colors";

const STATE = join(CONFIG_DIR, "update.json");
const DAY = 20 * 60 * 60 * 1000; // a little under a day, so a daily habit at the same time still triggers it

type State = { checkedAt?: string; updated?: { from: string; to: string } };

const readState = async (): Promise<State> => (existsSync(STATE) ? Bun.file(STATE).json().catch(() => ({})) : {});
const writeState = (s: State) => Bun.write(STATE, JSON.stringify(s, null, 2) + "\n");
const version = async () => (await Bun.file(join(TOOL, "package.json")).json()).version as string;
const git = (...args: string[]) => Bun.spawnSync(["git", ...args], { cwd: TOOL, stdout: "pipe", stderr: "pipe" });

/** Pulls the latest SleekCode, installs its dependencies and refreshes your workspace (never your solutions, notes or attempts) */
export async function pullLatest(ws: Workspace | null, progress: (msg: string) => void = () => {}) {
  const before = await version();
  const pull = git("pull", "--ff-only");
  if (pull.exitCode !== 0) return { ok: false as const, error: pull.stderr.toString().trim() };
  const changed = !pull.stdout.toString().includes("Already up to date");
  if (changed) Bun.spawnSync(["bun", "install"], { cwd: TOOL, stdout: "ignore", stderr: "ignore" });
  if (ws) {
    progress("Refreshing your workspace (tests, helpers, editor tasks)");
    // This process still has the old code loaded, so the new code does the refresh
    Bun.spawnSync(["bun", join(TOOL, "src", "cli.ts"), "update", "--refresh"], { cwd: ws.dir, stdout: "ignore", stderr: "ignore", env: process.env });
  }
  return { ok: true as const, changed, before, after: await version() };
}

/** The hidden `sk update --refresh`: brings a workspace's tests, helpers and editor tasks up to date */
export async function refresh(ws: Workspace) {
  await refreshWorkspace(ws);
  await syncReadmes(ws, () => {});
  for (const lang of ws.languages) await installDeps(ws.dir, lang);
}

/** Called on every sk command: once a day, starts a background update check. Never makes you wait. */
export async function updateInBackground(config: Config) {
  if (config.autoUpdate === false || process.env.SLEEKCODE_NO_AUTO_UPDATE) return;
  const state = await readState();
  if (state.checkedAt && Date.now() - Date.parse(state.checkedAt) < DAY) return;
  await writeState({ ...state, checkedAt: new Date().toISOString() });
  Bun.spawn(["bun", join(TOOL, "src", "cli.ts"), "update", "--background"], { stdio: ["ignore", "ignore", "ignore"], env: process.env }).unref();
}

/** The hidden `sk update --background`: update only if there's something new and it's safe to */
export async function updateQuietly(ws: Workspace | null) {
  // Local changes or commits mean someone is working on SleekCode itself: leave it alone
  if (git("status", "--porcelain").stdout.toString().trim()) return;
  if (git("fetch", "--quiet").exitCode !== 0) return; // offline: try again tomorrow
  const count = (range: string) => Number(git("rev-list", "--count", range).stdout.toString().trim() || 0);
  if (count("@{u}..HEAD") > 0 || count("HEAD..@{u}") === 0) return;
  const result = await pullLatest(ws);
  if (result.ok && result.changed) {
    const state = await readState();
    await writeState({ ...state, updated: { from: state.updated?.from ?? result.before, to: result.after } });
  }
}

/** What changed between two versions, from CHANGELOG.md: each bullet as plain text */
async function changes(from: string, to: string): Promise<string[]> {
  const newer = (a: string, b: string) => {
    const [x, y] = [a, b].map((v) => v.split(".").map(Number));
    for (let i = 0; i < 3; i++) if (x![i] !== y![i]) return x![i]! > y![i]!;
    return false;
  };
  const text = await Bun.file(join(TOOL, "CHANGELOG.md")).text().catch(() => "");
  const out: string[] = [];
  for (const section of text.split(/^## /m).slice(1)) {
    const v = section.split("\n")[0]!.trim();
    if (!newer(v, from) || newer(v, to)) continue;
    for (const line of section.split("\n")) {
      if (line.startsWith("- ")) out.push(line.slice(2).replace(/\*\*|`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"));
    }
  }
  return out;
}

/** After a background update: tells you once, on your next command, with what's new */
export async function updateNotice(): Promise<string | null> {
  const state = await readState();
  if (!state.updated) return null;
  const { from, to } = state.updated;
  delete state.updated;
  await writeState(state);
  const width = (process.stdout.columns || 100) - 6;
  const cut = (s: string) => (s.length > width ? s.slice(0, width - 1).trimEnd() + "…" : s);
  const notes = await changes(from, to);
  return [
    "",
    `  ${c.green("✦ SleekCode updated itself")} ${c.muted(`v${from} → v${to}`)}`,
    ...notes.slice(0, 4).map((n) => `    ${c.muted("·")} ${c.body(cut(n))}`),
    ...(notes.length > 4 ? [`    ${c.muted(`· and ${notes.length - 4} more (CHANGELOG.md)`)}`] : []),
  ].join("\n");
}
