export function minMeetingRooms(iv: number[][]) { const s = iv.map((x) => x[0]!).sort((a, b) => a - b), e = iv.map((x) => x[1]!).sort((a, b) => a - b);
  let r = 0, best = 0, j = 0; for (const t of s) { while (e[j]! <= t) { j++; r--; } r++; best = Math.max(best, r); } return best; }
