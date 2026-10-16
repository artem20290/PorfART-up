export function money(v: number, opts: { compact?: boolean; sign?: boolean } = {}) {
  const { compact = true } = opts;
  const abs = Math.abs(v);
  if (compact) {
    if (abs >= 1_000_000) return `$${(v / 1_000_000).toFixed(abs >= 10_000_000 ? 1 : 2)} млн`;
    if (abs >= 1_000) return `$${Math.round(v / 1000)}K`;
    return `$${v.toFixed(0)}`;
  }
  return "$" + v.toLocaleString("ru-RU", { maximumFractionDigits: 0 }).replace(/\u00A0/g, " ");
}

export const usd = (v: number) =>
  "$" + v.toLocaleString("en-US", { maximumFractionDigits: 0 }).replace(/,/g, " ");

export const usd2 = (v: number) =>
  "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, " ");

export const pct = (v: number, digits = 1) => `${(v * 100).toFixed(digits)} %`;

export const pctDelta = (v: number, digits = 0) =>
  `${v >= 0 ? "+" : "−"}${(Math.abs(v) * 100).toFixed(digits)} %`;

export function ruDate(iso: string) {
  const [y, m, d] = iso.split(" ")[0].split("-");
  return `${d}.${m}.${y}`;
}

export const num = (v: number) => v.toLocaleString("ru-RU").replace(/\u00A0/g, " ");
