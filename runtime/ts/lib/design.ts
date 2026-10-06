type Ctor = new (...args: any[]) => any;

/**
 * Replays a LeetCode design-problem example:
 *   runOps(LRUCache, ["LRUCache","put","get"], [[2],[1,1],[1]]) -> [null, null, 1]
 */
export function runOps(Class: Ctor, ops: string[], args: unknown[][]): unknown[] {
  const obj = new Class(...(args[0] ?? []));
  const out: unknown[] = [null];
  for (let i = 1; i < ops.length; i++) {
    const result = obj[ops[i]!](...(args[i] ?? []));
    out.push(result === undefined ? null : result);
  }
  return out;
}
