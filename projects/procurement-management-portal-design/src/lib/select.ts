import { POS, SUPPLIERS, type PO, type Supplier } from "../data/model";

export type FilterKind = "category" | "supplier" | "reason" | "owner" | "site" | "coverage" | "po";

export type Filter = {
  id: string;
  kind: FilterKind;
  value: string;
  label: string;
};

export const KIND_LABEL: Record<FilterKind, string> = {
  category: "Категория",
  supplier: "Поставщик",
  reason: "Причина",
  owner: "Владелец",
  site: "Площадка",
  coverage: "Покрытие",
  po: "Заказ",
};

export function applyFilters(filters: Filter[]): PO[] {
  return POS.filter((p) =>
    filters.every((f) => {
      switch (f.kind) {
        case "category":
          return p.category === f.value;
        case "supplier":
          return p.supplierId === f.value;
        case "reason":
          return p.reason === f.value;
        case "owner":
          return p.owner === f.value;
        case "site":
          return p.site === f.value;
        case "po":
          return p.id === f.value;
        case "coverage":
          return f.value === "off" ? p.offContract : !p.offContract;
        default:
          return true;
      }
    }),
  );
}

export type Agg = { key: string; label: string; spend: number; off: number; count: number; meta?: unknown };

export function groupBy(pos: PO[], by: "category" | "supplierId" | "reason" | "owner" | "site"): Agg[] {
  const map = new Map<string, Agg>();
  for (const p of pos) {
    const raw = (p as unknown as Record<string, string | null>)[by];
    const key = raw ?? "—";
    const label = by === "supplierId" ? p.supplier : key;
    let a = map.get(key);
    if (!a) {
      a = { key, label, spend: 0, off: 0, count: 0 };
      map.set(key, a);
    }
    a.spend += p.amount;
    a.off += p.offAmount;
    a.count += 1;
  }
  return [...map.values()].sort((a, b) => b.spend - a.spend);
}

export type SupplierRow = Supplier & { fSpend: number; fOff: number; fPos: number };

export function supplierRows(pos: PO[]): SupplierRow[] {
  const map = new Map<string, { spend: number; off: number; count: number }>();
  for (const p of pos) {
    const e = map.get(p.supplierId) ?? { spend: 0, off: 0, count: 0 };
    e.spend += p.amount;
    e.off += p.offAmount;
    e.count += 1;
    map.set(p.supplierId, e);
  }
  const rows: SupplierRow[] = [];
  for (const [id, e] of map) {
    const s = SUPPLIERS.find((x) => x.id === id)!;
    rows.push({ ...s, fSpend: e.spend, fOff: e.off, fPos: e.count });
  }
  return rows.sort((a, b) => b.fOff - a.fOff || b.fSpend - a.fSpend);
}

export function kpis(pos: PO[]) {
  const spend = pos.reduce((a, p) => a + p.amount, 0);
  const off = pos.reduce((a, p) => a + p.offAmount, 0);
  const sups = new Set(pos.map((p) => p.supplierId));
  const offSups = new Set(pos.filter((p) => p.offContract).map((p) => p.supplierId));
  const lines = pos.reduce((a, p) => a + p.lines.length, 0);
  return {
    spend,
    off,
    offShare: spend ? off / spend : 0,
    suppliers: sups.size,
    offSuppliers: offSups.size,
    pos: pos.length,
    lines,
  };
}
