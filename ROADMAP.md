# Roadmap

Ideas for where SleekCode goes next. Nothing here is promised or scheduled; it's a list of things worth building.

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

### AI review, bring-your-own-key (`sk review --ai`)
Strictly opt-in, never the default — SleekCode's core stays AI-free. You add your own API key (OpenAI or
Anthropic, any model) in `sk config`; nothing is sent anywhere unless you ask. Fits well with the free monthly
API credits on Max/Team plans.
- **Only runs after your own attempt and your own complexity guess.** A "check my work", never a "do my work",
  so it doesn't remove the thinking (working out the pattern and the Big O yourself is the whole point).
- **Checks your stated complexity:** you still type your Big O at `sk log`; then this can confirm or correct it
  ("you said O(n), it's O(n·k) because the strings have length"). This is the "automated Big O" idea done safely
  — assist, don't autofill.
- **Feedback on the solution:** a cleaner approach, edge cases you missed, whether you hit the target.
- **Model:** default a small fast model (Haiku 4.5, or an OpenAI mini); allow a bigger one (Sonnet 5) for the
  subtle multi-variable complexities where small models slip. Key and model live in `~/.config/sleekcode`.
- **Privacy:** the key never leaves the machine except in the API call you triggered; make that explicit.

### More languages
Go, Java, … The language registry (`src/core/languages.ts`) is built for this: one entry, a generator in
`src/core/generate.ts`, helpers in `runtime/<id>/`, then build + validate the bank.

### PyCharm (Python only)
An editor option for Python workspaces, since some Python learners live in PyCharm.
- **Only offered when the workspace is Python-only.** If someone with PyCharm adds TypeScript (`sk lang`), stop
  early and suggest switching editor first. (WebStorm is the TypeScript counterpart: maybe a general "JetBrains"
  option later.)
- **Opening files:** PyCharm's command-line launcher, or `open -a PyCharm`.
- **Run buttons:** shared run configurations (`.run/*.run.xml`) for `sk test` and `sk play`, in place of the
  Zed / VS Code tasks.
- **Interpreter:** PyCharm should pick up the workspace's uv `.venv` by itself; confirm.
- **Testing:** install the free PyCharm with Homebrew, check all of the above for real, then uninstall it.

## Known limits

- A few speed checks only catch brute force in Python: at LeetCode's maximum input sizes the TypeScript brute
  force is still fast (LeetCode behaves the same way).
