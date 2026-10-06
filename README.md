<div align="center">

<img src="assets/header.png" alt="SleekCode" width="720">

**LeetCode at home, for people who debug with `print`.**

</div>

You could learn to use a debugger. Or you could `console.log` everything until it works.
SleekCode is for the second kind of person.

```
$ sk play
── Example 1 ─────────────────────────────────
head = [1,2,3,4,5]
reversed so far: ListNode(2 → 1)   still to go: ListNode(3 → 4 → 5)
…
✓ [5,4,3,2,1]
```

The NeetCode 150, in TypeScript or Python, with tests, hidden cases, a "too slow" check, hints, and
a log that quietly judges you. macOS only.

## Install

```sh
git clone https://github.com/0mjs/sleekcode.git ~/sleekcode && bash ~/sleekcode/install.sh
```

Answer three questions (language, editor, folder), open a new terminal, type `sk`.

## Use

```
sk next      next problem
sk play -w   run the examples and see your logs, on every save
sk test -w   examples + hidden cases + speed check
sk hint      one hint at a time (no shame)
sk log       record how it went (honesty encouraged)
```

## Stats

`sk stats` is a full-screen dashboard in your terminal, because of course it is. Five tabs: your
progress and streaks, every pattern from "not started" to "mastered" (and which to focus on next),
TypeScript vs Python if you do both, how long things take you vs how long they should, and what's due
for review. Everything you log is tracked, so the graphs only lie if you do.

## Also

`sk review` (spaced repetition), `sk lang` (switch TypeScript ⇄ Python), `sk submit` (copy it to LeetCode
when you're feeling brave). `sk` lists the rest.

Works with Zed, VS Code, Cursor or vim. Update with `sk update`.

## Fine print

- Your solutions live in your own folder, not in this repo.
- Problem text comes from LeetCode when you set up; it isn't stored here.
- Test answers aren't hand-written: hidden cases are kept only when two independent reference
  solutions agree. Building them yourself: see [build/cases](build/cases/README.md).
- Problem list and hints: [NeetCode](https://neetcode.io) ([MIT](THIRD_PARTY_NOTICES.md)). Problems: [LeetCode](https://leetcode.com).
- Uninstall: `rm -rf ~/sleekcode ~/.config/sleekcode ~/.local/bin/sk ~/.local/bin/sleek`
