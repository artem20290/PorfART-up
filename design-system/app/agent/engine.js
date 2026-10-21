/* SB Design System Agent — orchestrator (Rule planner now, LLM-swappable later).
 *
 * Contract (same for RulePlanner and future LlmPlanner):
 *   planTurn(message, project, session) → { summary, steps[{tool,args,why}], ... }
 *   executeStep / runTurn → tools mutate project, return observe + diff
 */
(function (global) {
  const STORAGE_KEY = "sb-agent-project-v5";
  const SESSION_KEY = "sb-agent-session-v1";
  const CONFIG_KEY = "sb-agent-planner-config-v1";
  /** Default planner. Override via setPlannerConfig({ mode: "llm", endpoint: "..." }) */
  let PLANNER_MODE = "rule"; // "rule" | "llm"

  /**
   * System brief — «понимание» SB без LLM.
   * RulePlanner always recalls this; LlmPlanner should receive the same string as system prompt.
   */
  const SB_POLICY = {
    id: "sb-ds-v1",
    name: "SB Design System Policy",
    rules: [
      "Собирай UI только из каталога SB Design System (шаблоны + компоненты).",
      "Запрещены произвольные цвета, шрифты и «AI-purple» — только токены SB (:root).",
      "Новый компонент → сначала search_components; если нет в каталоге — отказ, предложи ближайший SB.",
      "Превью = HTML шаблона SB + токены; не генерируй вёрстку с нуля.",
      "Перед handoff проверь assert_sb_compliance (whitelist + шаблон).",
    ],
    systemBrief() {
      return [
        "Ты оркестратор SB Design System Agent.",
        "Твоя единственная дизайн-система: SB DS из этого репозитория.",
        ...this.rules.map((r, i) => `${i + 1}. ${r}`),
        "Всегда объясняй, какой компонент SB и почему (маппинг из брифа).",
      ].join("\n");
    },
  };

  /** User-language → SB component name (must exist in catalog when possible). */
  const SB_GROUNDING_MAP = [
    { keys: ["фильтр", "filter"], name: "Filter Bar", why: "в брифе нужны фильтры" },
    { keys: ["drawer", "панел", "боков", "детализац", "сайдбар детал"], name: "Drawer / SidePanel", why: "нужна боковая детализация" },
    { keys: ["лент", "активност", "истор", "feed"], name: "Activity Feed", why: "лента событий/история" },
    { keys: ["уведомлен", "toast", "нотификац"], name: "Toast / Notification", why: "уведомления пользователю" },
    { keys: ["модал", "диалог", "popup", "окно"], name: "Modal / Dialog", why: "модальный сценарий" },
    { keys: ["таб", "вкладк"], name: "Tabs", why: "несколько вкладок" },
    { keys: ["kpi", "статистик", "показател", "метрик"], name: "Stats", why: "KPI / метрики" },
    { keys: ["таблиц", "список заяв", "datatable", "grid"], name: "Advanced DataTable", why: "табличные данные" },
    { keys: ["поиск", "search"], name: "Search", why: "поиск по сущностям" },
    { keys: ["кнопк", "action", "cta"], name: "Button", why: "действия пользователя" },
    { keys: ["форм", "поле ввод", "input"], name: "TextField", why: "ввод данных" },
    { keys: ["граф", "chart", "диаграмм", "donut", "линейн"], name: "Donut Chart", why: "визуализация данных" },
    { keys: ["навигац", "меню", "appshell", "оболочк"], name: "AppShell", why: "каркас приложения SB" },
    { keys: ["тулбар", "toolbar", "панель инструмент"], name: "Toolbar", why: "панель действий" },
  ];

  const INTENT_MAP = [
    { id: "template-request", keys: ["заяв", "тикет", "обращен", "service desk", "helpdesk", "портал заявок"] },
    { id: "template-dashboard", keys: ["дашборд", "аналитик", "kpi", "отчет", "сводк", "метрик", "закуп", "spend"] },
    { id: "template-catalog", keys: ["каталог", "номенклатур", "продукц", "товар"] },
    { id: "template-settings", keys: ["настройк", "профиль", "аккаунт"] },
    { id: "template-login", keys: ["вход", "логин", "авторизац", "login"] },
    { id: "template-orders", keys: ["заказ", "order"] },
    { id: "template-tracking", keys: ["трекинг", "отслеж", "логистик", "доставк"] },
    { id: "template-kanban", keys: ["канбан", "доск задач", "колонк"] },
    { id: "template-calendar", keys: ["календар", "встреч", "расписан"] },
    { id: "template-edo", keys: ["эдо", "подпис"] },
    { id: "template-product", keys: ["карточк продукт", "product page"] },
  ];

  const SCENARIOS = [
    {
      id: "procurement",
      label: "Закупки KPI",
      chip: "Дашборд KPI",
      blurb: "KPI-карточки, графики и заказы",
      goal: "Дашборд дирекции по закупкам: spend, SLA, покрытие контрактами",
      title: "Закупки · KPI",
      stack: "react",
      theme: "light",
      density: "default",
      accent: null,
      screens: [
        { id: "dash", label: "Дашборд", templateId: "template-dashboard" },
        { id: "orders", label: "Заказы", templateId: "template-orders" },
      ],
      activeScreen: "dash",
      notes: ["KPI-карточки", "Графики", "Переход к заказам"],
    },
    {
      id: "catalog",
      label: "Каталог продукции",
      chip: "Каталог",
      blurb: "Дерево категорий и карточка продукта",
      goal: "Каталог продукции с деревом категорий и карточкой",
      title: "Каталог продукции",
      stack: "html",
      theme: "light",
      density: "default",
      accent: null,
      screens: [
        { id: "cat", label: "Каталог", templateId: "template-catalog" },
        { id: "product", label: "Продукт", templateId: "template-product" },
      ],
      activeScreen: "cat",
      notes: ["Дерево категорий", "Список позиций"],
    },
    {
      id: "kanban",
      label: "Канбан задач",
      chip: "Канбан",
      blurb: "Колонки статусов и календарь",
      goal: "Доска задач с колонками и календарём встреч",
      title: "Канбан задач",
      stack: "react",
      theme: "light",
      density: "default",
      accent: null,
      screens: [
        { id: "board", label: "Доска", templateId: "template-kanban" },
        { id: "cal", label: "Календарь", templateId: "template-calendar" },
      ],
      activeScreen: "board",
      notes: ["Колонки", "Карточки задач"],
    },
    {
      id: "logistics",
      label: "Трекинг доставок",
      chip: "Трекинг",
      blurb: "Отслеживание и список заказов",
      goal: "Логистика: трекинг отправлений и заказы",
      title: "Трекинг доставок",
      stack: "react",
      theme: "light",
      density: "default",
      accent: null,
      screens: [
        { id: "track", label: "Трекинг", templateId: "template-tracking" },
        { id: "orders", label: "Заказы", templateId: "template-orders" },
      ],
      activeScreen: "track",
      notes: ["Статусы доставки", "Заказы"],
    },
  ];

  /* ─── catalog helpers ─── */
  function templates() {
    return typeof templateDefinitions !== "undefined" ? templateDefinitions : [];
  }
  function components() {
    return typeof uniqueComponentsList !== "undefined" ? uniqueComponentsList : [];
  }
  function getTemplate(id) {
    return templates().find((t) => t.id === id) || null;
  }
  function searchComponents(query, limit) {
    let q = String(query || "")
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/^(найди|найти|покажи|поиск|открой|есть ли)\s+/i, "")
      .replace(/[?!.,]+$/g, "")
      .trim();
    const list = components();
    if (!q) return list.slice(0, limit || 12);
    const tokens = q.split(/\s+/).filter((t) => t.length >= 2 && !/^(в|из|по|и|или|компонент|каталог)$/i.test(t));
    return list
      .filter((c) => {
        const hay = `${c.name} ${c.category} ${c.params || ""} ${c.states || ""} ${c.aiPrompt || ""}`.toLowerCase().replace(/ё/g, "е");
        if (hay.includes(q)) return true;
        if (!tokens.length) return false;
        return tokens.some((t) => hay.includes(t));
      })
      .slice(0, limit || 12);
  }

  function matchIntent(text) {
    const q = String(text || "").toLowerCase().replace(/ё/g, "е");
    let best = null;
    let bestScore = 0;
    for (const row of INTENT_MAP) {
      let score = 0;
      for (const key of row.keys) {
        if (q.includes(key)) score += key.length;
      }
      if (score > bestScore) {
        bestScore = score;
        best = row;
      }
    }
    if (!best) {
      if (/сдела|собери|создай|проект|страниц|интерфейс|экран/.test(q)) {
        return { templateId: "template-dashboard", confidence: 0.35, reason: "общий запрос на сборку" };
      }
      return null;
    }
    return { templateId: best.id, confidence: Math.min(1, bestScore / 10), reason: "совпадение по ключевым словам" };
  }

  function findScenario(id) {
    return SCENARIOS.find((s) => s.id === id) || null;
  }

  function matchScenario(text) {
    const q = String(text || "").toLowerCase().replace(/ё/g, "е");
    for (const s of SCENARIOS) {
      const chip = String(s.chip || "").toLowerCase();
      const label = String(s.label || "").toLowerCase();
      if ((chip && q.includes(chip)) || (label && q.includes(label)) || q.includes(s.id)) return s;
    }
    if (/канбан|доск/.test(q)) return findScenario("kanban");
    if (/трекинг|доставк|логистик/.test(q)) return findScenario("logistics");
    if (/закуп|kpi|дашборд|аналит/.test(q)) return findScenario("procurement");
    if (/каталог|продукц|номенклатур/.test(q)) return findScenario("catalog");
    return null;
  }

  function guessTitle(text, template) {
    const q = String(text || "").trim();
    const m = q.match(/(?:для|про|под названием|назвай|заголовок)\s+[«"]?([^»".!?\n]{3,40})/i);
    if (m) return m[1].trim();
    if (template && template.label) {
      if (/закуп/.test(q.toLowerCase())) return "Портал закупок";
      if (/заяв/.test(q.toLowerCase())) return "Портал заявок";
      if (/аналит|дашборд|kpi/.test(q.toLowerCase())) return "Аналитика";
      return template.label;
    }
    return "Проект SB";
  }

  function normalizeCompKey(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[\s/_.-]+/g, "");
  }

  const SB_NAME_ALIASES = {
    donutchart: "DonutChart",
    linechart: "LinearChart",
    linearchart: "LinearChart",
    barchart: "BarChart",
    drawer: "Drawer / SidePanel",
    sidepanel: "Drawer / SidePanel",
    toast: "Toast / Notification",
    modal: "Modal / Dialog",
    datatable: "Advanced DataTable",
  };

  function resolveCatalogName(name) {
    const list = components();
    if (!name) return null;
    const exact = list.find((c) => c.name === name);
    if (exact) return exact.name;
    const key = normalizeCompKey(name);
    const byKey = list.find((c) => normalizeCompKey(c.name) === key);
    if (byKey) return byKey.name;
    const alias = SB_NAME_ALIASES[key];
    if (alias) {
      const hit = list.find((c) => c.name === alias) || list.find((c) => normalizeCompKey(c.name) === normalizeCompKey(alias));
      if (hit) return hit.name;
    }
    const fuzzy = list.find((c) => normalizeCompKey(c.name).includes(key) || key.includes(normalizeCompKey(c.name)));
    return fuzzy ? fuzzy.name : null;
  }

  /**
   * Ground brief → SB components with reasons (fake «understanding»).
   * Only names that exist in catalog (or template defaults resolved).
   */
  function groundInDesignSystem(brief, templateId) {
    const q = String(brief || "").toLowerCase().replace(/ё/g, "е");
    const tpl = getTemplate(templateId);
    const picks = [];
    const seen = new Set();

    const add = (name, why, source) => {
      const finalName = resolveCatalogName(name);
      if (!finalName || seen.has(finalName)) return;
      seen.add(finalName);
      picks.push({ name: finalName, why, source: source || "grounding" });
    };

    (tpl && tpl.components ? tpl.components : ["AppShell"]).forEach((n) => {
      add(n, `базовый состав шаблона «${tpl ? tpl.label : templateId}»`, "template");
    });

    SB_GROUNDING_MAP.forEach((row) => {
      if (row.keys.some((k) => q.includes(k))) {
        add(row.name, row.why, "brief→SB");
      }
    });

    return {
      policyId: SB_POLICY.id,
      templateId: templateId || null,
      templateLabel: tpl ? tpl.label : null,
      picks,
      names: picks.map((p) => p.name),
      rationale: picks.map((p) => `• **${p.name}** — ${p.why}`).join("\n"),
    };
  }

  function pickExtraComponents(goal, baseNames) {
    const grounded = groundInDesignSystem(goal, null);
    const want = new Set(baseNames || []);
    grounded.names.forEach((n) => want.add(n));
    return [...want];
  }

  function sanitizeProjectComponents(project) {
    if (!project) return project;
    const cleaned = [];
    const seen = new Set();
    (project.components || []).forEach((name) => {
      const resolved = resolveCatalogName(name);
      if (resolved && !seen.has(resolved)) {
        seen.add(resolved);
        cleaned.push(resolved);
      }
    });
    project.components = cleaned;
    return project;
  }

  function validateProjectAgainstSb(project) {
    sanitizeProjectComponents(project);
    const issues = [];
    const ok = [];
    const catalog = components();
    const catalogNames = new Set(catalog.map((c) => c.name));

    if (!project.templateId) {
      issues.push("Нет шаблона SB");
    } else if (!getTemplate(project.templateId)) {
      issues.push(`Шаблон «${project.templateId}» не из SB`);
    } else {
      ok.push(`Шаблон SB: ${getTemplate(project.templateId).label}`);
    }

    const comps = project.components || [];
    if (!comps.length) issues.push("Пустой whitelist компонентов");
    comps.forEach((name) => {
      if (catalogNames.has(name)) ok.push(`✓ ${name} в каталоге SB`);
      else issues.push(`✗ «${name}» нет в каталоге SB`);
    });

    (project.screens || []).forEach((s) => {
      if (!getTemplate(s.templateId)) issues.push(`Экран «${s.label}»: шаблон не SB`);
    });

    return {
      ok: issues.length === 0,
      issues,
      okItems: ok,
      policyId: SB_POLICY.id,
      summary: issues.length
        ? `SB policy: ${issues.length} проблем`
        : `SB policy: OK · ${comps.length} комп. из каталога`,
    };
  }

  function canHandoff(project) {
    const readiness = getReadiness(project);
    const compliance = validateProjectAgainstSb(project);
    return {
      ok: readiness.ready && compliance.ok,
      readiness,
      compliance,
      reasons: [
        ...(!compliance.ok ? compliance.issues : []),
        ...(!readiness.ready ? ["Чеклист готовности не закрыт (" + readiness.pct + "%)"] : []),
      ],
    };
  }

  function clarifyQuestions(text) {
    const q = String(text || "").toLowerCase();
    const questions = [];
    if (!matchIntent(text) && !matchScenario(text)) {
      questions.push("Это скорее дашборд, список заявок, каталог или форма?");
    }
    if (!/react|vue|html|tailwind/.test(q)) {
      questions.push("Стек: React, Vue или чистый HTML?");
    }
    if (questions.length < 2) {
      questions.push("Какой главный сценарий на первом экране?");
    }
    return questions.slice(0, 3);
  }

  /* ─── project / session ─── */
  function emptyProject() {
    return {
      name: "Новый проект",
      goal: "",
      stack: "react",
      templateId: null,
      title: "Новый проект",
      components: [],
      theme: "light",
      density: "default",
      accent: null,
      notes: [],
      screens: [],
      activeScreen: null,
      html: "",
      status: "draft",
      history: [],
      updatedAt: Date.now(),
    };
  }

  function emptySession() {
    return {
      brief: "",
      decisions: [],
      rejected: [],
      lastPlanId: null,
      planner: PLANNER_MODE,
      turns: 0,
    };
  }

  function cloneProject(project) {
    return JSON.parse(JSON.stringify(project));
  }

  function snapshotMeta(project) {
    return {
      title: project.title,
      goal: project.goal,
      stack: project.stack,
      theme: project.theme,
      density: project.density,
      templateId: project.templateId,
      activeScreen: project.activeScreen,
      components: [...(project.components || [])],
      screens: (project.screens || []).map((s) => s.label + ":" + s.templateId),
    };
  }

  function diffProjects(before, after) {
    const a = snapshotMeta(before);
    const b = snapshotMeta(after);
    const changes = [];
    if (a.title !== b.title) changes.push(`title → ${b.title}`);
    if (a.goal !== b.goal) changes.push("goal обновлена");
    if (a.stack !== b.stack) changes.push(`stack → ${b.stack}`);
    if (a.theme !== b.theme) changes.push(`theme → ${b.theme}`);
    if (a.density !== b.density) changes.push(`density → ${b.density}`);
    if (a.templateId !== b.templateId) changes.push(`template → ${b.templateId}`);
    if (a.activeScreen !== b.activeScreen) changes.push(`screen → ${b.activeScreen}`);
    const added = b.components.filter((c) => !a.components.includes(c));
    if (added.length) changes.push(`+ ${added.join(", ")}`);
    if (a.screens.join("|") !== b.screens.join("|")) changes.push(`экраны: ${b.screens.join(", ")}`);
    return changes;
  }

  function getReadiness(project) {
    const checks = [
      { id: "goal", label: "Цель", ok: !!(project.goal && project.goal.length > 8) },
      { id: "template", label: "Шаблон", ok: !!project.templateId },
      { id: "components", label: "Компоненты", ok: (project.components || []).length >= 3 },
      { id: "stack", label: "Стек", ok: !!project.stack },
      { id: "screen", label: "Экран", ok: !!(project.screens && project.screens.length) || !!project.html },
    ];
    const done = checks.filter((c) => c.ok).length;
    return { checks, done, total: checks.length, ready: done === checks.length, pct: Math.round((done / checks.length) * 100) };
  }

  function applyScenario(scenario) {
    const p = emptyProject();
    p.name = scenario.label;
    p.goal = scenario.goal;
    p.title = scenario.title;
    p.stack = scenario.stack;
    p.theme = scenario.theme;
    p.density = scenario.density;
    p.accent = scenario.accent;
    p.notes = [...(scenario.notes || [])];
    p.screens = (scenario.screens || []).map((s) => ({ ...s }));
    p.activeScreen = scenario.activeScreen || (p.screens[0] && p.screens[0].id);
    const screen = p.screens.find((s) => s.id === p.activeScreen) || p.screens[0];
    p.templateId = screen ? screen.templateId : null;
    const grounded = groundInDesignSystem(p.goal, p.templateId);
    p.components = grounded.names.length ? grounded.names : ["AppShell"];
    p.grounding = grounded;
    p.status = "ready";
    composePreview(p);
    return p;
  }

  function demoProject() {
    return emptyProject();
  }

  function loadProject() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return demoProject();
      const parsed = { ...emptyProject(), ...JSON.parse(raw) };
      if (!parsed.templateId && !(parsed.screens && parsed.screens.length)) return demoProject();
      if (parsed.screens && parsed.screens.length && !parsed.templateId) {
        const scr = parsed.screens.find((s) => s.id === parsed.activeScreen) || parsed.screens[0];
        parsed.templateId = scr.templateId;
      }
      if (parsed.templateId) composePreview(parsed);
      return parsed;
    } catch (e) {
      return demoProject();
    }
  }

  function saveProject(project) {
    sanitizeProjectComponents(project);
    project.updatedAt = Date.now();
    project.status = getReadiness(project).ready ? "ready" : "draft";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch (e) {}
    return project;
  }

  function loadSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return emptySession();
      return { ...emptySession(), ...JSON.parse(raw) };
    } catch (e) {
      return emptySession();
    }
  }

  function saveSession(session) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {}
    return session;
  }

  function rememberDecision(session, text) {
    if (!text) return session;
    const next = { ...session, decisions: [...(session.decisions || [])] };
    if (!next.decisions.includes(text)) {
      next.decisions.push(text);
      if (next.decisions.length > 12) next.decisions.shift();
    }
    return saveSession(next);
  }

  /* ─── preview compose ─── */
  function applyTitleToHtml(html, title) {
    if (!html || !title) return html || "";
    return html.replace(/(sb-appshell-title">)([^<]*)(<\/span>)/i, `$1${title}$3`);
  }

  function applyDensity(html, density) {
    if (!html) return html;
    if (density === "compact") {
      return html.replace('class="tpl-viewport"', 'class="tpl-viewport sb-agent-density-compact"');
    }
    return html.replace(/\s*sb-agent-density-compact/g, "");
  }

  function composePreview(project) {
    const screen = (project.screens || []).find((s) => s.id === project.activeScreen);
    const templateId = (screen && screen.templateId) || project.templateId;
    project.templateId = templateId;
    const tpl = getTemplate(templateId);
    let html = tpl ? tpl.html : "";
    if (!html) {
      html = `<div class="tpl-viewport" style="padding:32px;font-family:var(--font-sans),Inter,sans-serif">
        <h1 style="margin:0 0 8px;font-size:22px;color:var(--text-main)">${project.title || "Черновик"}</h1>
        <p style="color:var(--text-secondary);margin:0 0 16px">Шаблон ещё не выбран.</p>
      </div>`;
    }
    html = applyTitleToHtml(html, project.title);
    html = applyDensity(html, project.density);
    project.html = html;
    return html;
  }

  function setActiveScreen(project, screenId) {
    const scr = (project.screens || []).find((s) => s.id === screenId);
    if (!scr) return project;
    project.activeScreen = scr.id;
    project.templateId = scr.templateId;
    composePreview(project);
    return project;
  }

  function interactiveBootScript() {
    return `<script>(function(){
      document.querySelectorAll('[data-tpl-row]').forEach(function(row){
        row.addEventListener('click', function(){
          document.querySelectorAll('[data-tpl-row]').forEach(function(r){ r.classList.remove('is-selected'); });
          row.classList.add('is-selected');
          var drawer = document.querySelector('[data-tpl-drawer]');
          if (!drawer) return;
          drawer.hidden = false;
          var t = document.querySelector('[data-tpl-drawer-title]');
          var b = document.querySelector('[data-tpl-drawer-brand]');
          var s = document.querySelector('[data-tpl-drawer-status]');
          if (t) t.textContent = 'Заявка #' + (row.getAttribute('data-id') || '');
          if (b) b.textContent = row.getAttribute('data-brand') || '';
          if (s) s.textContent = row.getAttribute('data-status') || '';
        });
      });
      var closeBtn = document.querySelector('[data-tpl-drawer-close]');
      if (closeBtn) closeBtn.addEventListener('click', function(){
        var drawer = document.querySelector('[data-tpl-drawer]');
        if (drawer) drawer.hidden = true;
      });
      document.querySelectorAll('[data-filter-remove]').forEach(function(btn){
        btn.addEventListener('click', function(e){
          e.stopPropagation();
          var chip = btn.closest('.sb-filter-chip');
          if (chip) chip.remove();
        });
      });
    })();<\/script>`;
  }

  function buildPreviewDocument(project) {
    const bodyHtml = composePreview(project);
    const theme = project.theme === "dark" ? "dark" : "light";
    const accentCss = project.accent
      ? `:root{--primary:${project.accent};--primary-hover:${project.accent};}`
      : "";
    return `<!DOCTYPE html>
<html lang="ru" data-theme="${theme}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${(project.title || "Preview").replace(/</g, "")}</title>
<link rel="stylesheet" href="css/tokens.css" />
<link rel="stylesheet" href="css/app.css" />
<link rel="stylesheet" href="css/components.css" />
<link rel="stylesheet" href="css/components-medium.css" />
<link rel="stylesheet" href="css/components-high.css" />
<link rel="stylesheet" href="css/components-low.css" />
<link rel="stylesheet" href="css/components-upgrades.css" />
<link rel="stylesheet" href="css/components-dark.css" />
<link rel="stylesheet" href="css/templates.css" />
<style>
  html, body { margin:0; height:100%; background: var(--bg, #eef2f4); }
  body { overflow: auto; }
  .sb-agent-density-compact .sb-appshell-main { padding: 12px !important; }
  .sb-agent-density-compact .sb-stat { padding: 10px 12px !important; }
  ${accentCss}
</style>
</head>
<body>${bodyHtml}${interactiveBootScript()}</body>
</html>`;
  }

  function exportPrompt(project) {
    const stackMap = {
      react: "React + Tailwind CSS",
      vue: "Vue 3 + Tailwind CSS",
      html: "HTML + CSS + Vanilla JS",
    };
    const stackText = stackMap[project.stack] || stackMap.react;
    const names = project.components || [];
    const screens = (project.screens || [])
      .map((s) => `- ${s.label} (${s.templateId})`)
      .join("\n");
    const ready = getReadiness(project);
    const base = `# SB Design System — спецификация проекта

**Проект:** ${project.name || project.title}
**Статус:** ${ready.ready ? "готов к передаче" : "черновик"} (${ready.pct}%)
**Цель:** ${project.goal || project.title}
**Заголовок UI:** ${project.title}
**Стек:** ${stackText}
**Тема:** ${project.theme} · плотность ${project.density}
${project.accent ? `**Accent:** ${project.accent}\n` : ""}
## Экраны
${screens || "- один экран: " + (project.templateId || "custom")}

## Компоненты SB (whitelist)
${names.map((n) => `- ${n}`).join("\n") || "- AppShell"}

## SB Design System Policy (${SB_POLICY.id})
${SB_POLICY.rules.map((r) => `- ${r}`).join("\n")}
${project.grounding && project.grounding.rationale ? `\n## Почему эти компоненты\n${project.grounding.picks.map((p) => `- ${p.name}: ${p.why}`).join("\n")}\n` : ""}
## Правила реализации
- Только токены SB (CSS variables :root)
- Корпоративный строгий стиль, без «AI-purple»
- Доступность, hover, focus-ring из токенов
- Верни код по экранам выше · только компоненты из whitelist

## Заметки
${(project.notes || []).map((n) => `- ${n}`).join("\n") || "- нет"}`;

    if (typeof buildAiPromptWithStyles === "function") {
      return buildAiPromptWithStyles(base, names);
    }
    return base;
  }

  function exportHandoff(project, session) {
    sanitizeProjectComponents(project);
    const gate = canHandoff(project);
    if (!gate.ok) {
      return {
        blocked: true,
        ready: false,
        readiness: gate.readiness,
        compliance: gate.compliance,
        reasons: gate.reasons,
        componentMap: (project.components || []).slice(),
        screens: (project.screens || []).map((s) => ({ ...s })),
        decisions: (session && session.decisions) || [],
        planner: (session && session.planner) || PLANNER_MODE,
      };
    }
    return {
      blocked: false,
      ready: true,
      readiness: gate.readiness,
      compliance: gate.compliance,
      spec: exportPrompt(project),
      html: buildPreviewDocument(project),
      componentMap: (project.components || []).slice(),
      screens: (project.screens || []).map((s) => ({ ...s })),
      decisions: (session && session.decisions) || [],
      planner: (session && session.planner) || PLANNER_MODE,
    };
  }

  /* ─── TOOL REGISTRY (LLM will call these by name) ─── */
  const TOOLS = {
    recall_sb_policy: {
      description: "Вспомнить правила SB Design System (system brief)",
      parameters: {},
      execute(ctx) {
        ctx.session.policyId = SB_POLICY.id;
        ctx._lastPolicy = SB_POLICY;
        saveSession(ctx.session);
        return {
          ok: true,
          observe: `Policy ${SB_POLICY.id}: только каталог SB · ${SB_POLICY.rules.length} правил`,
          policy: SB_POLICY,
          brief: SB_POLICY.systemBrief(),
        };
      },
    },
    ground_in_sb: {
      description: "Сопоставить бриф с компонентами/шаблоном SB и объяснить выбор",
      parameters: { brief: "string", templateId: "string" },
      execute(ctx, args) {
        const templateId = args.templateId || ctx.project.templateId;
        const grounded = groundInDesignSystem(args.brief || ctx.project.goal, templateId);
        ctx.project.grounding = grounded;
        if (grounded.names.length) ctx.project.components = grounded.names;
        ctx._lastGrounding = grounded;
        ctx.session = rememberDecision(ctx.session, "Grounding SB: " + grounded.names.slice(0, 4).join(", "));
        return {
          ok: true,
          observe: grounded.names.length
            ? `SB: ${grounded.names.slice(0, 5).join(", ")}${grounded.names.length > 5 ? "…" : ""}`
            : "Нет маппинга — нужен шаблон SB",
          grounding: grounded,
        };
      },
    },
    assert_sb_compliance: {
      description: "Проверить, что проект использует только SB (whitelist + шаблоны)",
      parameters: {},
      execute(ctx) {
        const report = validateProjectAgainstSb(ctx.project);
        ctx.project.compliance = report;
        ctx._lastCompliance = report;
        return {
          ok: report.ok,
          observe: report.summary,
          compliance: report,
        };
      },
    },
    apply_scenario: {
      description: "Собрать готовый multi-screen сценарий SB",
      parameters: { scenarioId: "string" },
      execute(ctx, args) {
        const sc = SCENARIOS.find((s) => s.id === args.scenarioId) || SCENARIOS[0];
        const built = applyScenario(sc);
        if (args.goalOverride) {
          built.goal = args.goalOverride;
          const grounded = groundInDesignSystem(args.goalOverride, built.templateId);
          built.components = grounded.names;
          built.grounding = grounded;
        }
        Object.keys(ctx.project).forEach((k) => delete ctx.project[k]);
        Object.assign(ctx.project, built);
        ctx.session = rememberDecision(ctx.session, "Сценарий SB: " + sc.label);
        return { ok: true, observe: `Сценарий SB «${sc.label}»: ${built.screens.length} экрана, ${built.components.length} комп.` };
      },
    },
    build_from_intent: {
      description: "Собрать проект из intent → template + components SB",
      parameters: { templateId: "string", goal: "string" },
      execute(ctx, args) {
        const p = ctx.project;
        const tpl = getTemplate(args.templateId);
        p.goal = args.goal || p.goal;
        p.name = guessTitle(args.goal || "", tpl);
        p.title = p.name;
        p.templateId = args.templateId;
        const grounded = groundInDesignSystem(args.goal || "", args.templateId);
        p.components = grounded.names.length ? grounded.names : (tpl && tpl.components) || ["AppShell"];
        p.grounding = grounded;
        p.screens = [{ id: "main", label: tpl ? tpl.label : "Экран", templateId: args.templateId }];
        p.activeScreen = "main";
        if (args.templateId === "template-request") {
          p.screens.push({ id: "analytics", label: "Аналитика", templateId: "template-dashboard" });
        }
        if (args.templateId === "template-dashboard") {
          p.screens.push({ id: "orders", label: "Заказы", templateId: "template-orders" });
        }
        composePreview(p);
        ctx.session = rememberDecision(ctx.session, "Шаблон SB: " + (tpl ? tpl.label : args.templateId));
        return { ok: true, observe: `Шаблон SB «${tpl ? tpl.label : args.templateId}» · ${p.components.length} комп.` };
      },
    },
    set_theme: {
      description: "Сменить тему light/dark",
      parameters: { theme: "light|dark" },
      execute(ctx, args) {
        ctx.project.theme = args.theme === "dark" ? "dark" : "light";
        composePreview(ctx.project);
        ctx.session = rememberDecision(ctx.session, "Тема: " + ctx.project.theme);
        return { ok: true, observe: `Тема ${ctx.project.theme}` };
      },
    },
    set_density: {
      description: "Плотность UI",
      parameters: { density: "default|compact" },
      execute(ctx, args) {
        ctx.project.density = args.density === "compact" ? "compact" : "default";
        composePreview(ctx.project);
        ctx.session = rememberDecision(ctx.session, "Плотность: " + ctx.project.density);
        return { ok: true, observe: `Плотность ${ctx.project.density}` };
      },
    },
    set_stack: {
      description: "Целевой стек экспорта",
      parameters: { stack: "react|vue|html" },
      execute(ctx, args) {
        if (["react", "vue", "html"].includes(args.stack)) ctx.project.stack = args.stack;
        ctx.session = rememberDecision(ctx.session, "Стек: " + ctx.project.stack);
        return { ok: true, observe: `Стек ${ctx.project.stack}` };
      },
    },
    set_title: {
      description: "Заголовок UI",
      parameters: { title: "string" },
      execute(ctx, args) {
        ctx.project.title = String(args.title || "").trim() || ctx.project.title;
        ctx.project.name = ctx.project.title;
        composePreview(ctx.project);
        return { ok: true, observe: `Заголовок «${ctx.project.title}»` };
      },
    },
    set_accent: {
      description: "Фирменный accent SB",
      parameters: { accent: "string" },
      execute(ctx, args) {
        ctx.project.accent = args.accent || "#008f95";
        if (!ctx.project.notes.includes("Accent primary SB")) ctx.project.notes.push("Accent primary SB");
        composePreview(ctx.project);
        return { ok: true, observe: `Accent ${ctx.project.accent}` };
      },
    },
    set_active_screen: {
      description: "Переключить экран превью",
      parameters: { screenId: "string" },
      execute(ctx, args) {
        setActiveScreen(ctx.project, args.screenId);
        return { ok: true, observe: `Экран ${ctx.project.activeScreen}` };
      },
    },
    add_component: {
      description: "Добавить компонент из whitelist SB",
      parameters: { query: "string" },
      execute(ctx, args) {
        const hits = searchComponents(args.query, 5);
        if (!hits[0]) return { ok: false, observe: "Компонент не найден в SB" };
        if (!ctx.project.components.includes(hits[0].name)) {
          ctx.project.components = [...ctx.project.components, hits[0].name];
        }
        ctx.project.notes.push("Добавить " + hits[0].name);
        return { ok: true, observe: `+ ${hits[0].name}` };
      },
    },
    search_components: {
      description: "Поиск по каталогу SB",
      parameters: { query: "string", limit: "number" },
      execute(ctx, args) {
        const hits = searchComponents(args.query, args.limit || 6);
        ctx._lastSearch = hits;
        return {
          ok: true,
          observe: hits.length ? hits.map((c) => c.name).join(", ") : "пусто",
          hits,
        };
      },
    },
    compose_preview: {
      description: "Пересобрать HTML превью из шаблона",
      parameters: {},
      execute(ctx) {
        composePreview(ctx.project);
        return { ok: true, observe: "Превью собрано" };
      },
    },
    get_readiness: {
      description: "Чеклист готовности к передаче",
      parameters: {},
      execute(ctx) {
        const r = getReadiness(ctx.project);
        ctx._lastReadiness = r;
        return { ok: true, observe: `${r.pct}% (${r.done}/${r.total})`, readiness: r };
      },
    },
    remember_brief: {
      description: "Сохранить бриф в память сессии",
      parameters: { brief: "string" },
      execute(ctx, args) {
        ctx.session.brief = args.brief || ctx.session.brief;
        ctx.project.goal = ctx.project.goal || args.brief;
        saveSession(ctx.session);
        return { ok: true, observe: "Бриф сохранён" };
      },
    },
  };

  function listToolsForLlm() {
    return Object.keys(TOOLS).map((name) => ({
      name,
      description: TOOLS[name].description,
      parameters: TOOLS[name].parameters,
    }));
  }

  /* ─── PLANNERS ─── */
  function getPlannerConfig() {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      const cfg = raw ? JSON.parse(raw) : {};
      return {
        mode: cfg.mode === "llm" ? "llm" : "rule",
        endpoint: cfg.endpoint || "",
        apiKey: cfg.apiKey || "",
      };
    } catch (e) {
      return { mode: "rule", endpoint: "", apiKey: "" };
    }
  }

  function setPlannerConfig(partial) {
    const next = { ...getPlannerConfig(), ...(partial || {}) };
    PLANNER_MODE = next.mode === "llm" ? "llm" : "rule";
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
    } catch (e) {}
    return next;
  }

  /**
   * Normalize any planner JSON (LLM or rule) to a safe plan.
   * Drops unknown tools — model cannot invent actions outside registry.
   */
  function normalizePlan(raw, fallbackPlanner) {
    const plan = raw && typeof raw === "object" ? raw : {};
    const allowed = new Set(Object.keys(TOOLS));
    const steps = Array.isArray(plan.steps)
      ? plan.steps
          .filter((s) => s && allowed.has(s.tool))
          .map((s) => ({
            tool: s.tool,
            args: s.args && typeof s.args === "object" ? s.args : {},
            why: String(s.why || ""),
          }))
      : [];
    return {
      planner: plan.planner || fallbackPlanner || "rule",
      summary: String(plan.summary || "План"),
      steps,
      kind: plan.kind || null,
      reply: plan.reply || null,
      clarify: plan.clarify || null,
      suggestions: plan.suggestions || null,
      preview: !!plan.preview || plan.kind === "build",
    };
  }

  function parsePlanJson(text) {
    if (!text) return null;
    const str = String(text).trim();
    try {
      return JSON.parse(str);
    } catch (e) {
      const m = str.match(/\{[\s\S]*\}/);
      if (!m) return null;
      try {
        return JSON.parse(m[0]);
      } catch (e2) {
        return null;
      }
    }
  }

  /**
   * Sync LLM planner: only works if endpoint already returned via cache — normally use planTurnAsync.
   * Returns null → RulePlanner fallback.
   */
  function LlmPlanner(ctx) {
    const cfg = getPlannerConfig();
    if (cfg.mode !== "llm" || !cfg.endpoint) return null;
    if (ctx && ctx._llmPlan) return normalizePlan({ ...ctx._llmPlan, planner: "llm" }, "llm");
    return null;
  }

  /**
   * Async: fetch plan from LLM endpoint. Body includes systemBrief + tools + message + project snapshot.
   * Endpoint must return JSON { summary, steps:[{tool,args,why}], kind?, reply? }.
   */
  async function fetchLlmPlan(ctx) {
    const cfg = getPlannerConfig();
    if (!cfg.endpoint) return null;
    const payload = {
      system: SB_POLICY.systemBrief(),
      tools: listToolsForLlm(),
      message: ctx.message,
      project: {
        title: ctx.project.title,
        goal: ctx.project.goal,
        templateId: ctx.project.templateId,
        components: ctx.project.components,
        screens: ctx.project.screens,
        stack: ctx.project.stack,
        theme: ctx.project.theme,
      },
      session: {
        brief: ctx.session.brief,
        decisions: ctx.session.decisions,
      },
    };
    const headers = { "Content-Type": "application/json" };
    if (cfg.apiKey) headers.Authorization = "Bearer " + cfg.apiKey;
    const res = await fetch(cfg.endpoint, { method: "POST", headers, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error("LLM planner HTTP " + res.status);
    const data = await res.json();
    const parsed = data.steps ? data : parsePlanJson(data.content || data.text || data.plan);
    if (!parsed) throw new Error("LLM planner: invalid plan JSON");
    return normalizePlan({ ...parsed, planner: "llm" }, "llm");
  }

  function RulePlanner({ message, project, session }) {
    const raw = String(message || "").trim();
    const lower = raw.toLowerCase().replace(/ё/g, "е");
    const steps = [];
    const push = (tool, args, why) => steps.push({ tool, args: args || {}, why: why || "" });

    if (!raw) {
      return { planner: "rule", summary: "Пустой запрос", steps: [], reply: "Напишите задачу или выберите сценарий." };
    }

    // stack sniff into plan
    if (/react/.test(lower)) push("set_stack", { stack: "react" }, "В брифе указан React");
    if (/vue/.test(lower)) push("set_stack", { stack: "vue" }, "В брифе указан Vue");
    if (/\bhtml\b|ваниль|vanilla/.test(lower)) push("set_stack", { stack: "html" }, "В брифе указан HTML");

    const screenHit = (project.screens || []).find(
      (s) => lower.includes(s.label.toLowerCase()) || lower === s.id
    );
    if (screenHit && /экран|открой|покажи|переключи|вкладк/.test(lower)) {
      push("set_active_screen", { screenId: screenHit.id }, `Открыть экран «${screenHit.label}»`);
      push("compose_preview", {}, "Обновить превью");
      return {
        planner: "rule",
        summary: `Переключение на «${screenHit.label}»`,
        steps,
        reply: `Открыл экран **${screenHit.label}**.`,
        preview: true,
      };
    }

    if (/темн|тёмн|dark mode|темную тему|темная тема/.test(lower)) {
      push("set_theme", { theme: "dark" }, "Запрос тёмной темы");
      return { planner: "rule", summary: "Тёмная тема", steps, reply: "Превью на **тёмной теме** SB.", preview: true };
    }
    if (/светл|light mode|светлую тему|светлая тема/.test(lower)) {
      push("set_theme", { theme: "light" }, "Запрос светлой темы");
      return { planner: "rule", summary: "Светлая тема", steps, reply: "Вернул **светлую тему**.", preview: true };
    }
    if (/компакт/.test(lower)) {
      push("set_density", { density: "compact" }, "Компактная плотность");
      return { planner: "rule", summary: "Компактнее", steps, reply: "Включил **компактную** плотность.", preview: true };
    }
    if (/стандартн|обычн(ая|ые) плотн/.test(lower)) {
      push("set_density", { density: "default" }, "Стандартная плотность");
      return { planner: "rule", summary: "Плотность std", steps, reply: "Плотность **стандартная**.", preview: true };
    }
    if (/акцент|бирюз|teal|зелён|зелен/.test(lower)) {
      push("set_accent", { accent: "#008f95" }, "Фирменный accent SB");
      return { planner: "rule", summary: "Accent SB", steps, reply: "Закрепил **accent #008f95**.", preview: true };
    }

    const titleMatch = raw.match(/(?:заголовок|назвай|переименуй(?:\s+в)?)\s*[—:\-]?\s*[«"]?([^»"\n]{2,48})[»"]?/i);
    if (titleMatch && project.templateId) {
      push("set_title", { title: titleMatch[1].trim() }, "Переименовать UI");
      return {
        planner: "rule",
        summary: "Новый заголовок",
        steps,
        reply: `Заголовок: **${titleMatch[1].trim()}**.`,
        preview: true,
      };
    }

    if (/^(что умеешь|помощь|help|\?|статус|готовность)$/i.test(raw) || /готовность|чеклист/.test(lower)) {
      push("get_readiness", {}, "Проверить gate готовности");
      return { planner: "rule", summary: "Чеклист готовности", steps, kind: "readiness" };
    }

    if (/переда(й|ть)|handoff|в разработку|экспорт/.test(lower)) {
      push("recall_sb_policy", {}, "Перед передачей — правила SB");
      push("assert_sb_compliance", {}, "Только компоненты и шаблоны SB");
      push("get_readiness", {}, "Gate готовности");
      push("compose_preview", {}, "Финальная сборка превью");
      return { planner: "rule", summary: "Handoff с проверкой SB", steps, kind: "handoff", preview: true };
    }

    if (/политик|policy|compliance|комплаенс|проверь|проверить|design system|дизайн.?систем|только sb|whitelist/.test(lower)) {
      push("recall_sb_policy", {}, "Показать правила SB");
      push("assert_sb_compliance", {}, "Текущий проект vs каталог");
      return { planner: "rule", summary: "Проверка compliance SB", steps, kind: "policy" };
    }

    const scenario = matchScenario(raw);
    const intent = matchIntent(raw);
    const isBuild =
      !!scenario ||
      !!intent ||
      /сдела|собери|создай|нужен|хочу|проект|страниц|экран|портал|интерфейс|сценарий/.test(lower) ||
      /^(собери\s+)?(портал заявок|дашборд kpi|каталог|канбан|трекинг|заявки|дашборд|закупки kpi)$/i.test(raw.trim());

    if (isBuild && scenario) {
      push("recall_sb_policy", {}, "Работаем только внутри SB DS");
      push("remember_brief", { brief: raw }, "Зафиксировать бриф");
      push("apply_scenario", { scenarioId: scenario.id, goalOverride: raw.length > scenario.chip.length + 2 ? raw : null }, `Сценарий SB «${scenario.label}»`);
      push("ground_in_sb", { brief: raw, templateId: scenario.screens[0].templateId }, "Маппинг брифа → компоненты каталога");
      push("compose_preview", {}, "Превью из шаблона SB");
      push("assert_sb_compliance", {}, "Проверка whitelist");
      push("get_readiness", {}, "Готовность к передаче");
      return {
        planner: "rule",
        summary: `SB-сборка «${scenario.label}»`,
        steps,
        preview: true,
        kind: "build",
        replyHint: scenario.label,
      };
    }

    if (isBuild && intent) {
      push("recall_sb_policy", {}, "Работаем только внутри SB DS");
      push("remember_brief", { brief: raw }, "Зафиксировать бриф");
      push("build_from_intent", { templateId: intent.templateId, goal: raw }, "Шаблон SB по intent");
      push("ground_in_sb", { brief: raw, templateId: intent.templateId }, "Маппинг брифа → компоненты каталога");
      push("compose_preview", {}, "Превью из шаблона SB");
      push("assert_sb_compliance", {}, "Проверка whitelist");
      push("get_readiness", {}, "Готовность");
      return {
        planner: "rule",
        summary: `SB-сборка → ${intent.templateId}`,
        steps,
        preview: true,
        kind: "build",
      };
    }

    if (isBuild && !intent && !scenario) {
      push("recall_sb_policy", {}, "Сначала рамки SB DS");
      push("remember_brief", { brief: raw }, "Сохранить неполный бриф");
      return {
        planner: "rule",
        summary: "Нужен сценарий из SB",
        steps,
        clarify: clarifyQuestions(raw),
        suggestions: SCENARIOS.map((s) => s.chip),
        reply:
          "По политике SB собираю только из каталога.\nУточните тип экрана или выберите сценарий:\n\n" +
          clarifyQuestions(raw).map((q, i) => `${i + 1}. ${q}`).join("\n"),
      };
    }

    const addMatch = lower.match(/(?:добавь|подключи)\s+([a-zа-яё0-9 /._-]{2,40})/i);
    if (addMatch) {
      push("recall_sb_policy", {}, "Добавляем только из каталога SB");
      push("search_components", { query: addMatch[1], limit: 5 }, "Есть ли такой компонент в SB?");
      push("add_component", { query: addMatch[1] }, "Если найден — в whitelist");
      push("assert_sb_compliance", {}, "Проверка после добавления");
      return { planner: "rule", summary: "Добавление из каталога SB", steps };
    }

    push("recall_sb_policy", {}, "Поиск ограничен каталогом SB");
    push("search_components", { query: raw, limit: 6 }, "Поиск в uniqueComponentsList");
    return { planner: "rule", summary: "Поиск в каталоге SB", steps, kind: "search" };
  }

  function selectPlanner(ctx) {
    const cfg = getPlannerConfig();
    PLANNER_MODE = cfg.mode;
    if (cfg.mode === "llm") {
      const llm = LlmPlanner({ ...ctx, systemBrief: SB_POLICY.systemBrief(), tools: listToolsForLlm() });
      if (llm) return llm;
    }
    return normalizePlan(RulePlanner(ctx), "rule");
  }

  /* ─── ORCHESTRATOR LOOP ─── */
  function executeStep(project, session, step) {
    const tool = TOOLS[step.tool];
    if (!tool) {
      return { project, session, ok: false, observe: `Unknown tool: ${step.tool}`, diff: [] };
    }
    const before = cloneProject(project);
    const ctx = { project, session };
    let result;
    try {
      result = tool.execute(ctx, step.args || {}) || { ok: true, observe: "ok" };
    } catch (err) {
      result = { ok: false, observe: String(err && err.message ? err.message : err) };
    }
    sanitizeProjectComponents(ctx.project);
    const diff = diffProjects(before, ctx.project);
    if (diff.length) {
      ctx.project.history = [...(ctx.project.history || []), { at: Date.now(), tool: step.tool, diff }].slice(-40);
    }
    return {
      project: ctx.project,
      session: ctx.session,
      ok: !!result.ok,
      observe: result.observe || "",
      diff,
      extra: result,
    };
  }

  function buildReply(plan, project, session, lastExtra) {
    if (plan.reply) return plan.reply;
    if (plan.clarify && plan.clarify.length) {
      return "Уточню, чтобы взять готовый сценарий SB:\n\n" + plan.clarify.map((q, i) => `${i + 1}. ${q}`).join("\n");
    }
    if (plan.kind === "readiness") {
      const r = (lastExtra && lastExtra.readiness) || getReadiness(project);
      return (
        `**Готовность: ${r.pct}%** (${r.done}/${r.total})\n` +
        r.checks.map((c) => `${c.ok ? "✓" : "○"} ${c.label}`).join("\n") +
        (r.ready ? "\n\nСтатус: **готов к передаче**." : "\n\nДополните бриф или соберите сценарий.")
      );
    }
    if (plan.kind === "policy") {
      const c = (lastExtra && lastExtra.compliance) || project.compliance || validateProjectAgainstSb(project);
      return (
        `**Проверил по политике SB**\n\n` +
        SB_POLICY.rules.map((r) => `• ${r}`).join("\n") +
        `\n\n**Итог по проекту:** ${c.summary}` +
        (c.issues && c.issues.length ? "\n" + c.issues.map((i) => `— ${i}`).join("\n") : "") +
        "\n\nДальше можно дособрать экран или нажать **В разработку**."
      );
    }
    if (plan.kind === "handoff") {
      const r = getReadiness(project);
      const c = project.compliance || validateProjectAgainstSb(project);
      if (!c.ok) {
        return `Пока нельзя отдать в разработку — есть замечания по SB:\n${c.issues.map((i) => `• ${i}`).join("\n")}`;
      }
      return r.ready
        ? `Всё ок по SB · готовность **${r.pct}%**.\nНажмите **В разработку** в верхней панели — отдам Spec + HTML.`
        : `По SB всё чисто, но готовность ${r.pct}%. Закройте оставшиеся пункты чеклиста.`;
    }
    if (plan.kind === "search") {
      const hits = (lastExtra && lastExtra.hits) || [];
      if (!hits.length) {
        return "В каталоге SB ничего не нашёл по этому запросу.\nПопробуйте **Filter Bar**, **Drawer**, **Toast** — или соберите сценарий: **портал заявок** / **дашборд KPI**.";
      }
      return (
        `Нашёл в каталоге SB:\n` +
        hits.map((c) => `• **${c.name}** — ${c.category}`).join("\n") +
        `\n\nМогу добавить в текущий экран или собрать готовый сценарий.`
      );
    }
    if (plan.kind === "build") {
      const r = getReadiness(project);
      const g = project.grounding;
      const c = project.compliance || validateProjectAgainstSb(project);
      return (
        `Собрал **${project.title}** из компонентов SB — превью справа.\n\n` +
        `**Экраны:** ${(project.screens || []).map((s) => s.label).join(" · ")}\n` +
        (g && g.rationale ? `\n**Почему так:**\n${g.rationale}\n` : `**Компоненты:** ${(project.components || []).join(", ")}\n`) +
        `\n**Compliance:** ${c.summary}\n**Готовность:** ${r.pct}%\n\nДальше: «проверь compliance» или **В разработку**.`
      );
    }
    if (plan.steps && plan.steps.length) {
      return `Готово. Могу найти ещё компонент, пересобрать экран или проверить compliance.`;
    }
    return "Могу найти компонент, собрать **портал заявок** / **дашборд KPI** / **каталог** или проверить compliance SB.";
  }

  /**
   * planTurn — sync planning (Rule, or LLM if _llmPlan preloaded). No mutations.
   */
  function planTurn(project, session, message) {
    const ctx = { message, project: cloneProject(project), session: { ...session } };
    const plan = selectPlanner(ctx);
    plan.id = "plan_" + Date.now().toString(36);
    plan.steps = (plan.steps || []).filter((s) => TOOLS[s.tool]);
    return plan;
  }

  /**
   * planTurnAsync — tries LLM endpoint when mode=llm, else Rule. Always normalizePlan.
   */
  async function planTurnAsync(project, session, message) {
    const cfg = getPlannerConfig();
    const ctx = { message, project: cloneProject(project), session: { ...session } };
    if (cfg.mode === "llm" && cfg.endpoint) {
      try {
        const llmPlan = await fetchLlmPlan(ctx);
        if (llmPlan && llmPlan.steps) {
          llmPlan.id = "plan_" + Date.now().toString(36);
          return llmPlan;
        }
      } catch (err) {
        const fallback = normalizePlan(RulePlanner(ctx), "rule");
        fallback.id = "plan_" + Date.now().toString(36);
        fallback.summary = "LLM недоступен → Rule: " + fallback.summary;
        fallback._llmError = String(err && err.message ? err.message : err);
        return fallback;
      }
    }
    return planTurn(project, session, message);
  }

  /**
   * runTurn — plan + execute all steps (sync). Prefer executeStep in UI for animation.
   */
  function runTurn(project, session, message) {
    const plan = planTurn(project, session, message);
    let p = cloneProject(project);
    let s = { ...session, turns: (session.turns || 0) + 1, lastPlanId: plan.id, planner: plan.planner };
    const trace = [];
    let lastExtra = null;

    for (const step of plan.steps) {
      const out = executeStep(p, s, step);
      p = out.project;
      s = out.session;
      lastExtra = out.extra;
      trace.push({
        tool: step.tool,
        why: step.why,
        args: step.args,
        ok: out.ok,
        observe: out.observe,
        diff: out.diff,
      });
    }

    saveProject(p);
    saveSession(s);

    const reply = buildReply(plan, p, s, lastExtra);
    return {
      project: p,
      session: s,
      plan,
      trace,
      preview: !!plan.preview || plan.kind === "build",
      suggestions: plan.suggestions,
      messages: [{ role: "assistant", text: reply }],
      tools: trace.map((t) => t.tool),
      toolSteps: trace.map((t) => ({ tool: t.tool, detail: t.why || t.observe, why: t.why, observe: t.observe, diff: t.diff })),
      handoffReady: canHandoff(p).ok,
    };
  }

  /** Back-compat wrapper used by older UI */
  function handleUserMessage(project, text) {
    const session = loadSession();
    return runTurn(project, session, text);
  }

  // init mode from storage
  PLANNER_MODE = getPlannerConfig().mode;

  global.SbAgent = {
    emptyProject,
    emptySession,
    demoProject,
    applyScenario,
    loadProject,
    saveProject,
    loadSession,
    saveSession,
    searchComponents,
    getTemplate,
    matchIntent,
    matchScenario,
    composePreview,
    buildPreviewDocument,
    exportPrompt,
    exportHandoff,
    handleUserMessage,
    planTurn,
    planTurnAsync,
    executeStep,
    runTurn,
    buildReply,
    getReadiness,
    canHandoff,
    setActiveScreen,
    listToolsForLlm,
    groundInDesignSystem,
    validateProjectAgainstSb,
    sanitizeProjectComponents,
    normalizePlan,
    parsePlanJson,
    getPlannerConfig,
    setPlannerConfig,
    fetchLlmPlan,
    TOOLS,
    SB_POLICY,
    templates,
    SCENARIOS,
    INTENT_MAP,
    get PLANNER_MODE() {
      return PLANNER_MODE;
    },
    RulePlanner,
    LlmPlanner,
  };
})(window);
