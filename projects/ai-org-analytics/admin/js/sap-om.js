/**
 * SAP ERP HCM — слой OM/PA для агента.
 * O = org unit (ORGEH), S = position (PLANS), P = person (PERNR).
 * PA: IT0001 (оргназначение), IT0008 (оклад/грейд), IT0027 (cost center).
 *
 * Live-срез с карты → setLiveOrg(); иначе fallback-registry.
 */

const SPAN_WARN = 8;
const SPAN_CRIT = 12;

let liveOrg = null;

export function setLiveOrg(orgData) {
  liveOrg = orgData && orgData.employees ? orgData : null;
  return !!liveOrg;
}

export function getLiveOrg() {
  return liveOrg;
}

export function hasLiveOrg() {
  return !!liveOrg;
}

/** Нормализация в единый SAP-shaped registry */
export function buildSapRegistry(fallbackFacts) {
  if (liveOrg) return fromLive(liveOrg);
  return fromFallback(fallbackFacts);
}

function fromLive(orgData) {
  const unitById = new Map((orgData.orgUnits || []).map((u) => [u.id, u]));
  const persons = (orgData.employees || []).map((e) => {
    const unit = unitById.get(e.orgUnitId);
    const costCenter =
      (e.sap && e.sap.infotype0027) ||
      (unit && unit.costCenter) ||
      `CC-${String(e.orgUnitId || "").slice(-4) || "0000"}`;
    return {
      id: e.id,
      pernr: String(e.personnelNumber || e.id),
      fullName: e.fullName,
      plansText: e.position,
      plansId: `S-${e.id}`,
      orgeh: e.orgUnitId,
      orgehText: unit?.name || e.department || e.orgUnitId,
      managerId: e.managerId || null,
      costCenter,
      grade: (e.sap && e.sap.infotype0008) || null,
      kpi: e.kpi?.performanceScore ?? e.kpi ?? null,
      absences: e.metrics?.absenteeismDays ?? 0,
      status: e.employmentStatus || "active",
      teamSize: e.metrics?.teamSize ?? 0,
      source: "live-SAP_HCM",
    };
  });

  const units = (orgData.orgUnits || []).map((u) => ({
    id: u.id,
    otype: "O",
    name: u.name,
    parentId: u.parentId || null,
    headId: u.headId || null,
    costCenter: u.costCenter || null,
    budget: u.budget || 0,
    city: u.city || null,
  }));

  return finalizeRegistry(persons, units, "live");
}

function fromFallback(facts) {
  const persons = (facts.employees || []).map((e) => ({
    id: e.id,
    pernr: String(e.pernr || e.personnelNumber || e.id),
    fullName: e.fullName,
    plansText: e.position,
    plansId: e.plansId || `S-${e.id}`,
    orgeh: e.unitId || e.orgeh,
    orgehText: e.unit || e.orgehText,
    managerId: e.managerId ?? null,
    costCenter: e.costCenter || `CC-${String(e.unitId || "0000").slice(-4)}`,
    grade: e.grade || "G10",
    kpi: e.kpi,
    absences: e.absences || 0,
    status: e.status || "active",
    teamSize: e.teamSize || 0,
    source: "fallback-registry",
  }));
  const units = (facts.units || []).map((u) => ({
    id: u.id,
    otype: "O",
    name: u.name,
    parentId: u.parentId || null,
    headId: u.headId || null,
    costCenter: u.costCenter || null,
    budget: u.budget || 0,
    city: u.city || null,
    headcount: u.headcount,
    avgKpi: u.avgKpi,
    lowPerfShare: u.lowPerfShare,
  }));
  return finalizeRegistry(persons, units, "fallback");
}

