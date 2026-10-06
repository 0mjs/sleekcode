// Maintainer script: downloads everything build-bank.ts needs into .cache/ (skips what's already there).
//   bun build/fetch-cache.ts
// Sources: NeetCode's public repo (problem list, hints, reference solutions; MIT) and LeetCode's public GraphQL API.
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fetchQuestion } from "../src/core/leetcode";

const CACHE = join(import.meta.dir, "..", ".cache");
const NC = "https://raw.githubusercontent.com/neetcode-gh/leetcode/main";
for (const d of ["leetcode", "neetcode-hints", "neetcode-solutions", "neetcode-py"]) mkdirSync(join(CACHE, d), { recursive: true });

async function save(url: string, file: string) {
  if (existsSync(file)) return true;
  const res = await fetch(url);
  if (!res.ok) return false;
  await Bun.write(file, await res.text());
  return true;
}

await save(`${NC}/.problemSiteData.json`, join(CACHE, "neetcode-list.json"));
const list: any[] = (await Bun.file(join(CACHE, "neetcode-list.json")).json()).filter((x: any) => x.neetcode150);
const hintNames: Record<string, string> = await Bun.file(join(import.meta.dir, "neetcode-hint-names.json")).json();

let n = 0;
for (const x of list) {
  const slug = x.link.replace(/\/$/, "");
  const file = join(CACHE, "leetcode", `${slug}.json`);
  if (!existsSync(file)) {
    await Bun.write(file, JSON.stringify(await fetchQuestion(slug)));
    await Bun.sleep(200);
  }
  if (!(await save(`${NC}/typescript/${x.code}.ts`, join(CACHE, "neetcode-solutions", `${x.code}.ts`))))
    await save(`${NC}/javascript/${x.code}.js`, join(CACHE, "neetcode-solutions", `${x.code}.js`));
  await save(`${NC}/python/${x.code}.py`, join(CACHE, "neetcode-py", `${x.code}.py`));
  process.stdout.write(`\r${++n}/${list.length}`);
}
for (const name of Object.values(hintNames)) await save(`${NC}/hints/${name}.md`, join(CACHE, "neetcode-hints", `${name}.md`));
console.log("\ncache ready");
