import { parseArgs } from "node:util";
import { c } from "../ui/colors";
import { ALL, commandHelp } from "../ui/help";

/** Parses a command's flags using its definition in ui/help.ts, so help and behaviour can't drift apart */
export function parse(name: string, args: string[]) {
  const cmd = ALL.find((x) => x.name === name);
  const options = Object.fromEntries(
    (cmd?.flags ?? []).map((f) => [f.long, { type: f.arg ? ("string" as const) : ("boolean" as const), short: f.short }]),
  );
  // Flags whose value is optional: with nothing after them, they get "" (meaning "ask me")
  const optional = new Set((cmd?.flags ?? []).filter((f) => f.optional).flatMap((f) => [`-${f.short}`, `--${f.long}`]));
  const expanded = args.flatMap((a, i) => (optional.has(a) && (args[i + 1] === undefined || args[i + 1]!.startsWith("-")) ? [a, ""] : [a]));
  try {
    const { values, positionals } = parseArgs({ args: expanded, options, allowPositionals: true, strict: true });
    return { values: values as Record<string, string | boolean | undefined>, positionals };
  } catch (e) {
    console.error(`\n  ${c.red((e as Error).message.replace(/\. To specify.*$/, "."))}`);
    console.log(commandHelp(name) ?? "");
    process.exit(1);
  }
}
