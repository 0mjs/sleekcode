const byJSON = (a: unknown, b: unknown) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : 1);

/** Sort the outer array, for answers that may be returned "in any order". */
export function anyOrder<T>(value: T[]): T[] {
  return [...value].sort(byJSON);
}

/** Sort every level, for answers that are sets of sets (subsets, combinations, triplets). */
export function anyOrderDeep<T>(value: T): T {
  if (!Array.isArray(value)) return value;
  return value.map(anyOrderDeep).sort(byJSON) as T;
}
