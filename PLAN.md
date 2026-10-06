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

### More languages
Go, Java, … The language registry (`src/core/languages.ts`) is built for this: one entry, a generator in
`src/core/generate.ts`, helpers in `runtime/<id>/`, then build + validate the bank.

## Known limits

- Problems with hand-written tests (the 13 "manual" ones, e.g. Clone Graph, Course Schedule II) have no
  `cases.json`, so `sk play` runs their scratchpad instead of the examples, and they have no hidden cases or
  speed check yet.
