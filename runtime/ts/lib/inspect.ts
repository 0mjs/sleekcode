// How SleekCode's node classes look when you console.log them.
export const INSPECT = Symbol.for("nodejs.util.inspect.custom");

type ListLike = { val: number; next: ListLike | null };
type TreeLike = { val: number; left: TreeLike | null; right: TreeLike | null };

/** 1 → 2 → 3, or 1 → 2 → 3 → ↺ 2 when the tail loops back */
export function showList(head: ListLike | null, limit = 60): string {
  const seen = new Map<ListLike, number>();
  const parts: string[] = [];
  for (let n = head; n; n = n.next) {
    if (seen.has(n)) return parts.join(" → ") + ` → ↺ ${n.val}`;
    if (parts.length >= limit) return parts.join(" → ") + " → …";
    seen.set(n, parts.length);
    parts.push(String(n.val));
  }
  return parts.length ? parts.join(" → ") : "(empty)";
}

/**
 *  3
 *  ├─ 9
 *  └─ 20
 *     ├─ 15
 *     └─ 7
 * A missing left child shows as ·, so left and right stay unambiguous.
 */
export function showTree(root: TreeLike | null, limit = 120): string {
  if (!root) return "(empty tree)";
  const lines: string[] = [];
  let count = 0;
  const walk = (node: TreeLike | null, prefix: string, last: boolean, top: boolean) => {
    if (count++ > limit) return;
    lines.push(top ? String(node ? node.val : "·") : `${prefix}${last ? "└─ " : "├─ "}${node ? node.val : "·"}`);
    if (!node || (!node.left && !node.right)) return;
    const next = top ? "" : prefix + (last ? "   " : "│  ");
    walk(node.left, next, false, false);
    walk(node.right, next, true, false);
  };
  walk(root, "", true, true);
  if (count > limit) lines.push("…");
  return lines.join("\n");
}
