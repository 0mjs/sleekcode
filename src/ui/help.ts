import { bold, c, pad } from "./colors";
import { header } from "./header";

export type Flag = { short: string; long: string; arg?: string; desc: string };
export type Command = { name: string; args?: string; desc: string; flags?: Flag[] };

export const GROUPS: { title: string; commands: Command[] }[] = [
  {
    title: "Daily loop",
    commands: [
      { name: "next", desc: "Open the next unsolved problem (and make it current)", flags: [{ short: "b", long: "blind", desc: "Blind 75 problems only" }] },
      { name: "start", desc: "Start the timer" },
      {
        name: "play",
        desc: "Run every example: your logs/prints, then your answer vs the expected one",
        flags: [
          { short: "w", long: "watch", desc: "re-run every time you save" },
          { short: "s", long: "scratch", desc: "run your own scratchpad block at the bottom of the file instead" },
        ],
      },
      { name: "test", desc: "Run the tests", flags: [{ short: "w", long: "watch", desc: "re-run every time you save" }] },
      { name: "hint", desc: "Stuck? Show the next hint (target complexity first)", flags: [{ short: "r", long: "reset", desc: "start the hints over" }] },
      {
        name: "log",
        desc: "Record your result (asks a few quick questions)",
        flags: [
          { short: "t", long: "time", arg: "duration", desc: 'e.g. 25, "1h 10m" (automatic with sk start)' },
          { short: "s", long: "solo", arg: "y/n", desc: "solved on your own (no AI, no looking it up)?" },
          { short: "c", long: "complexity", arg: "text", desc: 'e.g. "O(n) / O(1)"' },
          { short: "n", long: "notes", arg: "text", desc: "anything worth remembering" },
        ],
      },
    ],
  },
  {
    title: "Practice",
    commands: [
      { name: "review", desc: "Redo what's due (spaced repetition), most overdue first", flags: [{ short: "l", long: "list", desc: "just show what's due" }] },
      { name: "open", args: "<number>", desc: "Jump to a specific problem" },
      { name: "reset", desc: "Blank your solution again (your code is saved first)" },
      { name: "submit", desc: "Copy your solution for LeetCode and open the problem, to submit it there" },
      { name: "which", desc: "Show the current problem" },
    ],
  },
  {
    title: "Progress",
    commands: [
      { name: "attempts", args: "[number]", desc: "See, edit or delete what you've logged", flags: [{ short: "a", long: "all", desc: "every problem, newest first" }] },
      { name: "undo", desc: "Delete your most recent log (asks first)" },
      { name: "stats", desc: "Dashboard: overview, patterns, history, review" },
      {
        name: "list",
        desc: "Your checklist, in study order (LIST.md updates by itself)",
        flags: [
          { short: "t", long: "todo", desc: "only what's left" },
          { short: "p", long: "pattern", arg: "name", desc: 'one pattern, e.g. "graphs"' },
        ],
      },
    ],
  },
  {
    title: "Setup",
    commands: [
      {
        name: "lang",
        args: "[language]",
        desc: "Show or switch your language (typescript, python), like LeetCode's dropdown",
        flags: [{ short: "a", long: "all", desc: "create files for every problem now, not as you go" }],
      },
      { name: "config", args: "[setting]", desc: "Settings menu, or jump straight to one:" },
      { name: "config editor", args: "[name]", desc: "zed, vscode, cursor, terminal or none" },
      { name: "config review", args: "[days]", desc: "how long a clean solve waits before review" },
      { name: "config workspace", args: "[path]", desc: "switch the active workspace" },
      { name: "config new", desc: "set up another workspace" },
      { name: "config remove", args: "[path]", desc: "move a workspace to the Trash (asks first)" },
      {
        name: "add",
        args: "<slug or url>",
        desc: "Add any other LeetCode problem",
        flags: [
          { short: "n", long: "name", arg: "short-name", desc: "folder name" },
          { short: "p", long: "pattern", arg: "name", desc: 'group it under a pattern, e.g. "Two Pointers"' },
        ],
      },
      { name: "sync", desc: "Download any problem text that's missing" },
      { name: "update", desc: "Update SleekCode to the latest version" },
      { name: "help", args: "[command]", desc: "This screen, or details for one command" },
    ],
  },
];

export const ALL = GROUPS.flatMap((g) => g.commands);

const flagText = (f: Flag) => `-${f.short}, --${f.long}${f.arg ? ` <${f.arg}>` : ""}`;

function commandLines(cmd: Command): string[] {
  const usage = `sk ${cmd.name}${cmd.args ? " " + cmd.args : ""}`;
  const lines = [`  ${pad(c.ink(usage), 26)} ${c.body(cmd.desc)}`];
  for (const f of cmd.flags ?? []) lines.push(`    ${pad(c.teal(flagText(f)), 30)} ${c.muted(f.desc)}`);
  return lines;
}

export function help(status?: string[]): string {
  const out = [header()];
  if (status?.length) out.push(...status, "");
  for (const g of GROUPS) {
    out.push(`  ${bold(c.green(g.title.toUpperCase()))}`);
    for (const cmd of g.commands) out.push(...commandLines(cmd));
    out.push("");
  }
  out.push(
    `  ${c.muted("Commands use the problem you're working on (the folder you're in, or the last one you opened).")}`,
    `  ${c.muted("Add a number to pick another:")} ${c.ink("sk test 217 -w")}  ${c.muted("·")}  ${c.ink("sleek")} ${c.muted("works too.")}`,
    "",
  );
  return out.join("\n");
}

export function commandHelp(name: string): string | null {
  const cmd = ALL.find((x) => x.name === name);
  if (!cmd) return null;
  return ["", ...commandLines(cmd), ""].join("\n");
}
