import { TASKS } from "./data/tasks.js";

export const TOOL_SPECS = [
  { name: "get_board_snapshot", description: "Сводка по статусам, предприятиям, приоритетам" },
  { name: "find_overdue_tasks", description: "Просроченные поручения" },
  { name: "find_high_priority", description: "Высокий приоритет" },
  { name: "find_by_assignee", description: "Поиск по исполнителю" },
  { name: "find_by_enterprise", description: "Срез по предприятию" },
  { name: "list_owners_to_notify", description: "Исполнители для эскалации" },
  { name: "draft_admin_brief", description: "Черновик под сценарий + RAG" },
];

function pack(tag, data, observe) {
  return {
    ok: true,
    observe,
    data,
    wire: `${tag}:${JSON.stringify(data)}END_${tag}`,
  };
}

export function executeTool(name, args = {}, ctx = {}) {
  if (name === "get_board_snapshot") {
    const byStatus = {};
    const byEnterprise = {};
    const byPriority = {};
    TASKS.forEach((t) => {
      byStatus[t.status] = (byStatus[t.status] || 0) + 1;
      byEnterprise[t.enterprise] = (byEnterprise[t.enterprise] || 0) + 1;
      byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
    });
    const overdue = TASKS.filter((t) => t.status === "Просрочено");
    const data = {
      total: TASKS.length,
      byStatus,
      byEnterprise,
      byPriority,
      overdueCount: overdue.length,
      overdueShare: TASKS.length ? Math.round((overdue.length / TASKS.length) * 100) : 0,
    };
    return pack("SNAPSHOT", data, `Срез: ${data.total} · просрочено ${data.overdueCount} (${data.overdueShare}%)`);
  }

  if (name === "find_overdue_tasks") {
    let list = TASKS.filter((t) => t.status === "Просрочено");
    if (args.priority && args.priority !== "all") {
      list = list.filter((t) => t.priority === args.priority);
    }
    return pack("OVERDUE", list, `Просрочено: ${list.length}`);
  }

  if (name === "find_high_priority") {
    const list = TASKS.filter((t) => t.priority === "Высокий");
    return pack("HIGH", list, `Высокий приоритет: ${list.length}`);
  }

  if (name === "find_by_assignee") {
    const q = String(args.query || "")
      .toLowerCase()
      .replace(/ё/g, "е");
    const tokens = q.split(/[^a-zа-я0-9.]+/i).filter((t) => t.length > 2);
    const list = TASKS.filter((t) => {
      const a = t.assignee.toLowerCase().replace(/ё/g, "е");
      return tokens.some((tok) => a.includes(tok));
    });
    return pack("ASSIGNEE", list, `По исполнителю «${args.query || "?"}»: ${list.length}`);
  }

  if (name === "find_by_enterprise") {
    const q = String(args.query || ctx.userTask || "")
      .toLowerCase()
      .replace(/ё/g, "е");
    const list = TASKS.filter((t) => {
      const e = t.enterprise.toLowerCase().replace(/ё/g, "е");
      if (q.includes("альфа")) return e.includes("альфа");
      if (q.includes("бета")) return e.includes("бета");
      if (q.includes("ук") || q.includes("холдинг")) return e.includes("ук") || e.includes("холдинг");
      return tokensMatch(e, q);
    });
    return pack("ENTERPRISE", list, `По предприятию: ${list.length}`);
  }

  if (name === "list_owners_to_notify") {
    const overdue = TASKS.filter((t) => t.status === "Просрочено");
    const owners = [...new Set(overdue.map((t) => t.assignee))];
    return pack("OWNERS", owners, `К эскалации: ${owners.length}`);
  }

  if (name === "draft_admin_brief") {
    const scenario = args.scenario || ctx.scenario || "snapshot";
    const rag = (ctx.ragChunks || [])
      .slice(0, 3)
      .map((c) => `• ${c.metadata?.source}: ${c.pageContent.slice(0, 140)}…`)
      .join("\n");
    const body = [`Черновик сценария «${scenario}»`, "RAG:", rag || "(нет)"].join("\n");
    return { ok: true, observe: `Черновик «${scenario}»`, data: { body, scenario }, wire: body };
  }

  return { ok: false, observe: `Unknown tool: ${name}` };
}

