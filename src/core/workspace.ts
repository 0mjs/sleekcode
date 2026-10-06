import { existsSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { LANGUAGES, loadConfig, type Config, type Difficulty, type Language } from "./config";
import { BANK } from "./paths";

export type Problem = {
  id: string;
  title: string;
  slug: string;
  folder: string;
  difficulty: Difficulty;
  pattern: string;
  blind75: boolean;
  video?: string;
  paid: boolean;
  /** Added with `sk add` (lives in the workspace, not the bank) */
  extra?: boolean;
};

export type Workspace = { dir: string; language: Language; config: Config; problems: Problem[] };

export const MARKER = ".sleekcode.json";

/** Walks up from `from` looking for a workspace */
export function findWorkspaceDir(from = process.cwd()): string | null {
  for (let dir = resolve(from); ; dir = dirname(dir)) {
    if (existsSync(join(dir, MARKER))) return dir;
    if (dirname(dir) === dir) return null;
  }
}

export const bankProblems = async (): Promise<Problem[]> => Bun.file(join(BANK, "problems.json")).json();

export async function openWorkspace(dir: string, config: Config): Promise<Workspace> {
  const marker = await Bun.file(join(dir, MARKER)).json();
  const extrasFile = join(dir, "extras.json");
  const extras: Problem[] = existsSync(extrasFile) ? await Bun.file(extrasFile).json() : [];
  return { dir, language: marker.language, config, problems: [...(await bankProblems()), ...extras] };
}

/** The workspace you're in, else the one in your config. Null if there's none yet. */
export async function currentWorkspace(): Promise<Workspace | null> {
  const config = await loadConfig();
  if (!config) return null;
  const dir = findWorkspaceDir() ?? (existsSync(join(config.workspace, MARKER)) ? config.workspace : null);
  return dir ? openWorkspace(dir, config) : null;
}

// ---------- paths inside a workspace ----------

export const problemDir = (ws: Workspace, p: Problem) => join(ws.dir, "problems", p.folder);
export const solutionFile = (ws: Workspace, p: Problem) => join(problemDir(ws, p), `solution.${LANGUAGES[ws.language].ext}`);
export const testFile = (ws: Workspace, p: Problem) => join(problemDir(ws, p), LANGUAGES[ws.language].test);
/** The untouched starting code, used by reset/review */
export const stubFile = (ws: Workspace, p: Problem) =>
  p.extra
    ? join(ws.dir, ".sleekcode", "stubs", `${p.folder}.${LANGUAGES[ws.language].ext}`)
    : join(BANK, "problems", p.folder, ws.language, `solution.${LANGUAGES[ws.language].ext}`);
export const hintsFile = (ws: Workspace, p: Problem) =>
  p.extra ? join(ws.dir, ".sleekcode", "hints", `${p.folder}.json`) : join(BANK, "problems", p.folder, "hints.json");
export const currentFile = (ws: Workspace) => join(ws.dir, ".current");

// ---------- picking a problem ----------

export function findProblem(ws: Workspace, query: string): Problem | undefined {
  const q = basename(query);
  return ws.problems.find((p) => p.id === q || p.folder === q || p.slug === q) ?? ws.problems.find((p) => p.folder.includes(q));
}

/**
 * Which problem a command means: an explicit number/name/path, else the problem folder you're in,
 * else the "current" one (set by next / open / start / review).
 */
export async function resolveProblem(ws: Workspace, query?: string): Promise<Problem | null> {
  if (query) return findProblem(ws, query) ?? null;
  const rel = relative(join(ws.dir, "problems"), process.cwd());
  if (!rel.startsWith("..") && rel) {
    const here = ws.problems.find((p) => p.folder === rel.split("/")[0]);
    if (here) return here;
  }
  const cur = currentFile(ws);
  if (!existsSync(cur)) return null;
  const folder = (await Bun.file(cur).text()).trim();
  return ws.problems.find((p) => p.folder === folder) ?? null;
}

export const setCurrent = (ws: Workspace, p: Problem) => Bun.write(currentFile(ws), p.folder);
