// `sk play`: runs every example with your console.logs shown, then your answer next to the expected one.
//   bun lib/play.ts <problem folder>
import { join, resolve } from "node:path";
import { preview, run, same, short, type CaseFile } from "./cases";

const tty = process.stdout.isTTY || process.env.FORCE_COLOR === "1";
const paint = (code: string) => (s: string) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);
const dim = paint("2"), green = paint("32"), red = paint("31"), bold = paint("1");
const width = Math.min(process.stdout.columns || 80, 100);

const dir = resolve(process.argv[2] ?? ".");
const file: CaseFile = await Bun.file(join(dir, "cases.json")).json();
const examples = file.cases.filter((c) => c.name.startsWith("example"));
const mod = await import(join(dir, "solution.ts"));

let ok = 0;
for (const [i, ex] of examples.entries()) {
  const title = `── Example ${i + 1} `;
  console.log(`\n${bold(title)}${dim("─".repeat(Math.max(4, width - title.length)))}`);
  console.log(dim(preview(file, ex.input, width - 4)));
  try {
    const answer = run(file, mod, ex.input);
    const good = same(file, answer, ex.output, ex.input);
    if (good) ok++;
    console.log(`${good ? green("✓") : red("✗")} ${bold(short(answer, width - 6))}${good ? "" : dim(`   expected ${short(ex.output, 60)}`)}`);
  } catch (e) {
    const err = e as Error;
    const line = err.stack?.split("\n").find((l) => l.includes("solution.ts"))?.match(/solution\.ts:(\d+)/)?.[1];
    console.log(`${red("✗")} ${red(err.message)}${line ? dim(`  (solution.ts line ${line})`) : ""}`);
  }
}
const all = ok === examples.length;
console.log(`\n${all ? green(`✓ ${ok}/${examples.length} examples match`) : `${ok}/${examples.length} examples match`}${dim(all ? " · now try sk test (hidden cases + speed)" : "")}\n`);
