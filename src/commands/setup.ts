// First-run onboarding (and `sk config`): pick a language, an editor, and where your workspace lives.
import * as p from "@clack/prompts";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { DEFAULTS, EDITORS, LANGUAGES, loadConfig, saveConfig, type Config, type Editor, type Language } from "../core/config";
import { createWorkspace, finishWorkspace, installDeps } from "../core/create";
import { writeEditorFiles } from "../core/editor-files";
import { tilde } from "../core/paths";
import { syncReadmes } from "../core/sync";
import { MARKER, openWorkspace, type Workspace } from "../core/workspace";
import { bold, c } from "../ui/colors";
import { header } from "../ui/header";

const expand = (path: string) => resolve(path.trim().replace(/^~(?=$|\/)/, homedir()));
const check = <T>(v: T): Exclude<T, symbol> => {
  if (p.isCancel(v)) {
    p.cancel("No changes made. Run sk again whenever you're ready.");
    process.exit(0);
  }
  return v as Exclude<T, symbol>;
};

async function ensureUv(): Promise<boolean> {
  if (Bun.which("uv")) return true;
  const ok = check(await p.confirm({ message: "Python practice uses uv (a fast Python tool). It isn't installed yet. Install it now?", initialValue: true }));
  if (!ok) return false;
  const spin = p.spinner();
  spin.start("Installing uv");
  const proc = Bun.spawn(["sh", "-c", "curl -LsSf https://astral.sh/uv/install.sh | sh"], { stdout: "pipe", stderr: "pipe" });
  const code = await proc.exited;
  process.env.PATH = `${join(homedir(), ".local", "bin")}:${process.env.PATH}`;
  spin.stop(code === 0 && Bun.which("uv") ? "uv installed" : c.red("Couldn't install uv. See https://docs.astral.sh/uv/"));
  return code === 0 && !!Bun.which("uv");
}

/** Creates the workspace with progress output. Returns the opened workspace. */
async function build(dir: string, language: Language, editor: Editor, config: Config): Promise<Workspace> {
  const spin = p.spinner();
  spin.start("Creating your workspace");
  await createWorkspace(dir, language, editor);
  const ws = await openWorkspace(dir, config);
  spin.message("Downloading problems from LeetCode");
  const failed = await syncReadmes(ws, (done, total) => spin.message(`Downloading problems from LeetCode (${done}/${total})`));
  spin.message(language === "ts" ? "Installing TypeScript tools (bun install)" : "Setting up Python (uv sync)");
  const deps = await installDeps(dir, language);
  await finishWorkspace(ws);
  spin.stop(`Workspace ready at ${c.ink(tilde(dir))}`);
  if (failed) p.log.warn(`${failed} problem descriptions couldn't be downloaded (no internet?). Run ${c.ink("sk sync")} later; the links work meanwhile.`);
  if (!deps.ok) p.log.warn(`Installing dependencies didn't finish:\n${c.muted(deps.output.trim().split("\n").slice(-4).join("\n"))}`);
  return ws;
}

async function askLanguage(): Promise<Language> {
  return check(await p.select<Language>({
    message: "Which language do you want to practise in?",
    options: [
      { value: "ts", label: "TypeScript", hint: "runs with Bun" },
      { value: "py", label: "Python", hint: "runs with uv + pytest" },
    ],
  }));
}

async function askEditor(initial?: Editor): Promise<Editor> {
  const installed = (app: string) => existsSync(`/Applications/${app}.app`) || existsSync(join(homedir(), "Applications", `${app}.app`));
  return check(await p.select<Editor>({
    message: "Which editor do you use?",
    initialValue: initial ?? (installed("Zed") ? "zed" : installed("Visual Studio Code") ? "vscode" : "none"),
    options: [
      { value: "zed", label: "Zed", hint: installed("Zed") ? "installed" : undefined },
      { value: "vscode", label: "VS Code", hint: installed("Visual Studio Code") ? "installed" : undefined },
      { value: "none", label: "Something else", hint: "I'll open the files myself" },
    ],
  }));
}

async function askDir(language: Language): Promise<string> {
  const suggestion = `~/sleekcode-${language === "ts" ? "typescript" : "python"}`;
  const v = check(await p.text({
    message: "Where should your workspace folder go?",
    placeholder: suggestion,
    defaultValue: suggestion,
    validate: (s) => {
      const dir = expand(s || suggestion);
      if (existsSync(dir) && readdirSync(dir).filter((f) => f !== ".DS_Store").length && !existsSync(join(dir, MARKER)))
        return "That folder already has files in it. Pick a new or empty one.";
    },
  }));
  return expand(v || suggestion);
}

function nextSteps(ws: Workspace) {
  const editorLine =
    ws.config.editor === "zed" ? `Open ${c.ink(tilde(ws.dir))} in Zed, then use alt-shift-t for tasks.`
      : ws.config.editor === "vscode" ? `Open ${c.ink(tilde(ws.dir))} in VS Code, then cmd-shift-p → "Tasks: Run Task".`
        : `Your files are in ${c.ink(tilde(ws.dir))}.`;
  p.note(
    [
      `${c.ink("sk next")}       open your first problem`,
      `${c.ink("sk test -w")}    run the tests every time you save`,
      `${c.ink("sk hint")}       stuck? one hint at a time`,
      `${c.ink("sk log")}        record how it went`,
      "",
      editorLine,
      `Run ${c.ink("sk")} any time to see every command.`,
    ].join("\n"),
    "You're set",
  );
}

