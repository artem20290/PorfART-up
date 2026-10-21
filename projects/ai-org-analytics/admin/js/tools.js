import { ORG_FACTS } from "./data/org-facts.js";
import {
  buildSapRegistry,
  sapOmPaSlice,
} from "./sap-om.js";

export const TOOL_SPECS = [
  { name: "get_org_snapshot", description: "Сводка OM/PA: O/S/P, KPI, риск" },
  { name: "get_sap_om_pa_slice", description: "Срез PERNR / ORGEH / PLANS / KOSTL" },
  { name: "analyze_span_of_control", description: "Span of control руководителей" },
  { name: "find_duplicate_roles", description: "Дубли ролей (S) в оргединице" },
  { name: "find_reporting_gaps", description: "Дыры в подчинении A002/B002" },
  { name: "analyze_cost_centers", description: "Cost center IT0027 vs OM" },
  { name: "find_low_performers", description: "Сотрудники с низким KPI / риском" },
  { name: "find_employee", description: "Поиск по ФИО / PERNR" },
  { name: "compare_units", description: "Сравнение оргединиц O" },
  { name: "draft_hr_brief", description: "Черновик под сценарий + RAG" },
];

function pack(tag, data, observe) {
  return {
    ok: true,
    observe,
    data,
    wire: `${tag}:${JSON.stringify(data)}END_${tag}`,
  };
}

function registry(ctx) {
  return buildSapRegistry(ctx.orgFacts || ORG_FACTS);
}

