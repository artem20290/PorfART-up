export type EChartsOption = Record<string, any>;
export type ECharts = {
  setOption: (opt: EChartsOption, _flags?: unknown) => void;
  on: (ev: string, fn: (params: any) => void) => void;
  resize: () => void;
  dispose: () => void;
};

type Box = { x: number; y: number; w: number; h: number; data: any };

function val(d: any): number {
  if (d == null) return 0;
  if (typeof d === "number") return d;
  return Number(d.value ?? 0);
}

function colorOf(d: any, fallback: string) {
  return d?.itemStyle?.color || fallback;
}

/** Slice-and-dice treemap */
function layoutTree(nodes: any[], box: Box, acc: Box[]) {
  const items = (nodes || []).filter((n) => val(n) > 0);
  const total = items.reduce((s, n) => s + val(n), 0) || 1;
  const horizontal = box.w >= box.h;
  let cursor = horizontal ? box.x : box.y;
  for (const n of items) {
    const share = val(n) / total;
    const child: Box = horizontal
      ? { x: cursor, y: box.y, w: box.w * share, h: box.h, data: n }
      : { x: box.x, y: cursor, w: box.w, h: box.h * share, data: n };
    cursor += horizontal ? child.w : child.h;
    const kids = n.children as any[] | undefined;
    if (kids?.length) {
      const header = 22;
      acc.push({ ...child, h: Math.min(header, child.h), data: { ...n, __header: true } });
      layoutTree(kids, { x: child.x, y: child.y + header, w: child.w, h: Math.max(0, child.h - header), data: n }, acc);
    } else {
      acc.push(child);
    }
  }
}

function elTooltip(host: HTMLElement) {
  let tip = host.querySelector<HTMLDivElement>("[data-mini-tip]");
  if (!tip) {
    tip = document.createElement("div");
    tip.dataset.miniTip = "1";
    tip.style.cssText =
      "position:absolute;z-index:20;pointer-events:none;display:none;max-width:320px;padding:8px 12px;border-radius:8px;background:#01313d;color:#fff;font:11.5px Inter, Roboto, Arial, sans-serif;box-shadow:0 8px 24px rgba(1,49,61,.35)";
    host.appendChild(tip);
  }
  return tip;
}

