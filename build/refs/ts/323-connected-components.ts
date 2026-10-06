export function countComponents(n: number, e: number[][]) { const p = [...Array(n).keys()]; const f = (x: number): number => (p[x] === x ? x : (p[x] = f(p[x]!)));
  let c = n; for (const [a, b] of e) { const x = f(a!), y = f(b!); if (x !== y) { p[x] = y; c--; } } return c; }
