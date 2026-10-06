# Big O cheatsheet

Everything you need for the NeetCode 150, and nothing you don't. The list is finite: **8 classes, 7 rules,
1 rule for space, 5 traps.** Learn those and you can read the complexity off any solution in this repo.

Big O doesn't measure speed. It measures **shape**: when the input gets 10× bigger, does the work stay the
same, grow 10×, or grow 100×? Keep the fastest-growing term, drop the constants:
`3n² + 5n + 20 → O(n²)`.

---

## 1. The 8 classes (best → worst)

| Class | Name | The code shape | At n = 1,000,000 | Largest n in ~1 second |
| --- | --- | --- | --- | --- |
| **O(1)** | constant | no loop over the input | 1 | anything |
| **O(log n)** | logarithmic | halve the problem each step | 20 | anything |
| **O(n)** | linear | one pass | 1,000,000 | ~100,000,000 |
| **O(n log n)** | linearithmic | sort, or halving × a pass | 20,000,000 | ~5,000,000 |
| **O(n²)** | quadratic | loop inside a loop | 10¹² | ~10,000 |
| **O(n³)** | cubic | three nested loops | 10¹⁸ | ~500 |
| **O(2ⁿ)** | exponential | try every subset | ∞ | ~25 |
| **O(n!)** | factorial | try every ordering | ∞ | ~11 |

In between, you'll only ever meet **two inputs**: `O(n + m)`, `O(n · m)`, `O(V + E)` for graphs, `O(n · k)`.
Never merge them into one letter.

---

## 2. The 7 rules (time)

Go through these in order. They give the right answer for nearly any function.

1. **Name the inputs.** What can grow? An array is `n`; a second array is `m`; a grid is `m × n`; a graph is `V` and `E`; a string is its length.
2. **Find every loop, including the hidden ones** (`includes`, `indexOf`, `slice`, `sort`, `in` on a list… see §5).
3. **Count iterations.** `i++` → n. `i *= 2` or `i /= 2` → log n. A fixed number (26 letters, 4 directions) → 1.
4. **Nested? Multiply.** n inside n = n². log n inside n = n log n.
5. **One after another? Add.** n + n = 2n = O(n). The biggest term wins.
6. **Recursion? Count the calls.** Work = number of calls × work per call (see §4).
7. **Simplify.** Drop constants and smaller terms: `2n² + 10n → n²`. Keep different inputs: `n + m` stays.

**Sanity check:** imagine n doubling. Twice the work → O(n). Four times → O(n²). One more step → O(log n).

## 3. The 1 rule for space

> **What do I create that grows with the input?** (Not counting the answer you return.)

| You create… | Extra space |
| --- | --- |
| a few variables, two pointers | **O(1)** |
| a hash map / set / array of the input's size | **O(n)** |
| a 2D DP table / visited grid | **O(m · n)** |
| recursion `d` levels deep | **O(d)**: the call stack counts. Balanced tree → O(log n); a chain / linked list → O(n) |
| a fixed-size array (26 letters) | **O(1)** |

---

## 4. Shapes → answers, with code

**O(1): no loop over the input**
```ts
const first = nums[0];           // index lookup
const has = seen.has(x);         // Set / Map lookup (average)
```

**O(log n): halve every step**
```ts
let lo = 0, hi = nums.length - 1;
while (lo <= hi) {               // the range halves each time → log n steps
  const mid = (lo + hi) >> 1;
  if (nums[mid] === target) return mid;
  if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
}
```

**O(n): one pass (even with several pointers)**
```ts
const seen = new Map<number, number>();
for (let i = 0; i < nums.length; i++) {           // n
  if (seen.has(target - nums[i])) return [seen.get(target - nums[i])!, i]; // O(1) each
  seen.set(nums[i], i);
}
// time O(n), space O(n)
```
Two pointers and sliding windows are O(n) too: each pointer only moves forward, so together they make at
most 2n steps, **even though there's a loop inside a loop**:
```ts
for (let r = 0; r < s.length; r++) {     // r moves n times in total
  while (window.has(s[r])) window.delete(s[l++]);   // l moves at most n times in TOTAL
  window.add(s[r]);
}
// O(n), not O(n²): count the total moves, not "a loop inside a loop"
```

