// Downloads problem text from LeetCode into each problem's README (the public repo doesn't ship it).
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fetchQuestion, toMarkdown } from "./leetcode";
import { BANK } from "./paths";
import { PENDING, problemReadme } from "./readme";
import { problemDir, type Problem, type Workspace } from "./workspace";

const readmeOf = (ws: Workspace, p: Problem) => join(problemDir(ws, p), "README.md");

/** Problem text: our write-up for Premium problems, otherwise LeetCode's */
async function problemText(p: Problem): Promise<string | null> {
  const local = join(BANK, "problems", p.folder, "problem.md");
  if (existsSync(local)) return (await Bun.file(local).text()).trim();
  const q = await fetchQuestion(p.slug, "content");
  return q?.content ? toMarkdown(q.content) : null;
}

/** Swaps the "## Problem" section, keeping your notes and attempts */
function withProblem(readme: string, text: string) {
  const start = readme.indexOf("## Problem\n");
  const end = readme.indexOf("\n## My Notes");
  if (start < 0 || end < 0) return readme;
  return readme.slice(0, start) + `## Problem\n\n${text}\n` + readme.slice(end);
}

export const needsSync = async (ws: Workspace, p: Problem) =>
  !existsSync(readmeOf(ws, p)) || (await Bun.file(readmeOf(ws, p)).text()).includes(PENDING);

/** Fills in every README that's still waiting for its text. Returns how many failed. */
export async function syncReadmes(ws: Workspace, onProgress: (done: number, total: number) => void): Promise<number> {
  const todo: Problem[] = [];
  for (const p of ws.problems) if (await needsSync(ws, p)) todo.push(p);
  let done = 0, failed = 0;
  const queue = [...todo];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) {
        const p = queue.shift()!;
        try {
          const text = await problemText(p);
          const file = readmeOf(ws, p);
          const current = existsSync(file) ? await Bun.file(file).text() : problemReadme(p, null);
          if (text) await Bun.write(file, withProblem(current, text));
          else failed++;
        } catch {
          failed++;
        }
        onProgress(++done, todo.length);
      }
    }),
  );
  return failed;
}
