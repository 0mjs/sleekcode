# SleekCode

**LeetCode practice in your terminal.** The NeetCode 150 (the classic interview problems, with the
Blind 75 marked ⭐), in **TypeScript or Python**, with:

- ✅ tests for every problem, so you know when you've got it
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
2. **Editor:** Zed, VS Code, or something else.
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
| 3 | `sk test -w` | Runs the tests every time you save. Green = solved |
| | `sk play -w` | Runs your code and shows what you `print` / `console.log` |
| | `sk hint` | Stuck? Shows one hint (run it again for the next) |
| 4 | `sk log` | Records how it went: time, hints, complexity, notes |

Then `sk next` again. Every few days, `sk review` brings back problems you found hard, with a blank
file so you solve them fresh.

`sk stats` shows a dashboard (use ← → to switch tabs, q to quit).

### Switching language

Like the language dropdown on LeetCode:

```sh
sk lang            # which language you're using
sk lang python     # switch to Python (or: sk lang typescript)
```

Your progress, notes and reviews are shared. A problem gets files for a language the first time you open it in that language, so you can re-solve problems you've done in one language in the other. `sk stats` compares the two.

### Editor shortcuts

- **Zed:** with a problem open, press **alt + shift + t** and pick a task like `sk: test (watch)`. **alt + t** re-runs the last one.
- **VS Code:** **cmd + shift + p** → "Tasks: Run Task" → pick `sk: test (watch)`, `sk: hint`, … Problem descriptions open as formatted previews.

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
sk config
```

Change your editor or review timing.

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