/** First run: the whole onboarding */
export async function onboarding(args: string[] = []) {
  // Non-interactive form (for scripts and tests): sk setup --language py --editor vscode --dir ~/x
  const { values } = parseArgs({ args, options: { language: { type: "string" }, editor: { type: "string" }, dir: { type: "string" } }, allowPositionals: true, strict: false });
  if (values.language && values.editor && values.dir) {
    const dir = expand(String(values.dir));
    const config: Config = { ...DEFAULTS, ...(await loadConfig()), workspace: dir, editor: values.editor as Editor };
    const ws = await build(dir, values.language as Language, values.editor as Editor, config);
    await saveConfig(config);
    return nextSteps(ws);
  }

  console.log(header());
  p.intro(bold(" Welcome to SleekCode "));
  p.log.message(c.body("The NeetCode 150 (the classic interview problems) with tests, hints and progress tracking.\nThree quick questions and you're ready."));

  const language = await askLanguage();
  if (language === "py" && !(await ensureUv())) {
    p.cancel("Python needs uv. Install it from https://docs.astral.sh/uv/ and run sk again.");
    process.exit(1);
  }
  const editor = await askEditor();
  const dir = await askDir(language);

  const go = check(await p.confirm({
    message: `Create a ${LANGUAGES[language].name} workspace in ${tilde(dir)}, set up for ${EDITORS[editor]}?`,
    initialValue: true,
  }));
  if (!go) {
    p.cancel("No changes made.");
    process.exit(0);
  }

  const config: Config = { ...DEFAULTS, ...(await loadConfig()), workspace: dir, editor };
  const ws = await build(dir, language, editor, config);
  await saveConfig(config);
  nextSteps(ws);
  p.outro(`Happy grinding ${c.green("✦")}`);
}

/** sk config: change settings later */
export async function configure(ws: Workspace | null) {
  const config = await loadConfig();
  if (!config) return onboarding();
  console.log(header());
  p.intro(bold(" SleekCode settings "));
  p.log.message([
    `${c.muted("Workspace")}  ${c.ink(tilde(ws?.dir ?? config.workspace))}${ws ? c.muted(` · ${LANGUAGES[ws.language].name}`) : ""}`,
    `${c.muted("Editor")}     ${c.ink(EDITORS[config.editor])}`,
    `${c.muted("Reviews")}    ${c.ink(`${config.reviewDays} days`)} ${c.muted(`· targets ${config.targets.Easy}/${config.targets.Medium}/${config.targets.Hard} min`)}`,
  ].join("\n"));

  const choice = check(await p.select({
    message: "What do you want to change?",
    options: [
      { value: "editor", label: "Editor", hint: EDITORS[config.editor] },
      { value: "review", label: "Review timing", hint: `${config.reviewDays} days` },
      { value: "new", label: "Set up another workspace", hint: "e.g. to try the other language" },
      { value: "switch", label: "Switch the active workspace" },
      { value: "done", label: "Nothing, I'm done" },
    ],
  }));

  if (choice === "editor") {
    config.editor = await askEditor(config.editor);
    if (ws) await writeEditorFiles(ws.dir, ws.language, config.editor);
  } else if (choice === "review") {
    const days = check(await p.text({ message: "Days until a clean solve comes back for review", defaultValue: String(config.reviewDays), placeholder: String(config.reviewDays), validate: (s) => (s && !/^\d+$/.test(s) ? "A number of days" : undefined) }));
    config.reviewDays = Number(days || config.reviewDays);
    for (const d of ["Easy", "Medium", "Hard"] as const) {
      const v = check(await p.text({ message: `Comfortable time for ${d} problems (minutes)`, defaultValue: String(config.targets[d]), placeholder: String(config.targets[d]), validate: (s) => (s && !/^\d+$/.test(s) ? "A number of minutes" : undefined) }));
      config.targets[d] = Number(v || config.targets[d]);
    }
  } else if (choice === "new") {
    const language = await askLanguage();
    if (language === "py" && !(await ensureUv())) process.exit(1);
    const dir = await askDir(language);
    config.workspace = dir;
    const created = await build(dir, language, config.editor, config);
    await saveConfig(config);
    nextSteps(created);
  } else if (choice === "switch") {
    const v = check(await p.text({ message: "Path to the workspace folder", placeholder: tilde(config.workspace) }));
    const dir = expand(v || config.workspace);
    if (!existsSync(join(dir, MARKER))) {
      p.cancel(`${tilde(dir)} isn't a SleekCode workspace.`);
      process.exit(1);
    }
    config.workspace = dir;
  }
  await saveConfig(config);
  p.outro(choice === "done" ? "No changes." : c.green("Saved."));
}
