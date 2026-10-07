// Creates and refreshes practice workspaces.
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { DEFAULTS, type Editor } from "./config";
import { writeEditorFiles } from "./editor-files";
import { LANGUAGES, type Language } from "./languages";
import { renderLog, renderRecords } from "./records";
import { ensureProblemFiles } from "./materialize";
import { BANK } from "./paths";
import { problemReadme } from "./readme";
import { MARKER, bankProblems, bankTestFile, openWorkspace, problemDir, solutionFile, testFile, writeMarker, type Workspace } from "./workspace";

/** Adds a language's helpers + project files to a workspace (safe to re-run) */
export async function setupLanguage(dir: string, lang: Language) {
  await LANGUAGES[lang].setup(dir);
}

/** bun install / uv sync */
export async function installDeps(dir: string, lang: Language): Promise<{ ok: boolean; output: string }> {
  const proc = Bun.spawn(LANGUAGES[lang].install, { cwd: dir, stdout: "pipe", stderr: "pipe" });
  const output = (await new Response(proc.stdout).text()) + (await new Response(proc.stderr).text());
  return { ok: (await proc.exited) === 0, output };
}

export async function createWorkspace(dir: string, language: Language, editor: Editor) {
  if (existsSync(dir) && readdirSync(dir).filter((f) => f !== ".DS_Store").length && !existsSync(join(dir, MARKER))) {
    throw new Error(`${dir} already has files in it. Pick an empty or new folder.`);
  }
  mkdirSync(dir, { recursive: true });
  await writeMarker(dir, language, [language]);
  await Bun.write(join(dir, ".gitignore"), [
    "node_modules/", ".venv/", "__pycache__/", ".pytest_cache/", ".ruff_cache/", ".DS_Store", ".current", "**/.started", "**/.hints-used", "",
  ].join("\n"));
  await setupLanguage(dir, language);
  await writeEditorFiles(dir, [language], editor);
  await Bun.write(join(dir, "README.md"), workspaceReadme());
  await renderLog({ dir } as Workspace, []);

  // Every problem gets its folder + README now, and starting code in the first language
  const ws = await openWorkspace(dir, { ...DEFAULTS, workspace: dir, editor });
  for (const p of ws.problems) await ensureProblemFiles(ws, p, language);
}

/**
 * After `sk update`: refresh tool-owned files (helpers, tests, editor tasks, any new problems).
 * Never touches your solutions, notes or attempts.
 */
export async function refreshWorkspace(ws: Workspace) {
  for (const lang of ws.languages) await setupLanguage(ws.dir, lang);
  await writeEditorFiles(ws.dir, ws.languages, ws.config.editor);
  await Bun.write(join(ws.dir, "README.md"), workspaceReadme());
  for (const p of await bankProblems()) {
    let touched = false;
    for (const lang of ws.languages) {
      if (existsSync(solutionFile(ws, p, lang))) {
        copyFileSync(bankTestFile(p, lang), testFile(ws, p, lang));
        touched = true;
      }
    }
    const cases = join(BANK, "problems", p.folder, "cases.json");
    if (touched && existsSync(cases)) copyFileSync(cases, join(problemDir(ws, p), "cases.json"));
    if (!existsSync(join(problemDir(ws, p), "README.md"))) {
      mkdirSync(problemDir(ws, p), { recursive: true });
      await Bun.write(join(problemDir(ws, p), "README.md"), problemReadme(p, null));
    }
  }
  const { loadAttempts } = await import("./attempts");
  await renderRecords(ws, (await loadAttempts(ws)).map((a) => a.folder));
}

function workspaceReadme(): string {
  return `# My SleekCode workspace

The NeetCode 150, plus anything you add. Your progress lives here; SleekCode itself is installed separately.

- \`problems/<number>-<name>/\`: \`README.md\` (problem + your notes + attempts), your solution file (work here), and its tests
- \`LIST.md\`: the checklist in study order · \`LOG.md\`: every attempt · \`attempts.json\`: the same, for \`sk stats\`

## The daily loop

\`\`\`
sk next        open the next problem
sk start       start the timer
sk test -w     run the tests every time you save
sk play -w     run your solution and see its output
sk hint        stuck? one hint at a time
sk log         record how it went
\`\`\`

## Languages

\`sk lang\` shows your language; \`sk lang python\` (or \`typescript\`) switches, like the dropdown on LeetCode.
Each problem gets files for a language the first time you open it in that language, and your notes and
progress are shared across languages.

Run \`sk\` on its own for a menu of what to do next, or \`sk -h\` for every command.

## Editors

- **Zed:** with a problem's file open, **alt-shift-t** → pick a task (\`sk: test (watch)\`, \`sk: hint\`, …). **alt-t** re-runs the last one.
- **VS Code / Cursor:** **cmd-shift-p → "Tasks: Run Task"**. Problem READMEs open as formatted previews.
- **Terminal editor:** \`sk next\` opens problems in your \`$EDITOR\` (vim/neovim: description and solution side by side).
- Both: the built-in terminal is **ctrl-\`**.

## Back it up (optional)

This folder is yours. To keep your progress safe, make it a private git repo: \`git init && git add -A && git commit -m "start"\`.
`;
}
