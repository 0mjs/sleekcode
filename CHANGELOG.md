# Changelog

## 0.4.0

- **Pause the timer:** `sk pause` when you step away, `sk start` to resume. Paused time isn't counted.
- **Cancel it:** `sk start -c` throws the timer away; `sk log` asks for the time instead.
- **Forgot to pause?** If the timer says more than 2 hours (or 3× your target for that difficulty), `sk log` asks whether that was really all solving time.
- The running or paused timer shows in `sk` and `sk which`; Zed / VS Code get a "pause timer" task.

## 0.3.0

- **Problems can be mastered.** 4 clean solves in a row (each one on time, on target, no hints or help) and a problem is ✅ mastered: out of the review queue for good. A non-clean redo puts it back. Change the number with `sk config -g`.
- Pattern levels: learning → practising → solid (all solved, 70%+ clean) → mastered (every problem mastered).
- Mastered counts in stats, `sk review`, `sk list` and LIST.md, and `sk log` tells you when it happens.

## 0.2.1

- TypeScript workspaces no longer flag `nums[i]` as "possibly undefined" (`noUncheckedIndexedAccess` is off, like on LeetCode). `strict` stays on. Run `sk update` to apply it to your workspace.

## 0.2.0

- **Not happy with a solution?** `sk log` asks how you feel about it (😬 not happy · 👍 fine · 😎 nailed it). Not happy brings it back for review in 2 days; nailed it waits twice as long.
- **Above the target complexity now counts.** If your time or space is worse than the target, the problem comes back in 3 days and isn't "clean" in stats. Existing attempts are checked too.
- **Stats:** "clean" means how you solved each problem most recently, so a clean redo counts fully.
- **Hidden tests for every problem:** 2,500+ edge and random cases, and speed checks on 75 problems.
- `sk play` runs every example with your logs; `sk submit`; readable lists and trees in your logs.
- `sk config` flags (`-e`, `-r`, `-w`, `-n`, `-d`); remove workspaces safely to the Trash.
- `sk -v` / `sk --version`, and `sk update` shows what changed.

## 0.1.0

- First release: the NeetCode 150 in TypeScript and Python, tests, hints, timer, logging, spaced repetition, stats, Zed / VS Code / Cursor / vim.
