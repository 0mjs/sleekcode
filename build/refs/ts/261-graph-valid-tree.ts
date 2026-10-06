export function validTree(n: number, e: number[][]) { if (e.length !== n - 1) return false; const p = [...Array(n).keys()]; const f = (x: number): number => (p[x] === x ? x : (p[x] = f(p[x]!)));
  for (const [a, b] of e) { const x = f(a!), y = f(b!); if (x === y) return false; p[x] = y; } return true; }