**O(n log n): sort first, or a heap**
```ts
intervals.sort((a, b) => a[0] - b[0]);   // n log n
for (const iv of intervals) { /* … */ }  // + n  → O(n log n)
```

**O(n²): every pair**
```ts
for (let i = 0; i < n; i++)
  for (let j = i + 1; j < n; j++)        // n(n-1)/2 pairs → still O(n²)
    if (nums[i] + nums[j] === target) return [i, j];
```

**O(2ⁿ): include it or not, for every element (subsets)**
```ts
function dfs(i: number, path: number[]) {
  if (i === nums.length) { out.push([...path]); return; }
  path.push(nums[i]); dfs(i + 1, path); path.pop();   // take it
  dfs(i + 1, path);                                    // skip it
}
// 2 choices × n levels = 2ⁿ calls; × n to copy each subset → O(n · 2ⁿ)
```

**O(n!): every ordering (permutations)**: n choices, then n−1, then n−2… = n!.

### Recursion: count the calls

| Recursion shape | Calls | Example |
| --- | --- | --- |
| one call, `n − 1` | n | linked list recursion → O(n) |
| one call, `n / 2` | log n | binary search → O(log n) |
| two calls, `n − 1` | **2ⁿ** | naive Fibonacci, climbing stairs without memo |
| two calls, `n / 2`, plus O(n) work | n log n | merge sort |
| visits each node once | n | tree DFS / BFS → O(n) |
| **with memo** | number of distinct states | climbing stairs with memo → O(n) |

**The memo rule (all of dynamic programming):**
> **time = number of states × work per state · space = number of states**

```ts
// LCS: a state per (i, j) → m · n states, O(1) work each → O(m · n) time and space
dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
```
Coin change: amount × coins states → O(amount · coins). Word break: n positions × n end points → O(n²)
(× word length for the substring check).

**Master theorem** (divide and conquer only), for `T(n) = a·T(n/b) + O(nᵈ)`:

| Compare `a` with `bᵈ` | Answer | Example |
| --- | --- | --- |
| `a < bᵈ` | O(nᵈ) | `T(n/2) + n` → O(n) |
| `a = bᵈ` | O(nᵈ log n) | merge sort (2, 2, 1) → O(n log n); binary search (1, 2, 0) → O(log n) |
| `a > bᵈ` | O(n^log_b a) | Karatsuba (3, 2, 1) → O(n^1.58) |

---

## 5. Hidden loops: one line, many steps

If it has to look at every element, it's O(n). These are the lines that look free and aren't.

| TypeScript | Python | Cost |
| --- | --- | --- |
| `arr.includes(x)`, `arr.indexOf(x)` | `x in my_list`, `my_list.index(x)` | **O(n)**. Use a `Set` / `set` for O(1) |
| `arr.slice()`, `[...arr]`, `str.slice()` | `my_list[:]`, `s[a:b]` | **O(k)**: copies k elements |
| `arr.shift()`, `arr.unshift(x)` | `my_list.pop(0)`, `insert(0, x)` | **O(n)**: shifts everything. Use a deque / index pointer |
| `arr.sort()` | `sorted()`, `.sort()` | **O(n log n)** |
| `str += x` in a loop | `s += x` in a loop | can be **O(n²)** in total. Build a list, then `join` |
| `Math.min(...arr)`, `arr.reduce` | `min(xs)`, `sum(xs)` | **O(n)** |
| `Object.keys(o)`, `[...map.keys()]` | `list(d.keys())` | **O(n)** |
| `map.get/set/has`, `set.add/has` | `d[k]`, `k in d`, `s.add(x)` | **O(1)** average |
| `arr.push(x)`, `arr.pop()` | `append`, `pop()` | **O(1)** (amortised) |
| heap push / pop | `heapq.heappush/heappop` | **O(log n)** |

