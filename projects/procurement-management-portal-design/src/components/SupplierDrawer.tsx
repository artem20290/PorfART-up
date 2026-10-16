import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Ban,
  BadgeCheck,
  FileStack,
  ScrollText,
  UserCheck,
} from "lucide-react";
import type { Action, PO, Supplier } from "../data/model";
import { money, pct, pctDelta, ruDate, usd, usd2 } from "../lib/format";
import { BenchBars } from "./charts";
import { Btn, CloseBtn, Flag, MiniBar, Panel, TableShell, Th } from "./ui";
import { cn } from "../utils/cn";

type Props = {
  supplier: Supplier;
  pos: PO[];
  actions: Action[];
  openPO: PO | null;
  onOpenPO: (po: PO | null) => void;
  onClose: () => void;
  onAssign: (supplier: Supplier, po: PO | null) => void;
  onFilter: (kind: "owner" | "reason" | "site" | "category", value: string) => void;
  onAudit: (scope: string) => void;
};

export default function SupplierDrawer({
  supplier,
  pos,
  actions,
  openPO,
  onOpenPO,
  onClose,
  onAssign,
  onFilter,
  onAudit,
}: Props) {
  const spend = pos.reduce((a, p) => a + p.amount, 0);
  const off = pos.reduce((a, p) => a + p.offAmount, 0);
  const offPos = pos.filter((p) => p.offContract);
  const coverage = spend ? 1 - off / spend : 1;

  const owners = useMemo(() => {
    const map = new Map<string, number>();
    pos.forEach((p) => map.set(p.owner, (map.get(p.owner) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [pos]);

  const sites = useMemo(() => {
    const map = new Map<string, number>();
    pos.forEach((p) => map.set(p.site, (map.get(p.site) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([s]) => s);
  }, [pos]);

  const sortedPos = useMemo(
    () => pos.slice().sort((a, b) => b.offAmount - a.offAmount || b.amount - a.amount),
    [pos],
  );

  return (
    <div className="live-overlay live-overlay--drawer" onClick={onClose} role="presentation">
      <aside
        className="live-drawer tpl-drawer supplier-drawer"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="live-drawer-head supplier-drawer-head">
          <div className="min-w-0 flex-1">
            <div className="supplier-drawer-eyebrow">
              <FileStack className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              {openPO ? (
                <button type="button" className="supplier-drawer-eyebrow-btn" onClick={() => onOpenPO(null)}>
                  Поставщик
                </button>
              ) : (
                <span>Поставщик</span>
              )}
              {openPO && <span className="num text-ink-3">/ {openPO.id}</span>}
            </div>
            <h2 className="supplier-drawer-title">
              <span>{supplier.name}</span>
              {supplier.offContract ? (
                <Flag tone="warn" dot>
                  вне контракта · {supplier.reason}
                </Flag>
              ) : (
                <Flag tone="ok">в рамках политики</Flag>
              )}
            </h2>
          </div>
          <div className="supplier-drawer-head-actions">
            <Btn
              variant="line"
              size="xs"
              icon={<ScrollText className="h-3.5 w-3.5" />}
              onClick={() => onAudit(`Поставщик · ${supplier.name}`)}
            >
              Аудит
            </Btn>
            <Btn variant="alert" size="xs" icon={<ArrowRight className="h-3.5 w-3.5" />} onClick={() => onAssign(supplier, openPO)}>
              Назначить действие
            </Btn>
            <CloseBtn onClick={onClose} />
          </div>
        </div>

        {openPO ? (
          <PODetail
            po={openPO}
            onBack={() => onOpenPO(null)}
            onAssign={() => onAssign(supplier, openPO)}
            onAudit={onAudit}
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="supplier-drawer-stats">
              <Cell label="Расходы Q3" value={money(spend)} sub={`${pos.length} заказов · ${offPos.length} вне рамок`} />
              <Cell
                label="Вне контракта"
                value={money(off)}
                tone="warn"
                sub={`${pct(spend ? off / spend : 0, 0)} расходов`}
              />
              <Cell
                label="Покрытие договором"
                value={pct(coverage, 0)}
                sub={<MiniBar value={coverage} tone="brand" />}
              />
              <Cell
                label="Причина отклонения"
                value={<span className="text-[13px] font-semibold leading-[18px]">{supplier.reason ?? "—"}</span>}
                tone={supplier.reason ? "warn" : undefined}
                sub={
                  supplier.reason ? (
                    <button type="button" className="supplier-drawer-link" onClick={() => onFilter("reason", supplier.reason!)}>
                      фильтровать квартал по причине
                    </button>
                  ) : (
                    "все заказы по действующим договорам"
                  )
                }
              />
            </div>

            <div className="supplier-drawer-chips">
              <span className="supplier-drawer-chips-label">Владельцы заказов</span>
              {owners.map(([o, n]) => (
                <button key={o} type="button" onClick={() => onFilter("owner", o)} className="supplier-drawer-chip">
                  {o} {n}
                </button>
              ))}
              <span className="supplier-drawer-chips-gap" aria-hidden />
              <span className="supplier-drawer-chips-label">Площадки</span>
              {sites.slice(0, 4).map((s) => (
                <button key={s} type="button" onClick={() => onFilter("site", s)} className="supplier-drawer-chip">
                  {s}
                </button>
              ))}
            </div>

            {actions.length > 0 && (
              <div className="border-b border-[#f6c3b7] bg-alert-soft/50 px-5 py-2.5">
                <div className="eyebrow text-[#c0371f]">Назначенные действия · {actions.length}</div>
                <ul className="mt-2 space-y-1.5">
                  {actions.map((a) => (
                    <li key={a.id} className="num flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-ink-2">
                      <span className="text-ink-3">{a.id}</span>
                      <span className="font-sans font-bold text-ink">{a.type}</span>
                      <span>{a.assignee}</span>
                      <span>до {ruDate(a.due)}</span>
                      <span className="font-bold text-[#c0371f]">{money(a.value)}</span>
                      {a.poId && <span className="text-ink-3">{a.poId}</span>}
                      <Flag tone={a.status === "Закрыто" ? "ok" : a.status === "В работе" ? "mute" : "alert"}>
                        {a.status}
                      </Flag>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="supplier-drawer-pos">
              <div className="supplier-drawer-pos-head">
                <h3>Заказы на поставку</h3>
                <span className="meta num">
                  {pos.length} заказов · {money(spend)}
                </span>
              </div>
              <div className="supplier-drawer-table">
                <TableShell compact>
                  <table className="sb-table-grid">
                    <colgroup>
                      <col className="c-po" />
                      <col className="c-date" />
                      <col className="c-site" />
                      <col className="c-owner" />
                      <col className="c-status" />
                      <col className="c-sum" />
                      <col className="c-off" />
                      <col className="c-go" />
                    </colgroup>
                    <thead>
                      <tr>
                        <Th>Заказ</Th>
                        <Th>Дата</Th>
                        <Th>Площадка</Th>
                        <Th>Владелец</Th>
                        <Th>Статус политики</Th>
                        <Th align="right">Сумма</Th>
                        <Th align="right">Вне контракта</Th>
                        <Th align="right"></Th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPos.map((p) => (
                        <tr
                          key={p.id}
                          onClick={() => onOpenPO(p)}
                          className="group cursor-pointer transition-colors hover:bg-brand-soft/40"
                        >
                          <td className="num font-bold text-ink group-hover:text-brand">{p.id}</td>
                          <td className="num text-ink-2">{ruDate(p.date)}</td>
                          <td className="text-ink-2">{p.site}</td>
                          <td className="text-ink-2">{p.owner}</td>
                          <td>
                            {p.offContract ? (
                              <Flag tone="warn" dot>
                                {p.reason}
                              </Flag>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10.5px] text-ink-3">
                                <BadgeCheck className="h-3.5 w-3.5 text-brand" />
                                {p.contract ?? "по договору"}
                              </span>
                            )}
                          </td>
                          <td className="num text-right text-ink">{usd(p.amount)}</td>
                          <td className={cn("num text-right", p.offAmount > 0 ? "supplier-drawer-off" : "text-ink-3")}>
                            {p.offAmount > 0 ? usd(p.offAmount) : "—"}
                          </td>
                          <td className="text-right">
                            <ArrowUpRight className="inline h-3.5 w-3.5 text-brand opacity-80 group-hover:opacity-100" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Cell({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "warn";
}) {
  return (
    <div className="supplier-drawer-stat">
      <div className="supplier-drawer-stat-label">{label}</div>
      <div className={cn("supplier-drawer-stat-value", tone === "warn" && "is-warn")}>{value}</div>
      <div className="supplier-drawer-stat-sub">{sub}</div>
    </div>
  );
}

function PODetail({
  po,
  onBack,
  onAssign,
  onAudit,
}: {
  po: PO;
  onBack: () => void;
  onAssign: () => void;
  onAudit: (s: string) => void;
}) {
  const [showApprovals, setShowApprovals] = useState(true);
  const benchTotal = po.lines.reduce((a, l) => a + l.benchmark * l.qty, 0);
  const total = po.lines.reduce((a, l) => a + l.amount, 0);
  const delta = benchTotal ? total / benchTotal - 1 : 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white px-5 py-2">
        <button type="button" onClick={onBack} className="btn btn-ghost btn-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          к поставщику
        </button>
        <div className="num flex flex-wrap items-center gap-x-4 text-[11px] text-ink-3">
          <span>{ruDate(po.date)}</span>
          <span>{po.site}</span>
          <span>{po.owner}</span>
          <span>{po.contract ?? "без договора"}</span>
          <Btn variant="line" size="xs" icon={<ScrollText className="h-3 w-3" />} onClick={() => onAudit(`Заказ · ${po.id}`)}>
            История изменений
          </Btn>
        </div>
      </div>

      <div className="supplier-drawer-stats">
        <Cell label="Сумма заказа" value={usd(total)} sub={`${po.lines.length} позиций`} />
        <Cell label="Рыночный бенчмарк" value={usd(benchTotal)} sub="согласованный прайс-лист" />
        <Cell
          label="Отклонение"
          value={pctDelta(delta, 0)}
          tone={delta > 0.02 ? "warn" : undefined}
          sub={`${usd(Math.round(total - benchTotal))} сверх бенчмарка`}
        />
        <Cell
          label="Статус политики"
          value={
            <span className="text-[13px] font-semibold leading-[18px]">
              {po.offContract ? po.reason : "Соответствует"}
            </span>
          }
          tone={po.offContract ? "warn" : undefined}
          sub={po.offContract ? "проверка контракта не выполнена" : "контракт подтверждён"}
        />
      </div>

      <div className="px-5 py-3.5">
        <div className="mb-2 flex items-end justify-between gap-3">
          <h3 className="m-0 text-[13px] font-bold tracking-tight text-ink">Позиции заказа против бенчмарка</h3>
          <span className="num text-[10.5px] text-ink-3">строки выше ±6 % подсвечены как отклонение</span>
        </div>

        <TableShell compact>
          <table className="sb-table-grid">
            <thead>
              <tr>
                <Th>Позиция</Th>
                <Th>Код</Th>
                <Th align="right">Кол-во</Th>
                <Th align="right">Цена</Th>
                <Th align="right">Бенчмарк</Th>
                <Th align="right">Δ</Th>
                <Th align="right">Сумма</Th>
              </tr>
            </thead>
            <tbody>
              {po.lines.map((l) => {
                const d = l.unitPrice / l.benchmark - 1;
                const hot = d > 0.06;
                return (
                  <tr
                    key={l.id}
                    className={cn(
                      "border-b border-line/70 transition-colors last:border-0 hover:bg-surface/70",
                      hot && "bg-alert-soft/45",
                    )}
                  >
                    <td className="px-3 py-2 text-[11.5px] font-medium text-ink">
                      {l.item}
                      {hot && (
                        <span className="ml-2 inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#c0371f]">
                          <Ban className="h-3 w-3" />
                          выше согласованной
                        </span>
                      )}
                    </td>
                    <td className="num px-3 py-2 text-[11px] text-ink-3">{l.code}</td>
                    <td className="num px-3 py-2 text-right text-[11.5px] text-ink-2">
                      {l.qty} {l.unit}
                    </td>
                    <td className="num px-3 py-2 text-right text-[11.5px] font-bold text-ink">{usd2(l.unitPrice)}</td>
                    <td className="num px-3 py-2 text-right text-[11.5px] text-ink-3">{usd2(l.benchmark)}</td>
                    <td className={cn("num px-3 py-2 text-right text-[11.5px] font-bold", hot ? "text-alert" : "text-ink-3")}>
                      {pctDelta(d, 0)}
                    </td>
                    <td className="num px-3 py-2 text-right text-[11.5px] text-ink">{usd(l.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-surface/80">
                <td colSpan={6} className="px-3 py-2 text-right text-[10px] tracking-[0.08em] text-ink-3 uppercase">
                  Итого по заказу
                </td>
                <td className="num px-3 py-2 text-right text-[12.5px] font-bold text-ink">{usd(total)}</td>
              </tr>
            </tfoot>
          </table>
        </TableShell>

        <Panel className="mt-4" eyebrow="Визуально" title="Цена против рынка по позициям">
          <div className="px-2 py-2">
            <BenchBars lines={po.lines} />
          </div>
        </Panel>

        <div className="accordion mt-4">
          <details open={showApprovals} onToggle={(e) => setShowApprovals((e.target as HTMLDetailsElement).open)}>
            <summary>Цепочка согласования · {po.approvals.length} подписи</summary>
            <div className="acc-body">
              <ol className="m-0 space-y-3 p-0">
                {po.approvals.map((a, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="num mt-[3px] text-[12px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-ink">
                        {a.name} <span className="font-medium text-ink-3">· {a.role}</span>
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 text-[13px]",
                          a.note.includes("не выполнена") || a.note.includes("без проверки")
                            ? "font-semibold text-[#c0371f]"
                            : "",
                        )}
                      >
                        {a.note}
                      </div>
                    </div>
                    <span className="num shrink-0 text-[12px] text-ink-3">{a.at}</span>
                  </li>
                ))}
              </ol>
            </div>
          </details>
        </div>

        <div className="sb-alert sb-alert--info mt-4 mb-6">
          <span className="sb-alert-icon" aria-hidden>
            <UserCheck className="h-[18px] w-[18px]" />
          </span>
          <div className="sb-alert-body">
            <strong>Нужно решение по заказу</strong>
            <p>
              Заказ выходит за рамки политики на <span className="num font-bold">{usd(po.offAmount)}</span>. Назначьте
              корректирующее действие до совещания по закупкам.
            </p>
          </div>
          <Btn variant="alert" onClick={onAssign}>
            <UserCheck className="h-3.5 w-3.5" />
            Назначить действие по заказу
          </Btn>
        </div>
      </div>
    </div>
  );
}
