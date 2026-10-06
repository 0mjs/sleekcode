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

### More languages
Go, Java, … The language registry (`src/core/languages.ts`) is built for this: one entry, a generator in
`src/core/generate.ts`, helpers in `runtime/<id>/`, then build + validate the bank.

## Known limits

- A few speed checks only catch brute force in Python: at LeetCode's maximum input sizes the TypeScript brute
  force is still fast (LeetCode behaves the same way).
