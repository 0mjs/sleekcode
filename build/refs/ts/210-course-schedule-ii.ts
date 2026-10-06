export function findOrder(n: number, pre: number[][]) { const adj: number[][] = Array.from({ length: n }, () => []), deg = Array(n).fill(0);
  for (const [a, b] of pre) { adj[b!]!.push(a!); deg[a!]++; } const q = deg.flatMap((d, i) => (d ? [] : [i]));
  for (let i = 0; i < q.length; i++) for (const x of adj[q[i]!]!) if (--deg[x] === 0) q.push(x); return q.length === n ? q : []; }
