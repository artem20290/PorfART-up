import { useMemo, useState } from "react";
import {
  ShieldAlert,
  Ban,
  BadgeCheck,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import type { Supplier, PO, Action } from "../data/model";
import { money, pct, usd } from "../lib/format";
import { Btn, FieldSearch, Flag, Panel, Stat, Switch, TableShell, Th } from "../components/ui";
import { supplierRows } from "../lib/select";
import { cn } from "../utils/cn";

interface Props {
  suppliers: Supplier[];
  pos: PO[];
  actions: Action[];
  onOpenSupplier: (s: Supplier, po?: PO | null) => void;
  onAssignAction: (s: Supplier, po?: PO | null) => void;
  onFilterByCategory: (cat: string) => void;
}

type SortCol = "name" | "fSpend" | "fOff" | "coverage" | "fPos" | "risk";

export default function SuppliersPage({
  suppliers,
  pos,
  actions,
  onOpenSupplier,
  onAssignAction,
  onFilterByCategory,
}: Props) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [onlyOff, setOnlyOff] = useState(false);

  const [sortCol, setSortCol] = useState<SortCol>("fOff");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const rows = useMemo(() => supplierRows(pos), [pos]);

  const actionCounts = useMemo(() => {
    const m: Record<string, number> = {};
    actions.forEach((a) => (m[a.supplierId] = (m[a.supplierId] ?? 0) + 1));
    return m;
  }, [actions]);

  // Categories list
  const categories = useMemo(() => {
    const s = new Set<string>();
    suppliers.forEach((sup) => s.add(sup.category));
    return Array.from(s).sort();
  }, [suppliers]);

  // Reasons list
  const reasons = useMemo(() => {
    const s = new Set<string>();
    suppliers.forEach((sup) => {
      if (sup.reason) s.add(sup.reason);
    });
    return Array.from(s).sort();
  }, [suppliers]);

  // Filter and sort
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (onlyOff && r.fOff <= 0) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (reasonFilter !== "all" && r.reason !== reasonFilter) return false;
      if (riskFilter !== "all" && r.risk !== riskFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesInn = r.inn.includes(q);
        const matchesOwner = r.owner.toLowerCase().includes(q);
        if (!matchesName && !matchesInn && !matchesOwner) return false;
      }
      return true;
    });
  }, [rows, onlyOff, categoryFilter, reasonFilter, riskFilter, search]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      let v = 0;
      if (sortCol === "name") {
        v = a.name.localeCompare(b.name);
      } else if (sortCol === "risk") {
        const order: Record<string, number> = { Высокий: 3, Средний: 2, Низкий: 1 };
        v = (order[a.risk] || 0) - (order[b.risk] || 0);
      } else if (sortCol === "coverage") {
        const ca = a.fSpend ? 1 - a.fOff / a.fSpend : 1;
        const cb = b.fSpend ? 1 - b.fOff / b.fSpend : 1;
        v = ca - cb;
      } else {
        v = (a[sortCol] as number) - (b[sortCol] as number);
      }
      return sortDir === "desc" ? -v : v;
    });
  }, [filteredRows, sortCol, sortDir]);

  function toggleSort(col: SortCol) {
    if (sortCol === col) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortCol(col);
      setSortDir("desc");
    }
  }

  // Aggregate stats for filtered rows
  const totalFilteredSpend = filteredRows.reduce((a, r) => a + r.fSpend, 0);
  const totalFilteredOff = filteredRows.reduce((a, r) => a + r.fOff, 0);
  const offCount = filteredRows.filter((r) => r.fOff > 0).length;

  return (
    <div className="space-y-4">
      {/* ── KPI блок страницы поставщиков ── */}
      <div className="sb-stats layout-grid size-s">
        <Stat
          label="Всего поставщиков"
          value={String(filteredRows.length)}
          sub={`из ${suppliers.length} в базе холдинга`}
        />
        <Stat
          label="Поставщики вне контракта"
          value={String(offCount)}
          tone="alert"
          sub={`${pct(filteredRows.length ? offCount / filteredRows.length : 0, 0)} требуют подключения к условиям`}
        />
        <Stat
          label="Сумма вне согласованных условий"
          value={money(totalFilteredOff)}
          tone="alert"
          sub={`из ${money(totalFilteredSpend)} общих расходов`}
        />
        <Stat
          label="Среднее покрытие договорами"
          value={pct(totalFilteredSpend ? 1 - totalFilteredOff / totalFilteredSpend : 1, 0)}
          tone="brand"
          sub="в текущей выборке"
        />
      </div>

      {/* ── Панель фильтров и поиска ── */}
      <Panel
        eyebrow="Реестр и аудит"
        title="Поставщики холдинга и охват контрактами"
        subtitle="Связка каждого контрагента с заказами, владельцами, причинами выхода за рамки политики и рисками."
        right={
          <div className="flex items-center gap-2">
            <span className="num text-[11px] text-ink-3">
              Найдено: <b className="text-ink">{sortedRows.length}</b>
            </span>
          </div>
        }
      >
        <div className="sb-table-toolbar">
          <div className="flex flex-wrap items-center gap-3">
            <FieldSearch
              value={search}
              onChange={setSearch}
              placeholder="Поиск по названию, ИНН или владельцу..."
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-select"
              aria-label="Категория"
            >
              <option value="all">Все категории ({categories.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="form-select"
              aria-label="Причина"
            >
              <option value="all">Все причины ({reasons.length})</option>
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="form-select"
              aria-label="Риск"
            >
              <option value="all">Любой риск</option>
              <option value="Высокий">Высокий</option>
              <option value="Средний">Средний</option>
              <option value="Низкий">Низкий</option>
            </select>
            <Switch checked={onlyOff} onChange={setOnlyOff} label="Только с отклонениями" />

            {(search || categoryFilter !== "all" || reasonFilter !== "all" || riskFilter !== "all" || onlyOff) && (
              <Btn
                variant="ghost"
                size="xs"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("all");
                  setReasonFilter("all");
                  setRiskFilter("all");
                  setOnlyOff(false);
                }}
              >
                Сбросить
              </Btn>
            )}
          </div>
        </div>

        {/* ── Таблица ── */}
        <TableShell compact className="max-h-[580px]">
          <table className="sb-table-grid">
            <thead>
              <tr>
                <Th onClick={() => toggleSort("name")} active={sortCol === "name"} dir={sortDir}>
                  Поставщик / ИНН
                </Th>
                <Th>Категория</Th>
                <Th>Владелец</Th>
                <Th>Причина выхода из политики</Th>
                <Th onClick={() => toggleSort("risk")} active={sortCol === "risk"} dir={sortDir}>
                  Уровень риска
                </Th>
                <Th align="right" onClick={() => toggleSort("fPos")} active={sortCol === "fPos"} dir={sortDir}>
                  Заказы (PO)
                </Th>
                <Th align="right" onClick={() => toggleSort("fSpend")} active={sortCol === "fSpend"} dir={sortDir}>
                  Расходы Q3
                </Th>
                <Th align="right" onClick={() => toggleSort("fOff")} active={sortCol === "fOff"} dir={sortDir}>
                  Вне контракта
                </Th>
                <Th align="right" onClick={() => toggleSort("coverage")} active={sortCol === "coverage"} dir={sortDir}>
                  Покрытие договором
                </Th>
                <Th align="right">Действия</Th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((r) => {
                const cov = r.fSpend ? 1 - r.fOff / r.fSpend : 1;
                const hot = r.fOff > 0;
                const actionsCount = actionCounts[r.id] ?? 0;
                return (
                  <tr
                    key={r.id}
                    onClick={() => {
                      const sup = suppliers.find((s) => s.id === r.id);
                      if (sup) onOpenSupplier(sup, null);
                    }}
                    className={cn(
                      "group cursor-pointer border-b border-line/70 transition-colors last:border-0 hover:bg-brand-soft/35",
                      hot && "bg-alert-soft/20",
                    )}
                  >
                    <td className="relative px-3 py-2.5">
                      <span className="absolute inset-y-0 left-0 w-[2px] scale-y-0 bg-brand transition-transform duration-200 group-hover:scale-y-100" />
                      <div className="flex items-center gap-1.5 font-bold text-ink group-hover:text-brand">
                        <span>{r.name}</span>
                        {r.risk === "Высокий" && (
                          <span title="Высокий риск отклонений">
                            <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-alert" />
                          </span>
                        )}
                      </div>
                      <div className="num mt-0.5 text-[10.5px] text-ink-3">
                        ИНН {r.inn} · Договор: {r.contract ?? "отсутствует"}
                      </div>
                    </td>

                    <td className="px-3 py-2.5 text-[11.5px] whitespace-nowrap text-ink-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFilterByCategory(r.category);
                        }}
                        className="sb-link sb-link--underline"
                      >
                        {r.category}
                      </button>
                    </td>

                    <td className="px-3 py-2.5 text-[11.5px] whitespace-nowrap text-ink-2">{r.owner}</td>

                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {hot && r.reason ? (
                        <span className="tag tag-danger">
                          <Ban className="h-3 w-3" />
                          {r.reason}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10.5px] text-ink-3">
                          <BadgeCheck className="h-3 w-3 text-brand" />В рамках политики
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <Flag
                        tone={r.risk === "Высокий" ? "alert" : r.risk === "Средний" ? "mute" : "ok"}
                        dot={r.risk === "Высокий"}
                      >
                        {r.risk}
                      </Flag>
                    </td>

                    <td className="num px-3 py-2.5 text-right text-[11.5px] text-ink-2">{r.fPos}</td>

                    <td className="num px-3 py-2.5 text-right text-[11.5px] font-semibold text-ink">
                      {usd(r.fSpend)}
                    </td>

                    <td
                      className={cn(
                        "num px-3 py-2.5 text-right text-[11.5px] font-bold",
                        hot ? "text-alert" : "text-ink-3",
                      )}
                    >
                      {hot ? usd(r.fOff) : "—"}
                    </td>

                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-[4px] w-[56px] overflow-hidden rounded-[1px] bg-surface-2">
                          <div
                            className={cn("h-full transition-[width] duration-500", cov < 0.9 ? "bg-alert" : "bg-brand")}
                            style={{ width: `${cov * 100}%` }}
                          />
                        </div>
                        <span className="num w-[36px] text-right text-[11px] font-semibold text-ink-2">
                          {pct(cov, 0)}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {actionsCount > 0 && (
                          <span className="tag tag-promo">{actionsCount} действ.</span>
                        )}
                        <Btn
                          variant="line"
                          size="xs"
                          onClick={() => {
                            const sup = suppliers.find((s) => s.id === r.id);
                            if (sup) onOpenSupplier(sup, null);
                          }}
                        >
                          Заказы
                          <ChevronRight className="h-3 w-3" />
                        </Btn>
                        {hot && (
                          <Btn
                            variant="alert"
                            size="xs"
                            onClick={() => {
                              const sup = suppliers.find((s) => s.id === r.id);
                              if (sup) onAssignAction(sup, null);
                            }}
                          >
                            <UserCheck className="h-3 w-3" />
                          </Btn>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {sortedRows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-[12px] text-ink-3">
                    По заданным критериям поставщики не найдены. Сбросьте поисковый запрос или фильтры.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableShell>

        {/* Футер таблицы с суммами */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface/70 px-4 py-2.5 text-[11px] text-ink-3">
          <div className="flex items-center gap-4">
            <span>
              Показано поставщиков: <b className="text-ink">{sortedRows.length}</b>
            </span>
            <span>
              Заказов суммарно: <b className="text-ink">{sortedRows.reduce((a, r) => a + r.fPos, 0)}</b>
            </span>
          </div>
          <div className="num flex items-center gap-4 font-semibold">
            <span>
              Расходы выборки: <b className="text-ink">{usd(totalFilteredSpend)}</b>
            </span>
            <span>
              Вне условий: <b className="text-alert">{usd(totalFilteredOff)}</b>
            </span>
          </div>
        </div>
      </Panel>
    </div>
  );
}
