import type { Problem } from "./workspace";

export const PENDING = "<!-- sleekcode: problem text not downloaded yet, run `sk sync` -->";

/** A problem's README: header, problem text, your notes, and the attempts table (which `sk log` appends to) */
export function problemReadme(p: Problem, body: string | null): string {
  const header = [
    `# ${p.id}. ${p.title}`,
    "",
    `**Difficulty:** ${p.difficulty}  `,
    `**Pattern:** ${p.pattern}${p.blind75 ? "  \n**⭐ Blind 75**" : ""}  `,
    `**Link:** https://leetcode.com/problems/${p.slug}/${p.paid ? " (Premium)" : ""}` +
      (p.video ? `  \n**Video walkthrough (when stuck):** https://www.youtube.com/watch?v=${p.video}` : ""),
  ].join("\n");
  const premium = p.paid ? `> 🔒 LeetCode Premium. A free version is on https://neetcode.io/practice (search "${p.title}"). The statement below is a write-up of the original.\n\n` : "";
  const text = body ?? `${PENDING}\n\nOpen the link above to read the problem.`;
  return `${header}\n\n${premium}## Problem\n\n${text}\n\n## My Notes\n\n<!-- approach, gotchas, what you'd do differently -->\n\n## Attempts\n\n| Date | Tests | Minutes | Solo? | Complexity | Notes |\n| ---- | ----- | ------- | ----- | ---------- | ----- |\n`;
}
