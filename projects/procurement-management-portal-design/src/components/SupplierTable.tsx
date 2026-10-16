import { useMemo, useState } from "react";
import { ArrowUpRight, Ban, BadgeCheck, ShieldAlert } from "lucide-react";
import type { SupplierRow } from "../lib/select";
import { money, pct, usd } from "../lib/format";
import { MiniBar, Switch, TableShell, Th } from "./ui";
import { cn } from "../utils/cn";

type SortKey = "name" | "fSpend" | "fOff" | "coverage" | "fPos";

export default function SupplierTable({
  rows,
  onOpen,
  actionCounts,
  onFilter,
}: {
  rows: SupplierRow[];
  onOpen: (r: SupplierRow) => void;
  actionCounts: Record<string, number>;
  onFilter: (kind: "category" | "owner" | "reason", value: string) => void;
}) {
  const [sort, setSort] = useState<SortKey>("fOff");
  const [dir, setDir] = useState<"desc" | "asc">("desc");
  const [onlyOff, setOnlyOff] = useState(false);

  const sorted = useMemo(() => {
    const base = rows.filter((x) => (onlyOff ? x.fOff > 0 : true));
    const s = base.sort((a, b) => {
      let v = 0;
      if (sort === "name") v = a.name.localeCompare(b.name);
      else if (sort === "coverage") {
        const ca = a.fSpend ? a.fOff / a.fSpend : 0;
        const cb = b.fSpend ? b.fOff / b.fSpend : 0;
        v = ca - cb;
      } else v = (a[sort] as number) - (b[sort] as number);
      return dir === "desc" ? (sort === "name" ? -v : -v) : sort === "name" ? -v : v;
    });
    return [...s];
  }, [rows, sort, dir, onlyOff]);

  const head = (k: SortKey, label: string, align: "left" | "right" = "right") => (
    <Th
      align={align}
      onClick={() => {
        if (sort === k) setDir((d) => (d === "desc" ? "asc" : "desc"));
        else {
          setSort(k);
          setDir("desc");
        }
      }}
      active={sort === k}
      dir={dir}
    >
      {label}
    </Th>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="sb-table-toolbar">
        <div className="sb-table-toolbar-label">Срез</div>
        <span className="num text-[13px] text-[var(--text-secondary)]">
          <b className="text-[var(--text-main)]">{sorted.length}</b> поставщиков ·{" "}
          {money(sorted.reduce((a, r) => a + r.fSpend, 0))} · вне договоров{" "}
          <b className="text-[var(--danger)]">{money(sorted.reduce((a, r) => a + r.fOff, 0))}</b>
        </span>
        <Switch checked={onlyOff} onChange={setOnlyOff} label="только с отклонениями" />
      </div>
      <TableShell compact className="max-h-[440px]">
        <table className="sb-table-grid">
          <thead>
            <tr>
              {head("name", "Поставщик", "left")}
              <Th align="left">Категория</Th>
              <Th align="left">Владелец</Th>
              <Th align="left">Причина отклонения</Th>
              {head("fPos", "PO")}
              {head("fSpend", "Расходы")}
              {head("fOff", "Вне контракта")}
              {head("coverage", "Покрытие")}
              <Th align="right">Действия</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const cov = r.fSpend ? 1 - r.fOff / r.fSpend : 1;
              const n = actionCounts[r.id] ?? 0;
              const hot = r.fOff > 0;
              return (
                <tr
                  key={r.id}
                  onClick={() => onOpen(r)}
                  className={cn(
                    "group cursor-pointer border-b border-line/70 transition-colors last:border-0 hover:bg-brand-soft/35",
                    hot && "bg-alert-soft/25",
                  )}
                >
                  <td className="relative px-3 py-2 text-[11.5px] font-bold whitespace-nowrap text-ink">
                    <span className="absolute inset-y-0 left-0 w-[2px] scale-y-0 bg-brand transition-transform duration-200 group-hover:scale-y-100" />
                    <span className="group-hover:text-brand">{r.name}</span>
                    {r.risk === "Высокий" && <ShieldAlert className="ml-1.5 inline h-3.5 w-3.5 align-[-2px] text-alert" />}
                  </td>
                  <td className="px-3 py-2 text-[11.5px] whitespace-nowrap text-ink-2">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onFilter("category", r.category);
                      }}
                      className="sb-link sb-link--underline"
                    >
                      {r.category}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[11.5px] whitespace-nowrap text-ink-2">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onFilter("owner", r.owner);
                      }}
                      className="sb-link sb-link--underline"
                    >
                      {r.owner}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {hot && r.reason ? (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onFilter("reason", r.reason!);
                        }}
                        className="tag tag-danger cursor-pointer"
                      >
                        <Ban className="h-3 w-3" />
                        {r.reason}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10.5px] text-ink-3">
                        <BadgeCheck className="h-3 w-3 text-brand" />
                        в рамках политики
                      </span>
                    )}
                  </td>
                  <td className="num px-3 py-2 text-right text-[11.5px] text-ink-2">{r.fPos}</td>
                  <td className="num px-3 py-2 text-right text-[11.5px] text-ink">{usd(r.fSpend)}</td>
                  <td className={cn("num px-3 py-2 text-right text-[11.5px] font-bold", hot ? "text-alert" : "text-ink-3")}>
                    {hot ? usd(r.fOff) : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-[54px]">
                        <MiniBar value={cov} tone={cov < 0.9 ? "alert" : "brand"} />
                      </div>
                      <span className="num w-[38px] text-right text-[11px] text-ink-2">{pct(cov, 0)}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {n > 0 ? (
                      <span className="tag tag-promo">
                        {n}
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="text-[11px] text-ink-3">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-[11.5px] text-ink-3">
                  В текущем срезе нет поставщиков — снимите один из фильтров.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
}
