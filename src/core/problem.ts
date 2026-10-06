import { c } from "../ui/colors";
import { ensureProblemFiles } from "./materialize";
import { resolveProblem, type Problem, type Workspace } from "./workspace";

/** The problem a command should act on, or exits with a helpful message */
export async function needProblem(ws: Workspace, query?: string): Promise<Problem> {
  const p = await resolveProblem(ws, query);
  if (p) {
    await ensureProblemFiles(ws, p);
    return p;
  }
  console.error(query ? `\n  ${c.red(`No problem matching "${query}".`)}\n` : `\n  ${c.amber("No current problem yet.")} Run ${c.ink("sk next")}, or pass a number: ${c.ink("sk test 217")}\n`);
  process.exit(1);
}

export const label = (p: Problem) => `${p.id}. ${p.title}`;