## 6. Data structures: the operations you'll use

| Structure | Lookup | Insert / delete | Notes |
| --- | --- | --- | --- |
| Array | O(1) by index, O(n) by value | O(1) at the end, O(n) elsewhere | |
| Hash map / set | **O(1)** | **O(1)** | average; the go-to fix for O(n²) |
| Linked list | O(n) | O(1) once you're at the node | |
| Stack / queue (deque) | top/front O(1) | O(1) | |
| Heap | peek min/max O(1) | O(log n) | building from n items: O(n) |
| Balanced BST | O(log n) | O(log n) | |
| Trie | O(word length) | O(word length) | |
| Union-find | ≈ O(1) | ≈ O(1) | with path compression |
| Graph BFS / DFS | – | – | O(V + E) total |

---

## 7. NeetCode patterns → their usual complexity

| Pattern | Usual time | Usual space |
| --- | --- | --- |
| Arrays & Hashing | O(n) | O(n) |
| Two Pointers | O(n) (O(n log n) if you sort first) | O(1) |
| Sliding Window | O(n) | O(1) or O(alphabet) |
| Stack (incl. monotonic) | O(n): each item pushed and popped once | O(n) |
| Binary Search | O(log n), or O(n log range) for "search the answer" | O(1) |
| Linked List | O(n) | O(1) |
| Trees | O(n): visit each node once | O(h): the height |
| Tries | O(total characters) | O(total characters) |
| Heap / Priority Queue | O(n log k) or O(n log n) | O(k) or O(n) |
| Backtracking | O(2ⁿ), O(n!), O(4^L)… | O(n) recursion depth |
| Graphs | O(V + E), or O(m · n) for grids | O(V) or O(m · n) |
| Advanced Graphs (Dijkstra, Prim) | O(E log V) | O(V + E) |
| 1-D DP | O(n) or O(n · choices) | O(n), often O(1) with two variables |
| 2-D DP | O(m · n) | O(m · n), often O(n) with one row |
| Greedy | O(n), or O(n log n) with a sort | O(1) |
| Intervals | O(n log n): sort by start | O(n) |
| Math & Geometry | varies, usually O(n) or O(m · n) | O(1) |
| Bit Manipulation | O(1) or O(n) | O(1) |

## 8. The constraints tell you the target

LeetCode's limits are a hint. About 10⁸ simple steps run in a second, so:

| Constraint on n | The intended solution is about | Think |
| --- | --- | --- |
| n ≤ 10 | O(n!) | permutations |
| n ≤ 20 | O(2ⁿ) | subsets, backtracking |
| n ≤ 500 | O(n³) | triple loops, interval DP |
| n ≤ 5,000 | O(n²) | 2-D DP, pairs |
| n ≤ 10⁵ – 10⁶ | O(n log n) or O(n) | sort, heap, hash map, two pointers |
| n ≤ 10⁹ (or the answer range) | O(log n) or O(1) | binary search, maths |

## 9. The 5 traps

1. **"A loop inside a loop is always n²."** Not if the inner pointer never goes back (sliding window, monotonic stack): count *total* moves.
2. **Merging two inputs.** Two arrays are `O(n + m)`, not `O(n)`. A grid is `O(m · n)`.
3. **Forgetting the call stack.** Recursion `n` deep is O(n) space even if it stores nothing.
4. **Hidden copies.** `slice`, spreading, `str +=` in a loop, `pop(0)`: see §5.
5. **Counting the output.** The answer you return usually isn't "extra" space. Say it out loud: "O(1) extra, not counting the output."

---

## The 20-second routine (before every `sk log`)

1. **Point at each loop** in your solution, including hidden ones. How many times does it run? Is it inside another loop?
2. **Point at each thing you create.** Does it grow with the input? Is there recursion?
3. Say it: **"O(…) time, O(…) space."**
4. `sk log` checks you against the target. When you're wrong, find the line that made the difference.
