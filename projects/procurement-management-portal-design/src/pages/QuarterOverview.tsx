import { useMemo, useState } from "react";
import {
  Layers,
  ArrowRight,
  UserCheck,
  Building2,
  AlertTriangle,
} from "lucide-react";
import type { PO, Supplier, Action } from "../data/model";
import { money, pct } from "../lib/format";
import { SpendMap, type MapNode } from "../components/charts";
import { Btn, Flag, Panel, Seg, Stat } from "../components/ui";
import { BreakdownList, CoveragePanel, OffPanel } from "../components/panels";
import { groupBy, type Filter } from "../lib/select";

interface Props {
  pos: PO[];
  allPos: PO[];
  suppliers: Supplier[];
  totals: { spend: number; off: number; offSuppliers: number; pos: number };
  coverageNow: number;
  coverageForecast: number;
  addressed: number;
  actions: Action[];
  filters: Filter[];
  trend: { q: string; v: number }[];
  onAddFilter: (kind: Filter["kind"], value: string, label?: string) => void;
  onClearFilters: () => void;
  onOpenSupplier: (s: Supplier, po?: PO | null) => void;
  onOpenAudit: (scope: string) => void;
  onNavigateTab: (tab: string) => void;
  heroPO: PO;
  heroSupplier: Supplier;
}

