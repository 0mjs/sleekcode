export function canAttendMeetings(iv: number[][]) { const s = [...iv].sort((a, b) => a[0]! - b[0]!); return s.every((x, i) => i === 0 || s[i - 1]![1]! <= x[0]!); }
