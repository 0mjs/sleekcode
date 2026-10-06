import { parseArgs } from "node:util";
import { c } from "../ui/colors";
import { ALL, commandHelp } from "../ui/help";

/** Parses a command's flags using its definition in ui/help.ts, so help and behaviour can't drift apart */
export function parse(name: string, args: string[]) {
  const cmd = ALL.find((x) => x.name === name);
  const options = Object.fromEntries(
    (cmd?.flags ?? []).map((f) => [f.long, { type: f.arg ? ("string" as const) : ("boolean" as const), short: f.short }]),
  );
  try {
    const { values, positionals } = parseArgs({ args, options, allowPositionals: true, strict: true });
    return { values: values as Record<string, string | boolean | undefined>, positionals };
  } catch (e) {
    console.error(`\n  ${c.red((e as Error).message.replace(/\. To specify.*$/, "."))}`);
    console.log(commandHelp(name) ?? "");
    process.exit(1);
  }
}
