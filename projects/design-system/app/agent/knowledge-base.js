/* SB Agent RAG — локальная база знаний для сборки UI */
(function (global) {
  const DOCS = [
    {
      id: "tz-flow",
      title: "Поток: бриф → анализ → сборка",
      tags: ["бриф", "анализ", "сборка", "агент"],
      text:
        "Пользователь описывает задачу текстом или голосом. Агент: 1) фиксирует бриф, 2) ищет в RAG паттерны SB, " +
        "3) разбирает экраны и фичи, 4) собирает превью только из шаблонов и компонентов SB Design System, " +
        "5) проверяет compliance. Без LLM — rule+RAG; с endpoint — план шагов через LLM.",
    },
    {
      id: "assignments-portal",
      title: "Платформа поручений",
      tags: ["поручен", "канбан", "доска", "админ", "холдинг", "sla", "голос"],
      text:
        "Корпоративная доска поручений холдинга. Экран «Доска» (канбан): статусы в работе / просрочено / завершено / отменено; " +
        "карточка: номер, тема, исполнитель, предприятие, срок, приоритет; фильтры и поиск; клик — drawer. " +
        "Живое превью: mock-реестр, фильтры/поиск, drawer, AI-панель (чипы + голос + текст) ищет просрочки/приоритет/ФИО/номер. " +
        "Экран «Администратор»: SLA и сводка из тех же данных, повестка, срезы → переход на доску. " +
        "Иконки SB; шестерёнка агента SB — RAG/LLM планировщика. Демо desktop.",
      screens: [
        { id: "board", label: "Доска", templateId: "template-kanban", kind: "assignments-board" },
        { id: "admin", label: "Администратор", templateId: "template-dashboard", kind: "assignments-admin" },
      ],
      components: [
        "AppShell",
        "Toolbar",
        "Filter Bar",
        "Card",
        "Tag / Chip",
        "Search",
        "Drawer / SidePanel",
        "Stats",
        "Advanced DataTable",
        "Toast / Notification",
        "Modal / Dialog",
      ],
    },
    {
      id: "sb-kanban",
      title: "Шаблон Канбан SB",
      tags: ["канбан", "доска", "колонк", "карточк", "задач"],
      text: "template-kanban: Toolbar, Card, Tag. Колонки статусов, карточки с тегами. Подходит для досок поручений и задач.",
      templateId: "template-kanban",
    },
    {
      id: "sb-dashboard",
      title: "Шаблон Дашборд / Админ SB",
      tags: ["дашборд", "админ", "sla", "kpi", "сводк", "аналитик"],
      text: "template-dashboard: AppShell, Stats, Toolbar, графики. Для админ-сводок, SLA, контроля поручений.",
      templateId: "template-dashboard",
    },
    {
      id: "sb-request",
      title: "Шаблон Портал заявок",
      tags: ["заявк", "тикет", "helpdesk", "реестр"],
      text: "template-request: Filter Bar, DataTable, Drawer, Activity Feed. Реестр с фильтрами и детализацией.",
      templateId: "template-request",
    },
    {
      id: "ai-rag-llm",
      title: "AI · RAG · LLM в продукте",
      tags: ["ai", "rag", "llm", "голос", "агент", "react", "plan"],
      text:
        "Если в брифе есть AI/голос/агент — заложить плавающую панель помощника и экран/блок настроек (endpoint, key, model). " +
        "RAG: локальные регламенты + поиск чанков; без LLM endpoint ответ из реестра и RAG. " +
        "Режимы агента: Plan-and-Execute, ReAct. Иконки только из Icon Pack SB.",
    },
    {
      id: "sb-policy",
      title: "Политика SB DS",
      tags: ["политик", "токен", "компонент", "whitelist"],
      text:
        "Собирать UI только из каталога SB. Запрещены произвольные цвета и «AI-purple». " +
        "Превью = HTML шаблона SB + токены. Новый компонент — только после search_components.",
    },
  ];

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[^\wа-яa-z0-9\s]+/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function scoreDoc(doc, query) {
    const q = normalize(query);
    if (!q) return 0;
    const tokens = q.split(" ").filter((t) => t.length >= 3);
    const hay = normalize([doc.title, doc.text, (doc.tags || []).join(" ")].join(" "));
    let score = 0;
    tokens.forEach((t) => {
      if (hay.includes(t)) score += t.length >= 5 ? 3 : 2;
      (doc.tags || []).forEach((tag) => {
        if (tag.includes(t) || t.includes(tag)) score += 4;
      });
    });
    if (q.includes("поручен") && (doc.id === "assignments-portal" || (doc.tags || []).includes("поручен"))) score += 12;
    if (q.includes("бриф") && doc.id === "tz-flow") score += 6;
    return score;
  }

  function search(query, limit) {
    const lim = limit || 4;
    return DOCS.map((d) => ({ doc: d, score: scoreDoc(d, query) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, lim)
      .map((x) => ({
        id: x.doc.id,
        title: x.doc.title,
        score: x.score,
        excerpt: x.doc.text.slice(0, 280),
        tags: x.doc.tags || [],
        templateId: x.doc.templateId || null,
        screens: x.doc.screens || null,
        components: x.doc.components || null,
      }));
  }

  function getDoc(id) {
    return DOCS.find((d) => d.id === id) || null;
  }

  function contextForBrief(brief, limit) {
    const hits = search(brief, limit || 3);
    if (!hits.length) return "";
    return hits
      .map((h, i) => `[RAG ${i + 1}] ${h.title}\n${h.excerpt}`)
      .join("\n\n");
  }

  global.SbAgentKB = {
    DOCS,
    search,
    getDoc,
    contextForBrief,
  };
})(window);
