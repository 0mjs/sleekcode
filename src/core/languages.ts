// Everything that differs between languages lives here.
// To add a language (Go, Java, …): add an entry below, a generator in core/generate.ts,
// helpers in runtime/<id>/, and bank/problems/*/<id>/ (built by build/build-bank.ts).
import * as p from "@clack/prompts";
import { cpSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { python, typescript, type Spec } from "./generate";
import { RUNTIME } from "./paths";

export type Language = "ts" | "py";
/** test = the test file · play = every example with your logs · scratch = your own scratchpad block */
export type Kind = "test" | "play" | "scratch";

export type LanguageSpec = {
  id: Language;
  name: string;
  /** Other names `sk lang` accepts */
  aliases: string[];
  ext: string;
  solution: string;
  test: string;
  /** LeetCode's code-snippet slug */
  leetcode: string;
  /** Short label + colour for stats */
  tag: string;
  color: string;
  /** The tool this language needs on PATH, and how to get it */
  tool: { bin: string; name: string; url: string; install?: string };
  /** Helpers + project files, added to a workspace the first time the language is used */
  setup: (dir: string) => Promise<void>;
  /** Install dependencies */
  install: string[];
  /** How to run a problem's tests / scratchpad, from inside its folder */
  run: (kind: Kind, wsDir: string, watch: boolean) => string[];
  /** True if run(…, watch = true) watches by itself; otherwise SleekCode re-runs on save */
  nativeWatch: boolean;
  generate: (spec: Spec, snippet: string) => { stub: string; test: string };
  vscodeExtensions: string[];
  /** Word for printing, used in help text */
  print: string;
};

const json = (v: unknown) => JSON.stringify(v, null, 2) + "\n";

export const LANGUAGES: Record<Language, LanguageSpec> = {
  ts: {
    id: "ts",
    name: "TypeScript",
    aliases: ["typescript", "js", "javascript"],
    ext: "ts",
    solution: "solution.ts",
    test: "solution.test.ts",
    leetcode: "typescript",
    tag: "TS",
    color: "#6aa9ef",
    tool: { bin: "bun", name: "Bun", url: "https://bun.sh" },
    async setup(dir) {
      cpSync(join(RUNTIME, "ts", "lib"), join(dir, "lib"), { recursive: true });
      await Bun.write(join(dir, "package.json"), json({
        name: "sleekcode-practice", private: true, type: "module",
        devDependencies: { "@types/bun": "latest", typescript: "^5" },
      }));
      await Bun.write(join(dir, "tsconfig.json"), json({
        compilerOptions: {
          target: "ESNext", module: "ESNext", moduleResolution: "bundler", strict: true,
          noUncheckedIndexedAccess: true, noEmit: true, skipLibCheck: true, resolveJsonModule: true, types: ["bun"],
        },
        include: ["lib", "problems"],
      }));
    },
    install: ["bun", "install"],
    // Tests stay clean: lib/quiet.ts mutes console.log while they run. `sk play` is where logs go.
    run: (kind, wsDir, watch) => {
      const w = watch ? ["--watch"] : [];
      if (kind === "test") return ["bun", "test", ...(existsSync(join(wsDir, "lib", "quiet.ts")) ? ["--preload", join(wsDir, "lib", "quiet.ts")] : []), ...w];
      if (kind === "play" && existsSync(join(wsDir, "lib", "play.ts"))) return ["bun", ...w, join(wsDir, "lib", "play.ts"), "."];
      return ["bun", ...w, "solution.ts"];
    },
    nativeWatch: true,
    generate: typescript,
    vscodeExtensions: ["oven.bun-vscode"],
    print: "console.log",
  },
  py: {
    id: "py",
    name: "Python",
    aliases: ["python", "python3"],
    ext: "py",
    solution: "solution.py",
    test: "test_solution.py",
    leetcode: "python3",
    tag: "PY",
    color: "#e3b04b",
    tool: { bin: "uv", name: "uv", url: "https://docs.astral.sh/uv/", install: "curl -LsSf https://astral.sh/uv/install.sh | sh" },
    async setup(dir) {
      cpSync(join(RUNTIME, "py", "sleek"), join(dir, "sleek"), { recursive: true });
      await Bun.write(join(dir, "pyproject.toml"), `[project]
name = "sleekcode-practice"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []

[dependency-groups]
dev = ["pytest>=8", "ruff>=0.6"]

[tool.uv]
package = false

[tool.pytest.ini_options]
addopts = "-q -p no:cacheprovider --color=yes"
pythonpath = ["."]
python_files = ["test_*.py"]

[tool.pyright]
venvPath = "."
venv = ".venv"
extraPaths = ["."]

[tool.ruff]
line-length = 120
`);
    },
    install: ["uv", "sync", "--quiet"],
    run: (kind, wsDir) => {
      const uv = ["uv", "run", "--quiet", "--project", wsDir];
      // Tests stay clean (pytest only shows prints for a failing test); `sk play` is where prints go
      if (kind === "test") return [...uv, "pytest"];
      if (kind === "play" && existsSync(join(wsDir, "sleek", "play.py"))) return [...uv, "python", "-m", "sleek.play", "."];
      return [...uv, "python", "solution.py"];
    },
    nativeWatch: false,
    generate: python,
    vscodeExtensions: ["ms-python.python", "charliermarsh.ruff"],
    print: "print",
  },
};

export const LANGUAGE_IDS = Object.keys(LANGUAGES) as Language[];

/** "python" → "py", "TS" → "ts" */
export function parseLanguage(name: string | undefined): Language | null {
  if (!name) return null;
  const n = name.toLowerCase();
  return LANGUAGE_IDS.find((id) => id === n || LANGUAGES[id].aliases.includes(n)) ?? null;
}

/** Makes sure the language's tool (bun / uv) is installed, offering to install it. */
export async function ensureTool(lang: Language, interactive = true): Promise<boolean> {
  const { tool } = LANGUAGES[lang];
  if (Bun.which(tool.bin)) return true;
  if (!tool.install) return false;
  if (interactive) {
    const ok = await p.confirm({ message: `${LANGUAGES[lang].name} needs ${tool.name}, which isn't installed yet. Install it now?`, initialValue: true });
    if (p.isCancel(ok) || !ok) return false;
  }
  const spin = p.spinner();
  spin.start(`Installing ${tool.name}`);
  const code = await Bun.spawn(["sh", "-c", tool.install], { stdout: "pipe", stderr: "pipe" }).exited;
  process.env.PATH = `${join(homedir(), ".local", "bin")}:${join(homedir(), ".cargo", "bin")}:${process.env.PATH}`;
  const ok = code === 0 && !!Bun.which(tool.bin);
  spin.stop(ok ? `${tool.name} installed` : `Couldn't install ${tool.name}. See ${tool.url}`);
  return ok;
}
