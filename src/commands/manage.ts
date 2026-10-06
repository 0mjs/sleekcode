// add, sync, update, list
import * as p from "@clack/prompts";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "../core/args";
import { LANGUAGES } from "../core/config";
import { createWorkspace, installDeps } from "../core/create";
import { python, specFrom, typescript } from "../core/generate";
import { fetchQuestion, toMarkdown } from "../core/leetcode";
import { renderList } from "../core/list";
import { TOOL } from "../core/paths";
import { problemReadme } from "../core/readme";
import { syncReadmes } from "../core/sync";
import { openWorkspace, problemDir, type Problem, type Workspace } from "../core/workspace";
import { c } from "../ui/colors";
import { describe } from "./practice";

export async function list(ws: Workspace) {
  await renderList(ws);
  console.log(`\n  ${c.green("LIST.md updated")} ${c.muted(join(ws.dir, "LIST.md"))}\n`);
}

export async function sync(ws: Workspace) {
  const spin = p.spinner();
  spin.start("Checking problem descriptions");
  const failed = await syncReadmes(ws, (done, total) => spin.message(`Downloading from LeetCode (${done}/${total})`));
  spin.stop(failed ? c.amber(`${failed} couldn't be downloaded. Check your internet and try again.`) : c.green("All problem descriptions are downloaded."));
}

export async function update(ws: Workspace | null) {
  const spin = p.spinner();
  spin.start("Updating SleekCode");
  const pull = Bun.spawnSync(["git", "pull", "--ff-only"], { cwd: TOOL, stdout: "pipe", stderr: "pipe" });
  if (pull.exitCode !== 0) {
    spin.stop(c.red("Couldn't update"));
    return console.log(c.muted(pull.stderr.toString().trim()));
  }
  Bun.spawnSync(["bun", "install"], { cwd: TOOL, stdout: "ignore", stderr: "ignore" });
  if (ws) {
    spin.message("Refreshing your workspace (tests, helpers, editor tasks)");
    await createWorkspace(ws.dir, ws.language, ws.config.editor); // never touches your solutions, notes or attempts
    const fresh = await openWorkspace(ws.dir, ws.config);
    await syncReadmes(fresh, () => {});
    await installDeps(ws.dir, ws.language);
    await renderList(fresh);
  }
  spin.stop(c.green(pull.stdout.toString().includes("Already up to date") ? "Already up to date." : "Updated."));
}

export async function add(ws: Workspace, args: string[]) {
  const { values, positionals } = parse("add", args);
  const slug = positionals[0]?.match(/problems\/([^/?#]+)/)?.[1] ?? positionals[0];
  if (!slug) return console.log(`\n  ${c.amber("Which problem?")} e.g. ${c.ink("sk add reverse-words-in-a-string")} or paste its LeetCode URL\n`);
  const existing = ws.problems.find((x) => x.slug === slug);
  if (existing) return console.log(`\n  ${c.muted("You already have it:")} ${describe(existing)}\n`);

  const spin = p.spinner();
  spin.start(`Fetching ${slug} from LeetCode`);
  const q = await fetchQuestion(slug);
  if (!q) return spin.stop(c.red(`LeetCode has no problem called "${slug}".`));
  if (!q.content) return spin.stop(c.red(`${q.title} is LeetCode Premium, so its text isn't available.`));

  const lang = LANGUAGES[ws.language];
  const prob: Problem = {
    id: q.questionFrontendId, title: q.title, slug, folder: `${q.questionFrontendId}-${values.name ?? slug}`,
    difficulty: q.difficulty, pattern: String(values.pattern ?? "Extras"), blind75: false, paid: false, extra: true,
  };
  const warnings: string[] = [];
  const snippet = q.codeSnippets?.find((s) => s.langSlug === (ws.language === "ts" ? "typescript" : "python3"))?.code;
  if (!snippet) return spin.stop(c.red(`LeetCode has no ${lang.name} version of this problem.`));

  const spec = specFrom(q, { ...prob, blind75: false });
  if (spec.inputs.length !== spec.outputs.length) warnings.push("Couldn't read every example's expected output. Check the test file.");
  if (JSON.parse(q.metaData).manual) warnings.push("LeetCode checks this one with custom logic. The generated tests may need adjusting.");
  let files: { stub: string; test: string };
  try {
    files = ws.language === "ts" ? typescript(spec, snippet) : python(spec, snippet);
  } catch (e) {
    return spin.stop(c.red(`Couldn't generate tests: ${(e as Error).message}`));
  }

  const dir = problemDir(ws, prob);
  mkdirSync(dir, { recursive: true });
  mkdirSync(join(ws.dir, ".sleekcode", "stubs"), { recursive: true });
  mkdirSync(join(ws.dir, ".sleekcode", "hints"), { recursive: true });
  await Bun.write(join(dir, `solution.${lang.ext}`), files.stub);
  await Bun.write(join(dir, lang.test), files.test);
  await Bun.write(join(ws.dir, ".sleekcode", "stubs", `${prob.folder}.${lang.ext}`), files.stub);
  await Bun.write(join(dir, "README.md"), problemReadme(prob, toMarkdown(q.content)));
  if (q.hints?.length) {
    const hints = q.hints.map((h) => h.replace(/<code>([\s\S]*?)<\/code>/g, "`$1`").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));
    await Bun.write(join(ws.dir, ".sleekcode", "hints", `${prob.folder}.json`), JSON.stringify({ source: `https://leetcode.com/problems/${slug}/`, target: null, hints }, null, 2) + "\n");
  }
  const extrasFile = join(ws.dir, "extras.json");
  const extras: Problem[] = existsSync(extrasFile) ? await Bun.file(extrasFile).json() : [];
  await Bun.write(extrasFile, JSON.stringify([...extras, prob], null, 2) + "\n");
  await renderList(await openWorkspace(ws.dir, ws.config));
  spin.stop(`Added ${describe(prob)}`);
  for (const w of warnings) p.log.warn(w);
  console.log(`  ${c.muted("Open it with")} ${c.ink(`sk open ${prob.id}`)}\n`);
}