function tokensMatch(hay, q) {
  const tokens = q.split(/[^a-zа-я0-9]+/i).filter((t) => t.length > 3);
  return tokens.some((t) => hay.includes(t));
}

export function detectScenario(raw) {
  const q = String(raw || "")
    .toLowerCase()
    .replace(/ё/g, "е");

  if (/альфа|бета|предприят|завод|ук холдинг|по предприя/.test(q)) {
    return { id: "enterprise", query: raw };
  }
  if (/(найди|поручения|задачи)\s+[а-яёa-z]/i.test(raw) || /петров|сидоров|иванов|козлов|соколов/.test(q)) {
    const m = String(raw).match(/(?:найди|поручения|задачи)\s+([А-Яа-яЁёA-Za-z.\-]+)/i);
    const named = q.match(/петров[а-я]*|сидоров[а-я]*|иванов[а-я]*|козлов[а-я]*|соколов[а-я]*/);
    return { id: "assignee", query: m ? m[1] : named ? named[0] : raw };
  }
  if (/совещани|повестк|бриф|подготов/.test(q)) return { id: "meeting" };
  if (/высоки|эскал|критич|приоритет/.test(q) && !/только просроч/.test(q)) return { id: "high" };
  if (/sla|порог|здоров|сводк|обзор|статистик|сколько|картин/.test(q)) return { id: "snapshot" };
  if (/просроч|отчёт|отчет|дирекции|сформируй/.test(q)) return { id: "overdue" };
  return { id: "snapshot" };
}

export function planStepsForScenario(scenario, ragOn) {
  const steps = [];
  let n = 1;
  if (ragOn) steps.push({ id: n++, tool: "rag_retrieve", why: "Регламенты и SLA из базы знаний" });

  if (scenario.id === "overdue") {
    steps.push(
      { id: n++, tool: "find_overdue_tasks", args: { priority: "all" }, why: "Реестр просрочек" },
      { id: n++, tool: "list_owners_to_notify", why: "Кого эскалировать" },
      { id: n++, tool: "draft_admin_brief", args: { scenario: "overdue" }, why: "Черновик отчёта" },
    );
  } else if (scenario.id === "high") {
    steps.push(
      { id: n++, tool: "find_high_priority", why: "Карточки высокого приоритета" },
      { id: n++, tool: "find_overdue_tasks", args: { priority: "Высокий" }, why: "Из них просроченные" },
      { id: n++, tool: "draft_admin_brief", args: { scenario: "high" }, why: "План эскалации" },
    );
  } else if (scenario.id === "assignee") {
    steps.push(
      { id: n++, tool: "find_by_assignee", args: { query: scenario.query }, why: "Поручения исполнителя" },
      { id: n++, tool: "draft_admin_brief", args: { scenario: "assignee" }, why: "Карточка нагрузки" },
    );
  } else if (scenario.id === "enterprise") {
    steps.push(
      { id: n++, tool: "find_by_enterprise", args: { query: scenario.query }, why: "Срез предприятия" },
      { id: n++, tool: "get_board_snapshot", why: "Сравнение с холдингом" },
      { id: n++, tool: "draft_admin_brief", args: { scenario: "enterprise" }, why: "Сводка по площадке" },
    );
  } else if (scenario.id === "meeting") {
    steps.push(
      { id: n++, tool: "get_board_snapshot", why: "KPI доски" },
      { id: n++, tool: "find_overdue_tasks", args: { priority: "all" }, why: "Блок просрочек в повестку" },
      { id: n++, tool: "find_high_priority", why: "Риски высокого приоритета" },
      { id: n++, tool: "list_owners_to_notify", why: "Ответственные" },
      { id: n++, tool: "draft_admin_brief", args: { scenario: "meeting" }, why: "Повестка совещания" },
    );
  } else {
    steps.push(
      { id: n++, tool: "get_board_snapshot", why: "Сводка по доске" },
      { id: n++, tool: "find_overdue_tasks", args: { priority: "all" }, why: "Контроль SLA" },
      { id: n++, tool: "draft_admin_brief", args: { scenario: "snapshot" }, why: "Админ-сводка" },
    );
  }

  steps.push({
    id: n++,
    tool: "llm_synthesize",
    why: ragOn ? "Ответ администратору (RAG + tools)" : "Ответ администратору (tools)",
  });
  return steps;
}
