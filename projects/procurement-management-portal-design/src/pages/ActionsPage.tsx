import { useMemo, useState } from "react";
import {
  UserCheck,
  Boxes,
  BadgeCheck,
  Plus,
  Clock3,
  ArrowRight,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";
import type { Action, Supplier, PO } from "../data/model";
import { money, pct, ruDate, usd } from "../lib/format";
import { Btn, FieldSearch, Flag, Panel, Seg, Stat, TableShell, Th } from "../components/ui";

interface Props {
  actions: Action[];
  suppliers: Supplier[];
  pos: PO[];
  coverageNow: number;
  coverageForecast: number;
  addressed: number;
  onOpenSupplier: (s: Supplier, po?: PO | null) => void;
  onAdvanceAction: (id: string) => void;
  onNewAction: () => void;
  onOpenAudit: (scope: string) => void;
}

const COLS: { s: Action["status"]; title: string; desc: string; icon: typeof UserCheck }[] = [
  { s: "Назначено", title: "Назначено", desc: "Действие зафиксировано до совещания", icon: UserCheck },
  { s: "В работе", title: "В работе", desc: "Ведутся переговоры или подключение", icon: Boxes },
  { s: "Закрыто", title: "Закрыто", desc: "Условия согласованы, сумма под контролем", icon: BadgeCheck },
];

export default function ActionsPage({
  actions,
  suppliers,
  pos,
  coverageNow,
  coverageForecast,
  addressed,
  onOpenSupplier,
  onAdvanceAction,
  onNewAction,
  onOpenAudit,
}: Props) {
  const [view, setView] = useState<"board" | "table">("board");
  const [typeFilter, setTypeFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const assignees = useMemo(() => {
    const s = new Set<string>();
    actions.forEach((a) => s.add(a.assignee));
    return Array.from(s).sort();
  }, [actions]);

  const filteredActions = useMemo(() => {
    return actions.filter((a) => {
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (assigneeFilter !== "all" && a.assignee !== assigneeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const mSup = a.supplier.toLowerCase().includes(q);
        const mPo = a.poId?.toLowerCase().includes(q) ?? false;
        const mNote = a.note.toLowerCase().includes(q);
        const mAss = a.assignee.toLowerCase().includes(q);
        if (!mSup && !mPo && !mNote && !mAss) return false;
      }
      return true;
    });
  }, [actions, typeFilter, assigneeFilter, search]);

  const totalValue = filteredActions.reduce((acc, a) => acc + a.value, 0);

  return (
    <div className="space-y-4">
      {/* ── KPI блок действий ── */}
      <div className="sb-stats layout-grid size-s">
        <Stat
          label="Всего действий"
          value={String(actions.length)}
          sub="в журнале решений Q3"
        />
        <Stat
          label="Объём под контролем"
          value={money(addressed)}
          tone="alert"
          sub="сумма зафиксированных решений"
        />
        <Stat
          label="Текущее покрытие"
          value={pct(coverageNow, 0)}
          tone="brand"
          sub="расходов по контракту на сегодня"
        />
        <Stat
          label="Прогноз покрытия Q4"
          value={pct(coverageForecast, 0)}
          tone="brand"
          sub="после исполнения назначенных действий (цель 96 %)"
        />
      </div>

      {/* ── Панель фильтров и переключателя вида ── */}
      <Panel
        eyebrow="Управление закупками"
        title="Панель корректирующих действий"
        subtitle="Решения, выработанные за неделю до совещания по закупкам: пересмотр условий, подключение к контрактам, блокировка поставщиков."
        right={
          <div className="flex items-center gap-2">
            <Btn variant="alert" size="sm" icon={<Plus className="h-4 w-4" />} onClick={onNewAction}>
              Назначить действие
            </Btn>
            <Btn variant="line" size="sm" onClick={() => onOpenAudit("Панель действий · решения")}>
              Аудиторский след
            </Btn>
          </div>
        }
      >
        <div className="sb-table-toolbar">
          <div className="flex flex-wrap items-center gap-3">
            <FieldSearch
              value={search}
              onChange={setSearch}
              placeholder="Поиск по поставщику, PO или исполнителю..."
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="form-select"
              aria-label="Тип действия"
            >
              <option value="all">Все типы действий</option>
              <option value="Пересмотр условий">Пересмотр условий</option>
              <option value="Подключение к контракту">Подключение к контракту</option>
              <option value="Блокировка поставщика">Блокировка поставщика</option>
              <option value="Запрос обоснования">Запрос обоснования</option>
            </select>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="form-select"
              aria-label="Исполнитель"
            >
              <option value="all">Все исполнители ({assignees.length})</option>
              {assignees.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <Seg
            value={view}
            onChange={setView}
            options={[
              { id: "board", label: <> <LayoutGrid className="h-3.5 w-3.5" /> Канбан-доска </> },
              { id: "table", label: <> <TableIcon className="h-3.5 w-3.5" /> Таблица </> },
            ]}
          />
        </div>

        {/* ── Канбан-доска ── */}
        {view === "board" ? (
          <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
            {COLS.map((col) => {
              const colItems = filteredActions.filter((a) => a.status === col.s);
              const colValue = colItems.reduce((acc, a) => acc + a.value, 0);
              const Icon = col.icon;
              return (
                <div key={col.s} className="sb-card space-sm shadow-false flex flex-col">
                  {/* Заголовок колонки */}
                  <div className="flex items-start justify-between border-b border-line bg-sheet p-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-ink">
                        <Icon className="h-4 w-4 text-brand" />
                        <span>{col.title}</span>
                        <span className="num ml-1 rounded-full bg-surface-2 px-1.5 py-[1px] text-[10.5px] text-ink-2">
                          {colItems.length}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[10.5px] text-ink-3">{col.desc}</div>
                    </div>
                    <span className="num text-[11px] font-bold text-alert">{money(colValue)}</span>
                  </div>

                  {/* Список карточек */}
                  <div className="flex-1 space-y-2.5 p-2.5">
                    {colItems.map((a) => {
                      const sup = suppliers.find((s) => s.id === a.supplierId);
                      const targetPO = a.poId ? pos.find((p) => p.id === a.poId) : null;
                      return (
                        <div
                          key={a.id}
                          className="sb-card space-sm shadow-false group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <Flag
                              tone={
                                a.type === "Блокировка поставщика"
                                  ? "alert"
                                  : a.type === "Пересмотр условий"
                                    ? "alert"
                                    : "ok"
                              }
                            >
                              {a.type}
                            </Flag>
                            <span className="num text-[11.5px] font-bold text-alert">
                              {money(a.value)}
                            </span>
                          </div>

                          <div
                            onClick={() => sup && onOpenSupplier(sup, targetPO)}
                            className="mt-2 cursor-pointer font-bold text-ink transition-colors group-hover:text-brand"
                          >
                            <div className="text-[12.5px]">{a.supplier}</div>
                            {a.poId && (
                              <div className="num mt-0.5 text-[10.5px] font-medium text-ink-3">
                                Прикреплён заказ: <b className="text-ink">{a.poId}</b>
                              </div>
                            )}
                          </div>

                          <p className="mt-2 text-[11px] leading-snug text-ink-2">{a.note}</p>

                          <div className="mt-3 flex items-center justify-between border-t border-line/70 pt-2 text-[10.5px] text-ink-3">
                            <span className="font-medium text-ink">{a.assignee}</span>
                            <span className="num flex items-center gap-1">
                              <Clock3 className="h-3 w-3" />
                              до {ruDate(a.due)}
                            </span>
                          </div>

                          {/* Кнопка продвижения статуса */}
                          {col.s !== "Закрыто" && (
                            <div className="mt-2.5 border-t border-line/60 pt-2">
                              <Btn
                                variant="line"
                                size="xs"
                                className="w-full justify-center"
                                icon={<ArrowRight className="h-3 w-3" />}
                                onClick={() => onAdvanceAction(a.id)}
                              >
                                {col.s === "Назначено" ? "Перевести в работу" : "Закрыть действие"}
                              </Btn>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {colItems.length === 0 && (
                      <div className="sb-card shadow-false view-outlined grid h-[120px] place-items-center text-[13px] text-[var(--text-secondary)]">
                        Нет действий в этом статусе
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Табличный вид ── */
          <TableShell compact>
            <table className="sb-table-grid">
              <thead>
                <tr>
                  <Th>ID / Дата</Th>
                  <Th>Тип действия</Th>
                  <Th>Поставщик</Th>
                  <Th>Привязанный PO</Th>
                  <Th>Исполнитель</Th>
                  <Th>Срок исполнения</Th>
                  <Th align="right">Сумма под контролем</Th>
                  <Th>Статус</Th>
                  <Th>Комментарий</Th>
                  <Th align="right">Управление</Th>
                </tr>
              </thead>
              <tbody>
                {filteredActions.map((a) => {
                  const sup = suppliers.find((s) => s.id === a.supplierId);
                  const targetPO = a.poId ? pos.find((p) => p.id === a.poId) : null;
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-line/70 transition-colors last:border-0 hover:bg-brand-soft/30"
                    >
                      <td className="num px-3 py-2 text-[11px] font-semibold text-ink">
                        <div>{a.id}</div>
                        <div className="text-[10px] text-ink-3">{ruDate(a.created)}</div>
                      </td>
                      <td className="px-3 py-2 text-[11.5px] font-bold text-ink">{a.type}</td>
                      <td className="px-3 py-2 text-[11.5px] font-medium text-ink">
                        <button
                          type="button"
                          onClick={() => sup && onOpenSupplier(sup, targetPO)}
                          className="sb-link sb-link--underline"
                        >
                          {a.supplier}
                        </button>
                      </td>
                      <td className="num px-3 py-2 text-[11px] text-ink-3">{a.poId ?? "—"}</td>
                      <td className="px-3 py-2 text-[11.5px] text-ink-2">{a.assignee}</td>
                      <td className="num px-3 py-2 text-[11.5px] text-ink-2">{ruDate(a.due)}</td>
                      <td className="num px-3 py-2 text-right text-[11.5px] font-bold text-alert">
                        {usd(a.value)}
                      </td>
                      <td className="px-3 py-2">
                        <Flag tone={a.status === "Закрыто" ? "ok" : a.status === "В работе" ? "mute" : "alert"}>
                          {a.status}
                        </Flag>
                      </td>
                      <td className="px-3 py-2 max-w-[240px] truncate text-[11px] text-ink-3" title={a.note}>
                        {a.note}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {a.status !== "Закрыто" && (
                          <Btn
                            variant="line"
                            size="xs"
                            onClick={() => onAdvanceAction(a.id)}
                          >
                            {a.status === "Назначено" ? "В работу" : "Закрыть"}
                          </Btn>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableShell>
        )}

        {/* Футер */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface/70 px-4 py-2.5 text-[11px] text-ink-3">
          <span>
            Показано действий: <b className="text-ink">{filteredActions.length}</b>
          </span>
          <span className="num font-semibold">
            Сумма под контролем в текущей выборке: <b className="text-alert">{usd(totalValue)}</b>
          </span>
        </div>
      </Panel>
    </div>
  );
}
