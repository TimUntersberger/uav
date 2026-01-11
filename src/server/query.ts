export function parseIsoDateOnly(s: string): Date | null {
  // expects YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function parseBool(v: unknown, defaultValue: boolean): boolean {
  if (v === undefined || v === null) return defaultValue;
  const s = String(v).toLowerCase();
  return s === "true" || s === "1" || s === "yes";
}

export function parseNumber(v: unknown, defaultValue: number): number {
  if (v === undefined || v === null) return defaultValue;
  const n = Number(v);
  return Number.isFinite(n) ? n : defaultValue;
}
