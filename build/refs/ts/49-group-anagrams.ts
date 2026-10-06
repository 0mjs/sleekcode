// NeetCode's TypeScript file prints to stdout and defines groupAnagrams twice; this is the clean sorted-key solution.
export function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const s of strs) {
    const key = [...s].sort().join("");
    const g = groups.get(key);
    if (g) g.push(s);
    else groups.set(key, [s]);
  }
  return [...groups.values()];
}
