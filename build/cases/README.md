# Hidden test cases + speed checks

Every problem's `cases.json` holds LeetCode's examples, plus **edge** and **random** cases and a **speed
check**, generated from a spec in `specs/*.ts`. A spec only describes *inputs*. Expected answers always come
from running **both** reference solutions (TypeScript and Python) and keeping only the cases where they agree.

```sh
bun build/build-cases.ts two-sum valid-anagram   # build some problems (slugs or folder prefixes)
bun build/build-cases.ts                         # build every spec
bun build/build-bank.ts && bun build/validate.ts # then merge into bank/ and prove every test
```

## Writing a spec

See `lib.ts` (the `CaseSpec` type + seeded random helpers) and `specs/_examples.ts` (worked examples covering
arrays, linked lists, trees, design classes and in-place problems).

For each problem, look at:
- `bank/problems/<folder>/cases.json`: the signature (`call`), how answers are compared (`compare`), and the examples (the input format to copy)
- `.cache/leetcode/<slug>.json` → `content`: the full statement, including **Constraints**

### Inputs must be valid

This is the most important rule. Respect every constraint and promise in the statement: value ranges,
lengths, "sorted", "distinct", "exactly one solution", "the answer is unique", "a valid BST", "no cycles", etc.
An invalid input can make the references agree on something a correct solution doesn't have to do.
When a problem promises one answer (Two Sum), construct inputs that guarantee it (see the two-sum spec).

- **edge**: 4–8 hand-picked inputs at the boundaries: the smallest allowed sizes, all-equal values, sorted and
  reverse-sorted, negatives/zero (if allowed), duplicates, the answer at the very start or end, the "impossible"
  or "no answer" case if the problem has one.
- **random**: small (≤ ~30 elements) valid inputs, varied in shape. `count` defaults to 10.

### Speed check (`perf`)

One recipe per parameter (types documented in `runtime/ts/lib/recipe.ts`), sized near the top of the
constraints, so the usual brute force is too slow and the intended solution is fast. Write `about` for the
user, e.g. `"nums of length 100,000"`.

- The limit is set automatically from the references (10×, minimum 0.5s TS / 1.5s Python).
- **Don't punish reasonable recursion**: keep depth ≤ ~5,000 (use `{bst: n}` for trees, not `{chainTree: n}`
  unless the problem is about depth and n ≤ 5,000).
- The input must be valid too (e.g. Two Sum's perf input has exactly one answer).
- Add `slow`: a correct but brute-force TypeScript solution. build-cases checks the limit catches it.
  If the constraints are too small for brute force to be slow (LeetCode accepts it too), leave out `perf`.
- Skip `perf` (null) for problems whose constraints are tiny, or that are exponential by nature (backtracking).

### When a reference is wrong or slow

NeetCode's solutions are good but not perfect. If one crashes, disagrees with the other language and is the
wrong one, or is slower than the intended complexity, add an override: `build/refs/ts/<folder>.ts` (export
the same function/class) or `build/refs/py/<folder>.py` (`class Solution`, or the design class). Keep it the
clean, optimal solution, with a one-line comment saying why it exists.

### Reading the output

```
✓ 1-two-sum: 15 cases kept · speed: ts 0.007s→limit 0.5s, py 0.013s→limit 1.5s · catches the slow solution ✓
⚠ …: something to fix (too many dropped cases, a reference error, a slow reference, the slow solution not caught)
```

`dropped` cases are where the references disagreed or errored. A few is fine if you understand why. Many
usually means invalid inputs.
