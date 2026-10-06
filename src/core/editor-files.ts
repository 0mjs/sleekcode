// Editor integration written into a workspace: tasks that run `sk` on whichever problem file is open.
import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import type { Editor, Language } from "./config";

const TASKS: { label: string; args: string; perFile: boolean }[] = [
  { label: "sk: test (watch)", args: "test --watch", perFile: true },
  { label: "sk: test", args: "test", perFile: true },
  { label: "sk: play (watch)", args: "play --watch", perFile: true },
  { label: "sk: play", args: "play", perFile: true },
  { label: "sk: hint", args: "hint", perFile: true },
  { label: "sk: start timer", args: "start", perFile: true },
  { label: "sk: log result", args: "log", perFile: true },
  { label: "sk: next problem", args: "next", perFile: false },
  { label: "sk: review", args: "review", perFile: false },
  { label: "sk: stats", args: "stats", perFile: false },
];

const json = (v: unknown) => JSON.stringify(v, null, 2) + "\n";

export async function writeEditorFiles(dir: string, language: Language, editor: Editor) {
  rmSync(join(dir, ".zed"), { recursive: true, force: true });
  rmSync(join(dir, ".vscode"), { recursive: true, force: true });

  if (editor === "zed") {
    mkdirSync(join(dir, ".zed"), { recursive: true });
    const tasks = TASKS.map((t) => ({
      label: t.label,
      command: `sk ${t.args}${t.perFile ? ' "$ZED_DIRNAME"' : ""}`,
      cwd: t.perFile ? "$ZED_DIRNAME" : "$ZED_WORKTREE_ROOT",
      reveal: "always",
      use_new_terminal: false,
      allow_concurrent_runs: false,
    }));
    await Bun.write(join(dir, ".zed", "tasks.json"), "// SleekCode tasks: run them with alt-shift-t (or cmd-shift-p → \"task: spawn\").\n" + json(tasks));
  }

  if (editor === "vscode") {
    mkdirSync(join(dir, ".vscode"), { recursive: true });
    await Bun.write(join(dir, ".vscode", "tasks.json"), json({
      version: "2.0.0",
      tasks: TASKS.map((t) => ({
        label: t.label,
        type: "shell",
        command: `sk ${t.args}${t.perFile ? ' "${fileDirname}"' : ""}`,
        options: { cwd: t.perFile ? "${fileDirname}" : "${workspaceFolder}" },
        problemMatcher: [],
        presentation: { reveal: "always", panel: "dedicated", clear: true },
      })),
    }));
    await Bun.write(join(dir, ".vscode", "settings.json"), json({
      // Problem READMEs open as formatted previews
      "workbench.editorAssociations": { "**/problems/*/README.md": "vscode.markdown.preview.editor" },
      "files.exclude": { "**/.started": true, "**/.hints-used": true, ".current": true, "**/__pycache__": true },
      ...(language === "py"
        ? {
            "python.defaultInterpreterPath": "${workspaceFolder}/.venv/bin/python",
            "python.analysis.extraPaths": ["${workspaceFolder}"],
            "[python]": { "editor.defaultFormatter": "charliermarsh.ruff" },
          }
        : {}),
    }));
    await Bun.write(join(dir, ".vscode", "extensions.json"), json({
      recommendations: language === "py" ? ["ms-python.python", "charliermarsh.ruff"] : ["oven.bun-vscode"],
    }));
  }
}
