// NeetCode's TypeScript version uses indexOf in a loop (O(n²)); this is the O(n) counting solution.
export function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count = new Map<string, number>();
  for (const ch of s) count.set(ch, (count.get(ch) ?? 0) + 1);
  for (const ch of t) {
    const n = count.get(ch) ?? 0;
    if (n === 0) return false;
    count.set(ch, n - 1);
  }
  return true;
}
