export const toArray = <T>(x?: T[] | null): T[] =>
  Array.isArray(x) ? x : [];

export function pickLargestByAmount<T extends { tokenAmount?: number }>(
  transfers: T[]
): T | null {
  let best: T | null = null;
  let bestAmt = -Infinity;

  for (const t of transfers) {
    const amt = t.tokenAmount ?? 0;
    if (amt > bestAmt) {
      best = t;
      bestAmt = amt;
    }
  }
  return best;
}

export function sumTokenAmount<T extends { tokenAmount?: number }>(
  transfers: T[]
): number {
  let sum = 0;
  for (const t of transfers) sum += t.tokenAmount ?? 0;
  return sum;
}
