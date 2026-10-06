// First-run onboarding (and `sk config`): pick a language, an editor, and where your workspace lives.
import * as p from "@clack/prompts";
import { cpSync, existsSync, readdirSync, renameSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { DEFAULTS, EDITORS, loadConfig, saveConfig, type Config, type Editor } from "../core/config";
import { LANGUAGE_IDS, LANGUAGES, ensureTool, type Language } from "../core/languages";
import { renderList } from "../core/list";
import { createWorkspace, installDeps } from "../core/create";
import { writeEditorFiles } from "../core/editor-files";
import { CONFIG_FILE, tilde } from "../core/paths";
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

/** Creates the workspace with progress output. Returns the opened workspace. */
async function build(dir: string, language: Language, editor: Editor, config: Config): Promise<Workspace> {
  const spin = p.spinner();
  spin.start("Creating your workspace");
  await createWorkspace(dir, language, editor);
  const ws = await openWorkspace(dir, config);
  spin.message("Downloading problems from LeetCode");
  const failed = await syncReadmes(ws, (done, total) => spin.message(`Downloading problems from LeetCode (${done}/${total})`));
  spin.message(`Setting up ${LANGUAGES[language].name} (${LANGUAGES[language].install.slice(0, 2).join(" ")})`);
  const deps = await installDeps(dir, language);
  await renderList(ws);
  spin.stop(`Workspace ready at ${c.ink(tilde(dir))}`);
  if (failed) p.log.warn(`${failed} problem descriptions couldn't be downloaded (no internet?). Run ${c.ink("sk sync")} later; the links work meanwhile.`);
  if (!deps.ok) p.log.warn(`Installing dependencies didn't finish:\n${c.muted(deps.output.trim().split("\n").slice(-4).join("\n"))}`);
  return ws;
}

async function askLanguage(): Promise<Language> {
  return check(await p.select<Language>({
    message: "Which language do you want to practise in? (you can switch any time with sk lang)",
    options: LANGUAGE_IDS.map((id) => ({ value: id, label: LANGUAGES[id].name, hint: `runs with ${LANGUAGES[id].tool.name}` })),
  }));
}

async function askEditor(initial?: Editor): Promise<Editor> {
  const installed = (app: string) => existsSync(`/Applications/${app}.app`) || existsSync(join(homedir(), "Applications", `${app}.app`));
  return check(await p.select<Editor>({
    message: "Which editor do you use?",
    initialValue: initial ?? (installed("Zed") ? "zed" : installed("Visual Studio Code") ? "vscode" : installed("Cursor") ? "cursor" : "none"),
    options: [
      { value: "zed", label: "Zed", hint: installed("Zed") ? "installed" : undefined },
      { value: "vscode", label: "VS Code", hint: installed("Visual Studio Code") ? "installed" : undefined },
      { value: "cursor", label: "Cursor", hint: installed("Cursor") ? "installed" : undefined },
      { value: "terminal", label: "A terminal editor", hint: `vim, nvim, helix… (uses $EDITOR${process.env.EDITOR ? `: ${process.env.EDITOR}` : ""})` },
      { value: "none", label: "Something else", hint: "SleekCode prints file paths; open them yourself" },
    ],
  }));
}

async function askDir(): Promise<string> {
  const suggestion = "~/sleekcode-practice";
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
      : ws.config.editor === "vscode" || ws.config.editor === "cursor" ? `Open ${c.ink(tilde(ws.dir))} in ${EDITORS[ws.config.editor]}, then cmd-shift-p → "Tasks: Run Task".`
        : ws.config.editor === "terminal" ? `sk next opens problems in ${c.ink(process.env.EDITOR || "vim")}, right here in the terminal.`
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
  if (!(await ensureTool(language))) {
    p.cancel(`${LANGUAGES[language].name} needs ${LANGUAGES[language].tool.name}. Install it from ${LANGUAGES[language].tool.url} and run sk again.`);
    process.exit(1);
  }
  const editor = await askEditor();
  const dir = await askDir();

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

/** Known workspaces that still exist, the active one first */
function knownWorkspaces(config: Config): string[] {
  return [...new Set([config.workspace, ...(config.workspaces ?? [])])].filter((d) => d && existsSync(join(d, MARKER)));
}

async function describeWorkspace(dir: string): Promise<string> {
  const marker = await Bun.file(join(dir, MARKER)).json().catch(() => null);
  const attemptsFile = join(dir, "attempts.json");
  const attempts: { folder: string; pass: number; total: number }[] = existsSync(attemptsFile) ? await Bun.file(attemptsFile).json().catch(() => []) : [];
  const solved = new Set(attempts.filter((a) => a.total && a.pass === a.total).map((a) => a.folder)).size;
  const langs = (marker?.languages ?? [marker?.language]).filter(Boolean).map((l: Language) => LANGUAGES[l]?.name ?? l).join(" + ");
  return `${langs || "?"} · ${attempts.length} attempt${attempts.length === 1 ? "" : "s"} logged · ${solved} solved`;
}

async function pickWorkspace(config: Config, message: string, query?: string): Promise<string> {
  const known = knownWorkspaces(config);
  if (query) {
    const dir = expand(query);
    const match = existsSync(join(dir, MARKER)) ? dir : known.find((d) => d.endsWith("/" + query) || d.includes(query));
    if (!match) {
      p.cancel(`No workspace matching "${query}".`);
      process.exit(1);
    }
    return match;
  }
  if (!known.length) {
    p.cancel("No workspaces found.");
    process.exit(1);
  }
  const options = await Promise.all(known.map(async (d) => ({ value: d, label: tilde(d) + (d === config.workspace ? c.green("  (active)") : ""), hint: await describeWorkspace(d) })));
  return check(await p.select({ message, options: [...options, { value: "", label: c.muted("Cancel") }] })) || (p.cancel("No changes."), process.exit(0));
}

/** Moves a workspace to the macOS Trash (recoverable), after showing what's in it */
async function removeWorkspace(config: Config, query?: string) {
  const dir = await pickWorkspace(config, "Which workspace do you want to remove?", query);
  p.log.message(`${c.ink(tilde(dir))}\n${c.muted(await describeWorkspace(dir))}`);
  const sure = check(await p.confirm({ message: "Move it to the Trash? Your solutions and progress go with it (you can still restore it from the Trash).", initialValue: false }));
  if (!sure) return p.outro(c.muted("No changes."));

  const trash = process.env.SLEEKCODE_TRASH ?? join(homedir(), ".Trash"); // override only for testing
  let target = join(trash, basename(dir));
  for (let i = 2; existsSync(target); i++) target = join(trash, `${basename(dir)} ${i}`);
  try {
    renameSync(dir, target);
  } catch {
    cpSync(dir, target, { recursive: true }); // a different disk: copy, then remove
    rmSync(dir, { recursive: true, force: true });
  }

  config.workspaces = (config.workspaces ?? []).filter((d) => d !== dir);
  const remaining = knownWorkspaces({ ...config, workspace: config.workspaces[0] ?? "" }).filter((d) => d !== dir);
  if (!config.workspaces.length && config.workspace !== dir) config.workspaces = [config.workspace];
  if (config.workspace === dir) {
    if (remaining.length) {
      config.workspace = remaining[0]!;
      p.log.info(`Active workspace is now ${c.ink(tilde(config.workspace))}`);
    } else {
      rmSync(CONFIG_FILE, { force: true });
      p.outro(`${c.green("Moved to the Trash.")} ${c.muted("That was your last workspace, so the next sk starts setup again.")}`);
      return;
    }
  }
  await saveConfig(config);
  if (process.cwd().startsWith(dir)) p.log.warn("You're still inside that folder in this terminal: cd somewhere else.");
  p.outro(c.green("Moved to the Trash."));
}

async function setEditor(config: Config, ws: Workspace | null, name?: string) {
  const fromArg = name ? (Object.keys(EDITORS) as Editor[]).find((e) => e === name.toLowerCase() || EDITORS[e].toLowerCase().replace(/\s/g, "") === name.toLowerCase().replace(/\s/g, "")) : undefined;
  if (name && !fromArg) {
    p.cancel(`Unknown editor "${name}". Choose from: ${Object.keys(EDITORS).join(", ")}`);
    process.exit(1);
  }
  config.editor = fromArg ?? (await askEditor(config.editor));
  if (ws) await writeEditorFiles(ws.dir, ws.languages, config.editor);
  await saveConfig(config);
  p.outro(`${c.green("Editor:")} ${EDITORS[config.editor]}`);
}

async function setReview(config: Config, days?: string) {
  if (days) {
    if (!/^\d+$/.test(days)) {
      p.cancel("Give a number of days, e.g. sk config review 10");
      process.exit(1);
    }
    config.reviewDays = Number(days);
  } else {
    const v = check(await p.text({ message: "Days until a clean solve comes back for review", defaultValue: String(config.reviewDays), placeholder: String(config.reviewDays), validate: (s) => (s && !/^\d+$/.test(s) ? "A number of days" : undefined) }));
    config.reviewDays = Number(v || config.reviewDays);
    for (const d of ["Easy", "Medium", "Hard"] as const) {
      const t = check(await p.text({ message: `Comfortable time for ${d} problems (minutes)`, defaultValue: String(config.targets[d]), placeholder: String(config.targets[d]), validate: (s) => (s && !/^\d+$/.test(s) ? "A number of minutes" : undefined) }));
      config.targets[d] = Number(t || config.targets[d]);
    }
  }
  await saveConfig(config);
  p.outro(`${c.green("Reviews:")} a clean solve comes back after ${config.reviewDays} days`);
}

async function switchWorkspace(config: Config, query?: string) {
  config.workspace = await pickWorkspace(config, "Which workspace should be active?", query);
  await saveConfig(config);
  p.outro(`${c.green("Active workspace:")} ${tilde(config.workspace)}`);
}

async function newWorkspace(config: Config) {
  const language = await askLanguage();
  if (!(await ensureTool(language))) process.exit(1);
  const dir = await askDir();
  config.workspace = dir;
  const created = await build(dir, language, config.editor, config);
  await saveConfig(config);
  nextSteps(created);
  p.outro(c.green("Done."));
}

/**
 * sk config                 the settings menu
 * sk config editor [name]   sk config review [days]   sk config workspace [path]   sk config new   sk config remove [path]
 */
export async function configure(ws: Workspace | null, args: string[] = []) {
  const config = await loadConfig();
  if (!config) return onboarding();
  const [action, value] = args;

  if (action) {
    p.intro(bold(" SleekCode settings "));
    if (action === "editor") return setEditor(config, ws, value);
    if (action === "review") return setReview(config, value);
    if (action === "workspace" || action === "switch") return switchWorkspace(config, value);
    if (action === "new") return newWorkspace(config);
    if (action === "remove" || action === "delete") return removeWorkspace(config, value);
    p.cancel(`Unknown setting "${action}". Try: editor, review, workspace, new, remove`);
    process.exit(1);
  }

  console.log(header());
  p.intro(bold(" SleekCode settings "));
  p.log.message([
    `${c.muted("Workspace")}  ${c.ink(tilde(ws?.dir ?? config.workspace))}${ws ? c.muted(` · ${LANGUAGES[ws.language].name}`) : ""}`,
    `${c.muted("Editor")}     ${c.ink(EDITORS[config.editor])}`,
    `${c.muted("Reviews")}    ${c.ink(`${config.reviewDays} days`)} ${c.muted(`· targets ${config.targets.Easy}/${config.targets.Medium}/${config.targets.Hard} min`)}`,
  ].join("\n"));
  const others = knownWorkspaces(config).length;
  const choice = check(await p.select({
    message: "What do you want to change?",
    options: [
      { value: "editor", label: "Editor", hint: `${EDITORS[config.editor]} · sk config editor` },
      { value: "review", label: "Review timing", hint: `${config.reviewDays} days · sk config review` },
      ...(others > 1 ? [{ value: "workspace", label: "Switch workspace", hint: "sk config workspace" }] : []),
      { value: "new", label: "Set up another workspace", hint: "sk config new · rarely needed: sk lang switches languages" },
      { value: "remove", label: "Remove a workspace", hint: "moves it to the Trash · sk config remove" },
      { value: "done", label: "Nothing, I'm done" },
    ],
  }));
  if (choice === "editor") return setEditor(config, ws);
  if (choice === "review") return setReview(config);
  if (choice === "workspace") return switchWorkspace(config);
  if (choice === "new") return newWorkspace(config);
  if (choice === "remove") return removeWorkspace(config);
  p.outro(c.muted("No changes."));
}