function draw(host: HTMLElement, option: EChartsOption, onClick?: (p: any) => void) {
  host.style.position = host.style.position || "relative";
  host.innerHTML = "";
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "width:100%;height:100%;display:block;cursor:default";
  host.appendChild(canvas);
  const tip = elTooltip(host);

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, host.clientWidth);
  const h = Math.max(1, host.clientHeight);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  const hits: Box[] = [];
  const series = (Array.isArray(option.series) ? option.series : option.series ? [option.series] : []) as any[];
  const type = series[0]?.type;

  const pad = option.grid || { left: 8, right: 8, top: 24, bottom: 8 };
  const left = Number(pad.left) || 8;
  const right = Number(pad.right) || 8;
  const top = Number(pad.top) || 8;
  const bottom = Number(pad.bottom) || 8;
  const plot = { x: left + (option.yAxis?.axisLabel?.width ? 90 : 0), y: top, w: w - left - right - (option.yAxis?.axisLabel?.width ? 90 : 0), h: h - top - bottom };

  if (type === "treemap") {
    const data = series[0].data || [];
    const boxes: Box[] = [];
    layoutTree(data, { x: 2, y: 2, w: w - 4, h: h - 4, data: null }, boxes);
    for (const b of boxes) {
      if (b.w < 2 || b.h < 2) continue;
      ctx.fillStyle = colorOf(b.data, "#0b5563");
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = "#fff";
      ctx.font = b.data.__header ? "700 10.5px Inter, Roboto, Arial, sans-serif" : "700 11px Inter, Roboto, Arial, sans-serif";
      ctx.textBaseline = "top";
      const fmt = series[0].label?.formatter;
      const text = typeof fmt === "function" ? String(fmt({ data: b.data, name: b.data.name })) : String(b.data.name || "");
      const lines = text.split("\n").slice(0, 3);
      lines.forEach((line, i) => {
        const clipped = line.length > 22 ? line.slice(0, 21) + "…" : line;
        if (8 + i * 14 < b.h - 4 && b.w > 36) ctx.fillText(clipped, b.x + 6, b.y + 6 + i * 14, b.w - 10);
      });
      hits.push(b);
    }
  } else if (type === "bar") {
    const cats: string[] = option.yAxis?.data || [];
    const n = cats.length || 1;
    const rowH = plot.h / n;
    let max = 1;
    for (const s of series) {
      (s.data || []).forEach((d: any) => {
        max = Math.max(max, val(d));
      });
    }
    if (series.some((s) => s.stack)) {
      max = 1;
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (const s of series) sum += val((s.data || [])[i]);
        max = Math.max(max, sum);
      }
    }
    ctx.font = "10.5px Inter, Roboto, Arial, sans-serif";
    ctx.fillStyle = "#2f5c66";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    cats.forEach((c, i) => {
      const y = plot.y + i * rowH;
      ctx.fillText(String(c).slice(0, 18), plot.x - 8, y + rowH / 2, 88);
      let x = plot.x;
      for (const s of series) {
        const d = (s.data || [])[i];
        const bw = (val(d) / max) * plot.w;
        ctx.fillStyle = colorOf(d, s.itemStyle?.color || "#008b92");
        ctx.fillRect(x, y + rowH * 0.28, Math.max(0, bw), rowH * 0.44);
        hits.push({ x, y: y + rowH * 0.28, w: bw, h: rowH * 0.44, data: typeof d === "object" ? d : { value: d, id: undefined } });
        if (s.stack) x += bw;
      }
    });
    if (option.legend?.show) {
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      let lx = w - 8;
      [...series].reverse().forEach((s) => {
        ctx.fillStyle = s.itemStyle?.color || "#008b92";
        ctx.fillRect(lx - 8, 4, 8, 8);
        ctx.fillStyle = "#2f5c66";
        ctx.font = "10.5px Inter, Roboto, Arial, sans-serif";
        const label = s.name || "";
        ctx.fillText(label, lx - 12, 3);
        lx -= ctx.measureText(label).width + 28;
      });
    }
  } else if (type === "line") {
    const labels: string[] = option.xAxis?.data || [];
    const data: number[] = (series[0].data || []).map((d: any) => val(d));
    const ymin = option.yAxis?.min ?? Math.min(...data, 0);
    const ymax = option.yAxis?.max ?? Math.max(...data, 1);
    const span = ymax - ymin || 1;
    const pts = data.map((v, i) => ({
      x: plot.x + (labels.length <= 1 ? plot.w / 2 : (i / (labels.length - 1)) * plot.w),
      y: plot.y + plot.h - ((v - ymin) / span) * plot.h,
    }));
    ctx.strokeStyle = option.yAxis?.splitLine?.lineStyle?.color || "#d9e3e4";
    ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g++) {
      const gy = plot.y + (plot.h * g) / 4;
      ctx.beginPath();
      ctx.moveTo(plot.x, gy);
      ctx.lineTo(plot.x + plot.w, gy);
      ctx.stroke();
    }
    const lineColor = series[0].lineStyle?.color || "#008b92";
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.lineTo(pts[pts.length - 1].x, plot.y + plot.h);
    ctx.lineTo(pts[0].x, plot.y + plot.h);
    ctx.closePath();
    ctx.fillStyle = series[0].areaStyle?.color?.colorStops?.[0]?.color || "rgba(0,139,146,0.2)";
    ctx.fill();
    pts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      hits.push({ x: p.x - 10, y: p.y - 10, w: 20, h: 20, data: { value: data[i], name: labels[i] } });
    });
    const mark = series[0].markLine?.data?.[0]?.yAxis;
    if (typeof mark === "number") {
      const my = plot.y + plot.h - ((mark - ymin) / span) * plot.h;
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = series[0].markLine.lineStyle?.color || "#fc5a41";
      ctx.beginPath();
      ctx.moveTo(plot.x, my);
      ctx.lineTo(plot.x + plot.w, my);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = series[0].markLine.label?.color || "#fc5a41";
      ctx.font = "9.5px Inter, Roboto, Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(series[0].markLine.label?.formatter || "", plot.x + plot.w, my - 4);
    }
    ctx.fillStyle = option.xAxis?.axisLabel?.color || "#5b7c86";
    ctx.font = "9.5px Inter, Roboto, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    labels.forEach((lb, i) => ctx.fillText(lb, pts[i]?.x ?? 0, plot.y + plot.h + 4));
  } else if (type === "pie") {
    const cx = w / 2;
    const cy = h / 2;
    const min = Math.min(w, h);
    series.forEach((s) => {
      const radius = s.radius || ["70%", "86%"];
      const inner = (parseFloat(radius[0]) / 100) * (min / 2);
      const outer = (parseFloat(radius[1]) / 100) * (min / 2);
      const data = s.data || [];
      const total = data.reduce((sum: number, d: any) => sum + val(d), 0) || 1;
      let a = -Math.PI / 2;
      data.forEach((d: any) => {
        const slice = (val(d) / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, outer, a, a + slice);
        ctx.arc(cx, cy, inner, a + slice, a, true);
        ctx.closePath();
        const c = colorOf(d, "#008b92");
        if (c !== "transparent") {
          ctx.fillStyle = c;
          ctx.fill();
        }
        a += slice;
      });
    });
    if (option.title?.text) {
      ctx.fillStyle = option.title.textStyle?.color || "#01313d";
      ctx.font = `700 ${option.title.textStyle?.fontSize || 26}px JetBrains Mono,monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(option.title.text, cx, cy - 6);
      if (option.title.subtext) {
        ctx.fillStyle = option.title.subtextStyle?.color || "#5b7c86";
        ctx.font = "9.5px Inter, Roboto, Arial, sans-serif";
        ctx.fillText(option.title.subtext, cx, cy + 16);
      }
    }
  }

  const findHit = (x: number, y: number) => hits.find((b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);

  canvas.onmousemove = (ev) => {
    const r = canvas.getBoundingClientRect();
    const x = ev.clientX - r.left;
    const y = ev.clientY - r.top;
    const hit = findHit(x, y);
    const tcfg = option.tooltip;
    if (!hit || tcfg?.show === false) {
      tip.style.display = "none";
      canvas.style.cursor = "default";
      return;
    }
    canvas.style.cursor = onClick && hit.data?.id ? "pointer" : "default";
    const fmt = tcfg?.formatter;
    const name = hit.data?.name || hit.data?.raw?.name || "";
    tip.innerHTML =
      typeof fmt === "function" ? String(fmt({ data: hit.data, name })) : `<b>${name}</b>`;
    tip.style.display = "block";
    const tw = tip.offsetWidth;
    tip.style.left = `${Math.min(x + 12, w - tw - 8)}px`;
    tip.style.top = `${Math.max(8, y - 36)}px`;
  };
  canvas.onmouseleave = () => {
    tip.style.display = "none";
  };
  canvas.onclick = (ev) => {
    const r = canvas.getBoundingClientRect();
    const hit = findHit(ev.clientX - r.left, ev.clientY - r.top);
    if (!hit) return;
    onClick?.({ data: hit.data });
  };
}

export function init(host: HTMLElement): ECharts {
  let option: EChartsOption = {};
  let click: ((p: any) => void) | undefined;
  const api: ECharts = {
    setOption(opt) {
      option = opt || {};
      draw(host, option, click);
    },
    on(ev, fn) {
      if (ev === "click") click = fn;
    },
    resize() {
      if (option) draw(host, option, click);
    },
    dispose() {
      host.innerHTML = "";
    },
  };
  return api;
}

export function use(_mods?: unknown) {
  /* no-op: charts are drawn by the lightweight renderer */
}
