import { ArrowRight, CircleCheck, Clock3, Gauge } from "lucide-react";
import type { Action } from "../data/model";
import { money, pct, ruDate, usd } from "../lib/format";
import type { Agg } from "../lib/select";
import { CoverageTrend, OffBars } from "./charts";
import { Btn, Flag, MiniBar, Panel } from "./ui";

export function CoveragePanel({
  coverageNow,
  coverageForecast,
  addressed,
  actionsCount,
  trend,
  onAudit,
}: {
  coverageNow: number;
  coverageForecast: number;
  addressed: number;
  actionsCount: number;
  trend: { q: string; v: number }[];
  onAudit: () => void;
}) {
  return (
    <Panel
      eyebrow="Итог цикла"
      title="Показатель контролируемых расходов"
      right={
        <Btn variant="line" size="xs" icon={<Gauge className="h-3.5 w-3.5" />} onClick={onAudit}>
          След
        </Btn>
      }
    >
      <div className="px-4 py-3.5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="num text-[34px] leading-none font-bold text-ink">{pct(coverageNow, 0)}</div>
            <div className="mt-1.5 text-[10.5px] tracking-[0.06em] text-ink-3 uppercase">расходов по договору сегодня</div>
          </div>
          <div className="text-right">
            <div className="num text-[22px] leading-none font-bold text-brand">{pct(coverageForecast, 0)}</div>
            <div className="mt-1 text-[10.5px] tracking-[0.06em] text-ink-3 uppercase">прогноз после действий</div>
          </div>
        </div>

        <div className="relative mt-3 h-[7px] w-full overflow-hidden rounded-[1px] bg-surface-2">
          <div className="absolute inset-y-0 left-0 bg-brand/35 transition-[width] duration-700" style={{ width: `${coverageForecast * 100}%` }} />
          <div className="absolute inset-y-0 left-0 bg-ink transition-[width] duration-700" style={{ width: `${coverageNow * 100}%` }} />
          <div className="absolute inset-y-0 w-[2px] bg-alert" style={{ left: "96%" }} />
        </div>
        <div className="num mt-1.5 flex justify-between text-[10px] text-ink-3">
          <span>факт</span>
          <span className="text-alert">цель 96 %</span>
        </div>

        <div className="mt-3.5">
          <CoverageTrend points={trend} forecast={coverageForecast} height={132} />
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3 text-[11px]">
          <Row k="Действий назначено" v={String(actionsCount)} />
          <Row k="Сумма под контролем" v={money(addressed)} alert />
          <Row k="Решений в журнале" v={String(actionsCount + 5)} />
          <Row k="Следующий обзор" v="14.10.2025" />
        </dl>
      </div>
    </Panel>
  );
}

function Row({ k, v, alert }: { k: string; v: string; alert?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-ink-3">{k}</dt>
      <dd className={`num font-bold ${alert ? "text-alert" : "text-ink"}`}>{v}</dd>
    </div>
  );
}

export function BreakdownList({
  title,
  subtitle,
  data,
  total,
  onPick,
  valueKey = "off",
  unitLabel,
}: {
  title: string;
  subtitle?: string;
  data: Agg[];
  total: number;
  onPick: (a: Agg) => void;
  valueKey?: "off" | "spend";
  unitLabel?: string;
}) {
  const rows = data.slice(0, 6);
  const max = Math.max(...rows.map((r) => (valueKey === "off" ? r.off : r.spend)), 1);
  return (
    <Panel eyebrow={unitLabel} title={title} subtitle={subtitle}>
      <ul className="divide-y divide-line/70">
        {rows.map((r) => {
          const v = valueKey === "off" ? r.off : r.spend;
          return (
            <li key={r.key}>
              <button onClick={() => onPick(r)} className="group w-full px-4 py-[9px] text-left transition-colors hover:bg-brand-soft/40">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-[11.5px] font-medium text-ink group-hover:text-brand">{r.label}</span>
                  <span className="num shrink-0 text-[11.5px] font-bold text-alert">
                    {money(v)}
                    <span className="ml-1.5 font-normal text-ink-3">{pct(total ? v / total : 0, 0)}</span>
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1">
                    <MiniBar value={v / max} tone={valueKey === "off" ? "alert" : "brand"} />
                  </div>
                  <span className="num w-[54px] text-right text-[10px] text-ink-3">{r.count} PO</span>
                </div>
              </button>
            </li>
          );
        })}
        {rows.length === 0 && <li className="px-4 py-5 text-[11.5px] text-ink-3">Нет данных в текущем срезе</li>}
      </ul>
    </Panel>
  );
}

export function OffPanel({
  rows,
  onPick,
}: {
  rows: { id: string; label: string; covered: number; off: number }[];
  onPick: (id: string) => void;
}) {
  return (
    <Panel
      eyebrow="Каскад · уровень 2"
      title="Крупнейшие поставщики вне согласованных условий"
      subtitle="Оранжевое — сумма, требующая решения до совещания по закупкам."
    >
      <OffBars rows={rows} onPick={onPick} />
    </Panel>
  );
}

export function ActionQueue({
  actions,
  onOpen,
  onAudit,
}: {
  actions: Action[];
  onOpen: (a: Action) => void;
  onAudit: () => void;
}) {
  const total = actions.reduce((a, x) => a + x.value, 0);
  return (
    <Panel
      eyebrow="Очередь недели"
      title="Панель действий"
      subtitle="Корректирующая работа, не выходя из режима просмотра."
      right={
        <Btn variant="line" size="xs" onClick={onAudit}>
          Журнал
        </Btn>
      }
      bodyClass="flex flex-col"
    >
      <ul className="max-h-[300px] flex-1 divide-y divide-line/70 overflow-y-auto">
        {actions.map((a) => (
          <li key={a.id}>
            <button onClick={() => onOpen(a)} className="group w-full px-4 py-2.5 text-left transition-colors hover:bg-surface/80">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-ink transition-colors group-hover:text-brand">
                    {a.type}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </div>
                  <div className="num mt-0.5 truncate text-[10.5px] text-ink-3">
                    {a.supplier}
                    {a.poId ? ` · ${a.poId}` : ""}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="num text-[11.5px] font-bold text-alert">{money(a.value)}</div>
                  <div className="num mt-0.5 flex items-center justify-end gap-1 text-[10px] text-ink-3">
                    <Clock3 className="h-3 w-3" />
                    {ruDate(a.due)}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Flag tone={a.status === "Закрыто" ? "ok" : a.status === "В работе" ? "mute" : "alert"} dot={a.status !== "Закрыто"}>
                  {a.status}
                </Flag>
                <span className="text-[10.5px] text-ink-3">{a.assignee}</span>
              </div>
            </button>
          </li>
        ))}
        {actions.length === 0 && (
          <li className="px-4 py-6 text-[11.5px] leading-snug text-ink-3">
            Действий пока нет. Откройте поставщика вне контракта и назначьте исполнителя со сроком — действие появится здесь и в
            карточке поставщика.
          </li>
        )}
      </ul>
      {actions.length > 0 && (
        <div className="flex items-center justify-between border-t border-line bg-surface/70 px-4 py-2">
          <span className="num text-[10.5px] text-ink-3">{actions.length} действий в работе</span>
          <span className="num flex items-center gap-1.5 text-[11.5px] font-bold text-alert">
            <CircleCheck className="h-3.5 w-3.5 text-brand" />
            {usd(total)}
          </span>
        </div>
      )}
    </Panel>
  );
}
