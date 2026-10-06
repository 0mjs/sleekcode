"""Runs a problem's cases (examples + extra edge/random cases) against your solution.
Shared by the tests (testing.py), `sk play` (play.py) and the speed check (perf.py)."""

from __future__ import annotations

import copy
import json
from typing import Any

from . import (
    any_order, any_order_deep, find_node, from_graph, from_list, from_random_list, from_tree, graph_nodes,
    random_list_nodes, run_ops, to_cycle_list, to_graph, to_list, to_random_list, to_tree,
)


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


# How LeetCode runs the problems that need more than "call a method, compare the result".
# Each returns the answer in JSON form, or a message saying what's wrong. (Same set in runtime/ts/lib/cases.ts.)


def _has_cycle(m, values, pos):  # 141: values + pos (where the tail links back; -1 = none)
    return m.Solution().hasCycle(to_cycle_list(values, pos))


def _lca(m, tree, p, q):  # 235: p and q are values; your method receives those nodes
    root = to_tree(tree)
    node = m.Solution().lowestCommonAncestor(root, find_node(root, p), find_node(root, q))
    return node.val if node else None


def _clone_graph(m, adj):  # 133: a deep copy, sharing no nodes with the original
    original = to_graph(adj)
    copy_ = m.Solution().cloneGraph(original)
    originals = {id(n) for n in graph_nodes(original)}
    if any(id(n) in originals for n in graph_nodes(copy_)):
        return "not a copy: it shares nodes with the original graph"
    return from_graph(copy_)


def _copy_random_list(m, pairs):  # 138: a deep copy; the original left unchanged
    original = to_random_list(pairs)
    copy_ = m.Solution().copyRandomList(original)
    originals = {id(n) for n in random_list_nodes(original)}
    for n in random_list_nodes(copy_):
        if id(n) in originals or (n.random is not None and id(n.random) in originals):
            return "not a copy: it points into the original list"
    if from_random_list(original) != pairs:
        return "the original list was changed"
    return from_random_list(copy_)


def _serialize_tree(m, tree):  # 297: any format, as long as it round-trips
    codec = m.Codec()
    data = codec.serialize(to_tree(tree))
    if not isinstance(data, str):
        return "serialize must return a string"
    return from_tree(m.Codec().deserialize(data))


def _encode_decode(m, strs):  # 271: any encoding, as long as it round-trips
    encoded = m.Solution().encode(list(strs))
    if not isinstance(encoded, str):
        return "encode must return a single string"
    return m.Solution().decode(encoded)


ADAPTERS = {
    "hasCycle": _has_cycle, "lowestCommonAncestor": _lca, "cloneGraph": _clone_graph,
    "copyRandomList": _copy_random_list, "serializeTree": _serialize_tree, "encodeDecode": _encode_decode,
}


def run(file: dict, module: Any, input_: list) -> Any:
    """Calls your solution with a case's input; returns its answer in LeetCode's JSON form."""
    call = file["call"]
    if call["kind"] == "design":
        return run_ops(getattr(module, call["className"]), input_[0], copy.deepcopy(input_[1]))
    if call["kind"] == "custom":
        return ADAPTERS[call["adapter"]](module, *copy.deepcopy(input_))
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


def _course_order(input_: list, actual: Any, expected: Any) -> bool:
    """210. Course Schedule II: any order with every prerequisite first; [] exactly when impossible"""
    n, prereqs = input_
    if not isinstance(actual, list):
        return False
    if not expected:
        return actual == []
    if sorted(actual) != list(range(n)):
        return False
    at = {c: i for i, c in enumerate(actual)}
    return all(at[pre] < at[course] for course, pre in prereqs)


def _alien_order(input_: list, actual: Any, expected: Any) -> bool:
    """269. Alien Dictionary: any letter order consistent with the words; "" exactly when there's none"""
    (words,) = input_
    if not isinstance(actual, str):
        return False
    if expected == "":
        return actual == ""
    if sorted(actual) != sorted(set("".join(words))):
        return False
    rank = {ch: i for i, ch in enumerate(actual)}
    for a, b in zip(words, words[1:]):
        for x, y in zip(a, b):
            if x != y:
                if rank[x] > rank[y]:
                    return False
                break
    return True


# For the few problems where more than one answer is correct (same set in runtime/ts/lib/cases.ts)
VALIDATORS = {"longestPalindrome": _longest_palindrome, "courseOrder": _course_order, "alienOrder": _alien_order}


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