export default function QuarterOverview({
  pos,
  allPos,
  suppliers,
  totals,
  coverageNow,
  coverageForecast,
  addressed,
  actions,
  filters,
  trend,
  onAddFilter,
  onClearFilters,
  onOpenSupplier,
  onOpenAudit,
  onNavigateTab,
  heroPO,
  heroSupplier,
}: Props) {
  const [mode, setMode] = useState<"spend" | "off">("spend");
  const [viewType, setViewType] = useState<"categories" | "hierarchy" | "suppliers">("categories");

  const spendInSlice = pos.reduce((a, p) => a + p.amount, 0);
  const offInSlice = pos.reduce((a, p) => a + p.offAmount, 0);
  const sliceSuppliers = new Set(pos.map((p) => p.supplierId));
  const offSuppliersInSlice = new Set(pos.filter((p) => p.offContract).map((p) => p.supplierId));

  const reasons = useMemo(() => groupBy(pos.filter((p) => p.offContract), "reason"), [pos]);
  const owners = useMemo(() => groupBy(pos.filter((p) => p.offContract), "owner"), [pos]);
  const sites = useMemo(() => groupBy(pos.filter((p) => p.offContract), "site"), [pos]);

  const hasCategory = filters.some((f) => f.kind === "category");
  const hasSupplier = filters.some((f) => f.kind === "supplier");

  const mapNodes = useMemo<MapNode[]>(() => {
    const leaf = (p: PO): MapNode => ({
      id: p.id,
      name: p.id,
      kind: "po",
      spend: p.amount,
      off: p.offAmount,
      count: 1,
    });
    const keep = (n: { off: number }) => (mode === "off" ? n.off > 0 : true);

    // 1. Уровень поставщика: отображаем заказы как отдельные кубики
    if (hasSupplier) {
      return pos
        .map(leaf)
        .filter(keep)
        .sort((a, b) => (mode === "off" ? b.off - a.off : b.spend - a.spend));
    }

    // 2. Уровень категории: отображаем поставщиков как просторные кубики, где все имена помещаются целиком
    if (hasCategory) {
      return groupBy(pos, "supplierId")
        .filter(keep)
        .map((g) => ({
          id: g.key,
          name: g.label,
          kind: "supplier" as const,
          spend: g.spend,
          off: g.off,
          count: g.count,
        }))
        .sort((a, b) => (mode === "off" ? b.off - a.off : b.spend - a.spend));
    }

    // 3. Прямой разрез: все поставщики холдинга как кубики
    if (viewType === "suppliers") {
      return groupBy(pos, "supplierId")
        .filter(keep)
        .map((g) => ({
          id: g.key,
          name: g.label,
          kind: "supplier" as const,
          spend: g.spend,
          off: g.off,
          count: g.count,
        }))
        .sort((a, b) => (mode === "off" ? b.off - a.off : b.spend - a.spend));
    }

    // 4. По категориям (крупные кубики 8 категорий) — названия и суммы гарантированно помещаются
    if (viewType === "categories") {
      return groupBy(pos, "category")
        .filter(keep)
        .map((g) => ({
          id: g.key,
          name: g.label,
          kind: "category" as const,
          spend: g.spend,
          off: g.off,
          count: g.count,
        }))
        .sort((a, b) => (mode === "off" ? b.off - a.off : b.spend - a.spend));
    }

    // 5. Иерархия (Категории с вложенными поставщиками)
    return groupBy(pos, "category")
      .filter(keep)
      .map((g) => {
        const sub = pos.filter((p) => p.category === g.key);
        const bySup = groupBy(sub, "supplierId").filter(keep);
        const kids: MapNode[] = bySup.slice(0, 5).map((s) => ({
          id: s.key,
          name: s.label,
          kind: "supplier" as const,
          spend: s.spend,
          off: s.off,
          count: s.count,
        }));
        const rest = bySup.slice(5);
        if (rest.length) {
          kids.push({
            id: "rest:" + g.key,
            name: `Прочие (${rest.length})`,
            kind: "supplier",
            spend: rest.reduce((a, r) => a + r.spend, 0),
            off: rest.reduce((a, r) => a + r.off, 0),
            count: rest.reduce((a, r) => a + r.count, 0),
          });
        }
        return {
          id: g.key,
          name: g.label,
          kind: "category" as const,
          spend: g.spend,
          off: g.off,
          count: g.count,
          children: kids,
        };
      });
  }, [pos, hasSupplier, hasCategory, mode, viewType]);

  const treeLevel = hasSupplier
    ? "Уровень 3: Заказы на поставку (PO)"
    : hasCategory
      ? "Уровень 2: Поставщики в категории"
      : viewType === "categories"
        ? "Уровень 1: Категории холдинга (клик сужает до поставщиков)"
        : viewType === "suppliers"
          ? "Все поставщики в срезе"
          : "Иерархия (Категории + Поставщики)";

  const offBars = useMemo(() => {
    const map = new Map<string, { id: string; label: string; covered: number; off: number }>();
    pos.forEach((p) => {
      const e = map.get(p.supplierId) ?? {
        id: p.supplierId,
        label: p.supplier,
        covered: 0,
        off: 0,
      };
      e.covered += p.amount - p.offAmount;
      e.off += p.offAmount;
      map.set(p.supplierId, e);
    });
    return [...map.values()]
      .filter((r) => r.off > 0)
      .sort((a, b) => b.off - a.off)
      .slice(0, 7);
  }, [pos]);

  function onMapPick(id: string, kind: MapNode["kind"]) {
    if (id.startsWith("rest:")) return;
    if (kind === "po") {
      const po = allPos.find((p) => p.id === id);
      if (po) {
        const sup = suppliers.find((s) => s.id === po.supplierId);
        if (sup) onOpenSupplier(sup, po);
      }
      return;
    }
    if (kind === "supplier") {
      const s = suppliers.find((x) => x.id === id);
      if (s) onAddFilter("supplier", s.id, s.name);
      return;
    }
    onAddFilter("category", id);
  }

  return (
    <div className="space-y-4">
      {/* ── KPI полоса ── */}
      <div className="sb-stats layout-grid size-s tpl-dashboard-stats">
        <Stat
          label="Расходы в срезе"
          value={money(spendInSlice)}
          sub={`${pct(totals.spend ? spendInSlice / totals.spend : 1, 0)} от $18,4M · ${pos.length} PO`}
        />
        <Stat
          label="Вне согласованных условий"
          value={money(offInSlice)}
          tone="alert"
          sub={`${pct(spendInSlice ? offInSlice / spendInSlice : 0, 1)} расходов среза`}
        />
        <Stat
          label="Поставщики с отклонениями"
          value={`${offSuppliersInSlice.size}`}
          tone="alert"
          sub={`из ${sliceSuppliers.size} в текущем срезе`}
        />
        <Stat
          label="Покрытие договорами"
          value={pct(spendInSlice ? 1 - offInSlice / spendInSlice : 1, 0)}
          tone="brand"
          sub="факт текущего среза"
        />
        <Stat
          label="Целевое покрытие Q4"
          value={`${pct(coverageForecast, 0)}`}
          sub={
            <span>
              цель холдинга <b className="text-brand">96 %</b>
            </span>
          }
          tone="brand"
        />
        <Stat
          label="Корректирующие действия"
          value={`${actions.length}`}
          sub={<span>{money(addressed)} под контролем</span>}
        />
      </div>

      <div className="sb-alert sb-alert--warning spend-crit-card">
        <span className="sb-alert-icon" aria-hidden>
          <AlertTriangle className="h-[18px] w-[18px]" />
        </span>
        <div className="sb-alert-body">
          <Flag tone="alert" dot>
            Критическое отклонение Q3
          </Flag>
          <p>
            <strong>
              {heroSupplier.name} · {heroSupplier.poCount} заказов · {money(heroSupplier.offAmount)} вне согласованных
              договоров.
            </strong>{" "}
            Клапаны МТР по цене на 23 % выше бенчмарка, согласованы 2 менеджерами без проверки контракта
          </p>
        </div>
        <div className="spend-crit-card-actions">
          <Btn variant="line" size="xs" onClick={() => onOpenSupplier(heroSupplier, null)}>
            Карточка поставщика
          </Btn>
          <Btn
            variant="alert"
            size="xs"
            icon={<ArrowRight className="h-3.5 w-3.5" />}
            onClick={() => onOpenSupplier(heroSupplier, heroPO)}
          >
            Разобрать PO {heroPO.id}
          </Btn>
        </div>
      </div>

      {/* ── Основная рабочая сетка ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-4">
          {/* Древовидная карта расходов */}
          <Panel
            eyebrow="Каскадный анализ расходов"
            title="Карта расходов за квартал (Treemap)"
            subtitle={
              mode === "off"
                ? "Показаны только суммы вне согласованных условий ($2,0 млн). Наименования автоматически переносятся по строкам и компактно помещаются в кубиках."
                : "Размер кубика пропорционален сумме расходов ($18,4 млн). Клик по кубику добавляет каскадный фильтр и раскрывает детализацию."
            }
            right={
              <div className="flex flex-wrap items-center justify-end gap-2">
                {/* Переключатель группировки (если не выбран поставщик) */}
                {!hasSupplier && (
                  <Seg
                    value={viewType}
                    onChange={setViewType}
                    options={[
                      { id: "categories", label: "Категории" },
                      { id: "suppliers", label: "Поставщики" },
                      { id: "hierarchy", label: "Иерархия" },
                    ]}
                  />
                )}

                {/* Режим фильтрации: Все / Только вне контракта */}
                <div className="flex items-center gap-1">
                  <Seg
                    value={mode}
                    onChange={setMode}
                    options={[
                      { id: "spend", label: "Все ($18,4M)" },
                      { id: "off", label: "Вне контракта ($2,0M)" },
                    ]}
                  />
                </div>
              </div>
            }
          >
            <div className="border-b border-line bg-surface/50 px-3 py-1.5 text-[11px] text-ink-3 flex items-center justify-between">
              <span className="num font-medium text-ink-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand" />
                {treeLevel}
              </span>
              <span className="text-[10.5px]">Кликните на кубик для перехода на следующий уровень детализации</span>
            </div>
            {mapNodes.length > 0 ? (
              <div className="px-2 pt-2 pb-2">
                <SpendMap nodes={mapNodes} mode={mode} onPick={onMapPick} height={hasSupplier ? 320 : 470} />
              </div>
            ) : (
              <div className="grid h-[260px] place-items-center text-center text-[12px] text-ink-3">
                <div>
                  <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-alert" />
                  В текущем срезе нет расходов вне контракта.
                  <div className="mt-2">
                    <Btn variant="line" size="xs" onClick={onClearFilters}>
                      Сбросить фильтры
                    </Btn>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface/70 px-4 py-2 text-[10.5px] text-ink-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-[9px] w-[9px] rounded-[1px] bg-[#0a5a63]" />
                  по договору (89 %)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-[9px] w-[9px] rounded-[1px] bg-[#008b92]" />
                  до 8 % вне
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-[9px] w-[9px] rounded-[1px] bg-[#fc5a41]" />
                  отклонение от политики (11 %)
                </span>
              </div>
              <span className="num font-semibold text-ink">
                {mapNodes.length} сегментов · {money(mode === "off" ? offInSlice : spendInSlice)}
              </span>
            </div>
          </Panel>

          {/* Панель топ-поставщиков вне контракта */}
          {offBars.length > 0 && (
            <OffPanel
              rows={offBars}
              onPick={(id) => {
                const s = suppliers.find((x) => x.id === id);
                if (s) onOpenSupplier(s, null);
              }}
            />
          )}

          {/* Быстрый переход к таблицам */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={() => onNavigateTab("suppliers")}
              className="sb-card space-sm shadow-false group flex cursor-pointer items-center justify-between text-left"
            >
              <div>
                <div className="eyebrow">Реестр</div>
                <div className="text-[14px] font-bold text-[var(--text-main)] group-hover:text-[var(--primary)]">Таблица поставщиков →</div>
                <div className="num mt-0.5 text-[13px] text-[var(--text-secondary)]">{sliceSuppliers.size} поставщиков в срезе</div>
              </div>
              <Building2 className="h-5 w-5 text-[var(--text-secondary)] transition-colors group-hover:text-[var(--primary)]" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab("benchmarks")}
              className="sb-card space-sm shadow-false group flex cursor-pointer items-center justify-between text-left"
            >
              <div>
                <div className="eyebrow">Построчный анализ</div>
                <div className="text-[14px] font-bold text-[var(--text-main)] group-hover:text-[var(--primary)]">Рыночные бенчмарки →</div>
                <div className="num mt-0.5 text-[13px] text-[var(--text-secondary)]">Сравнение цен заказов с рынком</div>
              </div>
              <Layers className="h-5 w-5 text-[var(--text-secondary)] transition-colors group-hover:text-[var(--primary)]" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab("actions")}
              className="sb-card space-sm shadow-false group flex cursor-pointer items-center justify-between text-left"
            >
              <div>
                <div className="eyebrow">Управление</div>
                <div className="text-[14px] font-bold text-[var(--text-main)] group-hover:text-[var(--primary)]">Доска действий →</div>
                <div className="num mt-0.5 text-[13px] text-[var(--text-secondary)]">{actions.length} решений до совещания</div>
              </div>
              <UserCheck className="h-5 w-5 text-[var(--text-secondary)] transition-colors group-hover:text-[var(--primary)]" />
            </button>
          </div>
        </div>

        {/* Правая колонка — Состояние проверки и причины отклонений */}
        <aside className="flex flex-col gap-4">
          <CoveragePanel
            coverageNow={coverageNow}
            coverageForecast={coverageForecast}
            addressed={addressed}
            actionsCount={actions.length}
            trend={trend}
            onAudit={() => onOpenAudit("Состояние проверки · Q3 2025")}
          />

          <BreakdownList
            unitLabel="Причины"
            title="Причины отклонений от политики"
            subtitle="Почему расходы вышли за рамки согласованных контрактов."
            data={reasons}
            total={offInSlice}
            onPick={(r) => onAddFilter("reason", r.key)}
          />

          <BreakdownList
            unitLabel="Ответственные"
            title="Владельцы заказов вне контракта"
            subtitle="Кому принадлежат закупки, нарушившие правила."
            data={owners}
            total={offInSlice}
            onPick={(o) => onAddFilter("owner", o.key)}
          />

          <BreakdownList
            unitLabel="Локации"
            title="Площадки холдинга с отклонениями"
            subtitle="Распределение расходов вне условий по предприятиям."
            data={sites}
            total={offInSlice}
            onPick={(s) => onAddFilter("site", s.key)}
          />
        </aside>
      </div>
    </div>
  );
}