function finalizeRegistry(persons, units, mode) {
  const byId = new Map(persons.map((p) => [p.id, p]));
  persons.forEach((p) => {
    p.directReports = persons.filter((x) => x.managerId === p.id).length;
  });

  const analyses = {
    spanOfControl: analyzeSpanOfControl(persons),
    duplicateRoles: findDuplicateRoles(persons),
    reportingGaps: findReportingGaps(persons, units, byId),
    costCenters: analyzeCostCenters(persons, units),
  };

  return {
    mode,
    system: "SAP_ERP_HCM",
    asOf: new Date().toISOString().slice(0, 10),
    om: { otypeO: units.length, otypeS: persons.length, otypeP: persons.length },
    persons,
    units,
    analyses,
    metadata: {
      totalEmployees: persons.length,
      totalUnits: units.length,
      source: mode === "live" ? "Оргкарта (live OM/PA snapshot)" : "Admin fallback registry",
    },
  };
}

export function analyzeSpanOfControl(persons) {
  const managers = persons
    .map((p) => ({
      id: p.id,
      pernr: p.pernr,
      fullName: p.fullName,
      plansText: p.plansText,
      orgehText: p.orgehText,
      span: p.directReports,
      level:
        p.directReports >= SPAN_CRIT ? "critical" : p.directReports >= SPAN_WARN ? "warning" : "ok",
    }))
    .filter((m) => m.span > 0)
    .sort((a, b) => b.span - a.span);

  const warnings = managers.filter((m) => m.level !== "ok");
  return {
    thresholdWarn: SPAN_WARN,
    thresholdCrit: SPAN_CRIT,
    managersTop: managers.slice(0, 12),
    warnings,
    summary: {
      managers: managers.length,
      warn: warnings.filter((m) => m.level === "warning").length,
      crit: warnings.filter((m) => m.level === "critical").length,
      maxSpan: managers[0]?.span || 0,
    },
  };
}

