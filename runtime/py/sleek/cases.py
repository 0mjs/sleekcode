"""Runs a problem's cases (examples + extra edge/random cases) against your solution.
Shared by the tests (testing.py), `sk play` (play.py) and the speed check (perf.py)."""

from __future__ import annotations

import copy
import json
from typing import Any

from . import any_order, any_order_deep, from_list, from_tree, run_ops, to_list, to_tree


def _to_arg(type_: str, v: Any) -> Any:
    if type_ == "ListNode":
        return to_list(v)
    if type_ == "TreeNode":
        return to_tree(v)
    if type_ == "ListNode[]":
        return [to_list(x) for x in v]
    return v


def _from_value(type_: str, v: Any) -> Any:
    if type_ == "ListNode":
        return from_list(v)
    if type_ == "TreeNode":
        return from_tree(v)
    return v


def run(file: dict, module: Any, input_: list) -> Any:
    """Calls your solution with a case's input; returns its answer in LeetCode's JSON form."""
    call = file["call"]
    if call["kind"] == "design":
        return run_ops(getattr(module, call["className"]), input_[0], copy.deepcopy(input_[1]))
    method = getattr(module.Solution(), call["name"])
    args = [_to_arg(p["type"], copy.deepcopy(v)) for p, v in zip(call["params"], input_)]
    result = method(*args)
    if call["returns"] == "void":
        return _from_value(call["params"][0]["type"], args[0])
    return _from_value(call["returns"], result)


def normalize(compare: str, v: Any) -> Any:
    """What gets compared: tuples → lists, floats rounded, order removed where it doesn't matter."""

    def clean(x: Any) -> Any:
        if isinstance(x, bool) or x is None:
            return x
        if isinstance(x, float):
            return int(x) if x.is_integer() and compare != "float" else x
        if isinstance(x, (list, tuple)):
            return [clean(i) for i in x]
        return x

    x = clean(v)
    if compare == "anyOrder" and isinstance(x, list):
        return any_order(x)
    if compare == "anyOrderDeep":
        return any_order_deep(x)
    return x  # validators compare in same()


def _longest_palindrome(input_: list, actual: Any, expected: Any) -> bool:
    """5. Longest Palindromic Substring: any palindrome in s of the longest length is accepted"""
    s = input_[0]
    return isinstance(actual, str) and len(actual) == len(expected) and actual in s and actual == actual[::-1]


# For the few problems where more than one answer is correct (same set in runtime/ts/lib/cases.ts)
VALIDATORS = {"longestPalindrome": _longest_palindrome}


def close(a: Any, b: Any) -> bool:
    """Numbers within 1e-5 (absolute or relative) count as equal, like LeetCode's checker for decimal answers"""
    if isinstance(a, (int, float)) and isinstance(b, (int, float)) and not isinstance(a, bool):
        return abs(a - b) <= 1e-5 * max(1.0, abs(b))
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)):
        return len(a) == len(b) and all(close(x, y) for x, y in zip(a, b))
    return a == b


def same(file: dict, actual: Any, expected: Any, input_: list | None = None) -> bool:
    if file["compare"].startswith("validator:"):
        return VALIDATORS[file["compare"][10:]](input_ or [], actual, expected)
    if file["compare"] == "float":
        return close(normalize("exact", actual), expected)
    return normalize(file["compare"], actual) == normalize(file["compare"], expected)


def short(v: Any, n: int = 70) -> str:
    s = json.dumps(v, separators=(",", ":"), default=str)
    return s if len(s) <= n else s[: n - 1] + "…"


def preview(file: dict, input_: list, n: int = 70) -> str:
    """nums = [2,7,11,15], target = 9"""
    call = file["call"]
    if call["kind"] == "design":
        return short(input_[0], n)
    params = call["params"]
    each = max(12, n // max(1, len(params)))
    return ", ".join(f"{p['name']} = {short(v, each)}" for p, v in zip(params, input_))
