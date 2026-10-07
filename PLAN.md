# Plan

What we want to add or fix next. Newest ideas at the bottom of each section.

## Ideas

### Mock interview mode (`sk mock`)
A random problem (optionally by pattern or difficulty), a visible countdown (e.g. 45 min), hints switched
off, and the attempt logged as a mock.

Open questions before building it:
- **Keep the pressure opt-in.** SleekCode is a low-pressure "learn the 150" playground; mocks shouldn't leak
  pressure into the everyday experience.
- **Stats:** mocks probably shouldn't mix into the normal numbers (streaks, clean %, review timing). Either a
  separate category everywhere, or their own tab in `sk stats`.
- Should a mock count as an attempt for spaced repetition at all?

### Dispute a test (`sk dispute`)
If a hidden test case looks wrong, a way to flag it from the CLI: shows the full input, your answer and the
expected one, and saves a report the maintainer can check (and fix the spec or reference). SleekCode stays the
judge; no "go check it on LeetCode" step.

### Pattern drills (`sk drill`)
Flashcards for the first two minutes of an interview: show a problem statement (no coding), pick the pattern and
the target complexity, get told instantly. Uses data we already have (problem text, pattern, NeetCode target).

### Interview habits
- **Explain it out loud:** `sk log` asks for the approach in a sentence or two; shown again at review time.
- **Edge cases first:** `sk start` asks for edge cases; `sk log` compares them with the hidden edge cases you failed.
- **More lists:** NeetCode 250, Grind 169 as whole sets (`sk add` covers single problems today).
- **Weekly goal:** a gentle "5 this week", shown in `sk` and stats (no pressure).

### System design practice
Not testable like code, but the practice can have the same loop (practise → check → log → review):
- **A finite library** of ~20 classic prompts: URL shortener, rate limiter, chat, news feed, video streaming, ride
  sharing, web crawler, distributed cache, notifications, key-value store, autocomplete, payments.
- **`sk design next`** opens a `design.md` with the interview sections (requirements, estimates, API, data model,
  high-level design, deep dives, trade-offs), with a 45-minute timer. Diagrams in Mermaid, or a linked tldraw/Excalidraw file.
- **A rubric instead of tests:** each prompt has a checklist of what a strong answer covers. `sk design check`
  reveals it, you tick what you covered, and the coverage score is logged, tracked and spaced like coding problems.
- **Estimation drills are testable:** back-of-envelope questions ("100M DAU × 10 requests: peak QPS?") have numeric
  answers, checked within a tolerance.
- **AI feedback only as an opt-in**, never the default.
- **Content:** written carefully per prompt; the System Design Primer (CC BY-SA 4.0) can be adapted with credit.

### More languages
Go, Java, … The language registry (`src/core/languages.ts`) is built for this: one entry, a generator in
`src/core/generate.ts`, helpers in `runtime/<id>/`, then build + validate the bank.

## Known limits

- A few speed checks only catch brute force in Python: at LeetCode's maximum input sizes the TypeScript brute
  force is still fast (LeetCode behaves the same way).
