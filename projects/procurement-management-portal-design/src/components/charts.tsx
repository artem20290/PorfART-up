import { money, pctDelta, usd2 } from "../lib/format";
import { useEchart } from "../lib/hooks";
import { P } from "../lib/palette";

export type { MapNode } from "./SpendMap";
export { SpendMap, wrapTileName } from "./SpendMap";

const MONO = "ui-monospace, Consolas, monospace";
const SANS = "'Inter', 'Roboto', Arial, sans-serif";

/* ── Поставщики: покрыто против вне контракта ─────────────────────── */
export function OffBars({
  rows,
  onPick,
}: {
  rows: { id: string; label: string; covered: number; off: number }[];
  onPick: (id: string) => void;
  height?: number;
}) {
  const max = Math.max(...rows.map((r) => r.covered + r.off), 1);
  return (
    <div>
      <div className="flex justify-end gap-3 px-4 pt-2 text-[10.5px] text-ink-2">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px]" style={{ background: "rgba(0,139,146,0.5)" }} />
          по договору
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px]" style={{ background: P.alert }} />
          вне контракта
        </span>
      </div>
      <ul className="divide-y divide-line/70">
        {rows.map((r) => {
          const total = r.covered + r.off;
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onPick(r.id)}
                className="group w-full px-4 py-2.5 text-left transition-colors hover:bg-brand-soft/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="min-w-0 whitespace-normal break-words text-[12px] font-medium leading-snug text-ink group-hover:text-brand">
                    {r.label}
                  </span>
                  <span className="num shrink-0 pt-0.5 text-[11.5px] font-bold text-alert">{money(r.off)}</span>
                </div>
                <div className="mt-1.5 flex h-[8px] w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full shrink-0"
                    style={{ width: `${(r.covered / max) * 100}%`, background: "rgba(0,139,146,0.5)" }}
                  />
                  <div
                    className="h-full shrink-0"
                    style={{ width: `${(r.off / max) * 100}%`, background: P.alert }}
                  />
                </div>
                <div className="num mt-1 text-[10px] text-ink-3">
                  {money(total)} всего · {money(r.covered)} по договору
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Динамика доли контролируемых расходов ────────────────────────── */
export function CoverageTrend({
  points,
  forecast,
  dark,
  height = 150,
}: {
  points: { q: string; v: number }[];
  forecast: number;
  dark?: boolean;
  height?: number;
}) {
  const { hostRef } = useEchart(() => {
    const data = [...points.map((p) => p.v * 100), forecast * 100];
    const labels = [...points.map((p) => p.q), "Q4 прогноз"];
    const axis = dark ? "rgba(255,255,255,0.5)" : P.ink3;
    const split = dark ? "rgba(255,255,255,0.09)" : P.line;
    return {
      grid: { left: 4, right: 8, top: 20, bottom: 2, containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: dark ? "#0b5563" : P.deep,
        borderWidth: 0,
        textStyle: { color: "#fff", fontSize: 11.5, fontFamily: SANS },
        valueFormatter: (v: any) => `${Number(v).toFixed(1)} %`,
      },
      xAxis: {
        type: "category",
        data: labels,
        boundaryGap: false,
        axisLine: { lineStyle: { color: split } },
        axisTick: { show: false },
        axisLabel: { fontFamily: SANS, fontSize: 9.5, color: axis },
      },
      yAxis: {
        type: "value",
        min: 76,
        max: 100,
        splitLine: { lineStyle: { color: split } },
        axisLabel: { fontFamily: MONO, fontSize: 9.5, color: axis, formatter: "{value}%" },
      },
      series: [
        {
          type: "line",
          smooth: 0.4,
          symbol: "circle",
          symbolSize: 7,
          data,
          lineStyle: { width: 2.5, color: dark ? "#5fd3da" : P.brand },
          itemStyle: { color: dark ? "#5fd3da" : P.brand, borderColor: dark ? P.deep : "#fff", borderWidth: 2 },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: dark ? "rgba(95,211,218,0.34)" : "rgba(0,139,146,0.24)" },
                { offset: 1, color: "rgba(0,139,146,0)" },
              ],
            },
          },
          markLine: {
            silent: true,
            symbol: "none",
            label: {
              formatter: "цель 96 %",
              position: "insideEndTop",
              fontFamily: SANS,
              fontSize: 9.5,
              color: dark ? "#ffb3a3" : P.alert,
            },
            lineStyle: { color: dark ? "rgba(252,90,65,0.75)" : P.alert, type: "dashed", width: 1.2 },
            data: [{ yAxis: 96 }],
          },
        },
      ],
    };
  }, [points, forecast, dark]);
  return <div ref={hostRef} style={{ height }} className="w-full" />;
}

