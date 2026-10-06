// Creates a problem's files for a language the first time you open it in that language.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { specFrom } from "./generate";
import { LANGUAGES, type Language } from "./languages";
import { fetchQuestion } from "./leetcode";
import { problemReadme } from "./readme";
import { bankTestFile, problemDir, solutionFile, stubFile, testFile, type Problem, type Workspace } from "./workspace";

/** Starting code + tests for this problem in `lang` (copied from the bank, or generated for `sk add` problems) */
export async function ensureProblemFiles(ws: Workspace, p: Problem, lang: Language = ws.language): Promise<void> {
  const dir = problemDir(ws, p);
  mkdirSync(dir, { recursive: true });
  if (!existsSync(join(dir, "README.md"))) await Bun.write(join(dir, "README.md"), problemReadme(p, null));
  if (existsSync(solutionFile(ws, p, lang)) && existsSync(testFile(ws, p, lang))) return;

  if (!p.extra) {
    if (!existsSync(solutionFile(ws, p, lang))) copyFileSync(stubFile(ws, p, lang), solutionFile(ws, p, lang));
    if (!existsSync(testFile(ws, p, lang))) copyFileSync(bankTestFile(p, lang), testFile(ws, p, lang));
    return;
  }

  // Problems added with `sk add`: generate this language's files from LeetCode's data
  const spec = LANGUAGES[lang];
  if (!existsSync(stubFile(ws, p, lang))) {
    const q = await fetchQuestion(p.slug);
    const snippet = q?.codeSnippets?.find((s) => s.langSlug === spec.leetcode)?.code;
    if (!q || !snippet) throw new Error(`LeetCode has no ${spec.name} version of ${p.title}.`);
    const files = spec.generate(specFrom(q, { ...p }), snippet);
    mkdirSync(join(ws.dir, ".sleekcode", "stubs"), { recursive: true });
    await Bun.write(stubFile(ws, p, lang), files.stub);
    await Bun.write(join(ws.dir, ".sleekcode", "stubs", `${p.folder}.${spec.test}`), files.test);
  }
  if (!existsSync(solutionFile(ws, p, lang))) copyFileSync(stubFile(ws, p, lang), solutionFile(ws, p, lang));
  if (!existsSync(testFile(ws, p, lang))) copyFileSync(join(ws.dir, ".sleekcode", "stubs", `${p.folder}.${spec.test}`), testFile(ws, p, lang));
}