export function executeTool(name, args = {}, ctx = {}) {
  const reg = registry(ctx);
  const persons = reg.persons;

  if (name === "get_org_snapshot") {
    const low = persons.filter((e) => e.kpi != null && e.kpi < 45);
    const avgKpi = persons.filter((e) => e.kpi != null).length
      ? Math.round(
          persons.filter((e) => e.kpi != null).reduce((s, e) => s + e.kpi, 0) /
            persons.filter((e) => e.kpi != null).length,
        )
      : 0;
    const data = {
      asOf: reg.asOf,
      system: reg.system,
      mode: reg.mode,
      om: reg.om,
      source: reg.metadata.source,
      units: reg.units.length,
      headcount: persons.length,
      avgKpi,
      lowPerfCount: low.length,
      lowPerfShare: persons.length ? Math.round((low.length / persons.length) * 100) : 0,
      spanWarnings: reg.analyses.spanOfControl.summary,
      duplicateRoles: reg.analyses.duplicateRoles.total,
      reportingGaps: reg.analyses.reportingGaps.total,
      costCenterMismatches: reg.analyses.costCenters.summary.mismatches,
      byUnit: reg.units.slice(0, 12).map((u) => ({
        id: u.id,
        name: u.name,
        costCenter: u.costCenter,
        headId: u.headId,
        budget: u.budget,
        headcount: u.headcount,
        avgKpi: u.avgKpi,
        lowPerfShare: u.lowPerfShare,
      })),
    };
    return pack(
      "SNAPSHOT",
      data,
      `SAP ${data.mode}: O=${data.om.otypeO} · P=${data.headcount} · avgKPI ${data.avgKpi} · gaps ${data.reportingGaps} · CCΔ ${data.costCenterMismatches}`,
    );
  }

  if (name === "get_sap_om_pa_slice") {
    const slice = sapOmPaSlice(reg, args.query || ctx.userTask || "");
    return pack("SAP_SLICE", slice, `OM/PA slice: ${slice.count} PERNR (show ${slice.sample.length})`);
  }

  if (name === "analyze_span_of_control") {
    const data = reg.analyses.spanOfControl;
    return pack(
      "SPAN",
      data,
      `Span: max ${data.summary.maxSpan} · warn ${data.summary.warn} · crit ${data.summary.crit}`,
    );
  }

  if (name === "find_duplicate_roles") {
    const data = reg.analyses.duplicateRoles;
    return pack("DUP_ROLES", data, `Дубли ролей (S): ${data.total} групп`);
  }

  if (name === "find_reporting_gaps") {
    const data = reg.analyses.reportingGaps;
    return pack("GAPS", data, `Дыры подчинения: ${data.total}`);
  }

  if (name === "analyze_cost_centers") {
    const data = reg.analyses.costCenters;
    return pack(
      "COST_CENTER",
      data,
      `KOSTL: ${data.summary.distinctCc} · mismatches ${data.summary.mismatches} · empty ${data.summary.emptyCc}`,
    );
  }

  if (name === "find_low_performers") {
    const list = persons
      .filter((e) => (e.kpi != null && e.kpi < 45) || e.absences >= 10)
      .sort((a, b) => (a.kpi ?? 99) - (b.kpi ?? 99))
      .slice(0, 25)
      .map((e) => ({
        id: e.id,
        pernr: e.pernr,
        fullName: e.fullName,
        position: e.plansText,
        unit: e.orgehText,
        unitId: e.orgeh,
        kpi: e.kpi,
        absences: e.absences,
        costCenter: e.costCenter,
        risk: e.kpi != null && e.kpi < 45 ? "high" : "medium",
      }));
    return pack("LOW", list, `Неэффективные / риск: ${list.length}`);
  }

  if (name === "find_employee") {
    const q = String(args.query || ctx.userTask || "")
      .toLowerCase()
      .replace(/ё/g, "е");
    const tokens = q.split(/[^a-zа-я0-9.]+/i).filter((t) => t.length > 2);
    const list = persons
      .filter((e) => {
        const hay = `${e.fullName} ${e.pernr} ${e.plansText} ${e.orgehText}`.toLowerCase().replace(/ё/g, "е");
        return tokens.some((tok) => hay.includes(tok));
      })
      .slice(0, 15)
      .map((e) => ({
        id: e.id,
        pernr: e.pernr,
        fullName: e.fullName,
        position: e.plansText,
        unit: e.orgehText,
        unitId: e.orgeh,
        managerId: e.managerId,
        costCenter: e.costCenter,
        grade: e.grade,
        kpi: e.kpi,
        absences: e.absences,
        status: e.status,
        risk: e.kpi != null && e.kpi < 45 ? "high" : "low",
      }));
    return pack("EMPLOYEE", list, `Поиск «${args.query || "?"}»: ${list.length}`);
  }

  if (name === "compare_units") {
    const q = String(args.query || ctx.userTask || "")
      .toLowerCase()
      .replace(/ё/g, "е");
    let units = reg.units.filter((u) => u.parentId); // предприятия / департаменты
    if (q.includes("альфа") || q.includes("бета") || q.includes("цифр")) {
      units = reg.units.filter((u) => {
        const n = u.name.toLowerCase();
        return (
          (q.includes("альфа") && n.includes("альфа")) ||
          (q.includes("бета") && n.includes("бета")) ||
          (q.includes("цифр") && n.includes("цифр"))
        );
      });
      if (units.length < 2) units = reg.units.filter((u) => u.parentId === "org-001").slice(0, 4);
    } else {
      units = reg.units.filter((u) => u.parentId === "org-001").slice(0, 6);
    }
    const enriched = units.map((u) => {
      const inUnit = persons.filter((p) => p.orgeh === u.id);
      const kpis = inUnit.map((p) => p.kpi).filter((k) => k != null);
      const avg = kpis.length ? Math.round(kpis.reduce((a, b) => a + b, 0) / kpis.length) : u.avgKpi;
      const lowShare = inUnit.length
        ? Math.round((inUnit.filter((p) => p.kpi != null && p.kpi < 45).length / inUnit.length) * 100)
        : u.lowPerfShare;
      return {
        id: u.id,
        name: u.name,
        costCenter: u.costCenter,
        headcount: inUnit.length || u.headcount || 0,
        avgKpi: avg ?? null,
        lowPerfShare: lowShare ?? null,
        budget: u.budget,
        headId: u.headId,
      };
    });
    return pack("UNITS", enriched, `Оргединицы O: ${enriched.length}`);
  }

  if (name === "draft_hr_brief") {
    const scenario = args.scenario || ctx.scenario || "snapshot";
    const rag = (ctx.ragChunks || [])
      .slice(0, 3)
      .map((c) => `• ${c.metadata?.source}: ${c.pageContent.slice(0, 140)}…`)
      .join("\n");
    const body = [
      `Черновик сценария «${scenario}»`,
      `Источник: ${reg.metadata.source}`,
      `OM: O=${reg.om.otypeO} S/P=${reg.om.otypeP}`,
      "RAG:",
      rag || "(нет)",
    ].join("\n");
    return { ok: true, observe: `Черновик «${scenario}»`, data: { body, scenario }, wire: body };
  }

  return { ok: false, observe: `Unknown tool: ${name}` };
}

