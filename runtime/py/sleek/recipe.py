"""Big inputs for the "fast enough?" test, from small recipes (same recipes as runtime/ts/lib/recipe.ts)."""

from __future__ import annotations

import copy
from typing import Any


def _rng(seed: int):
    a = seed & 0xFFFFFFFF

    def rnd() -> float:
        nonlocal a
        a = (a + 0x6D2B79F5) & 0xFFFFFFFF
        t = a
        t = ((t ^ (t >> 15)) * (t | 1)) & 0xFFFFFFFF
        t ^= (t + (((t ^ (t >> 7)) * (t | 61)) & 0xFFFFFFFF)) & 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296

    return rnd


def build(r: Any) -> Any:
    if isinstance(r, list):
        return [build(x) for x in r]
    if not isinstance(r, dict):
        return r
    R = _rng(r.get("seed", 1))

    def num(lo: int, hi: int) -> int:
        return lo + int(R() * (hi - lo + 1))

    if "range" in r:
        start, stop, *rest = r["range"]
        return list(range(start, stop, rest[0] if rest else 1))
    if "ints" in r:
        return [num(r["lo"], r["hi"]) for _ in range(r["ints"])]
    if "distinct" in r:
        seen: dict[int, None] = {}
        while len(seen) < r["distinct"]:
            seen[num(r["lo"], r["hi"])] = None
        return list(seen)
    if "sorted" in r:
        return sorted(build(r["sorted"]))
    if "reverse" in r:
        return list(reversed(build(r["reverse"])))
    if "shuffle" in r:
        xs = list(build(r["shuffle"]))
        for i in range(len(xs) - 1, 0, -1):
            j = int(R() * (i + 1))
            xs[i], xs[j] = xs[j], xs[i]
        return xs
    if "repeat" in r:
        value = build(r["repeat"])
        return [copy.deepcopy(value) for _ in range(r["n"])]
    if "concat" in r:
        return [x for part in r["concat"] for x in build(part)]
    if "list" in r:
        return [build(x) for x in r["list"]]
    if "string" in r:
        a = r["alphabet"]
        return "".join(a[int(R() * len(a))] for _ in range(r["string"]))
    if "text" in r:
        t = r["text"]
        return (t * (r["n"] // len(t) + 1))[: r["n"]]
    if "words" in r:
        a = r["alphabet"]
        return ["".join(a[int(R() * len(a))] for _ in range(num(r["min"], r["max"]))) for _ in range(r["words"])]
    if "grid" in r:
        rows, cols = r["grid"]
        return [[num(r["lo"], r["hi"]) for _ in range(cols)] for _ in range(rows)]
    if "charGrid" in r:
        rows, cols = r["charGrid"]
        a = r["alphabet"]
        return [[a[int(R() * len(a))] for _ in range(cols)] for _ in range(rows)]
    if "intervals" in r:
        out = []
        for _ in range(r["intervals"]):
            s = num(r["lo"], r["hi"] - 1)
            out.append([s, min(r["hi"], s + num(1, r["maxLen"]))])
        return out
    if "edges" in r:
        n = r["n"]
        return [[i, i + 1] if r["edges"] == "chain" else [num(0, i), i + 1] for i in range(n - 1)]
    if "bst" in r:
        out: list[int | None] = []
        level = [(1, r["bst"])]
        while any(a <= b for a, b in level):
            nxt = []
            for a, b in level:
                if a > b:
                    out.append(None)
                    continue
                m = (a + b) // 2
                out.append(m)
                nxt += [(a, m - 1), (m + 1, b)]
            level = nxt
        while out and out[-1] is None:
            out.pop()
        return out
    if "chainTree" in r:
        out = [1]
        for v in range(2, r["chainTree"] + 1):
            out += [None, v]
        return out
    raise ValueError(f"Unknown recipe {str(r)[:80]}")
