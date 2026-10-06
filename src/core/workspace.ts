import { existsSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { loadConfig, saveConfig, type Config, type Difficulty } from "./config";
import { LANGUAGES, type Language } from "./languages";
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

export type Workspace = {
  dir: string;
  /** The language you're practising right now (`sk lang`) */
  language: Language;
  /** Every language this workspace has been set up for */
  languages: Language[];
  config: Config;
  problems: Problem[];
};

export const MARKER = ".sleekcode.json";
type Marker = { version: number; language: Language; languages?: Language[]; created: string };

/** Walks up from `from` looking for a workspace */
export function findWorkspaceDir(from = process.cwd()): string | null {
  for (let dir = resolve(from); ; dir = dirname(dir)) {
    if (existsSync(join(dir, MARKER))) return dir;
    if (dirname(dir) === dir) return null;
  }
}

export const bankProblems = async (): Promise<Problem[]> => Bun.file(join(BANK, "problems.json")).json();

const readMarker = async (dir: string): Promise<Marker> => Bun.file(join(dir, MARKER)).json();

export async function writeMarker(dir: string, language: Language, languages: Language[]) {
  const prev = existsSync(join(dir, MARKER)) ? await readMarker(dir) : null;
  const marker: Marker = { version: 2, language, languages: [...new Set(languages)], created: prev?.created ?? new Date().toISOString() };
  await Bun.write(join(dir, MARKER), JSON.stringify(marker, null, 2) + "\n");
}

export async function openWorkspace(dir: string, config: Config): Promise<Workspace> {
  const marker = await readMarker(dir);
  const extrasFile = join(dir, "extras.json");
  const extras: Problem[] = existsSync(extrasFile) ? await Bun.file(extrasFile).json() : [];
  return {
    dir,
    language: marker.language,
    languages: marker.languages ?? [marker.language],
    config,
    problems: [...(await bankProblems()), ...extras],
  };
}

/** The workspace you're in, else the one in your config. Null if there's none yet. */
export async function currentWorkspace(): Promise<Workspace | null> {
  const config = await loadConfig();
  if (!config) return null;
  const here = findWorkspaceDir();
  if (here && !(config.workspaces ?? []).includes(here)) {
    // Remember workspaces you use, so `sk config` can switch to / remove them later
    config.workspaces = [...(config.workspaces ?? []), here];
    await saveConfig(config);
  }
  const dir = here ?? (existsSync(join(config.workspace, MARKER)) ? config.workspace : null);
  return dir ? openWorkspace(dir, config) : null;
}

// ---------- paths inside a workspace (for the current language unless given) ----------

export const problemDir = (ws: Workspace, p: Problem) => join(ws.dir, "problems", p.folder);
export const solutionFile = (ws: Workspace, p: Problem, lang = ws.language) => join(problemDir(ws, p), LANGUAGES[lang].solution);
export const testFile = (ws: Workspace, p: Problem, lang = ws.language) => join(problemDir(ws, p), LANGUAGES[lang].test);
/** The untouched starting code, used by reset/review */
export const stubFile = (ws: Workspace, p: Problem, lang = ws.language) =>
  p.extra
    ? join(ws.dir, ".sleekcode", "stubs", `${p.folder}.${LANGUAGES[lang].ext}`)
    : join(BANK, "problems", p.folder, lang, LANGUAGES[lang].solution);
export const bankTestFile = (p: Problem, lang: Language) => join(BANK, "problems", p.folder, lang, LANGUAGES[lang].test);
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
