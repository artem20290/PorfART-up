const STORAGE_KEY = "org-rag-llm-config";

const DEFAULTS = {
  temperature: 0.2,
  max_tokens: 900,
  model: "gpt-4o-mini",
  endpoint: "",
  apiKey: "",
  mode: "plan-execute",
  ragEnabled: true,
};

export function loadLlmConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveLlmConfig(partial) {
  const next = { ...loadLlmConfig(), ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function resetLlmConfig() {
  localStorage.removeItem(STORAGE_KEY);
  return { ...DEFAULTS };
}

export async function chatCompletions(opts) {
  const cfg = loadLlmConfig();
  const temperature = opts.temperature ?? cfg.temperature ?? DEFAULTS.temperature;
  const max_tokens = opts.max_tokens ?? cfg.max_tokens ?? DEFAULTS.max_tokens;
  const model = opts.model || cfg.model || DEFAULTS.model;
  const endpoint = cfg.endpoint || "";
  const apiKey = cfg.apiKey || "";

  if (endpoint) {
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        temperature,
        max_tokens,
        messages: opts.messages,
      }),
    });
    if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
    const data = await res.json();
    const content =
      data.choices?.[0]?.message?.content ||
      data.content ||
      data.text ||
      data.output ||
      "";
    return {
      content: String(content),
      provider: "api",
      model,
      temperature,
      usage: data.usage || null,
    };
  }

  return {
    content: localFallbackCompletion(opts.messages),
    provider: "local-fallback",
    model: "rule+RAG",
    temperature,
    usage: null,
  };
}

