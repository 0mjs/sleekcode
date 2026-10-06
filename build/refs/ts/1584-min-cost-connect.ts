// Override: O(n^2) array-based Prim (optimal for a complete graph); NeetCode's heap version is O(n^2 log n) and sets a limit loose enough for O(n^3)
export function minCostConnectPoints(points: number[][]): number {
  const n = points.length;
  const dist = new Array<number>(n).fill(Infinity);
  const done = new Array<boolean>(n).fill(false);
  dist[0] = 0;
  let total = 0;
  for (let it = 0; it < n; it++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!done[i] && (u < 0 || dist[i]! < dist[u]!)) u = i;
    done[u] = true;
    total += dist[u]!;
    const [ux, uy] = points[u]!;
    for (let v = 0; v < n; v++) {
      if (done[v]) continue;
      const d = Math.abs(ux! - points[v]![0]!) + Math.abs(uy! - points[v]![1]!);
      if (d < dist[v]!) dist[v] = d;
    }
  }
  return total;
}
