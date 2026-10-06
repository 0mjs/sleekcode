// Creates a practice workspace: problem folders, helpers, project files, editor tasks.
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { LANGUAGES, type Editor, type Language } from "./config";
import { writeEditorFiles } from "./editor-files";
import { renderList } from "./list";
import { BANK, RUNTIME } from "./paths";
import { problemReadme } from "./readme";
import { MARKER, bankProblems, type Workspace } from "./workspace";

const json = (v: unknown) => JSON.stringify(v, null, 2) + "\n";

export async function createWorkspace(dir: string, language: Language, editor: Editor) {
  if (existsSync(dir) && readdirSync(dir).filter((f) => f !== ".DS_Store").length && !existsSync(join(dir, MARKER))) {
    throw new Error(`${dir} already has files in it. Pick an empty or new folder.`);
  }
  mkdirSync(dir, { recursive: true });
  const lang = LANGUAGES[language];

  await Bun.write(join(dir, MARKER), json({ version: 1, language, created: new Date().toISOString() }));
  await Bun.write(join(dir, ".gitignore"), [
    "node_modules/", ".venv/", "__pycache__/", ".pytest_cache/", ".ruff_cache/", ".DS_Store", ".current", "**/.started", "**/.hints-used", "",
  ].join("\n"));

  // Helpers + project files
  if (language === "ts") {
    cpSync(join(RUNTIME, "ts", "lib"), join(dir, "lib"), { recursive: true });
    await Bun.write(join(dir, "package.json"), json({
      name: "sleekcode-practice", private: true, type: "module",
      devDependencies: { "@types/bun": "latest", typescript: "^5" },
    }));
    await Bun.write(join(dir, "tsconfig.json"), json({
      compilerOptions: {
        target: "ESNext", module: "ESNext", moduleResolution: "bundler", strict: true,
        noUncheckedIndexedAccess: true, noEmit: true, skipLibCheck: true, types: ["bun"],
      },
      include: ["lib", "problems"],
    }));
  } else {
    cpSync(join(RUNTIME, "py", "sleek"), join(dir, "sleek"), { recursive: true });
    await Bun.write(join(dir, "pyproject.toml"), `[project]
name = "sleekcode-practice"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []

[dependency-groups]
dev = ["pytest>=8", "ruff>=0.6"]

[tool.uv]
package = false

[tool.pytest.ini_options]
addopts = "-q -p no:cacheprovider --color=yes"
pythonpath = ["."]

[tool.pyright]
venvPath = "."
venv = ".venv"
extraPaths = ["."]

[tool.ruff]
line-length = 120
`);
  }

  await writeEditorFiles(dir, language, editor);

  // Problem folders: README (text filled in by sync), starting code, tests
  for (const p of await bankProblems()) {
    const pd = join(dir, "problems", p.folder);
    mkdirSync(pd, { recursive: true });
    const src = join(BANK, "problems", p.folder, language);
    if (!existsSync(join(pd, `solution.${lang.ext}`))) cpSync(join(src, `solution.${lang.ext}`), join(pd, `solution.${lang.ext}`));
    cpSync(join(src, lang.test), join(pd, lang.test));
    if (!existsSync(join(pd, "README.md"))) await Bun.write(join(pd, "README.md"), problemReadme(p, null));
  }

  if (!existsSync(join(dir, "LOG.md"))) {
    await Bun.write(join(dir, "LOG.md"), "# Results Log\n\n| Date | Problem | Difficulty | Tests | Minutes | Solo? | Complexity | Notes |\n| ---- | ------- | ---------- | ----- | ------- | ----- | ---------- | ----- |\n");
  }
  await Bun.write(join(dir, "README.md"), workspaceReadme(language, editor));
}

/** bun install / uv sync */
export async function installDeps(dir: string, language: Language): Promise<{ ok: boolean; output: string }> {
  const cmd = language === "ts" ? ["bun", "install"] : ["uv", "sync", "--quiet"];
  const proc = Bun.spawn(cmd, { cwd: dir, stdout: "pipe", stderr: "pipe" });
  const output = (await new Response(proc.stdout).text()) + (await new Response(proc.stderr).text());
  return { ok: (await proc.exited) === 0, output };
}

export async function finishWorkspace(ws: Workspace) {
  await renderList(ws);
}

function workspaceReadme(language: Language, editor: Editor): string {
  const l = LANGUAGES[language];
  const run = language === "ts" ? "console.log" : "print";
  const editorTips =
    editor === "zed"
      ? `## Zed

Open this folder in Zed. With any problem's file open, press **alt-shift-t** (or cmd-shift-p → "task: spawn")
and pick a task: \`sk: test (watch)\`, \`sk: play (watch)\`, \`sk: hint\`, \`sk: log result\`, …
**alt-t** re-runs the last task. Open the built-in terminal with **ctrl-\`**.
Markdown preview: **cmd-shift-v** on a README.
`
      : editor === "vscode"
        ? `## VS Code

Open this folder in VS Code. Problem READMEs open as formatted previews automatically.
With a problem's file open: **cmd-shift-p → "Tasks: Run Task"** and pick \`sk: test (watch)\`, \`sk: hint\`, …
Open the built-in terminal with **ctrl-\`** and type \`sk\` commands there.
Install the recommended extensions when VS Code asks.
`
        : "";
  return `# My SleekCode workspace

${l.name} practice for the NeetCode 150. Your progress lives here; SleekCode itself is installed separately.

- \`problems/<number>-<name>/\`: \`README.md\` (problem + your notes + attempts), \`solution.${l.ext}\` (work here), \`${l.test}\`
- \`LIST.md\`: the checklist in study order · \`LOG.md\`: every attempt · \`attempts.json\`: the same, for stats

## The daily loop

\`\`\`
sk next        open the next problem
sk start       start the timer
sk test -w     run the tests every time you save
sk play -w     run your solution and see what you ${run}
sk hint        stuck? one hint at a time
sk log         record how it went
\`\`\`

Run \`sk\` on its own for every command.

${editorTips}
## Back it up (optional)

This folder is yours. To keep your progress safe, make it a git repo: \`git init && git add -A && git commit -m "start"\`.
`;
}
