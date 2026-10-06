"""SleekCode helpers: build inputs and compare outputs the way LeetCode does."""

from __future__ import annotations

import json
from typing import Any, Iterable


# ---------- linked lists ----------


class ListNode:
    def __init__(self, val: int = 0, next: ListNode | None = None):
        self.val = val
        self.next = next

    def __repr__(self) -> str:
        return f"ListNode({from_list(self)})"


def to_list(values: Iterable[int]) -> ListNode | None:
    """[1, 2, 3] -> 1 -> 2 -> 3"""
    dummy = tail = ListNode()
    for v in values:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next


def from_list(head: ListNode | None) -> list[int]:
    """1 -> 2 -> 3 -> [1, 2, 3] (stops after 10^5 nodes in case of a cycle)"""
    out: list[int] = []
    while head and len(out) < 100_000:
        out.append(head.val)
        head = head.next
    return out


def to_cycle_list(values: list[int], pos: int) -> ListNode | None:
    """[3, 2, 0, -4], pos 1 -> list whose tail links back to index `pos` (-1 = no cycle)"""
    head = to_list(values)
    if pos < 0 or head is None:
        return head
    nodes = []
    node = head
    while node:
        nodes.append(node)
        node = node.next
    nodes[-1].next = nodes[pos]
    return head


# ---------- binary trees ----------


class TreeNode:
    def __init__(self, val: int = 0, left: TreeNode | None = None, right: TreeNode | None = None):
        self.val = val
        self.left = left
        self.right = right

    def __repr__(self) -> str:
        return f"TreeNode({from_tree(self)})"


def to_tree(values: list[int | None]) -> TreeNode | None:
    """LeetCode level-order list -> tree, e.g. [3, 9, 20, None, None, 15, 7]"""
    if not values or values[0] is None:
        return None
    root = TreeNode(values[0])
    queue = [root]
    i = 1
    for node in queue:
        if i >= len(values):
            break
        for side in ("left", "right"):
            if i < len(values) and values[i] is not None:
                child = TreeNode(values[i])
                setattr(node, side, child)
                queue.append(child)
            i += 1
    return root


def from_tree(root: TreeNode | None) -> list[int | None]:
    """Tree -> LeetCode level-order list (trailing Nones trimmed)"""
    out: list[int | None] = []
    queue: list[TreeNode | None] = [root]
    for node in queue:
        out.append(node.val if node else None)
        if node:
            queue.extend([node.left, node.right])
    while out and out[-1] is None:
        out.pop()
    return out


def find_node(root: TreeNode | None, val: int) -> TreeNode | None:
    """First node with the given value (for problems that pass nodes as arguments)."""
    if root is None or root.val == val:
        return root
    return find_node(root.left, val) or find_node(root.right, val)


# ---------- graphs (Clone Graph) ----------


class GraphNode:
    def __init__(self, val: int = 0, neighbors: list[GraphNode] | None = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


def to_graph(adj: list[list[int]]) -> GraphNode | None:
    """Adjacency list (1-indexed values) -> node 1, e.g. [[2, 4], [1, 3], [2, 4], [1, 3]]"""
    if not adj:
        return None
    nodes = [GraphNode(i + 1) for i in range(len(adj))]
    for i, ns in enumerate(adj):
        nodes[i].neighbors = [nodes[v - 1] for v in ns]
    return nodes[0]


def graph_nodes(node: GraphNode | None) -> list[GraphNode]:
    """Every node reachable from `node`, in value order"""
    seen: dict[int, GraphNode] = {}
    stack = [node] if node else []
    while stack:
        n = stack.pop()
        if n.val in seen:
            continue
        seen[n.val] = n
        stack.extend(n.neighbors)
    return [seen[k] for k in sorted(seen)]


def from_graph(node: GraphNode | None) -> list[list[int]]:
    """node 1 -> adjacency list"""
    return [[m.val for m in n.neighbors] for n in graph_nodes(node)]


# ---------- random-pointer lists (Copy List with Random Pointer) ----------


class RandomNode:
    def __init__(self, x: int = 0, next: RandomNode | None = None, random: RandomNode | None = None):
        self.val = int(x)
        self.next = next
        self.random = random


def to_random_list(pairs: list[list[int | None]]) -> RandomNode | None:
    """[[val, random_index or None], ...] -> list"""
    nodes = [RandomNode(v) for v, _ in pairs]
    for i, (_, r) in enumerate(pairs):
        nodes[i].next = nodes[i + 1] if i + 1 < len(nodes) else None
        nodes[i].random = nodes[r] if r is not None else None
    return nodes[0] if nodes else None


def random_list_nodes(head: RandomNode | None) -> list[RandomNode]:
    nodes = []
    while head and len(nodes) < 10_000:
        nodes.append(head)
        head = head.next
    return nodes


def from_random_list(head: RandomNode | None) -> list[list[int | None]]:
    """list -> [[val, random_index or None], ...]"""
    nodes = random_list_nodes(head)
    index = {id(n): i for i, n in enumerate(nodes)}
    return [[n.val, index.get(id(n.random)) if n.random else None] for n in nodes]


# ---------- design problems & comparisons ----------


def run_ops(cls: type, ops: list[str], args: list[list[Any]]) -> list[Any]:
    """Replays a design-problem example:
    run_ops(LRUCache, ["LRUCache", "put", "get"], [[2], [1, 1], [1]]) -> [None, None, 1]
    """
    obj = cls(*args[0])
    return [None] + [getattr(obj, op)(*a) for op, a in zip(ops[1:], args[1:])]


def _key(value: Any) -> str:
    return json.dumps(value, sort_keys=True)


def _lists(value: Any) -> Any:
    """Tuples -> lists (LeetCode accepts either)."""
    return [_lists(v) for v in value] if isinstance(value, (list, tuple)) else value


def any_order(value: list) -> list:
    """Sort the outer list, for answers that may be returned in any order."""
    return sorted(_lists(value), key=_key)


def any_order_deep(value: Any) -> Any:
    """Sort every level, for answers that are sets of sets (subsets, combinations, triplets)."""
    if not isinstance(value, (list, tuple)):
        return value
    return sorted((any_order_deep(v) for v in value), key=_key)


Node = GraphNode  # LeetCode's name in Clone Graph

__all__ = [
    "ListNode", "to_list", "from_list", "to_cycle_list",
    "TreeNode", "to_tree", "from_tree", "find_node",
    "GraphNode", "Node", "to_graph", "from_graph", "graph_nodes",
    "RandomNode", "to_random_list", "from_random_list", "random_list_nodes",
    "run_ops", "any_order", "any_order_deep",
]