function extract(tag, blob) {
  const re = new RegExp(`${tag}:([\\s\\S]*?)END_${tag}`);
  const m = blob.match(re);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

function listPeople(arr) {
  if (!arr || !arr.length) return "_нет данных_";
  return arr
    .map(
      (e, i) =>
        `${i + 1}. **${e.fullName}**` +
        (e.pernr ? ` · PERNR **${e.pernr}**` : "") +
        ` — ${e.position || e.plansText || "—"} · ${e.unit || e.orgehText || "—"} · KPI **${e.kpi ?? "—"}**` +
        (e.costCenter ? ` · KOSTL ${e.costCenter}` : "") +
        (e.risk ? ` · риск ${e.risk}` : ""),
    )
    .join("\n");
}

function listUnits(arr) {
  if (!arr || !arr.length) return "_нет данных_";
  return arr
    .map(
      (u, i) =>
        `${i + 1}. **${u.name}**` +
        (u.id ? ` (${u.id})` : "") +
        ` — ${u.headcount ?? "—"} чел. · avg KPI **${u.avgKpi ?? "—"}** · low **${u.lowPerfShare ?? "—"}%**` +
        (u.costCenter ? ` · KOSTL ${u.costCenter}` : ""),
    )
    .join("\n");
}

function localFallbackCompletion(messages) {
  const user = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const toolBlob = messages
    .filter((m) => m.role === "tool" || m.role === "assistant")
    .map((m) => m.content)
    .join("\n");

  const scenario = (user.match(/Сценарий:\s*(\w+)/) || [])[1] || "snapshot";
  const ragMatch = toolBlob.match(/RAG_CONTEXT:([\s\S]*?)END_RAG/);
  const rag = (ragMatch?.[1] || "").trim();
  const ragBlock = rag
    ? rag
        .split("\n")
        .slice(0, 4)
        .map((l) => `> ${l}`)
        .join("\n")
    : "_контекст не передан_";

  const snap = extract("SNAPSHOT", toolBlob);
  const low = extract("LOW", toolBlob) || [];
  const employees = extract("EMPLOYEE", toolBlob) || [];
  const units = extract("UNITS", toolBlob) || [];
  const span = extract("SPAN", toolBlob);
  const dups = extract("DUP_ROLES", toolBlob);
  const gaps = extract("GAPS", toolBlob);
  const cc = extract("COST_CENTER", toolBlob);
  const sapSlice = extract("SAP_SLICE", toolBlob);

  if (scenario === "span" && span) {
    const top = (span.managersTop || span.warnings || []).slice(0, 8);
    return [
      "**Span of control (норма управляемости)**",
      "",
      `Пороги: warn ≥**${span.thresholdWarn}**, crit ≥**${span.thresholdCrit}**`,
      `Руководителей: **${span.summary?.managers ?? "—"}** · warn **${span.summary?.warn ?? 0}** · crit **${span.summary?.crit ?? 0}** · max span **${span.summary?.maxSpan ?? 0}**`,
      "",
      top
        .map(
          (m, i) =>
            `${i + 1}. **${m.fullName}** · span **${m.span}** · ${m.level} · ${m.orgehText || ""}`,
        )
        .join("\n") || "_нет_",
      "",
      "### Рекомендации",
      "• Crit — разукрупнить команду / добавить слой S",
      "• Warn — проверить делегирование и вакансии тимлидов",
      "",
      "### RAG",
      ragBlock,
    ].join("\n");
  }

  if (scenario === "duplicates" && dups) {
    return [
      "**Дубли ролей (одинаковый PLANS в ORGEH)**",
      "",
      `Групп дублей: **${dups.total}**`,
      "",
      (dups.items || [])
        .slice(0, 8)
        .map(
          (d, i) =>
            `${i + 1}. **${d.plansText}** @ ${d.orgehText} ×**${d.count}**\n` +
            (d.holders || [])
              .map((h) => `   — ${h.fullName} · PERNR ${h.pernr} · ${h.costCenter}`)
              .join("\n"),
        )
        .join("\n\n") || "_нет_",
      "",
      "### Действия",
      "• Развести PLANS (уникальные S) или оформить совместительство явно",
      "• Сверить штатное расписание OM",
      "",
      "### RAG",
      ragBlock,
    ].join("\n");
  }

  if (scenario === "gaps" && gaps) {
    return [
      "**Дыры в подчинении (OM A002 / PA IT0001)**",
      "",
      `Всего: **${gaps.total}**`,
      gaps.byType
        ? Object.entries(gaps.byType)
            .map(([k, v]) => `• ${k}: **${v}**`)
            .join("\n")
        : "",
      "",
      (gaps.items || [])
        .slice(0, 12)
        .map(
          (g, i) =>
            `${i + 1}. **${g.type}** · ${g.severity || "high"} — ${g.fullName || g.name || g.orgeh || ""} · ${g.detail}`,
        )
        .join("\n"),
      "",
      "### Действия",
      "• Починить managerId / headId в OM-PA",
      "• Не строить орг. решения на битых связях",
      "",
      "### RAG",
      ragBlock,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (scenario === "costcenter" && cc) {
    return [
      "**Cost center (KOSTL / IT0027)**",
      "",
      `Уникальных КЦ: **${cc.summary?.distinctCc ?? "—"}** · mismatches **${cc.summary?.mismatches ?? 0}** · без КЦ **${cc.summary?.emptyCc ?? 0}**`,
      "",
      "### Mismatch IT0027 ≠ OM",
      (cc.mismatches || [])
        .slice(0, 10)
        .map(
          (m, i) =>
            `${i + 1}. **${m.fullName}** · PERNR ${m.pernr} · person **${m.personCc}** vs unit **${m.unitCc}** (${m.orgehText})`,
        )
        .join("\n") || "_нет_",
      "",
      "### Топ КЦ по численности",
      (cc.byCc || [])
        .slice(0, 6)
        .map((c, i) => `${i + 1}. **${c.costCenter}** — ${c.headcount} чел. · avg KPI ${c.avgKpi ?? "—"}`)
        .join("\n"),
      "",
      "### RAG",
      ragBlock,
    ].join("\n");
  }

  if (scenario === "sap_slice" && sapSlice) {
    return [
      "**Срез SAP OM/PA**",
      "",
      `Система: **${sapSlice.system}** · режим **${sapSlice.mode}** · найдено PERNR: **${sapSlice.count}**`,
      sapSlice.om ? `OM counters: O=**${sapSlice.om.otypeO}** · S/P=**${sapSlice.om.otypeP}**` : "",
      "",
      (sapSlice.sample || [])
        .map(
          (p, i) =>
            `${i + 1}. PERNR **${p.pernr}** · **${p.fullName}**\n` +
            `   O ${p.o} (${p.oText}) · S ${p.sText} · KOSTL ${p.kostl} · IT0008 ${p.it0008 || "—"} · KPI ${p.kpi ?? "—"}`,
        )
        .join("\n"),
      "",
      "### RAG",
      ragBlock,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (scenario === "employee") {
    return [
      "**Карточка сотрудника (PA)**",
      "",
      listPeople(employees),
      "",
      employees[0]
        ? employees[0].kpi < 45
          ? "### Вердикт\n• Зона риска по регламенту (KPI <45) — разбор с HR BP."
          : "### Вердикт\n• Показатели в рабочем диапазоне; держать регулярный review."
        : "### Вердикт\n• Совпадений в OM/PA нет — уточните ФИО или PERNR.",
      "",
      "### RAG",
      ragBlock,
    ].join("\n");
  }

  if (scenario === "low" || scenario === "optimize") {
    return [
      "**Неэффективные зоны / потенциал оптимизации**",
      "",
      listPeople(low),
      "",
      snap
        ? `Доля риска: **${snap.lowPerfShare}%** · gaps **${snap.reportingGaps ?? "—"}** · span crit **${snap.spanWarnings?.crit ?? "—"}**`
        : "",
      "",
      "### Рекомендации",
      "• High-risk — 1:1 с руководителем и HR BP",
      "• Параллельно закрыть дыры подчинения и дубли ролей",
      "• Кадровые решения — только после human-in-the-loop",
      "",
      "### RAG",
      ragBlock,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (scenario === "compare") {
    return [
      "**Сравнение оргединиц (O)**",
      "",
      listUnits(units.length ? units : snap?.byUnit || []),
      "",
      "### Вывод",
      "Смотрите avg KPI, lowPerfShare и KOSTL; производство и digital сравнивайте раздельно.",
      "",
      "### RAG",
      ragBlock,
    ].join("\n");
  }

  if (scenario === "meeting") {
    return [
      "**Повестка HR-комитета**",
      "",
      snap
        ? `1. OM/PA: P=**${snap.headcount ?? snap.headcountSample}**, O=**${snap.units}**, avg KPI **${snap.avgKpi}**, риск **${snap.lowPerfShare}%** (${snap.mode || "sap"})`
        : "1. Сводка холдинга",
      `2. Дыры подчинения: **${snap?.reportingGaps ?? gaps?.total ?? "—"}**`,
      `3. Дубли ролей: **${snap?.duplicateRoles ?? dups?.total ?? "—"}**`,
      `4. Span crit/warn: **${snap?.spanWarnings?.crit ?? 0}** / **${snap?.spanWarnings?.warn ?? 0}**`,
      `5. Cost center mismatches: **${snap?.costCenterMismatches ?? cc?.summary?.mismatches ?? 0}**`,
      `6. Неэффективные (${low.length}):`,
      listPeople(low.slice(0, 3)),
      "7. Решения: починка OM → разведение S → 1:1 high-risk",
      "",
      "### RAG",
      ragBlock,
    ].join("\n");
  }

  return [
    "**Сводка администратора · SAP OM/PA**",
    "",
    snap
      ? [
          `Источник: **${snap.source || snap.mode}**`,
          `Оргединицы O: **${snap.units}** · сотрудники P: **${snap.headcount ?? snap.headcountSample}**`,
          `Средний KPI: **${snap.avgKpi}** · риск: **${snap.lowPerfShare}%**`,
          `Дыры подчинения: **${snap.reportingGaps ?? 0}** · дубли ролей: **${snap.duplicateRoles ?? 0}**`,
          `Span crit: **${snap.spanWarnings?.crit ?? 0}** · CC mismatches: **${snap.costCenterMismatches ?? 0}**`,
          snap.lowPerfShare > 15
            ? "SLA оргдизайна: порог тревоги **превышен** (>15%)."
            : "SLA оргдизайна: доля риска в ориентире.",
        ].join("\n")
      : listPeople(low),
    "",
    low.length ? `Критичные зоны:\n${listPeople(low.slice(0, 3))}` : "",
    "",
    "### RAG",
    ragBlock,
    "",
    "_Подключите LLM в настройках для внешней модели_",
  ]
    .filter(Boolean)
    .join("\n");
}
