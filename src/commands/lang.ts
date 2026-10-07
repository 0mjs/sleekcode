// sk lang [language]: show or switch the language you're practising in (like LeetCode's dropdown)
import * as p from "@clack/prompts";
import { parse } from "../core/args";
import { installDeps, setupLanguage } from "../core/create";
import { writeEditorFiles } from "../core/editor-files";
import { LANGUAGE_IDS, LANGUAGES, ensureTool, parseLanguage } from "../core/languages";
import { renderList } from "../core/list";
import { ensureProblemFiles } from "../core/materialize";
import { label } from "../core/problem";
import { resolveProblem, writeMarker, type Workspace } from "../core/workspace";
import { bold, c, rgb } from "../ui/colors";

export async function lang(ws: Workspace, args: string[]) {
  const { values, positionals } = parse("lang", args);

  if (!positionals[0]) {
    console.log(`\n  ${c.muted("Practising in")} ${bold(rgb(LANGUAGES[ws.language].color)(LANGUAGES[ws.language].name))}\n`);
    for (const id of LANGUAGE_IDS) {
      const l = LANGUAGES[id];
      const mark = id === ws.language ? c.accent("●") : ws.languages.includes(id) ? c.body("○") : c.dim("○");
      const note = id === ws.language ? c.muted("current") : ws.languages.includes(id) ? c.muted("set up") : c.dim("not set up yet");
      console.log(`  ${mark} ${rgb(l.color)(l.name.padEnd(12))} ${c.ink(`sk lang ${l.aliases[0]}`.padEnd(22))} ${note}`);
    }
    return console.log(`\n  ${c.muted("Your notes, progress and reviews are shared across languages.")}\n`);
  }

  const target = parseLanguage(positionals[0]);
  if (!target) {
    console.log(`\n  ${c.red(`SleekCode doesn't support "${positionals[0]}" yet.`)} ${c.muted("Available:")} ${LANGUAGE_IDS.map((id) => LANGUAGES[id].name).join(", ")}\n`);
    process.exit(1);
  }
  const l = LANGUAGES[target];

  if (target !== ws.language || values.all) {
    const fresh = !ws.languages.includes(target);
    if (fresh && !(await ensureTool(target))) {
      console.log(`\n  ${c.red(`${l.name} needs ${l.tool.name}.`)} ${c.muted(`Install it from ${l.tool.url} and try again.`)}\n`);
      process.exit(1);
    }
    const spin = p.spinner();
    if (fresh) {
      spin.start(`Setting up ${l.name}`);
      await setupLanguage(ws.dir, target);
      const deps = await installDeps(ws.dir, target);
      if (!deps.ok) {
        spin.stop(c.red(`Couldn't install ${l.name} dependencies`));
        console.log(c.muted(deps.output.trim().split("\n").slice(-5).join("\n")));
        process.exit(1);
      }
    } else spin.start(`Switching to ${l.name}`);

    ws.languages = [...new Set([...ws.languages, target])];
    ws.language = target;
    await writeMarker(ws.dir, target, ws.languages);
    await writeEditorFiles(ws.dir, ws.languages, ws.config.editor);

    if (values.all) {
      let n = 0;
      for (const prob of ws.problems) {
        spin.message(`Creating ${l.name} files (${++n}/${ws.problems.length})`);
        await ensureProblemFiles(ws, prob, target).catch(() => {});
      }
    }
    const current = await resolveProblem(ws);
    if (current) await ensureProblemFiles(ws, current, target);
    await renderList(ws);
    spin.stop(`${fresh ? "Set up and switched" : "Switched"} to ${bold(rgb(l.color)(l.name))}`);
  } else {
    console.log(`\n  ${c.muted("Already practising in")} ${rgb(l.color)(l.name)}.`);
  }

  const current = await resolveProblem(ws);
  console.log(`  ${c.muted(values.all ? "Every problem has" : "Problems get")} ${l.solution} ${c.muted(values.all ? "now." : "the first time you open them in " + l.name + ".")}`);
  if (current) console.log(`  ${c.muted("Current problem:")} ${label(current)} ${c.muted("→")} ${c.ink("sk test -w")}`);
  console.log();
}
