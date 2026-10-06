// sk submit: copies your solution, cleaned up for LeetCode's editor, and opens the problem page.
import { existsSync } from "node:fs";
import { parse } from "../core/args";
import { LANGUAGES, type Language } from "../core/languages";
import { label, needProblem } from "../core/problem";
import { runOnce } from "../core/run";
import { solutionFile, type Workspace } from "../core/workspace";
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
  const { positionals } = parse("submit", args);
  const p = await needProblem(ws, positionals[0]);
  const lang = LANGUAGES[ws.language];
  const file = solutionFile(ws, p);
  if (!existsSync(file)) return console.log(`\n  ${c.amber("No solution yet.")}\n`);

  const { code: testsExit } = await runOnce(ws, p, "test", true);
  const code = forLeetCode(await Bun.file(file).text(), ws.language);
  const copy = Bun.spawn(["pbcopy"], { stdin: "pipe" });
  copy.stdin.write(code);
  await copy.stdin.end();
  await copy.exited;

  console.log(`\n  ${c.green("✓ Copied")} your ${lang.name} solution for ${c.ink(label(p))} ${c.muted(`(${code.split("\n").length - 1} lines)`)}`);
  if (testsExit !== 0) console.log(`  ${c.amber("Heads up: it doesn't pass sk test yet.")}`);
  if (p.paid) {
    console.log(`  ${c.amber("This one is LeetCode Premium,")} ${c.muted("so submitting needs a subscription. The free version: https://neetcode.io/practice")}`);
  }
  console.log(`  ${c.muted("On LeetCode: pick")} ${c.ink(lang.name)} ${c.muted("in the language menu, select all in the editor, paste (cmd-V), then Submit.")}\n`);
  Bun.spawn(["open", `https://leetcode.com/problems/${p.slug}/`], { stdio: ["ignore", "ignore", "ignore"] });
}
