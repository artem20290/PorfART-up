export const P = {
  deep: "#0b2a30",
  deep2: "#12343b",
  brand: "#008f95",
  brand2: "#00a8af",
  brandSoft: "rgba(0, 143, 149, 0.10)",
  alert: "#e67e22",
  alertSoft: "#fcefe0",
  sheet: "#ffffff",
  surface: "#f2f7f6",
  ink2: "#41636a",
  ink3: "#6c9098",
  line: "#d7dee1",
};

/** Смешивание с белым для светлых оттенков и с петролем для тёмных. */
export function mix(hex: string, target: string, t: number) {
  const a = parseInt(hex.slice(1), 16);
  const b = parseInt(target.slice(1), 16);
  const ch = (i: number) => Math.round((((a >> i) & 255) * (1 - t) + ((b >> i) & 255) * t));
  return "#" + [ch(16), ch(8), ch(0)].map((v) => v.toString(16).padStart(2, "0")).join("");
}

/** Цвет сегмента по доле расходов вне политики. */
export function offColor(share: number, alpha = 1) {
  if (share <= 0.02) return mix(P.brand, P.sheet, 0.16);
  if (share <= 0.08) return mix(P.brand, P.sheet, 0.42);
  const t = Math.min(1, (share - 0.08) / 0.5);
  const c = mix(P.deep2, P.alert, 0.35 + t * 0.65);
  if (alpha >= 1) return c;
  const n = parseInt(c.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}
