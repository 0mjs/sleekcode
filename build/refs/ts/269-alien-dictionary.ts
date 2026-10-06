export function alienOrder(w: string[]) { const adj = new Map<string, Set<string>>(); for (const c of w.join("")) adj.set(c, adj.get(c) ?? new Set());
  for (let i = 0; i + 1 < w.length; i++) { const a = w[i]!, b = w[i + 1]!; const j = [...a].findIndex((c, k) => c !== b[k]);
    if (j === -1) { if (a.length > b.length) return ""; continue; } if (j >= b.length) return ""; adj.get(a[j]!)!.add(b[j]!); }
  const st = new Map<string, number>(), out: string[] = []; const dfs = (c: string): boolean => { if (st.get(c) === 1) return false; if (st.get(c) === 2) return true;
    st.set(c, 1); for (const d of adj.get(c)!) if (!dfs(d)) return false; st.set(c, 2); out.push(c); return true; };
  for (const c of adj.keys()) if (!dfs(c)) return ""; return out.reverse().join(""); }
