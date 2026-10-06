import { INSPECT, showList } from "./inspect";

export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
  /** console.log(head) → ListNode(1 → 2 → 3) */
  [INSPECT]() {
    return `ListNode(${showList(this)})`;
  }
  toString() {
    return `ListNode(${showList(this)})`;
  }
}

/** [1,2,3] -> 1 -> 2 -> 3 */
export function toList(values: number[]): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  for (const v of values) tail = tail.next = new ListNode(v);
  return dummy.next;
}

/** 1 -> 2 -> 3 -> [1,2,3] (stops after 10^5 nodes in case of a cycle) */
export function fromList(head: ListNode | null): number[] {
  const out: number[] = [];
  for (let n = head; n && out.length < 100_000; n = n.next) out.push(n.val);
  return out;
}

/** [3,2,0,-4], pos 1 -> list whose tail links back to index `pos` (-1 = no cycle) */
export function toCycleList(values: number[], pos: number): ListNode | null {
  const head = toList(values);
  if (pos < 0) return head;
  let target: ListNode | null = null;
  let tail = head;
  for (let i = 0; tail; i++) {
    if (i === pos) target = tail;
    if (!tail.next) break;
    tail = tail.next;
  }
  if (tail) tail.next = target;
  return head;
}