/** Дубли ролей: одинаковый plansText в одной ORGEH (2+ P на одну роль) */
export function findDuplicateRoles(persons) {
  const map = new Map();
  persons.forEach((p) => {
    if (p.status && p.status !== "active") return;
    const key = `${p.orgeh}||${(p.plansText || "").toLowerCase().trim()}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  });
  const dups = [];
  map.forEach((list, key) => {
    if (list.length < 2) return;
    const [orgeh, plans] = key.split("||");
    dups.push({
      orgeh,
      orgehText: list[0].orgehText,
      plansText: list[0].plansText,
      count: list.length,
      holders: list.map((p) => ({
        id: p.id,
        pernr: p.pernr,
        fullName: p.fullName,
        costCenter: p.costCenter,
      })),
    });
  });
  dups.sort((a, b) => b.count - a.count);
  return { items: dups.slice(0, 20), total: dups.length };
}

/**
 * Дыры в подчинении:
 * - managerId указывает на несуществующего P
 * - не-CEO без managerId
 * - O без headId / head не в unit
 * - P с orgeh без единицы в OM
 */
export function findReportingGaps(persons, units, byId) {
  byId = byId || new Map(persons.map((p) => [p.id, p]));
  const unitById = new Map(units.map((u) => [u.id, u]));
  const gaps = [];

  persons.forEach((p) => {
    const isRoot = !p.managerId && (p.orgeh === "org-001" || /генеральн|ceo|председатель/i.test(p.plansText || ""));
    if (!p.managerId && !isRoot) {
      gaps.push({
        type: "missing_manager",
        severity: "high",
        pernr: p.pernr,
        fullName: p.fullName,
        orgeh: p.orgeh,
        detail: "IT0001: нет руководителя (A002/B002)",
      });
    }
    if (p.managerId && !byId.has(p.managerId)) {
      gaps.push({
        type: "broken_manager_link",
        severity: "critical",
        pernr: p.pernr,
        fullName: p.fullName,
        managerId: p.managerId,
        detail: "Ссылка на руководителя не резолвится в PA",
      });
    }
    if (p.orgeh && !unitById.has(p.orgeh)) {
      gaps.push({
        type: "orphan_orgeh",
        severity: "high",
        pernr: p.pernr,
        fullName: p.fullName,
        orgeh: p.orgeh,
        detail: "ORGEH отсутствует в OM (объект O)",
      });
    }
  });

  units.forEach((u) => {
    if (u.parentId && !unitById.has(u.parentId) && u.id !== "org-001") {
      gaps.push({
        type: "broken_o_parent",
        severity: "high",
        orgeh: u.id,
        name: u.name,
        parentId: u.parentId,
        detail: "Родительская оргединица не найдена в OM",
      });
    }
    if (!u.headId) {
      gaps.push({
        type: "unit_without_head",
        severity: "medium",
        orgeh: u.id,
        name: u.name,
        detail: "Оргединица без руководителя (headId)",
      });
    } else if (!byId.has(u.headId)) {
      gaps.push({
        type: "unit_head_missing",
        severity: "high",
        orgeh: u.id,
        name: u.name,
        headId: u.headId,
        detail: "headId не найден среди PERNR",
      });
    }
  });

  const byType = {};
  gaps.forEach((g) => {
    byType[g.type] = (byType[g.type] || 0) + 1;
  });

  return {
    items: gaps.slice(0, 40),
    total: gaps.length,
    byType,
  };
}

export function analyzeCostCenters(persons, units) {
  const ccPerson = new Map();
  persons.forEach((p) => {
    const cc = p.costCenter || "(пусто)";
    if (!ccPerson.has(cc)) ccPerson.set(cc, []);
    ccPerson.get(cc).push(p);
  });

  const unitCc = new Map(units.map((u) => [u.id, u.costCenter]));
  const mismatches = [];
  persons.forEach((p) => {
    const unitCcVal = unitCc.get(p.orgeh);
    if (unitCcVal && p.costCenter && unitCcVal !== p.costCenter) {
      mismatches.push({
        pernr: p.pernr,
        fullName: p.fullName,
        personCc: p.costCenter,
        unitCc: unitCcVal,
        orgeh: p.orgeh,
        orgehText: p.orgehText,
        detail: "IT0027 ≠ cost center оргединицы",
      });
    }
  });

  const byCc = [...ccPerson.entries()]
    .map(([cc, list]) => ({
      costCenter: cc,
      headcount: list.length,
      avgKpi: list.filter((p) => p.kpi != null).length
        ? Math.round(
            list.filter((p) => p.kpi != null).reduce((s, p) => s + p.kpi, 0) /
              list.filter((p) => p.kpi != null).length,
          )
        : null,
      units: [...new Set(list.map((p) => p.orgehText))],
    }))
    .sort((a, b) => b.headcount - a.headcount);

  const emptyCc = persons.filter((p) => !p.costCenter).length;

  return {
    byCc: byCc.slice(0, 20),
    mismatches: mismatches.slice(0, 25),
    emptyCc,
    summary: {
      distinctCc: byCc.length,
      mismatches: mismatches.length,
      emptyCc,
    },
  };
}

export function sapOmPaSlice(registry, query = "") {
  const q = String(query || "").toLowerCase();
  let persons = registry.persons;
  if (q) {
    const tokens = q.split(/[^a-zа-я0-9]+/i).filter((t) => t.length > 2);
    persons = persons.filter((p) => {
      const hay = `${p.fullName} ${p.pernr} ${p.plansText} ${p.orgehText} ${p.costCenter}`.toLowerCase();
      return tokens.some((t) => hay.includes(t));
    });
  }
  return {
    system: registry.system,
    mode: registry.mode,
    om: registry.om,
    sample: persons.slice(0, 15).map((p) => ({
      pernr: p.pernr,
      fullName: p.fullName,
      o: p.orgeh,
      oText: p.orgehText,
      s: p.plansId,
      sText: p.plansText,
      managerId: p.managerId,
      kostl: p.costCenter,
      it0008: p.grade,
      kpi: p.kpi,
    })),
    count: persons.length,
  };
}