export function detectScenario(raw) {
  const q = String(raw || "")
    .toLowerCase()
    .replace(/ё/g, "е");

  if (/span|норм\s*управл|подчиненн|перегрузк\s*руковод/.test(q)) return { id: "span", query: raw };
  if (/дубл.*рол|одинаков.*должност|две.*ставк|совпаден.*должност/.test(q)) {
    return { id: "duplicates", query: raw };
  }
  if (/дыр|разрыв|без\s*руковод|битая\s*связ|orphan|подчинен.*дыр|а002|b002/.test(q)) {
    return { id: "gaps", query: raw };
  }
  if (/cost\s*center|кост|kostl|центр\s*затрат|it0027|0027/.test(q)) {
    return { id: "costcenter", query: raw };
  }
  if (/pernr|табельн|оргединиц|om\/pa|инфотип|orgeh|plans/.test(q)) {
    return { id: "sap_slice", query: raw };
  }
  if (/сравни|альфа|бета|подраздел|завод|единиц/.test(q) && !/найди|петров/.test(q)) {
    return { id: "compare", query: raw };
  }
  if (
    /(найди|покажи|открой|кто такой|кто такая)\s+/i.test(raw) ||
    /петров|сидоров|иванов|козлов|белов|тихонов/.test(q)
  ) {
    const m = String(raw).match(
      /(?:найди|покажи|открой|кто такой|кто такая)\s+([А-Яа-яЁёA-Za-z.\-\s]+)/i,
    );
    const named = q.match(
      /петров[а-я]*|сидоров[а-я]*|иванов[а-я]*|козлов[а-я]*|белов[а-я]*|тихонов[а-я]*/,
    );
    return { id: "employee", query: m ? m[1].trim() : named ? named[0] : raw };
  }
  if (/совещани|повестк|бриф|подготов|комитет/.test(q)) return { id: "meeting" };
  if (/неэффект|низк|риск|слабые|аутсайдер|отстающ|производител/.test(q)) {
    return { id: "low" };
  }
  if (/оптимиз|потенциал|реорганиз/.test(q)) return { id: "optimize" };
  if (/сводк|обзор|статистик|сколько|картин|холдинг/.test(q)) return { id: "snapshot" };
  return { id: "snapshot" };
}

