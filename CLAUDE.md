# SleekCode

CLI (`sk` / `sleek`, Bun + TypeScript) for practising the NeetCode 150 in TypeScript or Python. macOS only.

## Layout

- `src/cli.ts`: entry and dispatch. `src/commands/*`: commands. `src/core/*`: config, workspace, attempts, generation, sync, run, editor. `src/ui/*`: colours, header wordmark, help (the help definitions in `ui/help.ts` also drive flag parsing in `core/args.ts`, so add flags there).
- `src/core/languages.ts`: the language registry (files, tools, run commands, generator, colours). One workspace holds any number of languages; `.sleekcode.json` has the current `language` and the set-up `languages`. Problem files for a language are created on first use (`core/materialize.ts`, called from `needProblem` / `select`).
- `bank/problems.json`: index. `bank/problems/<id>-<short-name>/`: `hints.json` (NeetCode, MIT), `ts/` + `py/` (solution stub + tests), `problem.md` (Premium write-ups only).
- `runtime/ts/lib`, `runtime/py/sleek`: helpers copied into each workspace (ListNode/TreeNode builders, runOps / run_ops, anyOrder / any_order).
- `build/`: maintainer scripts. `fetch-cache.ts` → `build-bank.ts` → `validate.ts`. `build/refs/<lang>/` holds reference solutions where NeetCode's are missing or broken, plus the 13 MANUAL problems. `build/neetcode-hint-names.json` is a hand-checked 1:1 map; don't regenerate it by fuzzy matching.

## Rules

- **Workspace ≠ tool.** User solutions, attempts.json, LOG.md and LIST.md live in the user's workspace (created by onboarding), never in this repo.
- **No LeetCode problem text in the repo.** Workspaces download it (`core/sync.ts`). Premium write-ups in `problem.md` are our own words.
- **Never write hints or solutions from memory.** Hints come from NeetCode's repo; tests are validated.
- After changing generation or tests: `bun build/build-bank.ts && bun build/validate.ts`. Both languages must be 150/150 (fail on stub, pass on reference). Then `bun run typecheck` and `uvx ruff check bank runtime/py --select E9,F`.
- MANUAL problems (see `build/build-bank.ts`) are hand-written in both languages; the builder never overwrites them.
- Test new CLI behaviour with `SLEEKCODE_CONFIG_DIR=<tmp>` and `sk setup --language ts|py --editor none --dir <tmp>` so the real config and editors aren't touched.
- Commits: no Claude co-author trailer.
