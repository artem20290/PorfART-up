export type TileInput = { key: string; value: number; [k: string]: unknown };
export type Tile = TileInput & { x: number; y: number; w: number; h: number };

type Rect = { x: number; y: number; w: number; h: number };

function worst(row: number[], length: number, scale: number) {
  if (!row.length || length <= 0) return Infinity;
  const sum = row.reduce((a, b) => a + b, 0) * scale;
  const max = Math.max(...row) * scale;
  const min = Math.min(...row) * scale;
  if (!min || !sum) return Infinity;
  const s2 = sum * sum;
  const l2 = length * length;
  return Math.max((l2 * max) / s2, s2 / (l2 * min));
}

/** Squarified treemap layout (Bruls, Huizing, van Wijk). */
export function squarify(items: TileInput[], width: number, height: number): Tile[] {
  const data = items.filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  const total = data.reduce((a, d) => a + d.value, 0);
  if (!total || width <= 0 || height <= 0) return [];
  if (data.length === 1) {
    return [{ ...data[0], x: 0, y: 0, w: width, h: height }];
  }
  const scale = (width * height) / total;
  const out: Tile[] = [];
  let rect: Rect = { x: 0, y: 0, w: width, h: height };
  let i = 0;

  while (i < data.length) {
    const short = Math.min(rect.w, rect.h);
    const row: number[] = [];
    const rowItems: TileInput[] = [];
    while (i < data.length) {
      const candidate = [...row, data[i].value];
      if (row.length === 0 || worst(candidate, short, scale) <= worst(row, short, scale)) {
        row.push(data[i].value);
        rowItems.push(data[i]);
        i++;
      } else break;
    }
    const rowSum = row.reduce((a, b) => a + b, 0) * scale;
    const thickness = rowSum / short;
    if (rect.w >= rect.h) {
      let y = rect.y;
      rowItems.forEach((it, k) => {
        const h = (row[k] * scale) / thickness;
        out.push({ ...it, x: rect.x, y, w: thickness, h });
        y += h;
      });
      rect = { x: rect.x + thickness, y: rect.y, w: rect.w - thickness, h: rect.h };
    } else {
      let x = rect.x;
      rowItems.forEach((it, k) => {
        const w = (row[k] * scale) / thickness;
        out.push({ ...it, x, y: rect.y, w, h: thickness });
        x += w;
      });
      rect = { x: rect.x, y: rect.y + thickness, w: rect.w, h: rect.h - thickness };
    }
  }
  return out;
}
