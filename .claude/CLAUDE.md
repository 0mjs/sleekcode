# SleekCode

CLI (`sk` / `sleek`, Bun + TypeScript) for practising the NeetCode 150 in TypeScript or Python. macOS only.

## Layout

- `src/cli.ts`: entry and dispatch. `src/commands/*`: commands. `src/core/*`: config, workspace, attempts, generation, sync, run, editor. `src/ui/*`: colours, header wordmark, help (the help definitions in `ui/help.ts` also drive flag parsing in `core/args.ts`, so add flags there).
- `src/core/languages.ts`: the language registry (files, tools, run commands, generator, colours). One workspace holds any number of languages; `.sleekcode.json` has the current `language` and the set-up `languages`. Problem files for a language are created on first use (`core/materialize.ts`, called from `needProblem` / `select`).
- `bank/problems/<folder>/cases.json`: the data every test, `sk play` and the speed check run from: call signature, compare mode, cases (examples + edge + random), perf recipe + limits. Runtimes: `runtime/ts/lib/{cases,testing,play,perf,recipe}.ts` and `runtime/py/sleek/{cases,testing,play,perf,recipe}.py`, kept in sync.
- Hidden cases: `build/cases/specs/*.ts` describe valid inputs; `build/build-cases.ts` keeps only cases where the TypeScript and Python references agree (see `build/cases/README.md`). Never hand-write expected outputs.
- `bank/problems.json`: index. `bank/problems/<id>-<short-name>/`: `hints.json` (NeetCode, MIT), `ts/` + `py/` (solution stub + tests), `problem.md` (Premium write-ups only).
- `runtime/ts/lib`, `runtime/py/sleek`: helpers copied into each workspace (ListNode/TreeNode builders, runOps / run_ops, anyOrder / any_order).
- `build/`: maintainer scripts. `fetch-cache.ts` → `build-bank.ts` → `validate.ts`. `build/refs/<lang>/` holds reference solutions where NeetCode's are missing or broken, plus the 13 MANUAL problems. `build/neetcode-hint-names.json` is a hand-checked 1:1 map; don't regenerate it by fuzzy matching.

- Leagues: `src/core/league.ts` + `src/commands/league.ts`. A league is a private GitHub repo (via `gh`) cloned to `~/.config/sleekcode/league`; each player writes only `players/<login>.json` (no code, no notes) and the README is a regenerated leaderboard. Sync = fetch + hard reset + rewrite own file + push (never merges). `sk log` / edits publish in the background (`sk league --publish`, internal); failures set `league.pending` and retry on the next command. Test without GitHub by using a local bare repo path as the league and `SLEEKCODE_LEAGUE_LOGIN=<name>`.

## Rules

- **Workspace ≠ tool.** User solutions, attempts.json, LOG.md and LIST.md live in the user's workspace (created by onboarding), never in this repo.
- **No LeetCode problem text in the repo.** Workspaces download it (`core/sync.ts`). Premium write-ups in `problem.md` are our own words.
- **Never write hints or solutions from memory.** Hints come from NeetCode's repo; tests are validated.
- `sk test` stays clean (logs muted); logs belong to `sk play`. Problems with several correct answers use a validator (`VALIDATORS` in both runtimes), never exact matching.
- After changing generation or tests: `bun build/build-bank.ts && bun build/validate.ts`. Both languages must be 150/150 (fail on stub, pass on reference). Then `bun run typecheck` and `uvx ruff check bank runtime/py --select E9,F`.
- MANUAL problems (see `build/build-bank.ts`) are hand-written in both languages; the builder never overwrites them.
- Test new CLI behaviour with `SLEEKCODE_CONFIG_DIR=<tmp>` and `sk setup --language ts|py --editor none --dir <tmp>` so the real config and editors aren't touched.
- CLI shape, everywhere: `sk <command> [number|name] [flags]`. Every option is a flag with a short and a long form (defined in `ui/help.ts`, which also drives parsing); a flag's value can be optional (`optional: true`), meaning "ask me / show a picker". No word sub-commands.
- Commits: no Claude co-author trailer.

## Versioning

Semantic versioning, `MAJOR.MINOR.PATCH` in `package.json` (shown by `sk -v` and the header).
- **PATCH**: bug fixes only. **MINOR**: new features that break nothing. **MAJOR**: breaking changes only.
- Breaking = removing/renaming a command or flag, a workspace change the user must fix by hand, or existing data (`attempts.json`, `.sleekcode.json`, config) no longer loading.
- Breaking changes are a last resort: add a migration instead (fill missing fields on load, keep reading old formats, let `sk update` refresh workspaces). The goal is to stay on 1.x forever (1.109.0 is fine; 2.0.0 should never be needed).
- 0.x until the first-run install (Bun + uv from scratch) is proven on a real Mac and a second user has used it for a week or two without problems; then 1.0.0.
- Every user-facing release: bump `package.json`, add a CHANGELOG.md entry (user-facing wording: auto-update shows users the first 4 bullets of each new version, so lead with what matters to them, one line each), commit, then `git tag -a vX.Y.Z` and push the tag.