export function planStepsForScenario(scenario, ragOn) {
  const steps = [];
  let n = 1;
  if (ragOn) steps.push({ id: n++, tool: "rag_retrieve", why: "Регламенты HCM / OM-PA из базы знаний" });

  if (scenario.id === "span") {
    steps.push(
      { id: n++, tool: "analyze_span_of_control", why: "Норма управляемости" },
      { id: n++, tool: "get_org_snapshot", why: "Контекст OM" },
      { id: n++, tool: "draft_hr_brief", args: { scenario: "span" }, why: "Рекомендации" },
    );
  } else if (scenario.id === "duplicates") {
    steps.push(
      { id: n++, tool: "find_duplicate_roles", why: "Дубли S в ORGEH" },
      { id: n++, tool: "get_sap_om_pa_slice", args: { query: scenario.query }, why: "PERNR держателей" },
      { id: n++, tool: "draft_hr_brief", args: { scenario: "duplicates" }, why: "План разведения ролей" },
    );
  } else if (scenario.id === "gaps") {
    steps.push(
      { id: n++, tool: "find_reporting_gaps", why: "Битые A002/B002 и headId" },
      { id: n++, tool: "get_sap_om_pa_slice", why: "Контекст OM/PA" },
      { id: n++, tool: "draft_hr_brief", args: { scenario: "gaps" }, why: "План починки связей" },
    );
  } else if (scenario.id === "costcenter") {
    steps.push(
      { id: n++, tool: "analyze_cost_centers", why: "IT0027 vs OM KOSTL" },
      { id: n++, tool: "get_org_snapshot", why: "Сводка" },
      { id: n++, tool: "draft_hr_brief", args: { scenario: "costcenter" }, why: "Сверка КЦ" },
    );
  } else if (scenario.id === "sap_slice") {
    steps.push(
      { id: n++, tool: "get_sap_om_pa_slice", args: { query: scenario.query }, why: "Срез PERNR/ORGEH/PLANS/KOSTL" },
      { id: n++, tool: "get_org_snapshot", why: "OM counters" },
      { id: n++, tool: "draft_hr_brief", args: { scenario: "sap_slice" }, why: "Пояснение среза" },
    );
  } else if (scenario.id === "low" || scenario.id === "optimize") {
    steps.push(
      { id: n++, tool: "find_low_performers", why: "Зоны риска по KPI" },
      { id: n++, tool: "analyze_span_of_control", why: "Перегруз руководителей" },
      { id: n++, tool: "find_reporting_gaps", why: "Структурный шум" },
      { id: n++, tool: "draft_hr_brief", args: { scenario: scenario.id }, why: "Рекомендации HR" },
    );
  } else if (scenario.id === "employee") {
    steps.push(
      { id: n++, tool: "find_employee", args: { query: scenario.query }, why: "Карточка P / PERNR" },
      { id: n++, tool: "get_sap_om_pa_slice", args: { query: scenario.query }, why: "OM/PA поля" },
      { id: n++, tool: "draft_hr_brief", args: { scenario: "employee" }, why: "Вердикт по регламенту" },
    );
  } else if (scenario.id === "compare") {
    steps.push(
      { id: n++, tool: "compare_units", args: { query: scenario.query }, why: "Срез оргединиц O" },
      { id: n++, tool: "analyze_cost_centers", why: "КЦ площадок" },
      { id: n++, tool: "draft_hr_brief", args: { scenario: "compare" }, why: "Выводы" },
    );
  } else if (scenario.id === "meeting") {
    steps.push(
      { id: n++, tool: "get_org_snapshot", why: "KPI + OM counters" },
      { id: n++, tool: "find_reporting_gaps", why: "Структурные риски" },
      { id: n++, tool: "find_duplicate_roles", why: "Дубли ролей" },
      { id: n++, tool: "analyze_span_of_control", why: "Span of control" },
      { id: n++, tool: "draft_hr_brief", args: { scenario: "meeting" }, why: "Повестка" },
    );
  } else {
    steps.push(
      { id: n++, tool: "get_org_snapshot", why: "Сводка OM/PA" },
      { id: n++, tool: "find_reporting_gaps", why: "Дыры подчинения" },
      { id: n++, tool: "analyze_cost_centers", why: "Cost centers" },
      { id: n++, tool: "draft_hr_brief", args: { scenario: "snapshot" }, why: "Админ-сводка" },
    );
  }

  steps.push({
    id: n++,
    tool: "llm_synthesize",
    why: ragOn ? "Ответ администратору (RAG + SAP tools)" : "Ответ администратору (SAP tools)",
  });
  return steps;
}
