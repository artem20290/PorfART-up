import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { money, pct, usd } from "../lib/format";
import { P, offColor } from "../lib/palette";
import { squarify } from "../lib/treemap";

export type MapNode = {
  id: string;
  name: string;
  kind: "category" | "supplier" | "po";
  spend: number;
  off: number;
  count: number;
  children?: MapNode[];
};

const MONO = "ui-monospace, Consolas, monospace";
const SANS = "'Inter', 'Roboto', Arial, sans-serif";

export function wrapTileName(str: string, maxCharsPerLine = 13): string {
  if (!str) return "";
  if (str.length <= maxCharsPerLine) return str;
  if (str.includes("-") && !str.includes(" ")) {
    const idx = str.indexOf("-");
    if (idx >= 3 && idx < str.length - 2) {
      return str.slice(0, idx + 1) + "\n" + str.slice(idx + 1);
    }
  }
  const words = str.split(/\s+/);
  if (words.length <= 1) return str;
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if (!current) current = w;
    else if ((current + " " + w).length <= maxCharsPerLine) current += " " + w;
    else {
      lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  if (lines.length > 2) return lines[0] + "\n" + lines.slice(1).join(" ");
  return lines.join("\n");
}

type LaidTile = {
  id: string;
  kind: MapNode["kind"];
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  node: MapNode;
  nested: boolean;
  chrome?: "frame" | "head";
};

function tileColor(n: MapNode, mode: "spend" | "off") {
  const share = n.spend ? n.off / n.spend : 0;
  if (n.children?.length) return P.deep2;
  if (mode === "off") {
    if (share > 0.55) return P.alert;
    if (share > 0.2) return "#e8734f";
  }
  return offColor(share);
}

function layoutTiles(
  nodes: MapNode[],
  x: number,
  y: number,
  w: number,
  h: number,
  mode: "spend" | "off",
  gap: number,
): LaidTile[] {
  const items = nodes
    .map((n) => ({ key: n.id, value: mode === "off" ? n.off : n.spend, node: n }))
    .filter((d) => d.value > 0);
  const innerW = Math.max(0, w - gap);
  const innerH = Math.max(0, h - gap);
  if (!items.length || innerW < 4 || innerH < 4) return [];
  const laid = squarify(items, innerW, innerH);
  const out: LaidTile[] = [];
  for (const t of laid) {
    const node = t.node as MapNode;
    const tx = x + t.x + gap / 2;
    const ty = y + t.y + gap / 2;
    const tw = Math.max(0, t.w - gap / 2);
    const th = Math.max(0, t.h - gap / 2);
    const kids = node.children;
    if (kids?.length && th > 72 && tw > 88) {
      const head = 40;
      out.push({
        id: `${node.id}::frame`,
        kind: node.kind,
        x: tx,
        y: ty,
        w: tw,
        h: th,
        color: P.deep2,
        node,
        nested: false,
        chrome: "frame",
      });
      out.push({
        id: node.id,
        kind: node.kind,
        x: tx,
        y: ty,
        w: tw,
        h: head,
        color: P.deep2,
        node,
        nested: true,
        chrome: "head",
      });
      out.push(...layoutTiles(kids, tx + 3, ty + head + 2, tw - 6, th - head - 5, mode, 3));
    } else {
      out.push({
        id: node.id,
        kind: node.kind,
        x: tx,
        y: ty,
        w: tw,
        h: th,
        color: tileColor(node, mode),
        node,
        nested: false,
      });
    }
  }
  return out;
}

export function SpendMap({
  nodes,
  mode,
  onPick,
  height = 460,
}: {
  nodes: MapNode[];
  mode: "spend" | "off";
  onPick: (id: string, kind: MapNode["kind"]) => void;
  height?: number;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: height });
  const [tip, setTip] = useState<{ n: MapNode; x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const id = window.setTimeout(measure, 50);
    return () => {
      ro.disconnect();
      window.clearTimeout(id);
    };
  }, [height]);

  const tiles = useMemo(
    () => layoutTiles(nodes, 0, 0, size.w, size.h, mode, 4),
    [nodes, mode, size.w, size.h],
  );

  return (
    <div
      ref={hostRef}
      className="relative w-full overflow-hidden rounded-[10px]"
      style={{ height, background: "var(--neutral-bg, #eef2f4)" }}
      onMouseLeave={() => setTip(null)}
    >
      {tiles.map((t) => {
        const n = t.node;
        const v = money(mode === "off" ? n.off : n.spend);
        const share = n.spend ? n.off / n.spend : 0;
        const showLabel = t.w > 52 && t.h > 28;
        const lines = wrapTileName(n.name, t.w > 140 ? 16 : 11).split("\n");
        if (t.chrome === "frame") {
          return (
            <div
              key={t.id}
              className="pointer-events-none absolute"
              style={{
                left: t.x,
                top: t.y,
                width: t.w,
                height: t.h,
                background: t.color,
                borderRadius: 10,
              }}
            />
          );
        }
        return (
          <button
            key={`${t.id}:${Math.round(t.x)}:${Math.round(t.y)}`}
            type="button"
            className={
              t.nested
                ? "absolute z-[2] overflow-hidden text-left text-white"
                : "absolute z-[1] overflow-hidden text-left text-white transition-[box-shadow] duration-150 hover:z-10 hover:shadow-[0_8px_20px_rgba(11,42,48,0.28)]"
            }
            style={{
              left: t.x,
              top: t.y,
              width: t.w,
              height: t.h,
              background: t.color,
              borderRadius: t.nested ? "8px 8px 6px 6px" : 8,
              border: t.nested ? "none" : "1.5px solid rgba(255,255,255,0.92)",
              padding: t.nested ? 0 : "6px 8px",
            }}
            onClick={() => onPick(n.id, n.kind)}
            onMouseEnter={(e) => {
              const host = hostRef.current?.getBoundingClientRect();
              if (!host) return;
              setTip({ n, x: e.clientX - host.left + 12, y: e.clientY - host.top - 8 });
            }}
            onMouseMove={(e) => {
              const host = hostRef.current?.getBoundingClientRect();
              if (!host) return;
              setTip({ n, x: e.clientX - host.left + 12, y: e.clientY - host.top - 8 });
            }}
          >
            {t.nested ? (
              <span
                className="flex h-full min-w-0 items-center gap-2 px-3"
                style={{ fontFamily: SANS }}
                title={`${n.name} · ${v}`}
              >
                <span className="min-w-0 flex-1 truncate text-[13px] font-bold leading-none tracking-tight">
                  {n.name}
                </span>
                {t.w > 132 && (
                  <span className="shrink-0 text-[12px] font-semibold leading-none tabular-nums opacity-90">
                    {v}
                  </span>
                )}
              </span>
            ) : (
              showLabel && (
                <span className="block" style={{ fontFamily: SANS }}>
                  {lines.map((line) => (
                    <span key={line} className="block truncate text-[11px] font-bold leading-[15px]">
                      {line}
                    </span>
                  ))}
                  <span className="mt-0.5 block text-[10.5px] font-semibold leading-tight opacity-90">
                    {v}
                    {mode !== "off" && share > 0.08 ? ` (${pct(share, 0)} вне)` : ""}
                  </span>
                </span>
              )
            )}
          </button>
        );
      })}
      {tip && (
        <div
          className="pointer-events-none absolute z-20 max-w-[320px] rounded-[8px] px-3 py-2 text-[11px] text-white shadow-[0_8px_24px_rgba(11,42,48,0.35)]"
          style={{
            left: Math.min(tip.x, Math.max(8, size.w - 280)),
            top: Math.max(8, tip.y),
            background: P.deep,
            fontFamily: SANS,
          }}
        >
          <div className="mb-1 text-[12.5px] font-bold">{tip.n.name}</div>
          <div className="flex flex-wrap gap-3" style={{ fontFamily: MONO }}>
            <span>
              Объём: <b>{usd(tip.n.spend)}</b>
            </span>
            <span style={{ color: "#ff8b76" }}>
              Вне условий: <b>{usd(tip.n.off)}</b> ({pct(tip.n.spend ? tip.n.off / tip.n.spend : 0, 1)})
            </span>
            <span style={{ color: "#8fb6bd" }}>{tip.n.count} PO</span>
          </div>
        </div>
      )}
    </div>
  );
}
