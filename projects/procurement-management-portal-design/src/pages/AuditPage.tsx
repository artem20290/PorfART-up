import { useMemo, useState } from "react";
import {
  ScrollText,
  Download,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import type { AuditEvent } from "../data/model";
import { Btn, FieldSearch, Flag, Panel, Stat, TableShell, Th } from "../components/ui";

interface Props {
  events: AuditEvent[];
  onLogAudit: (event: string, detail: string, scope: string) => void;
}

export default function AuditPage({ events, onLogAudit }: Props) {
  const [scopeFilter, setScopeFilter] = useState("all");
  const [actorFilter, setActorFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const actors = useMemo(() => {
    const s = new Set<string>();
    events.forEach((e) => s.add(e.actor));
    return Array.from(s).sort();
  }, [events]);

  const scopes = useMemo(() => {
    const s = new Set<string>();
    events.forEach((e) => s.add(e.scope));
    return Array.from(s).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (scopeFilter !== "all" && e.scope !== scopeFilter) return false;
      if (actorFilter !== "all" && e.actor !== actorFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const mEvent = e.event.toLowerCase().includes(q);
        const mDetail = e.detail.toLowerCase().includes(q);
        const mActor = e.actor.toLowerCase().includes(q);
        if (!mEvent && !mDetail && !mActor) return false;
      }
      return true;
    });
  }, [events, scopeFilter, actorFilter, search]);

  function triggerExport() {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice("Пакет аудита за Q3 2025 сформирован и готов к передаче в Службу внутреннего контроля.");
      onLogAudit(
        "Выгрузка аудиторского отчёта",
        "Сформирован официальный пакет решений и отклонений по закупкам за III квартал 2025 г.",
        "Квартал",
      );
      setTimeout(() => setExportNotice(null), 5000);
    }, 800);
  }

  function simulateSync() {
    onLogAudit(
      "Синхронизация ERP и Реестра",
      "Принудительная сверка статусов согласования заказов с мастер-системой ERP / Реестром договоров. Расхождений не выявлено.",
      "Квартал",
    );
  }

  return (
    <div className="space-y-4">
      {/* ── KPI блок аудита ── */}
      <div className="sb-stats layout-grid size-s">
        <Stat
          label="Всего записей в аудите"
          value={String(events.length)}
          sub="неизменяемый реестр решений"
        />
        <Stat
          label="Статус интеграции ERP"
          value="100 %"
          tone="brand"
          sub="1 248 строк заказов импортировано"
        />
        <Stat
          label="Зафиксировано отклонений"
          value="34"
          tone="alert"
          sub="поставщиков с нарушением контракта"
        />
        <Stat
          label="Готовность к проверке"
          value="Подтверждена"
          tone="brand"
          sub="Служба внутреннего контроля холдинга"
        />
      </div>

      {exportNotice && (
        <div className="sb-alert sb-alert--success">
          <span className="sb-alert-icon" aria-hidden>
            <CheckCircle2 className="h-[18px] w-[18px]" />
          </span>
          <div className="sb-alert-body">
            <strong>{exportNotice}</strong>
          </div>
          <button type="button" className="sb-alert-close" onClick={() => setExportNotice(null)} aria-label="Закрыть">
            ×
          </button>
        </div>
      )}

      {/* ── Реестр событий аудита ── */}
      <Panel
        eyebrow="Комплаенс и контроль"
        title="Журнал решений и аудиторский след закупок"
        subtitle="Каждая закупка вне контракта, согласование без проверки и корректирующее действие фиксируются в неизменяемом протоколе."
        right={
          <div className="flex items-center gap-2">
            <Btn variant="line" size="xs" icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={simulateSync}>
              Сверить с ERP
            </Btn>
            <Btn
              variant="alert"
              size="xs"
              icon={<Download className="h-3.5 w-3.5" />}
              disabled={isExporting}
              onClick={triggerExport}
            >
              {isExporting ? "Формирование пакета..." : "Выгрузить пакет аудита"}
            </Btn>
          </div>
        }
      >
        <div className="sb-table-toolbar">
          <FieldSearch
            value={search}
            onChange={setSearch}
            placeholder="Поиск по событию, описанию или автору..."
          />
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="form-select"
            aria-label="Область"
          >
            <option value="all">Все области ({scopes.length})</option>
            {scopes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            className="form-select"
            aria-label="Автор записи"
          >
            <option value="all">Все авторы ({actors.length})</option>
            {actors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
            {(search || scopeFilter !== "all" || actorFilter !== "all") && (
              <Btn
                variant="ghost"
                size="xs"
                onClick={() => {
                  setSearch("");
                  setScopeFilter("all");
                  setActorFilter("all");
                }}
              >
                Сбросить
              </Btn>
            )}
        </div>

        {/* Таблица событий */}
          <TableShell compact className="max-h-[560px]">
          <table className="sb-table-grid">
            <thead>
              <tr>
                <Th>ID / Метка времени</Th>
                <Th>Автор решения</Th>
                <Th>Событие</Th>
                <Th>Подробное описание и контекст решения</Th>
                <Th align="right">Область действия</Th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-line/70 transition-colors last:border-0 hover:bg-brand-soft/30"
                >
                  <td className="num px-3 py-2.5 text-[11px] whitespace-nowrap text-ink">
                    <div className="font-bold">{e.id}</div>
                    <div className="text-[10px] text-ink-3">{e.at}</div>
                  </td>

                  <td className="px-3 py-2.5 text-[11.5px] whitespace-nowrap font-medium text-ink">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-surface-2 text-[9px] font-bold text-ink-2">
                        {e.actor.slice(0, 2).toUpperCase()}
                      </span>
                      {e.actor}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 text-[11.5px] font-bold whitespace-nowrap text-ink">
                    <span className="inline-flex items-center gap-1.5">
                      <ScrollText className="h-3.5 w-3.5 text-brand" />
                      {e.event}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 text-[11.5px] leading-snug text-ink-2">
                    {e.detail}
                  </td>

                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    <Flag
                      tone={
                        e.scope === "Заказ"
                          ? "alert"
                          : e.scope === "Поставщик"
                            ? "mute"
                            : "ok"
                      }
                    >
                      {e.scope}
                    </Flag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>

        {/* Футер */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface/70 px-4 py-2.5 text-[11px] text-ink-3">
          <span>
            Показано событий: <b className="text-ink">{filteredEvents.length}</b> из {events.length}
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" />
            Записи защищены криптографической контрольной суммой и неизменяемы
          </span>
        </div>
      </Panel>
    </div>
  );
}
