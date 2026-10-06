<div align="center">

<pre>
   ━━━━━ ━━ ━    ┏━━╸ ╻    ┏━━╸ ┏━━╸ ╻ ┏╸ ┏━━╸ ┏━━┓ ┳━━┓ ┏━━╸
 ━━━━━━━━ ━━    ┗━━┓ ┃    ┣━╸  ┣━╸  ┣━┻┓ ┃    ┃  ┃ ┃  ┃ ┣━╸
━━━━━ ━━━  ━   ╺━━┛ ┗━━╸ ┗━━╸ ┗━━╸ ╹  ╹ ┗━━╸ ┗━━┛ ┻━━┛ ┗━━╸
</pre>

**LeetCode practice in your terminal, where you can `print` your way to a solution.**

The NeetCode 150 · TypeScript or Python · macOS

</div>

---

LeetCode makes it awkward to just log things and work a problem out as you go. SleekCode is built around
that: `sk play` runs every example and shows your `console.log` / `print` output under each one, next to
your answer and the expected one.

```
$ sk play
── Example 1 ───────────────────────────────────────────
head = [1,2,3,4,5]
reversed so far: ListNode(1)   still to go: ListNode(2 → 3 → 4 → 5)
reversed so far: ListNode(2 → 1)   still to go: ListNode(3 → 4 → 5)
…
✓ [5,4,3,2,1]
```

- 🖨 **`sk play`**: every example with your logs, and your answer vs the expected one. Lists and trees print readably
- ✅ **`sk test`**: the examples plus ~17 hidden edge and random cases per problem, and a speed check that
  catches a too-slow solution (LeetCode's "Time Limit Exceeded")
- 💡 **`sk hint`**: hints one at a time, target complexity first
- 📝 **`sk log`**: time (from the timer), how you solved it, your complexity checked against the target
- 🔁 **`sk review`**: spaced repetition brings back the problems you found hard
- 📊 **`sk stats`**: progress per pattern and language, solve times, streaks, what's due
- 🔀 **`sk lang`**: switch between TypeScript and Python, like LeetCode's language dropdown
- ⌨️ Editor tasks for **Zed**, **VS Code** and **Cursor**, or use vim/neovim in the terminal

## Install

Open **Terminal** (cmd + space, type "Terminal", Enter), paste this and press Enter:

```sh
git clone https://github.com/0mjs/sleekcode.git ~/sleekcode && bash ~/sleekcode/install.sh
```

> Asked to install the "command line developer tools"? Click **Install**, wait for it to finish, then paste
> the line again.

The installer sets up [Bun](https://bun.sh) if needed, then asks three questions (arrow keys + Enter):
your language (Python offers to install [uv](https://docs.astral.sh/uv/)), your editor, and where to put
your practice folder. It downloads the problems in about 10 seconds.

Then open a **new** terminal window (cmd + N) and type `sk`.

## Every day

Open your practice folder in your editor, open its terminal (ctrl + `), and:

```
sk next        open the next problem: its description and your solution file
sk start       start the timer
sk play -w     run the examples with your logs, every time you save
sk test -w     the full tests: examples, hidden cases and the speed check
sk hint        stuck? one hint at a time
sk log         record how it went
```

`sk submit` copies your solution, cleaned up for LeetCode, and opens the problem on leetcode.com.
Every few days, `sk review` brings back problems you found hard, with a blank file to solve them fresh.

Run `sk` for every command. Commands work on the problem you're on; add a number to pick another
(`sk test 217`). Every option is a flag with a short and a long form (`-w` = `--watch`).

### Editors

- **Zed:** with a problem open, **alt + shift + t** → a task like `sk: test (watch)`. **alt + t** re-runs it.
- **VS Code / Cursor:** **cmd + shift + p** → "Tasks: Run Task". Problem descriptions open as previews.
- **vim / neovim:** `sk next` opens the description and your solution side by side, right in the terminal.

### Settings

```
sk config          the settings menu
sk config -e zed   editor: zed, vscode, cursor, terminal, none (just -e for a picker)
sk config -r 10    days before a clean solve comes back for review
sk config -w       switch workspace       sk config -n   set up another
sk config -d       move a workspace to the Trash (shows what's in it, asks first)
```

### Updating, troubleshooting, uninstalling

- **Update:** `sk update`
- **`sk: command not found`:** open a new terminal window. Still nothing? `bash ~/sleekcode/install.sh --no-setup`
- **Problem text says "not downloaded yet":** you were offline during setup; run `sk sync`
- **Uninstall:** `rm -rf ~/sleekcode ~/.config/sleekcode ~/.local/bin/sk ~/.local/bin/sleek` (your practice folder is yours to keep or delete)

## How it works

- **This repo is the tool**: the `sk` command (`src/`), the problem bank (`bank/`: starting code, tests,
  cases and hints for both languages) and helpers (`runtime/`). It contains nobody's solutions.
- **Your workspace is yours**: a separate folder with your solutions, notes and progress. Make it a private
  git repo to back it up.
- **Problem text isn't stored here**: your workspace downloads it from LeetCode when it's created.
- **Test answers are never hand-written**: hidden cases are kept only when two independent reference
  solutions (TypeScript and Python, from [NeetCode](https://github.com/neetcode-gh/leetcode)) agree.

### Contributing

```sh
bun build/fetch-cache.ts   # download LeetCode + NeetCode data into .cache/
bun build/build-cases.ts   # hidden cases + speed checks (see build/cases/README.md)
bun build/build-bank.ts    # regenerate bank/
bun build/validate.ts      # every test must fail on the blank stub and pass on the references
bun run typecheck
```

New languages (Go, Java, …) slot into `src/core/languages.ts`. Ideas and known limits are in [PLAN.md](PLAN.md).

## Credits

Problem list, hints and video links: [NeetCode](https://neetcode.io) ([MIT](THIRD_PARTY_NOTICES.md)).
Problems: [LeetCode](https://leetcode.com).
