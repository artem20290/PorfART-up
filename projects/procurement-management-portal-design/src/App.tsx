import { useEffect, useMemo, useState } from "react";
import {
  Filter as FilterIcon,
  Search,
  SlidersHorizontal,
  X,
  Plus,
  BarChart3,
  Building2,
  Layers,
  UserCheck,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import {
  POS,
  QUARTER_TREND,
  SEED_ACTIONS,
  SEED_AUDIT,
  SUPPLIERS,
  TOTALS,
  HERO_PO_ID,
  HERO_SUPPLIER_ID,
  type Action,
  type AuditEvent,
  type PO,
  type Supplier,
} from "./data/model";
import { applyFilters, KIND_LABEL, type Filter } from "./lib/select";
import { money, ruDate } from "./lib/format";
import SupplierDrawer from "./components/SupplierDrawer";
import ActionModal from "./components/ActionModal";
import AuditDrawer from "./components/AuditDrawer";

// Pages
import QuarterOverview from "./pages/QuarterOverview";
import SuppliersPage from "./pages/SuppliersPage";
import BenchmarksPage from "./pages/BenchmarksPage";
import ActionsPage from "./pages/ActionsPage";
import AuditPage from "./pages/AuditPage";
import { cn } from "./utils/cn";
import logoMark from "../logo-mark.png?url";

export type NavTab = "overview" | "suppliers" | "benchmarks" | "actions" | "audit";

const NAV_TABS: { id: NavTab; label: string; icon: typeof BarChart3 }[] = [
  { id: "overview", label: "Обзор квартала", icon: BarChart3 },
  { id: "suppliers", label: "Поставщики", icon: Building2 },
  { id: "benchmarks", label: "Бенчмарки", icon: Layers },
  { id: "actions", label: "Действия", icon: UserCheck },
  { id: "audit", label: "Аудит", icon: ShieldCheck },
];

const PIPELINE_BASE = 1_115_000;

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [actions, setActions] = useState<Action[]>(SEED_ACTIONS);
  const [audit, setAudit] = useState<AuditEvent[]>(SEED_AUDIT);

  // Modals & Drawers
  const [drawer, setDrawer] = useState<{ supplier: Supplier; po: PO | null } | null>(null);
  const [modal, setModal] = useState<{ supplier: Supplier; po: PO | null } | null>(null);
  const [auditScope, setAuditScope] = useState<string | null>(null);

  // Global search input
  const [globalSearch, setGlobalSearch] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (modal) setModal(null);
      else if (auditScope) setAuditScope(null);
      else if (drawer) setDrawer(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, auditScope, drawer]);

  // Filtered dataset
  const pos = useMemo(() => applyFilters(filters), [filters]);

  const addressed = PIPELINE_BASE + actions.reduce((a, x) => a + x.value, 0);
  const coverageNow = 1 - TOTALS.off / TOTALS.spend;
  const coverageForecast = Math.min(0.995, coverageNow + addressed / TOTALS.spend);

  const heroPO = useMemo(() => POS.find((p) => p.id === HERO_PO_ID)!, []);
  const heroSupplier = useMemo(() => SUPPLIERS.find((s) => s.id === HERO_SUPPLIER_ID)!, []);

  function addFilter(kind: Filter["kind"], value: string, label?: string) {
    setFilters((prev) => {
      if (prev.some((f) => f.kind === kind && f.value === value)) return prev;
      return [...prev, { id: `${kind}:${value}`, kind, value, label: label ?? value }];
    });
  }

  function removeFilter(id: string) {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  }

  function clearAllFilters() {
    setFilters([]);
  }

  // Bridge for overlay AI-assistant (ai-agent.js)
  useEffect(() => {
    const api = {
      goTab: (id: NavTab) => setActiveTab(id),
      search: (q: string) => {
        const query = String(q || "").trim();
        if (!query) return;
        setGlobalSearch(query);
        const matchedSup = SUPPLIERS.find(
          (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.inn.includes(query),
        );
        if (matchedSup) {
          addFilter("supplier", matchedSup.id, matchedSup.name);
          setActiveTab("suppliers");
          setGlobalSearch("");
          return;
        }
        const matchedPO = POS.find((p) => p.id.toLowerCase().includes(query.toLowerCase()));
        if (matchedPO) {
          const sup = SUPPLIERS.find((s) => s.id === matchedPO.supplierId);
          if (sup) setDrawer({ supplier: sup, po: matchedPO });
          setGlobalSearch("");
        }
      },
      filterOffContract: () => {
        setFilters((prev) => {
          if (prev.some((f) => f.kind === "coverage" && f.value === "off")) return prev;
          return [...prev, { id: "coverage:off", kind: "coverage", value: "off", label: "вне контракта" }];
        });
        setActiveTab("suppliers");
      },
      clearFilters: () => clearAllFilters(),
      openAction: () => setModal({ supplier: heroSupplier, po: heroPO }),
      openHero: () => setDrawer({ supplier: heroSupplier, po: heroPO }),
      openFirstSupplier: (preferOff?: boolean) => {
        const list =
          preferOff === false
            ? SUPPLIERS
            : SUPPLIERS.filter((s) => s.offContract).length
              ? SUPPLIERS.filter((s) => s.offContract)
              : SUPPLIERS;
        const first = list[0];
        if (!first) return;
        const po = POS.find((p) => p.supplierId === first.id && (preferOff !== false ? p.offContract : true))
          ?? POS.find((p) => p.supplierId === first.id)
          ?? null;
        setActiveTab("suppliers");
        setDrawer({ supplier: first, po });
      },
      getSnapshot: () => ({
        spendLabel: `Q3 2025 · $${(TOTALS.spend / 1e6).toFixed(1).replace(".", ",")} млн`,
        offSuppliers: TOTALS.offSuppliers,
        coverage: Math.round(coverageNow * 100),
        coverageForecast: Math.round(coverageForecast * 100),
        actionsOpen: actions.filter((a) => a.status !== "Закрыто").length,
        meeting: "14.10.2025",
        benchmarks: "+23 % · позиции выше рынка",
      }),
    };
    (window as unknown as { ProcureAIBridge?: typeof api }).ProcureAIBridge = api;
    return () => {
      delete (window as unknown as { ProcureAIBridge?: typeof api }).ProcureAIBridge;
    };
  }, [actions, coverageNow, coverageForecast, heroPO, heroSupplier]);

  function logAudit(event: string, detail: string, scope: string, actor = "Е. Соколова") {
    const now = new Date();
    const at = `2025-09-26 ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setAudit((prev) => [
      { id: "A-" + Math.floor(Math.random() * 9000 + 1000), at, actor, event, detail, scope },
      ...prev,
    ]);
  }

  function submitAction(a: Omit<Action, "id" | "created" | "status">) {
    const id = "ACT-" + (2043 + actions.length);
    setActions((prev) => [{ ...a, id, created: "2025-09-26", status: "Назначено" }, ...prev]);
    logAudit(
      `Назначено действие ${id}`,
      `${a.type} · ${a.supplier}${a.poId ? " · " + a.poId : ""} · ${a.assignee} · срок ${ruDate(a.due)} · ${money(a.value)}`,
      a.poId ? "Заказ" : "Поставщик",
    );
    setModal(null);
  }

  function advanceAction(id: string) {
    setActions((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status:
                a.status === "Назначено"
                  ? ("В работе" as const)
                  : ("Закрыто" as const),
            }
          : a,
      ),
    );
    const a = actions.find((x) => x.id === id);
    if (a) {
      logAudit(
        `Статус действия ${id} обновлён`,
        `${a.type} · ${a.supplier} · переход на следующий этап исполнения`,
        "Действие",
      );
    }
  }

  function handleGlobalSearch() {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return;
    const matchedSup = SUPPLIERS.find((s) => s.name.toLowerCase().includes(q) || s.inn.includes(q));
    if (matchedSup) {
      addFilter("supplier", matchedSup.id, matchedSup.name);
      setActiveTab("suppliers");
      setGlobalSearch("");
      return;
    }
    const matchedPO = POS.find((p) => p.id.toLowerCase().includes(q));
    if (matchedPO) {
      const sup = SUPPLIERS.find((s) => s.id === matchedPO.supplierId);
      if (sup) setDrawer({ supplier: sup, po: matchedPO });
      setGlobalSearch("");
      return;
    }
  }

  const drawerPos = drawer ? POS.filter((p) => p.supplierId === drawer.supplier.id) : [];

  return (
    <div className="sb-appshell tpl-appshell spend-app font-sans text-ink">
      <header className="sb-appshell-header">
        <span className="sb-appshell-logo spend-brand">
          <img src={logoMark} alt="SB" className="spend-brand-mark" width={30} height={30} />
          <span className="sb-appshell-title spend-brand-title">Портал «Управление закупками»</span>
        </span>
        <span className="sb-appshell-spacer" />
        <div className="nav-search spend-search">
          <Search className="nav-search-icon h-4 w-4" />
          <input
            className="nav-search-input"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGlobalSearch()}
            placeholder="Поставщик, ИНН, PO…"
          />
        </div>
        <span className="tag tag-neutral hidden items-center gap-1 md:inline-flex" style={{ background: "rgba(255,255,255,0.12)", color: "#e8f4f5" }}>
          <Calendar className="h-3.5 w-3.5" />
          Q3 2025 · $18,4 млн
        </span>
        <button type="button" className="btn btn-primary btn-s" onClick={() => setModal({ supplier: heroSupplier, po: heroPO })}>
          <Plus className="h-4 w-4" />
          Действие
        </button>
        <div className="sb-appshell-avatar" title="Е. Соколова">ЕС</div>
      </header>

      <div className="sb-appshell-body">
        <aside className="sb-appshell-sidebar">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count =
              tab.id === "overview" ? "$18,4M" :
              tab.id === "suppliers" ? "34 вне" :
              tab.id === "benchmarks" ? "+23 %" :
              tab.id === "actions" ? String(actions.length) : null;
            const warn = tab.id === "suppliers" || tab.id === "benchmarks";
            return (
              <button
                key={tab.id}
                type="button"
                className={cn("sb-appshell-nav", isActive && "is-active", warn && "is-warn")}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
                {count && <span className="sb-nav-count">{count}</span>}
              </button>
            );
          })}
        </aside>

        <main className="sb-appshell-main tpl-dashboard-main">
          <div className="sb-filter-bar">
            <span className="sb-filter-bar-label">
              <SlidersHorizontal className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
              Фильтры:
            </span>
            <span className="sb-filter-chip">Q3 2025 (01.07 – 30.09)</span>
            {filters.map((f) => (
              <span key={f.id} className="sb-filter-chip">
                {KIND_LABEL[f.kind]}: {f.label}
                <button type="button" onClick={() => removeFilter(f.id)} aria-label="Убрать">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {filters.length === 0 && (
              <span className="text-[13px] text-[var(--text-secondary)]">
                Кликните по сегменту на карте, чтобы сузить срез
              </span>
            )}
            <button
              type="button"
              className={cn("btn btn-s", filters.some((f) => f.kind === "coverage") ? "btn-danger" : "btn-secondary")}
              onClick={() =>
                filters.some((f) => f.kind === "coverage")
                  ? setFilters((prev) => prev.filter((f) => f.kind !== "coverage"))
                  : addFilter("coverage", "off", "вне контракта")
              }
            >
              <FilterIcon className="h-3.5 w-3.5" />
              Только вне контракта
            </button>
            {filters.length > 0 && (
              <button type="button" className="sb-filter-reset" onClick={clearAllFilters}>
                Сбросить всё ({filters.length})
              </button>
            )}
          </div>

        {activeTab === "overview" && (
          <QuarterOverview
            pos={pos}
            allPos={POS}
            suppliers={SUPPLIERS}
            totals={TOTALS}
            coverageNow={coverageNow}
            coverageForecast={coverageForecast}
            addressed={addressed}
            actions={actions}
            filters={filters}
            trend={QUARTER_TREND.map((q) => ({ q: q.q, v: q.coverage }))}
            onAddFilter={addFilter}
            onClearFilters={clearAllFilters}
            onOpenSupplier={(s, po) => setDrawer({ supplier: s, po: po ?? null })}
            onOpenAudit={(scope) => setAuditScope(scope)}
            onNavigateTab={(tab) => setActiveTab(tab as NavTab)}
            heroPO={heroPO}
            heroSupplier={heroSupplier}
          />
        )}

        {activeTab === "suppliers" && (
          <SuppliersPage
            suppliers={SUPPLIERS}
            pos={pos}
            actions={actions}
            onOpenSupplier={(s, po) => setDrawer({ supplier: s, po: po ?? null })}
            onAssignAction={(s, po) => setModal({ supplier: s, po: po ?? null })}
            onFilterByCategory={(cat) => addFilter("category", cat, cat)}
          />
        )}

        {activeTab === "benchmarks" && (
          <BenchmarksPage
            pos={pos}
            suppliers={SUPPLIERS}
            heroPO={heroPO}
            heroSupplier={heroSupplier}
            onOpenSupplier={(s, po) => setDrawer({ supplier: s, po: po ?? null })}
            onAssignAction={(s, po) => setModal({ supplier: s, po: po ?? null })}
          />
        )}

        {activeTab === "actions" && (
          <ActionsPage
            actions={actions}
            suppliers={SUPPLIERS}
            pos={POS}
            coverageNow={coverageNow}
            coverageForecast={coverageForecast}
            addressed={addressed}
            onOpenSupplier={(s, po) => setDrawer({ supplier: s, po: po ?? null })}
            onAdvanceAction={advanceAction}
            onNewAction={() => setModal({ supplier: heroSupplier, po: heroPO })}
            onOpenAudit={(scope) => setAuditScope(scope)}
          />
        )}

        {activeTab === "audit" && (
          <AuditPage events={audit} onLogAudit={logAudit} />
        )}
        </main>
      </div>

      <footer className="flex min-h-[85px] w-full shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 self-stretch border-t border-line bg-sheet px-6 py-8 text-[13px] leading-5 text-ink-2">
        <span className="flex items-center gap-4 font-medium">
          <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden />
          {activeTab === "actions"
            ? `Действия · ${actions.filter((a) => a.status === "В работе").length} в работе · до совещания 14.10`
            : activeTab === "audit"
              ? `Аудит · ${audit.length} записей · ERP синхронизирован`
              : "ERP · реестр договоров синхронизирован"}
        </span>
        <span className="flex flex-wrap items-center gap-x-3">
          <span>Совещание по закупкам: 14.10.2025</span>
          <span className="text-line" aria-hidden>
            ·
          </span>
          <span>
            {activeTab === "suppliers"
              ? `Поставщики · ${SUPPLIERS.filter((s) => s.offContract).length} вне контракта · покрытие ${Math.round(coverageNow * 100)} %`
              : activeTab === "benchmarks"
                ? "Бенчмарки · 141 выше рынка · макс. +71 %"
                : activeTab === "actions"
                  ? `Действия · ${actions.filter((a) => a.status === "В работе").length} в работе · до совещания 14.10`
                  : activeTab === "audit"
                    ? `Аудит · ${audit.length} записей · ERP синхронизирован`
                    : `Покрытие ${Math.round(coverageNow * 100)} % → ${Math.round(coverageForecast * 100)} %`}
          </span>
        </span>
      </footer>

      {/* ── Модальные окна и Drawers ── */}
      {drawer && (
        <SupplierDrawer
          supplier={drawer.supplier}
          pos={drawerPos}
          openPO={drawer.po}
          actions={actions.filter((a) => a.supplierId === drawer.supplier.id)}
          onOpenPO={(po) => setDrawer((d) => (d ? { ...d, po } : d))}
          onClose={() => setDrawer(null)}
          onAssign={(supplier, po) => setModal({ supplier, po })}
          onFilter={(kind, value) => {
            addFilter(kind, value, value);
            setDrawer(null);
          }}
          onAudit={(scope) => setAuditScope(scope)}
        />
      )}

      {modal && (
        <ActionModal
          supplier={modal.supplier}
          po={modal.po}
          value={
            modal.po
              ? modal.po.offAmount || modal.po.amount
              : modal.supplier.offAmount || Math.round(modal.supplier.spend * 0.1)
          }
          onClose={() => setModal(null)}
          onSubmit={submitAction}
        />
      )}

      {auditScope && (
        <AuditDrawer events={audit} scope={auditScope} onClose={() => setAuditScope(null)} />
      )}
    </div>
  );
}
