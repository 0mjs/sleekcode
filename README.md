# SleekCode

**LeetCode practice in your terminal, where you can actually `print` your way to a solution.**
LeetCode and friends make it awkward to just log things and work it out as you go. SleekCode is built
around that: `sk play` runs every example and shows your `console.log` / `print` output under each one,
right next to your answer and the expected one.

The NeetCode 150 (the classic interview problems, with the Blind 75 marked ⭐), in **TypeScript or Python**, with:

- 🖨 `sk play`: every example, your logs, your answer vs the expected one. Lists and trees print readably
- ✅ `sk test`: the examples plus hidden edge and random cases, and a speed check that catches a too-slow
  solution, like LeetCode's "Time Limit Exceeded"
- 💡 hints one at a time when you're stuck (from NeetCode)
- ⏱ a timer, and a log of every attempt
- 🔁 spaced repetition: problems come back for review so they stick
- 📊 a stats dashboard: progress per pattern, time per problem, streaks
- ⌨️ editor tasks for **Zed** or **VS Code**

```
sk next      open the next problem
sk test -w   run the tests every time you save
sk hint      stuck? one hint at a time
sk log       record how it went
```

---

## Install (macOS, about 2 minutes)

You only do this once. No terminal experience needed: copy, paste, press Enter.

### 1. Open Terminal

Press **cmd + space**, type **Terminal**, press **Enter**.

### 2. Copy and paste this, then press Enter

```sh
git clone https://github.com/0mjs/sleekcode.git ~/sleekcode && bash ~/sleekcode/install.sh
```

> **"The git command requires the command line developer tools"?** Click **Install**, wait for it
> to finish (a few minutes), then paste the line above again.

The installer sets up everything SleekCode needs (a tool called Bun), then asks you three questions.

### 3. Answer the three questions

Use the **arrow keys** to choose and **Enter** to confirm:

1. **Language:** TypeScript or Python. You can switch any time later. (If you pick Python, it offers to install `uv`, the Python tool it uses. Say yes.)
2. **Editor:** Zed, VS Code, Cursor, a terminal editor like vim (uses your `$EDITOR`), or none.
3. **Where to put your practice folder:** just press Enter for the suggested place.

It then downloads the problems (about 10 seconds). That's it.

### 4. Open a new terminal window

Press **cmd + N** in Terminal. (The old window doesn't know about the new `sk` command yet.)
Type `sk` and press Enter to see everything you can do.

---

## Every day

Open your practice folder in your editor, open its built-in terminal (**ctrl + `** in both Zed and VS Code), and:

| Step | Type | What it does |
| --- | --- | --- |
| 1 | `sk next` | Opens the next problem: its description and your solution file |
| 2 | `sk start` | Starts a timer |
| 3 | `sk test -w` | Runs the full tests (examples + hidden cases + speed check) every time you save. Green = solved |
| | `sk play -w` | Runs every example, showing what you `print` / `console.log` and your answer vs the expected one |
| | `sk hint` | Stuck? Shows one hint (run it again for the next) |
| 4 | `sk log` | Records how it went. The time comes from the timer; you pick how you solved it (on your own / AI / looked it up) and your time & space complexity from a list, and it checks them against the target |

Want the real thing too? `sk submit` copies your solution (cleaned up for LeetCode) and opens the
problem on leetcode.com, so you can paste and submit it there. Then `sk next` again. Every few days, `sk review` brings back problems you found hard, with a blank
file so you solve them fresh.

`sk stats` shows a dashboard (use ← → to switch tabs, q to quit). `sk list` shows your checklist (`sk list -t` for just what's left).

### Switching language

Like the language dropdown on LeetCode:

```sh
sk lang            # which language you're using
sk lang python     # switch to Python (or: sk lang typescript)
```

Your progress, notes and reviews are shared. A problem gets files for a language the first time you open it in that language, so you can re-solve problems you've done in one language in the other. `sk stats` compares the two.

### Editor shortcuts

- **Zed:** with a problem open, press **alt + shift + t** and pick a task like `sk: test (watch)`. **alt + t** re-runs the last one.
- **VS Code / Cursor:** **cmd + shift + p** → "Tasks: Run Task" → pick `sk: test (watch)`, `sk: hint`, … Problem descriptions open as formatted previews.
- **Terminal editor:** `sk next` opens the problem in your `$EDITOR` right in the terminal (vim and neovim get the description and your solution side by side).

### All commands

Run `sk` on its own for the full list (`sleek` works too). Every flag has a short and long form,
e.g. `sk test -w` = `sk test --watch`. Commands work on the problem you're on; add a number to pick
another, e.g. `sk test 217`.

---

## Updating

```sh
sk update
```

## Settings

```sh
sk config                    # the settings menu
sk config -e zed             # editor: zed, vscode, cursor, terminal, none (just -e for a picker)
sk config -r 10              # days before a clean solve comes back for review
sk config -w                 # switch between workspaces
sk config -n                 # set up another workspace
sk config -d                 # move a workspace to the Trash (shows what's in it and asks first)
```

Long forms work too (`--editor`, `--review`, `--workspace`, `--new`, `--delete`), like every flag in SleekCode.

A workspace is just a folder; removing one moves it to the macOS Trash, so you can restore it from there.

## Troubleshooting

- **`sk: command not found`** → open a new terminal window (cmd + N). Still nothing? Run `bash ~/sleekcode/install.sh --no-setup`.
- **Problem descriptions say "not downloaded yet"** → you were offline during setup. Run `sk sync`.
- **Something else** → `sk update`, then try again.

## Uninstall

```sh
rm -rf ~/sleekcode ~/.config/sleekcode ~/.local/bin/sk ~/.local/bin/sleek
```

Your practice folder is yours: delete it too if you want, or keep it.

---

## How it works

- **This repo** is the tool: the `sk` command (`src/`), the problem bank (`bank/`: starting code, tests
  and hints for both languages), and helpers (`runtime/`). It doesn't contain anyone's solutions.
- **Your workspace** is a separate folder created during setup. Your solutions, notes and progress
  live there. You can make it a git repo to back it up.
- **Problem text** is downloaded from LeetCode into your workspace when it's created; it isn't stored here.

### For maintainers

```sh
bun build/fetch-cache.ts   # download LeetCode + NeetCode data into .cache/
bun build/build-cases.ts   # hidden cases + speed checks from build/cases/specs (see build/cases/README.md)
bun build/build-bank.ts    # regenerate bank/ (hand-written problems are kept)
bun build/validate.ts      # every test must fail on the blank stub and pass on a reference solution
bun run typecheck
```

**Adding a language** (Go, Java, …): add an entry to `src/core/languages.ts`, a generator in
`src/core/generate.ts`, helpers in `runtime/<id>/`, then rebuild and validate the bank. Everything else
(commands, stats, editors) picks it up from the registry.

## Credits

Problem list, hints and video links: [NeetCode](https://neetcode.io) ([MIT](THIRD_PARTY_NOTICES.md)).
Problems: [LeetCode](https://leetcode.com).
