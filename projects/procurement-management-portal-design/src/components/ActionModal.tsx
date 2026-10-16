import { useState } from "react";
import { Ban, CircleCheck, FilePlus2, Link2, Scale } from "lucide-react";
import { OWNERS, type Action, type ActionType, type PO, type Supplier } from "../data/model";
import { money, ruDate, usd } from "../lib/format";
import { Btn, CloseBtn } from "./ui";
import { cn } from "../utils/cn";

const TYPES: { t: ActionType; d: string; icon: typeof Scale }[] = [
  { t: "Пересмотр условий", d: "Вынести строки выше бенчмарка на переговоры.", icon: Scale },
  { t: "Подключение к контракту", d: "Перевести номенклатуру на рамочное соглашение.", icon: Link2 },
  { t: "Блокировка поставщика", d: "Запретить новые заказы до заключения договора.", icon: Ban },
  { t: "Запрос обоснования", d: "Запросить у владельца обоснование закупки вне политики.", icon: FilePlus2 },
];

export default function ActionModal({
  supplier,
  po,
  value,
  onClose,
  onSubmit,
}: {
  supplier: Supplier;
  po: PO | null;
  value: number;
  onClose: () => void;
  onSubmit: (a: Omit<Action, "id" | "created" | "status">) => void;
}) {
  const [type, setType] = useState<ActionType>(po ? "Пересмотр условий" : "Подключение к контракту");
  const [assignee, setAssignee] = useState(supplier.owner);
  const [due, setDue] = useState("2025-10-15");
  const [note, setNote] = useState("");
  const meta = TYPES.find((t) => t.t === type)!;

  return (
    <div className="live-overlay" onClick={onClose} role="presentation">
      <div className="live-modal action-modal animate-popin" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <header className="action-modal-head">
          <div className="min-w-0">
            <span className="tag tag-promo">Корректирующее действие</span>
            <h4>Назначить до совещания по закупкам</h4>
            <p>
              {supplier.name}
              {po ? ` · ${po.id}` : ""}
              <span className="action-modal-dot">·</span>
              объём {money(value)}
            </p>
          </div>
          <CloseBtn onClick={onClose} />
        </header>

        <div className="action-modal-body">
          <div className="action-field">
            <div className="form-label">Тип действия</div>
            <div className="action-type-grid" role="radiogroup" aria-label="Тип действия">
              {TYPES.map((t) => {
                const Icon = t.icon;
                const on = type === t.t;
                return (
                  <button
                    key={t.t}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setType(t.t)}
                    className={cn("action-type-card", on && "is-on")}
                  >
                    <span className="action-type-icon">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="action-type-title">{t.t}</span>
                      <span className="action-type-desc">{t.d}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="action-field-row">
            <label className="action-field">
              <span className="form-label">Ответственный</span>
              <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="form-select">
                {OWNERS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="action-field">
              <span className="form-label">Срок исполнения</span>
              <input
                type="date"
                className="form-input"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </label>
          </div>

          <label className="action-field">
            <span className="form-label">Комментарий для повестки</span>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                po
                  ? `Позиции ${po.id} выше согласованной цены — вынести на переговоры.`
                  : "Кратко: что должно измениться к следующему квартальному обзору."
              }
              className="form-textarea"
            />
          </label>

          <div className="action-summary">
            <span>{meta.d}</span>
            <strong>+{usd(value)} к покрытию договорами</strong>
          </div>
        </div>

        <footer className="action-modal-foot">
          <span>
            В аудиторский след · срок {ruDate(due)} · {assignee}
          </span>
          <div className="modal-actions">
            <Btn variant="line" onClick={onClose}>
              Отмена
            </Btn>
            <Btn
              variant="solid"
              icon={<CircleCheck className="h-4 w-4" />}
              onClick={() =>
                onSubmit({
                  type,
                  supplierId: supplier.id,
                  supplier: supplier.name,
                  poId: po?.id ?? null,
                  assignee,
                  due,
                  value,
                  note: note || meta.d,
                })
              }
            >
              Назначить и записать в аудит
            </Btn>
          </div>
        </footer>
      </div>
    </div>
  );
}
