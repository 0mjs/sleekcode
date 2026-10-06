import { join } from "node:path";
import { solvedFolders } from "./attempts";
import type { Problem, Workspace } from "./workspace";

/** Rebuilds LIST.md (the checklist, in study order) from the problem list + attempts */
export async function renderList(ws: Workspace) {
  const solved = await solvedFolders(ws);
  const count = (ps: Problem[]) => `${ps.filter((p) => solved.has(p.folder)).length}/${ps.length}`;
  const by = (d: string) => ws.problems.filter((p) => p.difficulty === d);

  const groups = new Map<string, Problem[]>();
  for (const p of ws.problems) groups.set(p.pattern, [...(groups.get(p.pattern) ?? []), p]);

  const lines = [
    "# Problem List",
    "",
    `**Progress: ${count(ws.problems)}** · ⭐ Blind 75: ${count(ws.problems.filter((p) => p.blind75))} · Easy ${count(by("Easy"))} · Medium ${count(by("Medium"))} · Hard ${count(by("Hard"))}`,
    "",
    "Work top to bottom (⭐ = Blind 75, do those first if you're short on time). `sk next` opens the next unsolved one.",
    "This file is rebuilt by `sk log`, so don't edit it by hand.",
  ];
  for (const [pattern, ps] of groups) {
    lines.push("", `## ${pattern} (${count(ps)})`, "");
    for (const p of ps) {
      lines.push(`- [${solved.has(p.folder) ? "x" : " "}] ${p.blind75 ? "⭐ " : ""}[${p.id}. ${p.title}](problems/${p.folder}/README.md) — ${p.difficulty}${p.paid ? " 🔒" : ""}`);
    }
  }
  await Bun.write(join(ws.dir, "LIST.md"), lines.join("\n") + "\n");
}
