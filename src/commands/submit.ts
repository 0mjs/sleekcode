// sk submit: copies your solution, cleaned up for LeetCode's editor, and opens the problem page.
import { existsSync } from "node:fs";
import { parse } from "../core/args";
import { LANGUAGES, type Language } from "../core/languages";
import { loadAttempts, type Attempt } from "../core/attempts";
import * as p from "@clack/prompts";
import { join } from "node:path";
import { summary } from "./attempts";
import { ask } from "./log";
import { label, needProblem } from "../core/problem";
import { runOnce } from "../core/run";
import { problemDir, solutionFile, type Workspace } from "../core/workspace";
import { c } from "../ui/colors";

/** Your file minus the SleekCode bits LeetCode doesn't want: helper imports, `export`, the header, the scratchpad */
function forLeetCode(source: string, lang: Language): string {
  let code = source;
  if (lang === "ts") {
    code = code
      .replace(/^import .* from "\.\.\/\.\.\/lib(\/\w+)?";\n/gm, "")
      .trimStart()
      .replace(/^\/\*\*[\s\S]*?\*\/\n/, "") // the header comment at the top
      .replace(/\n\/\/ Scratchpad[\s\S]*$/, "\n")
      .replace(/^export (function|class|const|let|type|interface) /gm, "$1 ");
  } else {
    code = code
      .replace(/^from sleek(\.\w+)? import .*\n/gm, "")
      .replace(/^"""[\s\S]*?"""\n/, "") // the header docstring at the top
      .replace(/\n# Scratchpad[\s\S]*$/, "\n");
  }
  return code.replace(/^\s*\n/, "").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

export async function submit(ws: Workspace, args: string[]) {
  const { values, positionals } = parse("submit", args);
  const prob = await needProblem(ws, positionals[0]);
  const dir = problemDir(ws, prob);

  // What to submit: your current solution, or (with -a) any attempt you've logged
  type Choice = { file: string; lang: Language; logged?: Attempt };
  const current = (lang: Language): Choice | null => (existsSync(solutionFile(ws, prob, lang)) ? { file: solutionFile(ws, prob, lang), lang } : null);
  let choice: Choice | null = current(ws.language);

  if (values.attempt) {
    const logged = (await loadAttempts(ws)).filter((a) => a.folder === prob.folder && a.snapshot && existsSync(join(dir, a.snapshot))).reverse();
    const currents = ws.languages.map(current).filter((x): x is Choice => !!x);
    if (!logged.length && currents.length <= 1) {
      console.log(`\n  ${c.muted("Nothing logged for this problem yet, so there's only your current solution.")}`);
    } else {
      p.intro(`Submit ${label(prob)}`);
      const options = [
        ...currents.map((x) => ({ value: x.file, label: `Current solution (${LANGUAGES[x.lang].name})`, hint: x.file.split("/").pop() })),
        ...logged.map((a) => ({ value: join(dir, a.snapshot!), label: summary(a) })),
      ];
      const picked = ask(await p.select({ message: "Which solution?", options, maxItems: 10 }));
      const a = logged.find((x) => join(dir, x.snapshot!) === picked);
      choice = { file: String(picked), lang: a ? a.language : currents.find((x) => x.file === picked)!.lang, logged: a };
    }
  }
  if (!choice) return console.log(`\n  ${c.amber("No solution yet.")}\n`);

  const lang = LANGUAGES[choice.lang];
  // Tests: a logged attempt already has its result; the current solution is checked now
  const passing = choice.logged
    ? choice.logged.total > 0 && choice.logged.pass === choice.logged.total
    : choice.lang === ws.language ? (await runOnce(ws, prob, "test", true)).code === 0 : null;

  const code = forLeetCode(await Bun.file(choice.file).text(), choice.lang);
  const copy = Bun.spawn(["pbcopy"], { stdin: "pipe" });
  copy.stdin.write(code);
  await copy.stdin.end();
  await copy.exited;

  const which = choice.logged ? `your ${lang.name} attempt from ${choice.logged.at.slice(0, 10)}` : `your ${lang.name} solution`;
  console.log(`\n  ${c.green("✓ Copied")} ${which} for ${c.ink(label(prob))} ${c.muted(`(${code.split("\n").length - 1} lines)`)}`);
  if (passing === false) console.log(`  ${c.amber(choice.logged ? "Heads up: it didn't pass the tests when you logged it." : "Heads up: it doesn't pass sk test yet.")}`);
  if (prob.paid) {
    console.log(`  ${c.amber("This one is LeetCode Premium,")} ${c.muted("so submitting needs a subscription. The free version: https://neetcode.io/practice")}`);
  }
  console.log(`  ${c.muted("On LeetCode: pick")} ${c.ink(lang.name)} ${c.muted("in the language menu, select all in the editor, paste (cmd-V), then Submit.")}\n`);
  Bun.spawn(["open", `https://leetcode.com/problems/${prob.slug}/`], { stdio: ["ignore", "ignore", "ignore"] });
}
