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
import { problemDir, resolveProblem, solutionFile, type Problem, type Workspace } from "../core/workspace";
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
  type Choice = { prob: Problem; file: string; lang: Language; logged?: Attempt };
  const current = (prob: Problem) =>
    ws.languages.filter((l) => existsSync(solutionFile(ws, prob, l))).map((l): Choice => ({ prob, file: solutionFile(ws, prob, l), lang: l }));
  let choice: Choice | undefined;

  if (values.attempt) {
    // The picker: your current solution(s), then logged attempts, newest first.
    // With a number, just that problem's; without one, every problem's.
    const prob = positionals[0] ? await needProblem(ws, positionals[0]) : await resolveProblem(ws);
    const logged: Choice[] = (await loadAttempts(ws))
      .filter((a) => (!positionals[0] || a.folder === prob!.folder) && a.snapshot)
      .reverse()
      .flatMap((a) => {
        const owner = ws.problems.find((x) => x.folder === a.folder);
        return owner && existsSync(join(problemDir(ws, owner), a.snapshot!)) ? [{ prob: owner, file: join(problemDir(ws, owner), a.snapshot!), lang: a.language, logged: a }] : [];
      });
    const choices = [...(prob ? current(prob) : []), ...logged];
    if (!choices.length) return console.log(`\n  ${c.muted("Nothing to submit yet: no solution and nothing logged.")}\n`);
    p.intro(positionals[0] ? `Submit ${label(prob!)}` : "Submit");
    const picked = ask(await p.select({
      message: "Which solution?",
      maxItems: 10,
      options: choices.map((x, i) => ({
        value: i,
        label: x.logged ? summary(x.logged, !positionals[0]) : `${label(x.prob)} ${c.muted("·")} current solution (${LANGUAGES[x.lang].name})`,
      })),
    }));
    choice = choices[picked];
  } else {
    const prob = await needProblem(ws, positionals[0]);
    choice = current(prob).find((x) => x.lang === ws.language);
    if (!choice) return console.log(`\n  ${c.amber("No solution yet.")}\n`);
  }
  const { prob, file, logged } = choice!;
  const lang = LANGUAGES[choice!.lang];

  // Only passing code goes to LeetCode. A logged attempt has its result; the current solution is tested now.
  if (logged ? logged.total === 0 || logged.pass < logged.total : (await runOnce(ws, prob, "test", true, choice!.lang)).code !== 0) {
    console.log(`\n  ${c.red("Not copied:")} ${logged ? `that attempt only passed ${logged.pass}/${logged.total} tests when you logged it.` : "it doesn't pass the tests yet."}`);
    return console.log(`  ${c.muted("Get it green with")} ${c.ink(`sk test ${prob.id}`)}${c.muted(", then submit.")}\n`);
  }

  const code = forLeetCode(await Bun.file(file).text(), choice!.lang);
  const copy = Bun.spawn(["pbcopy"], { stdin: "pipe" });
  copy.stdin.write(code);
  await copy.stdin.end();
  await copy.exited;

  const which = logged ? `your ${lang.name} attempt from ${logged.at.slice(0, 10)}` : `your ${lang.name} solution`;
  console.log(`\n  ${c.green("✓ Copied")} ${which} for ${c.ink(label(prob))} ${c.muted(`(${code.split("\n").length - 1} lines)`)}`);
  if (prob.paid) {
    console.log(`  ${c.amber("This one is LeetCode Premium,")} ${c.muted("so submitting needs a subscription. The free version: https://neetcode.io/practice")}`);
  }
  console.log(`  ${c.muted("On LeetCode: pick")} ${c.ink(lang.name)} ${c.muted("in the language menu, select all in the editor, paste (cmd-V), then Submit.")}\n`);
  Bun.spawn(["open", `https://leetcode.com/problems/${prob.slug}/`], { stdio: ["ignore", "ignore", "ignore"] });
}
