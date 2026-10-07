import { bold, c, pad } from "./colors";
import { header } from "./header";

/** arg = the flag takes a value; optional = the value can be left out (you get a picker or a question instead) */
type Flag = { short: string; long: string; arg?: string; optional?: boolean; desc: string };
type Command = { name: string; args?: string; desc: string; flags?: Flag[] };

const GROUPS: { title: string; commands: Command[] }[] = [
  {
    title: "Daily loop",
    commands: [
      { name: "next", desc: "Open the next unsolved problem (and make it current)", flags: [{ short: "b", long: "blind", desc: "Blind 75 problems only" }] },
      { name: "start", desc: "Start the timer (or resume a paused one)", flags: [{ short: "c", long: "cancel", desc: "throw the timer away (sk log will ask for the time)" }] },
      { name: "pause", desc: "Pause the timer when you step away (sk start resumes it)" },
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
          { short: "f", long: "feel", arg: "unhappy|fine|nailed", desc: "how you feel about your solution" },
          { short: "n", long: "notes", arg: "text", desc: "anything worth remembering" },
        ],
      },
    ],
  },
  {
    title: "Practice",
    commands: [
      { name: "review", desc: "Redo what's due (spaced repetition), most overdue first", flags: [{ short: "l", long: "list", desc: "just show what's due" }] },
      {
        name: "drill",
        desc: "Flashcards: read a problem, name the pattern and target complexity, no coding",
        flags: [
          { short: "n", long: "count", arg: "number", desc: "how many cards (default 5)" },
          { short: "p", long: "pattern", arg: "name", desc: 'one pattern, e.g. "graphs"' },
          { short: "s", long: "solved", desc: "only problems you've already solved" },
        ],
      },
      { name: "open", args: "<number>", desc: "Jump to a specific problem" },
      { name: "reset", desc: "Blank your solution again (your code is saved first)" },
      {
        name: "submit",
        desc: "Copy your solution for LeetCode and open the problem, to submit it there",
        flags: [{ short: "a", long: "attempt", desc: "pick from your current solution and every attempt you've logged" }],
      },
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
        name: "league",
        args: "[number]",
        desc: "A private leaderboard with friends (a GitHub repo), or one problem head to head",
        flags: [
          { short: "c", long: "create", desc: "create a league and invite friends" },
          { short: "i", long: "invite", arg: "username", optional: true, desc: "invite friends by GitHub username" },
          { short: "j", long: "join", arg: "owner/repo", optional: true, desc: "join one (or just run sk league to see invites)" },
          { short: "l", long: "leave", desc: "leave the league (your results are removed)" },
          { short: "d", long: "delete", desc: "delete the league (only its creator)" },
        ],
      },
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
      { name: "intro", desc: "A two-minute tour of how SleekCode works, in plain English" },
      {
        name: "lang",
        args: "[language]",
        desc: "Show or switch your language (typescript, python), like LeetCode's dropdown",
        flags: [{ short: "a", long: "all", desc: "create files for every problem now, not as you go" }],
      },
      {
        name: "config",
        desc: "Settings menu, or jump straight to one setting:",
        flags: [
          { short: "e", long: "editor", arg: "name", optional: true, desc: "zed, vscode, cursor, terminal or none" },
          { short: "t", long: "theme", arg: "name", optional: true, desc: "colours: tokyo-night, dracula, gruvbox, monokai… (no name = pick)" },
          { short: "r", long: "review", arg: "days", optional: true, desc: "days before a clean solve comes back for review" },
          { short: "m", long: "menu", arg: "on|off", optional: true, desc: "sk on its own opens a menu of next steps (off: shows this help)" },
          { short: "u", long: "updates", arg: "on|off", optional: true, desc: "install new versions by themselves (on by default)" },
          { short: "g", long: "graduate", arg: "count", optional: true, desc: "clean solves in a row before a problem is mastered (default 4)" },
          { short: "w", long: "workspace", arg: "path", optional: true, desc: "switch the active workspace" },
          { short: "n", long: "new", desc: "set up another workspace" },
          { short: "d", long: "delete", arg: "path", optional: true, desc: "move a workspace to the Trash (shows what's in it, asks first)" },
        ],
      },
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
      { name: "-v, --version", desc: "Which version of SleekCode you have" },
    ],
  },
];

export const ALL = GROUPS.flatMap((g) => g.commands);

const flagText = (f: Flag) => `-${f.short}, --${f.long}${f.arg ? (f.optional ? ` [${f.arg}]` : ` <${f.arg}>`) : ""}`;

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
    out.push(`  ${bold(c.accent(g.title.toUpperCase()))}`);
    for (const cmd of g.commands) out.push(...commandLines(cmd));
    out.push("");
  }
  out.push(
    `  ${c.muted("Commands use the problem you're working on (the folder you're in, or the last one you opened).")}`,
    `  ${c.muted("Every option is a flag with a short and long form; [values] in brackets can be left out to get a picker.")}`,
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