/* ── Позиции заказа против бенчмарка ──────────────────────────────── */
export function BenchBars({
  lines,
}: {
  lines: { id: string; item: string; unitPrice: number; benchmark: number; qty: number }[];
  height?: number;
}) {
  const max = Math.max(...lines.map((l) => Math.max(l.unitPrice, l.benchmark)), 1);
  return (
    <div>
      <div className="flex justify-end gap-3 px-3 pt-1 pb-1 text-[10.5px] text-ink-2">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px]" style={{ background: P.alert }} />
          цена заказа
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px]" style={{ background: "rgba(0,139,146,0.85)" }} />
          бенчмарк рынка
        </span>
      </div>
      <ul className="divide-y divide-line/70">
        {lines.map((l) => {
          const over = l.unitPrice > l.benchmark * 1.02;
          return (
            <li key={l.id} className="px-3 py-2.5">
              <div className="whitespace-normal break-words text-[12px] font-medium leading-snug text-ink">{l.item}</div>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-[7px] min-w-0 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(l.unitPrice / max) * 100}%`, background: P.alert }}
                    />
                  </div>
                  <span className="num w-[72px] shrink-0 text-right text-[11px] font-semibold text-alert">
                    {usd2(l.unitPrice)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-[7px] min-w-0 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(l.benchmark / max) * 100}%`, background: "rgba(0,139,146,0.85)" }}
                    />
                  </div>
                  <span className="num w-[72px] shrink-0 text-right text-[11px] font-semibold text-ink-2">
                    {usd2(l.benchmark)}
                  </span>
                </div>
              </div>
              {over && (
                <div className="num mt-1 text-[10.5px] font-semibold text-alert">
                  выше рынка на {pctDelta(l.benchmark ? l.unitPrice / l.benchmark - 1 : 0, 0)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Кольцо покрытия договором ────────────────────────────────────── */
export function CoverageDonut({
  coverage,
  label,
  dark,
  size = 132,
}: {
  coverage: number;
  label: string;
  dark?: boolean;
  size?: number;
}) {
  const { hostRef } = useEchart(
    () => ({
      title: {
        text: `${(coverage * 100).toFixed(0)}%`,
        subtext: label,
        left: "center",
        top: "center",
        textStyle: {
          color: dark ? "#fff" : P.deep,
          fontFamily: MONO,
          fontSize: 26,
          fontWeight: 700,
        },
        subtextStyle: { color: dark ? "rgba(255,255,255,0.55)" : P.ink3, fontFamily: SANS, fontSize: 9.5 },
      },
      tooltip: { show: false },
      series: [
        {
          type: "pie",
          radius: ["70%", "86%"],
          avoidLabelOverlap: true,
          silent: true,
          label: { show: false },
          data: [
            { value: coverage, itemStyle: { color: dark ? "#5fd3da" : P.brand } },
            { value: 1 - coverage, itemStyle: { color: dark ? "rgba(255,255,255,0.12)" : "#e2eaea" } },
          ],
        },
        {
          type: "pie",
          radius: ["58%", "60%"],
          silent: true,
          label: { show: false },
          data: [
            { value: 0.11, itemStyle: { color: P.alert } },
            { value: 0.89, itemStyle: { color: "transparent" } },
          ],
        },
      ],
    }),
    [coverage, dark, label],
  );
  return <div ref={hostRef} style={{ width: size, height: size }} />;
}
