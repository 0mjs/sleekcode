// LeetCode's public GraphQL API (no login needed) + HTML → Markdown for READMEs
import TurndownService from "turndown";
import type { Problem } from "./workspace";

export type Question = {
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  difficulty: Problem["difficulty"];
  isPaidOnly: boolean;
  content: string | null;
  metaData: string;
  exampleTestcaseList: string[];
  codeSnippets: { langSlug: string; code: string }[] | null;
  hints: string[];
};

const FIELDS = "questionFrontendId title titleSlug difficulty isPaidOnly content metaData exampleTestcaseList codeSnippets{langSlug code} hints";

export async function fetchQuestion(slug: string, fields = FIELDS): Promise<Question | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
        body: JSON.stringify({ query: `query q($s:String!){question(titleSlug:$s){${fields}}}`, variables: { s: slug } }),
        signal: AbortSignal.timeout(15_000),
      });
      if (res.ok) return (await res.json()).data?.question ?? null;
    } catch {}
    await Bun.sleep(1000 * (attempt + 1));
  }
  throw new Error(`Couldn't reach LeetCode for "${slug}"`);
}

const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
td.addRule("pre", { filter: "pre", replacement: (_c, node: any) => "\n\n```\n" + node.textContent.trim() + "\n```\n\n" });
td.addRule("sup", { filter: "sup", replacement: (c) => `^${c}` });
td.addRule("sub", { filter: "sub", replacement: (c) => `_${c}` });

export function toMarkdown(html: string): string {
  return td
    .turndown(html)
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\*\*Example (\d+):\*\*/g, "### Example $1")
    .replace(/\*\*Constraints:\*\*/g, "### Constraints")
    .replace(/\*\*Follow[- ]up:?\*\*:?/gi, "### Follow-up\n\n")
    .replace(/^\s* \s*$/gm, "")
    .replace(/^(\s*)-   /gm, "$1- ")
    .trim();
}
