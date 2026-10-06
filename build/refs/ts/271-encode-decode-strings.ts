export const encode = (s: string[]) => s.map((x) => `${x.length}#${x}`).join("");
export function decode(s: string) { const out: string[] = []; let i = 0; while (i < s.length) { const j = s.indexOf("#", i); const n = +s.slice(i, j); out.push(s.slice(j + 1, j + 1 + n)); i = j + 1 + n; } return out; }
