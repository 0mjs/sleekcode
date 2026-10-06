// Runs a problem's tests or its scratchpad block in the current language, optionally re-running on save.
import { watch as watchDir } from "node:fs";
import { basename } from "node:path";
import { LANGUAGES, type Kind } from "./languages";
import { problemDir, type Problem, type Workspace } from "./workspace";

export type { Kind };

const env = (ws: Workspace, color: boolean) => ({
  ...process.env, PYTHONPATH: ws.dir, PYTHONDONTWRITEBYTECODE: "1", FORCE_COLOR: color ? "1" : "0",
});

/** Runs once and returns the exit code (and output, when quiet) */
export async function runOnce(ws: Workspace, p: Problem, kind: Kind, quiet = false): Promise<{ code: number; output: string }> {
  const proc = Bun.spawn(LANGUAGES[ws.language].run(kind, ws.dir, false), {
    cwd: problemDir(ws, p),
    env: env(ws, !quiet),
    stdio: quiet ? ["ignore", "pipe", "pipe"] : ["inherit", "inherit", "inherit"],
  });
  const output = quiet ? (await new Response(proc.stdout).text()) + (await new Response(proc.stderr).text()) : "";
  return { code: await proc.exited, output };
}

/** Runs and keeps re-running whenever a file in the problem folder is saved. Never returns. */
export async function runWatching(ws: Workspace, p: Problem, kind: Kind): Promise<never> {
  const lang = LANGUAGES[ws.language];
  if (lang.nativeWatch) {
    const proc = Bun.spawn(lang.run(kind, ws.dir, true), { cwd: problemDir(ws, p), env: env(ws, true), stdio: ["inherit", "inherit", "inherit"] });
    process.exit(await proc.exited);
  }
  let running: ReturnType<typeof Bun.spawn> | null = null;
  let timer: Timer | null = null;
  const start = () => {
    running?.kill();
    process.stdout.write("\x1b[2J\x1b[H");
    console.log(`\x1b[2m${kind === "test" ? "Testing" : kind === "play" ? "Playing the examples of" : "Running your scratchpad for"} ${p.id}. ${p.title} (${lang.name}) · watching for changes, ctrl-c to stop\x1b[0m\n`);
    running = Bun.spawn(lang.run(kind, ws.dir, false), { cwd: problemDir(ws, p), env: env(ws, true), stdio: ["inherit", "inherit", "inherit"] });
  };
  watchDir(problemDir(ws, p), (_event, file) => {
    if (!file || !String(file).endsWith(`.${lang.ext}`) || basename(String(file)).startsWith(".")) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(start, 120);
  });
  start();
  return new Promise<never>(() => {});
}
