/**
 * LLM-клиент: OpenAI-compatible API + локальный fallback.
 */

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
    const raw = localStorage.getItem("rag-poc-llm-config");
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveLlmConfig(partial) {
  const next = { ...loadLlmConfig(), ...partial };
  localStorage.setItem("rag-poc-llm-config", JSON.stringify(next));
  return next;
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

function listTasks(arr) {
  if (!arr || !arr.length) return "_нет данных_";
  return arr
    .map(
      (t, i) =>
        `${i + 1}. **${t.id}** — ${t.title} · ${t.assignee} · ${t.status} · ${t.priority}` +
        (t.daysOverdue ? ` · −${t.daysOverdue}д` : ""),
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

  const overdue = extract("OVERDUE", toolBlob) || [];
  const high = extract("HIGH", toolBlob) || [];
  const assignee = extract("ASSIGNEE", toolBlob) || [];
  const enterprise = extract("ENTERPRISE", toolBlob) || [];
  const owners = extract("OWNERS", toolBlob) || [];
  const snap = extract("SNAPSHOT", toolBlob);

  if (scenario === "assignee") {
    return [
      "**Поручения исполнителя**",
      "",
      listTasks(assignee),
      "",
      "### Рекомендация",
      assignee.some((t) => t.status === "Просрочено")
        ? "• Есть просрочки — эскалировать по регламенту >3 р.д."
        : "• Просрочек нет; держать контроль сроков.",
      "",
      "### RAG",
      ragBlock,
    ].join("\n");
  }

  if (scenario === "enterprise") {
    return [
      "**Срез по предприятию**",
      "",
      listTasks(enterprise),
      snap
        ? `\nДоля просрочек по холдингу (для сравнения): **${snap.overdueShare}%** (${snap.overdueCount}/${snap.total}).`
        : "",
      "",
      "### RAG",
      ragBlock,
    ].join("\n");
  }

  if (scenario === "high") {
    const lateHigh = overdue.filter((t) => t.priority === "Высокий");
    return [
      "**Высокий приоритет**",
      "",
      listTasks(high),
      "",
      `Из них просрочено: **${lateHigh.length}**`,
      lateHigh.length ? listTasks(lateHigh) : "",
      "",
      "### Действия",
      "• Назначить контролёра на просроченный high",
      "• Зафиксировать в аудите",
      "",
      "### RAG",
      ragBlock,
    ].join("\n");
  }

  if (scenario === "meeting") {
    return [
      "**Повестка к совещанию дирекции**",
      "",
      snap
        ? `1. Состояние доски: ${snap.total} поручений, просрочено **${snap.overdueCount}** (${snap.overdueShare}%)`
        : "1. Состояние доски",
      `2. Просрочки (${overdue.length}): разобрать топ`,
      listTasks(overdue.slice(0, 3)),
      `3. Высокий приоритет: **${high.length}** карточек`,
      owners.length ? `4. Эскалация владельцам: ${owners.join(", ")}` : "4. Эскалация — уточнить владельцев",
      "5. Решение: перенос срока / переназначение / закрытие",
      "",
      "### RAG",
      ragBlock,
    ].join("\n");
  }

  if (scenario === "overdue") {
    const hi = overdue.filter((t) => t.priority === "Высокий");
    return [
      "**Отчёт по просроченным поручениям**",
      "",
      `Сводка: **${overdue.length}** просроченных, высокий приоритет: **${hi.length}**.`,
      "",
      "### Реестр",
      listTasks(overdue),
      owners.length ? `\nЭскалация: ${owners.join(", ")}` : "",
      "",
      "### Рекомендации",
      "• High >3 р.д. — контролёр и аудит",
      "• Блок в повестку пн 10:00",
      "",
      "### RAG",
      ragBlock,
    ].join("\n");
  }

  // snapshot default
  return [
    "**Сводка администратора по доске**",
    "",
    snap
      ? [
          `Всего: **${snap.total}**`,
          `Просрочено: **${snap.overdueCount}** (${snap.overdueShare}%)`,
          `Статусы: ${Object.entries(snap.byStatus || {})
            .map(([k, v]) => `${k} ${v}`)
            .join(" · ")}`,
          `Предприятия: ${Object.entries(snap.byEnterprise || {})
            .map(([k, v]) => `${k} ${v}`)
            .join(" · ")}`,
          snap.overdueShare > 15
            ? "SLA: порог тревоги **превышен** (>15%)."
            : "SLA: доля просрочек в ориентире.",
        ].join("\n")
      : listTasks(overdue),
    "",
    overdue.length ? `Критичные просрочки:\n${listTasks(overdue.slice(0, 3))}` : "",
    "",
    "### RAG",
    ragBlock,
    "",
    "_Подключите LLM в настройках для внешней модели_",
  ]
    .filter(Boolean)
    .join("\n");
}
