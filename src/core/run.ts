// Runs a problem's tests or its scratchpad block, in the workspace's language, optionally re-running on save.
import { watch as watchDir } from "node:fs";
import { basename } from "node:path";
import { problemDir, type Problem, type Workspace } from "./workspace";

export type Kind = "test" | "play";

function command(ws: Workspace, kind: Kind, watch: boolean): string[] {
  if (ws.language === "ts") {
    return kind === "test" ? ["bun", "test", ...(watch ? ["--watch"] : [])] : ["bun", ...(watch ? ["--watch"] : []), "solution.ts"];
  }
  const uv = ["uv", "run", "--quiet", "--project", ws.dir];
  return kind === "test" ? [...uv, "pytest"] : [...uv, "python", "solution.py"];
}

const env = (ws: Workspace) => ({ ...process.env, PYTHONPATH: ws.dir, PYTHONDONTWRITEBYTECODE: "1", FORCE_COLOR: "1" });

/** Runs once and returns the exit code */
export async function runOnce(ws: Workspace, p: Problem, kind: Kind, quiet = false): Promise<{ code: number; output: string }> {
  const proc = Bun.spawn(command(ws, kind, false), {
    cwd: problemDir(ws, p),
    env: quiet ? { ...env(ws), FORCE_COLOR: "0" } : env(ws),
    stdio: quiet ? ["ignore", "pipe", "pipe"] : ["inherit", "inherit", "inherit"],
  });
  const output = quiet ? (await new Response(proc.stdout).text()) + (await new Response(proc.stderr).text()) : "";
  return { code: await proc.exited, output };
}

/** Runs and keeps re-running whenever a file in the problem folder is saved. Never returns. */
export async function runWatching(ws: Workspace, p: Problem, kind: Kind): Promise<never> {
  if (ws.language === "ts") {
    // Bun has a built-in watcher
    const proc = Bun.spawn(command(ws, kind, true), { cwd: problemDir(ws, p), env: env(ws), stdio: ["inherit", "inherit", "inherit"] });
    process.exit(await proc.exited);
  }
  // Python: our own watcher
  let running: ReturnType<typeof Bun.spawn> | null = null;
  let timer: Timer | null = null;
  const start = () => {
    running?.kill();
    process.stdout.write("\x1b[2J\x1b[H");
    console.log(`\x1b[2m${kind === "test" ? "Testing" : "Running"} ${p.id}. ${p.title} · watching for changes (ctrl-c to stop)\x1b[0m\n`);
    running = Bun.spawn(command(ws, kind, false), { cwd: problemDir(ws, p), env: env(ws), stdio: ["inherit", "inherit", "inherit"] });
  };
  watchDir(problemDir(ws, p), (_event, file) => {
    if (!file || !String(file).endsWith(".py") || basename(String(file)).startsWith(".")) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(start, 120);
  });
  start();
  return new Promise<never>(() => {});
}
