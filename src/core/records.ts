// attempts.json is the one source of truth. LOG.md, each README's Attempts table and LIST.md are
// regenerated from it, so editing or deleting an attempt shows up everywhere.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { HELP_LABEL, loadAttempts, passed, type Attempt } from "./attempts";
import { formatDuration } from "./duration";
import { LANGUAGES } from "./languages";
import { renderList } from "./list";
import { problemDir, type Workspace } from "./workspace";

const esc = (s: string) => s.replaceAll("|", "\\|").replaceAll("\n", " ");

function cells(a: Attempt) {
  return {
    date: a.at.slice(0, 10),
    lang: LANGUAGES[a.language]?.tag ?? a.language,
    tests: `${a.pass}/${a.total} ${passed(a) ? "✅" : "❌"}`,
    time: a.seconds == null ? "–" : formatDuration(a.seconds),
    how: `${a.help === "none" ? "✅" : `❌ ${HELP_LABEL[a.help]}`}${a.hints ? ` 💡${a.hints}` : ""}`,
    complexity: esc(a.complexity || "–"),
    notes: esc(a.notes),
  };
}

const LOG_HEAD = "| Date | Problem | Lang | Difficulty | Tests | Time | Solved | Complexity | Notes |\n| ---- | ------- | ---- | ---------- | ----- | ---- | ------ | ---------- | ----- |";
const README_HEAD = "| Date | Lang | Tests | Time | Solved | Complexity | Notes |\n| ---- | ---- | ----- | ---- | ------ | ---------- | ----- |";

export async function renderLog(ws: Workspace, attempts?: Attempt[]) {
  const rows = (attempts ?? (await loadAttempts(ws))).map((a) => {
    const x = cells(a);
    return `| ${x.date} | [${a.id}. ${a.title}](problems/${a.folder}/README.md) | ${x.lang} | ${a.difficulty} | ${x.tests} | ${x.time} | ${x.how} | ${x.complexity} | ${x.notes} |`;
  });
  await Bun.write(join(ws.dir, "LOG.md"), `# Results Log\n\nEvery attempt, oldest first. Generated from attempts.json, so edit with \`sk attempts\`, not here.\n\n${LOG_HEAD}\n${rows.join("\n")}${rows.length ? "\n" : ""}`);
}

/** Rewrites everything from "## Attempts" down. Your notes above it are never touched. */
export async function renderReadmeAttempts(ws: Workspace, folder: string, attempts?: Attempt[]) {
  const file = join(problemDir(ws, { folder } as never), "README.md");
  if (!existsSync(file)) return;
  const rows = (attempts ?? (await loadAttempts(ws))).filter((a) => a.folder === folder).map((a) => {
    const x = cells(a);
    return `| ${x.date} | ${x.lang} | ${x.tests} | ${x.time} | ${x.how} | ${x.complexity} | ${x.notes} |`;
  });
  const readme = await Bun.file(file).text();
  const at = readme.indexOf("\n## Attempts");
  const top = (at >= 0 ? readme.slice(0, at) : readme).trimEnd();
  await Bun.write(file, `${top}\n\n## Attempts\n\n${README_HEAD}\n${rows.join("\n")}${rows.length ? "\n" : ""}`);
}

/** After any change to attempts: LOG.md, the affected READMEs, LIST.md */
export async function renderRecords(ws: Workspace, folders: string[]) {
  const attempts = await loadAttempts(ws);
  await renderLog(ws, attempts);
  for (const f of new Set(folders)) await renderReadmeAttempts(ws, f, attempts);
  await renderList(ws);
}
