import { ScrollText } from "lucide-react";
import type { AuditEvent } from "../data/model";
import { CloseBtn } from "./ui";

export default function AuditDrawer({ events, scope, onClose }: { events: AuditEvent[]; scope: string; onClose: () => void }) {
  return (
    <div className="live-overlay live-overlay--drawer" onClick={onClose} role="presentation">
      <aside className="live-drawer tpl-drawer-sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="live-drawer-head">
          <div>
            <div className="eyebrow mb-1 flex items-center gap-1.5 text-brand">
              <ScrollText className="h-3.5 w-3.5" />
              Аудиторский след
            </div>
            <p className="m-0 text-[13px] text-[var(--text-secondary)]">Контекст: {scope}</p>
          </div>
          <CloseBtn onClick={onClose} />
        </div>
        <div className="live-drawer-body">
          <ol className="relative space-y-0 border-l border-line-2 pl-4">
            {events.map((e) => (
              <li key={e.id} className="group relative pb-5">
                <span className="absolute top-[7px] -left-[21px] h-[7px] w-[7px] rounded-full border-2 border-line-2 bg-sheet transition-colors group-hover:border-alert group-hover:bg-alert" />
                <div className="num text-[10.5px] text-ink-3">
                  {e.at} · {e.scope}
                </div>
                <div className="mt-0.5 text-[12px] font-bold text-ink">{e.event}</div>
                <div className="mt-0.5 text-[11.5px] leading-snug text-ink-2">{e.detail}</div>
                <div className="mt-1 text-[10.5px] font-medium text-ink-3">{e.actor}</div>
              </li>
            ))}
          </ol>
        </div>
        <footer className="border-t border-[var(--border)] bg-[var(--neutral-bg)] px-5 py-2.5 text-[12px] text-[var(--text-secondary)]">
          Записи неизменяемы · выгрузка для внутреннего аудита
        </footer>
      </aside>
    </div>
  );
}
