import { useMemo, useState } from "react";
import {
  Ban,
  BadgeCheck,
  UserCheck,
} from "lucide-react";
import type { PO, Supplier, POLine } from "../data/model";
import { money, pct, pctDelta, ruDate, usd, usd2 } from "../lib/format";
import { Btn, FieldSearch, Flag, Panel, Stat, TableShell, Th } from "../components/ui";
import { BenchBars } from "../components/charts";
import { cn } from "../utils/cn";

interface Props {
  pos: PO[];
  suppliers: Supplier[];
  heroPO: PO;
  heroSupplier: Supplier;
  onOpenSupplier: (s: Supplier, po?: PO | null) => void;
  onAssignAction: (s: Supplier, po?: PO | null) => void;
}

interface FlattenedLine extends POLine {
  poId: string;
  poDate: string;
  poSite: string;
  poOwner: string;
  supplierId: string;
  supplierName: string;
  category: string;
  offContract: boolean;
  deltaPct: number;
  deltaRub: number;
}

export default function BenchmarksPage({
  pos,
  suppliers,
  heroPO,
  heroSupplier,
  onOpenSupplier,
  onAssignAction,
}: Props) {
  const [selectedPO, setSelectedPO] = useState<PO>(heroPO);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [deltaFilter, setDeltaFilter] = useState<"all" | "hot" | "above10" | "above20">("all");
  const [showApprovals, setShowApprovals] = useState(true);

  // Flatten lines
  const allLines = useMemo<FlattenedLine[]>(() => {
    const list: FlattenedLine[] = [];
    pos.forEach((p) => {
      p.lines.forEach((l) => {
        const deltaPct = l.benchmark > 0 ? l.unitPrice / l.benchmark - 1 : 0;
        const deltaRub = (l.unitPrice - l.benchmark) * l.qty;
        list.push({
          ...l,
          poId: p.id,
          poDate: p.date,
          poSite: p.site,
          poOwner: p.owner,
          supplierId: p.supplierId,
          supplierName: p.supplier,
          category: p.category,
          offContract: p.offContract,
          deltaPct,
          deltaRub,
        });
      });
    });
    return list;
  }, [pos]);

  // Aggregate metrics
  const totalLines = allLines.length;
  const deviatedLines = allLines.filter((l) => l.deltaPct > 0.06);
  const totalOverspend = allLines.reduce((acc, l) => (l.deltaRub > 0 ? acc + l.deltaRub : acc), 0);
  const maxDeviation = allLines.reduce((max, l) => (l.deltaPct > max ? l.deltaPct : max), 0);

  // Filtered lines for explorer table
  const filteredLines = useMemo(() => {
    return allLines
      .filter((l) => {
        if (catFilter !== "all" && l.category !== catFilter) return false;
        if (deltaFilter === "hot" && l.deltaPct <= 0.06) return false;
        if (deltaFilter === "above10" && l.deltaPct <= 0.1) return false;
        if (deltaFilter === "above20" && l.deltaPct <= 0.2) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const mItem = l.item.toLowerCase().includes(q);
          const mCode = l.code.toLowerCase().includes(q);
          const mSup = l.supplierName.toLowerCase().includes(q);
          const mPo = l.poId.toLowerCase().includes(q);
          if (!mItem && !mCode && !mSup && !mPo) return false;
        }
        return true;
      })
      .sort((a, b) => b.deltaPct - a.deltaPct);
  }, [allLines, catFilter, deltaFilter, search]);

  const categories = useMemo(() => {
    const s = new Set<string>();
    pos.forEach((p) => s.add(p.category));
    return Array.from(s).sort();
  }, [pos]);

  // Selected PO calculation
  const selTotal = selectedPO.lines.reduce((a, l) => a + l.amount, 0);
  const selBenchTotal = selectedPO.lines.reduce((a, l) => a + l.benchmark * l.qty, 0);
  const selDelta = selBenchTotal > 0 ? selTotal / selBenchTotal - 1 : 0;
  const selOverspend = selTotal - selBenchTotal;

  const currentSupplier =
    suppliers.find((s) => s.id === selectedPO.supplierId) ?? heroSupplier;

  return (
    <div className="space-y-4">
      {/* ── KPI блок бенчмарков ── */}
      <div className="sb-stats layout-grid size-s">
        <Stat
          label="Всего строк в анализе"
          value={totalLines.toLocaleString("ru-RU")}
          sub={`${pos.length} проверенных заказов на поставку`}
        />
        <Stat
          label="Строки выше прайс-листа"
          value={String(deviatedLines.length)}
          tone="alert"
          sub={`${pct(totalLines ? deviatedLines.length / totalLines : 0, 1)} позиций с наценкой выше рынка`}
        />
        <Stat
          label="Сумма превышения бенчмарков"
          value={money(totalOverspend)}
          tone="alert"
          sub="потенциал экономии при пересмотре цен"
        />
        <Stat
          label="Максимальное отклонение"
          value={pctDelta(maxDeviation, 0)}
          tone="alert"
          sub="Клапан регулирующий DN80 PN40"
        />
      </div>

      {/* ── Эталонный кейс: фокус на PO-2025-04871 ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel
          eyebrow="Детальный разбор заказа"
          title={`Заказ ${selectedPO.id} против согласованного прайс-листа`}
          subtitle={`Поставщик: ${selectedPO.supplier} · Площадка: ${selectedPO.site} · Ответственный: ${selectedPO.owner}`}
          right={
            <div className="flex items-center gap-2">
              <Flag tone={selectedPO.offContract ? "alert" : "ok"} dot={selectedPO.offContract}>
                {selectedPO.offContract ? selectedPO.reason ?? "Вне контракта" : "По контракту"}
              </Flag>
              <Btn
                variant="alert"
                size="xs"
                onClick={() => onAssignAction(currentSupplier, selectedPO)}
              >
                <UserCheck className="h-3.5 w-3.5" />
                Назначить действие
              </Btn>
            </div>
          }
        >
          <TableShell compact>
            <table className="sb-table-grid">
              <thead>
                <tr>
                  <Th>Позиция номенклатуры</Th>
                  <Th>Код МТР</Th>
                  <Th align="right">Кол-во</Th>
                  <Th align="right">Цена закупки</Th>
                  <Th align="right">Бенчмарк</Th>
                  <Th align="right">Отклонение (Δ)</Th>
                  <Th align="right">Сумма строки</Th>
                </tr>
              </thead>
              <tbody>
                {selectedPO.lines.map((l) => {
                  const d = l.unitPrice / l.benchmark - 1;
                  const hot = d > 0.06;
                  return (
                    <tr
                      key={l.id}
                      className={cn(
                        "border-b border-line/70 transition-colors last:border-0 hover:bg-surface/70",
                        hot && "bg-alert-soft/40",
                      )}
                    >
                      <td className="px-3 py-2 text-[11.5px] font-medium text-ink">
                        <div>{l.item}</div>
                        {hot && (
                          <span className="text-[10px] font-semibold text-[#c0371f]">
                            выше рыночного бенчмарка
                          </span>
                        )}
                      </td>
                      <td className="num px-3 py-2 text-[11px] text-ink-3">{l.code}</td>
                      <td className="num px-3 py-2 text-right text-[11.5px] text-ink-2">
                        {l.qty} {l.unit}
                      </td>
                      <td className="num px-3 py-2 text-right text-[11.5px] font-semibold text-ink">
                        {usd2(l.unitPrice)}
                      </td>
                      <td className="num px-3 py-2 text-right text-[11.5px] text-ink-3">
                        {usd2(l.benchmark)}
                      </td>
                      <td
                        className={cn(
                          "num px-3 py-2 text-right text-[11.5px] font-bold",
                          hot ? "text-alert" : "text-ink-3",
                        )}
                      >
                        {pctDelta(d, 0)}
                      </td>
                      <td className="num px-3 py-2 text-right text-[11.5px] font-bold text-ink">
                        {usd(l.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-surface/80">
                  <td colSpan={5} className="px-3 py-2 text-right text-[10.5px] tracking-wider text-ink-3 uppercase">
                    Итого по заказу
                  </td>
                  <td className="num px-3 py-2 text-right text-[11.5px] font-bold text-alert">
                    {pctDelta(selDelta, 0)}
                  </td>
                  <td className="num px-3 py-2 text-right text-[12.5px] font-bold text-ink">
                    {usd(selTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </TableShell>

          {/* Итоги сверки */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface/60 px-4 py-2.5 text-[11.5px]">
            <div className="num flex items-center gap-4">
              <span>
                Сумма заказа: <b className="text-ink">{usd(selTotal)}</b>
              </span>
              <span>
                Бенчмарк: <b className="text-ink">{usd(selBenchTotal)}</b>
              </span>
              <span>
                Превышение: <b className="text-alert">{usd(Math.round(selOverspend))}</b> ({pctDelta(selDelta, 0)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Btn
                variant="line"
                size="xs"
                onClick={() => onOpenSupplier(currentSupplier, selectedPO)}
              >
                Открыть поставщика
              </Btn>
            </div>
          </div>
        </Panel>

        {/* Правая колонка: график цен и цепочка согласования */}
        <div className="flex flex-col gap-4">
          <Panel eyebrow="Визуализация" title="Сопоставление цен с рыночным бенчмарком">
            <div className="p-2">
              <BenchBars lines={selectedPO.lines} />
            </div>
          </Panel>

          <Panel
            eyebrow="История согласования"
            title="Контроль полномочий по заказу"
            subtitle={`${selectedPO.approvals.length} подписи менеджеров в ERP`}
            right={
              <button type="button" className="btn btn-ghost btn-xs" onClick={() => setShowApprovals((v) => !v)}>
                {showApprovals ? "Свернуть" : "Развернуть"}
              </button>
            }
          >
            {showApprovals && (
              <ol className="divide-y divide-line/70">
                {selectedPO.approvals.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 px-4 py-2.5">
                    <span className="num mt-[2px] text-[10.5px] text-ink-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-bold text-ink">
                        {a.name} <span className="font-medium text-ink-3">· {a.role}</span>
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 flex items-center gap-1.5 text-[11px]",
                          a.note.toLowerCase().includes("без проверки") ||
                            a.note.toLowerCase().includes("не выполнена")
                            ? "font-semibold text-[#c0371f]"
                            : "text-ink-3",
                        )}
                      >
                        {a.note.includes("без проверки") || a.note.includes("не выполнена") ? (
                          <Ban className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand" />
                        )}
                        <span>{a.note}</span>
                      </div>
                    </div>
                    <span className="num text-[10.5px] text-ink-3">{a.at}</span>
                  </li>
                ))}
              </ol>
            )}
            <div className="border-t border-line bg-alert-soft/40 px-4 py-2.5 text-[11px] leading-snug text-[#8d3b2a]">
              Одобрено двумя менеджерами без проверки контракта. При запросе от отдела снабжения цепочка
              согласования документирует нарушение регламента закупок.
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Глобальный реестр позиций номенклатуры ── */}
      <Panel
        eyebrow="Сквозной реестр"
        title="Анализ позиций заказов по всем закупкам Q3"
        subtitle="Сравнение каждой закупленной строки с согласованным рыночным бенчмарком холдинга."
        right={
          <span className="num text-[11px] text-ink-3">
            Найдено позиций: <b className="text-ink">{filteredLines.length}</b>
          </span>
        }
      >
        <div className="sb-table-toolbar">
          <FieldSearch
            value={search}
            onChange={setSearch}
            placeholder="Поиск номенклатуры, кода, поставщика или PO..."
          />
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
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
            value={deltaFilter}
            onChange={(e) => setDeltaFilter(e.target.value as any)}
            className="form-select"
            aria-label="Отклонение"
          >
            <option value="all">Все позиции</option>
            <option value="hot">Выше рынка (&gt; +6 %)</option>
            <option value="above10">Выше рынка (&gt; +10 %)</option>
            <option value="above20">Критичные (&gt; +20 %)</option>
          </select>

            {(search || catFilter !== "all" || deltaFilter !== "all") && (
              <Btn
                variant="ghost"
                size="xs"
                onClick={() => {
                  setSearch("");
                  setCatFilter("all");
                  setDeltaFilter("all");
                }}
              >
                Сбросить
              </Btn>
            )}
        </div>

        {/* Таблица всех строк */}
        <TableShell compact className="max-h-[500px]">
          <table className="sb-table-grid">
            <thead>
              <tr>
                <Th>Номенклатурная позиция</Th>
                <Th>Код МТР</Th>
                <Th>Заказ / Дата</Th>
                <Th>Поставщик</Th>
                <Th>Владелец / Площадка</Th>
                <Th align="right">Кол-во</Th>
                <Th align="right">Цена PO</Th>
                <Th align="right">Бенчмарк</Th>
                <Th align="right">Отклонение (Δ)</Th>
                <Th align="right">Сумма строки</Th>
                <Th align="right">Выбрать</Th>
              </tr>
            </thead>
            <tbody>
              {filteredLines.slice(0, 100).map((l, i) => {
                const hot = l.deltaPct > 0.06;
                const isSelected = selectedPO.id === l.poId;
                return (
                  <tr
                    key={`${l.poId}-${l.id}-${i}`}
                    onClick={() => {
                      const targetPO = pos.find((p) => p.id === l.poId);
                      if (targetPO) setSelectedPO(targetPO);
                    }}
                    className={cn(
                      "group cursor-pointer border-b border-line/70 transition-colors last:border-0 hover:bg-brand-soft/35",
                      isSelected && "bg-brand-soft/60",
                      hot && !isSelected && "bg-alert-soft/20",
                    )}
                  >
                    <td className="px-3 py-2 text-[11.5px] font-medium text-ink group-hover:text-brand">
                      {l.item}
                    </td>
                    <td className="num px-3 py-2 text-[11px] text-ink-3">{l.code}</td>
                    <td className="num px-3 py-2 text-[11px] font-semibold text-ink">
                      <div>{l.poId}</div>
                      <div className="text-[10px] text-ink-3">{ruDate(l.poDate)}</div>
                    </td>
                    <td className="px-3 py-2 text-[11.5px] text-ink-2">
                      <div className="truncate max-w-[160px]">{l.supplierName}</div>
                    </td>
                    <td className="px-3 py-2 text-[11px] text-ink-3">
                      <div>{l.poOwner}</div>
                      <div className="text-[10px] text-ink-3">{l.poSite}</div>
                    </td>
                    <td className="num px-3 py-2 text-right text-[11.5px] text-ink-2">
                      {l.qty} {l.unit}
                    </td>
                    <td className="num px-3 py-2 text-right text-[11.5px] font-semibold text-ink">
                      {usd2(l.unitPrice)}
                    </td>
                    <td className="num px-3 py-2 text-right text-[11.5px] text-ink-3">
                      {usd2(l.benchmark)}
                    </td>
                    <td
                      className={cn(
                        "num px-3 py-2 text-right text-[11.5px] font-bold",
                        hot ? "text-alert" : "text-ink-3",
                      )}
                    >
                      {pctDelta(l.deltaPct, 0)}
                    </td>
                    <td className="num px-3 py-2 text-right text-[11.5px] font-bold text-ink">
                      {usd(l.amount)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Btn
                        variant={isSelected ? "solid" : "line"}
                        size="xs"
                        onClick={() => {
                          const targetPO = pos.find((p) => p.id === l.poId);
                          if (targetPO) setSelectedPO(targetPO);
                        }}
                      >
                        {isSelected ? "Выбран" : "В фокус"}
                      </Btn>
                    </td>
                  </tr>
                );
              })}

              {filteredLines.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-[12px] text-ink-3">
                    Позиций по заданным критериям не найдено.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableShell>
        {filteredLines.length > 100 && (
          <div className="border-t border-line bg-surface/70 px-4 py-2 text-center text-[11px] text-ink-3">
            Показаны первые 100 строк из {filteredLines.length}. Уточните фильтр для сужения выборки.
          </div>
        )}
      </Panel>
    </div>
  );
}
