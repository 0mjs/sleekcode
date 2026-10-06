import { RandomNode } from "../../lib";
export function copyRandomList(h: RandomNode | null) { const m = new Map<RandomNode | null, RandomNode | null>([[null, null]]);
  for (let n = h; n; n = n.next) m.set(n, new RandomNode(n.val));
  for (let n = h; n; n = n.next) { m.get(n)!.next = m.get(n.next)!; m.get(n)!.random = m.get(n.random)!; } return m.get(h)!; }
