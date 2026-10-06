export function wallsAndGates(g: number[][]) { const q: number[][] = []; g.forEach((r, i) => r.forEach((v, j) => v === 0 && q.push([i, j])));
  for (let k = 0; k < q.length; k++) { const [i, j] = q[k]!; for (const [a, b] of [[1,0],[-1,0],[0,1],[0,-1]]) { const x = i! + a!, y = j! + b!;
    if (g[x]?.[y] === 2147483647) { g[x]![y] = g[i!]![j!]! + 1; q.push([x, y]); } } } }
