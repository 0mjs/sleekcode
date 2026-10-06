// Comparing your time/space complexity with a problem's target (from its hints).

/** O(N²) / O(n^2) / O(n*n) → one comparable form */
export function norm(s: string): string {
  return s.toLowerCase().replace(/\s|\*|·|×/g, "").replace(/²/g, "^2").replace(/³/g, "^3").replace(/ⁿ/g, "^n")
    .replace(/√n|sqrt\(n\)/g, "sqrtn").replace(/n\^2|n\.n|nn(?!a)/g, "n^2");
}

/** Same complexity? Also treats O(m·n) and O(n·m) as the same */
export const same = (a: string, b: string) => norm(a) === norm(b) || [...norm(a)].sort().join("") === [...norm(b)].sort().join("");

/** The usual growth ladder. A sum of two linear inputs (n + m, V + E) is still linear for ranking. */
const LADDER = ["o(1)", "o(logn)", "o(sqrtn)", "o(n)", "o(nlogn)", "o(n^2)", "o(n^3)", "o(2^n)", "o(n!)"];
export const rank = (s: string) => {
  const n = norm(s).replace(/^o\((n\+m|m\+n|v\+e|e\+v)\)$/, "o(n)").replace(/^o\(\d+\)$/, "o(1)"); // O(26) is constant
  return LADDER.indexOf(n);
};

export type Verdict = "met" | "better" | "worse" | "unknown";

/** How one of your answers compares to the target */
export function verdict(yours: string | undefined, target: string | undefined): Verdict {
  if (!yours || !target) return "unknown";
  if (same(yours, target)) return "met";
  const [y, t] = [rank(yours), rank(target)];
  if (y < 0 || t < 0) return "unknown";
  return y < t ? "better" : y > t ? "worse" : "met";
}

/** The target's time and space, e.g. "aim for O(n + m) time and O(1) space" → ["O(n + m)", "O(1)"] */
export const targetParts = (target: string | null | undefined): [string?, string?] =>
  (target?.replace(/`/g, "").match(/O\([^)]*\)/g) ?? []) as [string?, string?];

/** Your "O(a) / O(b)" against the target: is either part worse? (null when it can't tell) */
export function aboveTarget(complexity: string, target: string | null | undefined): { above: boolean | null; detail: string } {
  const [time, space] = complexity.split("/").map((x) => x.trim());
  const [tTime, tSpace] = targetParts(target);
  const v = [verdict(time, tTime), verdict(space, tSpace)];
  if (v.includes("worse")) {
    const worse = [v[0] === "worse" ? `time ${time}, target ${tTime}` : null, v[1] === "worse" ? `space ${space}, target ${tSpace}` : null].filter(Boolean).join("; ");
    return { above: true, detail: worse };
  }
  if (v.every((x) => x === "unknown")) return { above: null, detail: "" };
  return { above: false, detail: "" };
}
