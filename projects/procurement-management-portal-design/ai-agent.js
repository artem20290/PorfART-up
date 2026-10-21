/**
 * AI-ассистент портала закупок
 * Архитектура как у LLM-агента: Policy → Planner → Tools → Observe → Reply
 * Planner сейчас rule-based (симуляция LLM), контракт тот же — можно подключить реальный LLM.
 */
(function () {
  var QUICK = [
    "Сводка за квартал",
    "Покажи карту расходов",
    "Подготовь к совещанию",
    "Кто вне контракта?",
    "Где переплачиваем?",
    "Разбери критический кейс",
    "Что сделать в первую очередь?",
    "Открытые действия",
    "Назначь действие",
    "Покажи аудит",
  ];

  /* Playbook UX: «хочет X → ведём в UI» (demo grounding) */
  var PLAYBOOK = {
    meeting: "14.10.2025",
    spend: "$18,4 млн",
    coverage: 89,
    coverageForecast: 95,
    targetCoverage: 96,
    offSuppliers: 34,
    offShare: "11 %",
    overBenchmark: 141,
    maxDelta: "+71 %",
    avgDelta: "+23 %",
    openActions: 2,
    actionsInWork: 1,
    heroSupplier: "ПромАрматура-Урал",
    heroPO: "PO-2025-04871",
    mapDepth: [
      "Уровень 1 — Категория холдинга (клик → фильтр)",
      "Уровень 2 — Поставщики в категории (клик → фильтр)",
      "Уровень 3 — Заказы PO (клик → карточка заказа)",
      "Дальше в карточке — строки номенклатуры, Δ к рынку, согласования → действие / аудит",
    ],
    topReasons: ["Нет контракта", "Контракт истёк", "Аварийная закупка", "Вне каталога"],
    priorities: [
      { title: "Закрыть топ вне контракта", why: "быстрый рост покрытия до совещания", tab: "suppliers" },
      { title: "Пересмотр тарифов выше рынка", why: "141 позиция · макс. +71 %", tab: "benchmarks" },
      { title: "Дожать открытые действия", why: "2 в пайплайне до 14.10", tab: "actions" },
    ],
    agenda: [
      "Покрытие контрактами: 89 % → цель 95 %",
      "34 поставщика вне условий — топ-5 на разбор",
      "Бенчмарки: где переплачиваем сильнее всего",
      "Статус действий ACT-2041 / ACT-2042",
      "Риски и аудит отклонений",
    ],
    /* Каталог сценариев для help + planner */
    scenarios: [
      { want: "Увидеть KPI квартала", ui: "Обзор → полоса метрик", depth: "срез по фильтрам", chip: "Сводка за квартал" },
      { want: "Пройти карту расходов", ui: "Обзор → Treemap", depth: "Категория → Поставщик → PO → строки", chip: "Покажи карту расходов" },
      { want: "Разобрать критический кейс", ui: "Обзор → hero → drawer", depth: "сразу PO + позиции", chip: "Разбери критический кейс" },
      { want: "Кто вне контракта", ui: "Поставщики + фильтр", depth: "таблица → карточка → действие", chip: "Кто вне контракта?" },
      { want: "Почему отклонения", ui: "Обзор (причины) или Поставщики", depth: "фильтр причины → карточка", chip: null },
      { want: "Где переплачиваем", ui: "Бенчмарки", depth: "позиция → PO → переговоры", chip: "Где переплачиваем?" },
      { want: "Назначить / провести меру", ui: "Действия + модал", depth: "Назначено → В работе → Закрыто", chip: "Назначь действие" },
      { want: "Подготовиться к совещанию", ui: "Обзор + повестка", depth: "KPI → кейс → действия", chip: "Подготовь к совещанию" },
      { want: "Проверить след", ui: "Аудит", depth: "журнал / ERP / выгрузка", chip: "Покажи аудит" },
      { want: "Найти поставщика или PO", ui: "Поиск в шапке", depth: "фильтр или drawer с PO", chip: null },
    ],
  };

  var THINK = [
    "Планирую UX-сценарий…",
    "Подбираю инструменты портала…",
    "Сверяю контекст закупок…",
    "Собираю ответ пользователю…",
  ];

  var TOOL_LABELS = {
    recall_policy: "Политика агента",
    get_snapshot: "Снимок данных портала",
    go_tab: "Открыть раздел",
    filter_off_contract: "Фильтр вне контракта",
    clear_filters: "Сброс фильтров",
    search: "Поиск поставщика / PO",
    open_action: "Форма действия",
    remember_brief: "Запомнить бриф",
    advise: "Рекомендации UX",
    highlight_ui: "Подсветка в интерфейсе",
    open_hero: "Открыть кейс на экране",
    open_first_row: "Открыть первую строку",
    focus_main: "Показать область контента",
  };

  var NAV = [
    { id: "overview", label: "Обзор квартала", keys: ["обзор", "квартал", "spend", "сводк", "покрыт", "kpi"] },
    { id: "suppliers", label: "Поставщики", keys: ["поставщик", "инн"] },
    { id: "benchmarks", label: "Бенчмарки", keys: ["бенчмарк", "цен", "рынок", "тариф", "переплат"] },
    { id: "actions", label: "Действия", keys: ["действ", "совеща"] },
    { id: "audit", label: "Аудит", keys: ["аудит", "протокол", "журнал"] },
  ];

  var state = {
    messages: [],
    loading: false,
    minimized: false,
    voiceListening: false,
    pos: { x: 0, y: 0 },
    thinkIdx: 0,
    session: { brief: "", turns: 0, lastPlanId: null },
  };

  var recognition = null;
  /* SB design systems — Icon Pack */
  var SB_ICONS = {
    refresh:
      '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    "chevron-down": '<path d="M6 9l6 6 6-6"/>',
    "chevron-up": '<path d="M18 15l-6-6-6 6"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>',
    "mic-off":
      '<line x1="2" y1="2" x2="22" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><line x1="12" y1="19" x2="12" y2="22"/>',
  };
  function sbIcon(id, size) {
    var paths = SB_ICONS[id];
    if (!paths) return "";
    var s = size || 16;
    return (
      '<svg width="' +
      s +
      '" height="' +
      s +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      paths +
      "</svg>"
    );
  }

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function bridge() {
    return window.ProcureAIBridge || null;
  }
  function uid() {
    return "plan-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  /* ─── voice ─── */
  function ensureRecognition() {
    if (recognition) return recognition;
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    recognition = new SR();
    recognition.lang = "ru-RU";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = function (event) {
      var text = (event.results[0] && event.results[0][0] && event.results[0][0].transcript) || "";
      state.voiceListening = false;
      syncVoiceUi();
      if (text.trim()) runTurn(text.trim());
    };
    recognition.onerror = function () {
      state.voiceListening = false;
      syncVoiceUi();
    };
    recognition.onend = function () {
      state.voiceListening = false;
      syncVoiceUi();
    };
    return recognition;
  }

  function syncVoiceUi() {
    var panel = $("#proc-ai-panel");
    if (!panel) return;
    var mic = panel.querySelector("[data-mic]");
    var input = panel.querySelector("[data-input]");
    if (mic) {
      mic.classList.toggle("is-listening", state.voiceListening);
      mic.innerHTML = sbIcon(state.voiceListening ? "mic-off" : "mic", 16);
      mic.title = state.voiceListening ? "Остановить" : "Голосовой ввод";
      mic.setAttribute("aria-pressed", state.voiceListening ? "true" : "false");
    }
    if (input) {
      input.placeholder = state.voiceListening
        ? "Говорите…"
        : "Например: кто вне контракта? открой бенчмарки…";
      input.disabled = state.loading || state.voiceListening;
    }
  }

  function toggleVoice() {
    var rec = ensureRecognition();
    if (!rec) {
      alert("Голосовой ввод не поддерживается в этом браузере. Используйте Chrome.");
      return;
    }
    if (state.voiceListening) {
      try {
        rec.stop();
      } catch (e) {}
      state.voiceListening = false;
      syncVoiceUi();
      return;
    }
    if (state.loading) return;
    try {
      rec.start();
      state.voiceListening = true;
      syncVoiceUi();
    } catch (e) {
      state.voiceListening = false;
      syncVoiceUi();
    }
  }

  /* ─── tools (исполнитель UX) ─── */
  function flash(el) {
    if (!el) return;
    el.classList.add("proc-ai-flash");
    setTimeout(function () {
      el.classList.remove("proc-ai-flash");
    }, 1400);
  }

  function toolGoTab(args) {
    var id = (args && args.id) || "";
    var label = (args && args.label) || "";
    var nav = NAV.find(function (n) {
      return n.id === id || n.label === label;
    });
    var b = bridge();
    if (b && b.goTab && nav) {
      b.goTab(nav.id);
      return { ok: true, observe: "Раздел «" + nav.label + "»" };
    }
    var want = (nav && nav.label) || label || id;
    var btns = $all(".sb-appshell-nav");
    var target = null;
    btns.forEach(function (btn) {
      var t = (btn.textContent || "").replace(/\s+/g, " ").trim();
      if (!target && want && t.indexOf(want.split(" ")[0]) !== -1) target = btn;
      if (!target && nav && t.indexOf(nav.label) !== -1) target = btn;
    });
    if (target) {
      target.click();
      flash(target);
      return { ok: true, observe: "Раздел «" + (target.textContent || "").replace(/\s+/g, " ").trim() + "»" };
    }
    return { ok: false, observe: "Раздел не найден" };
  }

  function toolFilterOff() {
    var b = bridge();
    if (b && b.filterOffContract) {
      b.filterOffContract();
      return { ok: true, observe: "Фильтр «вне контракта»" };
    }
    var btn = $all("button").find(function (el) {
      return /вне контракта/i.test(el.textContent || "");
    });
    if (btn) {
      btn.click();
      flash(btn);
      return { ok: true, observe: "Фильтр «вне контракта»" };
    }
    return { ok: false, observe: "Кнопка фильтра не найдена" };
  }

  function toolClearFilters() {
    var b = bridge();
    if (b && b.clearFilters) {
      b.clearFilters();
      return { ok: true, observe: "Фильтры сброшены" };
    }
    var btn = $all("button").find(function (el) {
      return /сбросить всё/i.test(el.textContent || "");
    });
    if (btn) {
      btn.click();
      return { ok: true, observe: "Фильтры сброшены" };
    }
    return { ok: false, observe: "Нечего сбрасывать" };
  }

  function toolSearch(args) {
    var query = String((args && args.query) || "").trim();
    if (!query) return { ok: false, observe: "Пустой запрос" };
    var b = bridge();
    if (b && b.search) {
      b.search(query);
      return { ok: true, observe: "Поиск «" + query + "»" };
    }
    var input = $(".nav-search-input, .spend-search input");
    if (!input) return { ok: false, observe: "Поиск недоступен" };
    var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(input, query);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }));
    flash(input);
    return { ok: true, observe: "Поиск «" + query + "»" };
  }

  function toolOpenAction() {
    var b = bridge();
    if (b && b.openAction) {
      b.openAction();
      return { ok: true, observe: "Модалка действия" };
    }
    var primary = $all("header button, .sb-appshell-header button").find(function (el) {
      return /Действие/i.test(el.textContent || "");
    });
    if (primary) {
      primary.click();
      flash(primary);
      return { ok: true, observe: "Модалка действия" };
    }
    return { ok: false, observe: "Кнопка действия не найдена" };
  }

  function toolHighlight(args) {
    var target = (args && args.target) || "main";
    var map = {
      main: ".sb-appshell-main, main.sb-appshell-main, .tpl-dashboard-main",
      stats: ".sb-stats, .tpl-dashboard-stats",
      alert: ".spend-crit-card, .sb-alert--warning",
      filter: ".sb-filter-bar",
      table: ".sb-table-grid, table.sb-table-grid, .sb-table-toolbar",
      map: ".sb-appshell-main .border-b, [class*='SpendMap']",
      sidebar: ".sb-appshell-sidebar",
      footer: "footer",
      actions: ".sb-appshell-main",
      audit: ".sb-appshell-main",
      benchmarks: ".sb-appshell-main .sb-table-grid, .sb-appshell-main",
    };
    var sel = map[target] || target;
    var nodes = $all(sel);
    if (!nodes.length) {
      var main = $(".sb-appshell-main, main");
      if (main) {
        main.scrollIntoView({ behavior: "smooth", block: "nearest" });
        flash(main);
        return { ok: true, observe: "Подсветил основную область" };
      }
      return { ok: false, observe: "Элемент UI не найден" };
    }
    var el = nodes[0];
    try {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {}
    nodes.slice(0, 3).forEach(function (n) {
      flash(n);
    });
    return { ok: true, observe: "На экране: " + target };
  }

  function toolFocusMain() {
    var main = $(".sb-appshell-main, main.tpl-dashboard-main, main");
    if (!main) return { ok: false, observe: "Main не найден" };
    try {
      main.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {}
    flash(main);
    return { ok: true, observe: "Фокус на контенте портала" };
  }

  function toolOpenHero() {
    var b = bridge();
    if (b && b.openHero) {
      b.openHero();
      return { ok: true, observe: "Открыт hero-кейс" };
    }
    var zone = $(".spend-crit-card, .sb-alert--warning");
    if (zone) {
      flash(zone);
      var btn =
        $all("button", zone).find(function (el) {
          return /заказ|поставщик|открыть|карточк/i.test(el.textContent || "");
        }) || $all("button", zone)[0];
      if (btn) {
        btn.click();
        return { ok: true, observe: "Открыт кейс из критической карточки" };
      }
    }
    var row = $(".sb-table-grid tbody tr");
    if (row) {
      row.click();
      flash(row);
      return { ok: true, observe: "Открыта первая строка таблицы" };
    }
    return { ok: false, observe: "Кейс на экране не найден" };
  }

  function toolOpenFirstRow() {
    var b = bridge();
    if (b && b.openFirstSupplier) {
      b.openFirstSupplier();
      return { ok: true, observe: "Открыт первый поставщик среза" };
    }
    var row = $(".sb-table-grid tbody tr");
    if (row) {
      try {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch (e) {}
      flash(row);
      setTimeout(function () {
        row.click();
      }, 120);
      return { ok: true, observe: "Клик по первой строке таблицы" };
    }
    return { ok: false, observe: "Таблица пуста / ещё не отрисована" };
  }

  function toolSnapshot() {
    var b = bridge();
    var base = {
      spendLabel: "Q3 2025 · " + PLAYBOOK.spend,
      offSuppliers: PLAYBOOK.offSuppliers,
      coverage: PLAYBOOK.coverage,
      coverageForecast: PLAYBOOK.coverageForecast,
      actionsOpen: PLAYBOOK.openActions,
      meeting: PLAYBOOK.meeting,
      benchmarks: PLAYBOOK.avgDelta + " · " + PLAYBOOK.overBenchmark + " выше рынка",
      offShare: PLAYBOOK.offShare,
      maxDelta: PLAYBOOK.maxDelta,
      reasons: PLAYBOOK.topReasons,
    };
    if (b && b.getSnapshot) {
      var s = b.getSnapshot();
      return { ok: true, observe: "Snapshot", data: Object.assign({}, base, s) };
    }
    return { ok: true, observe: "Snapshot (playbook)", data: base };
  }

  function executeTool(step) {
    var tool = step.tool;
    var args = step.args || {};
    if (tool === "recall_policy") {
      return { ok: true, observe: "Только UX-действия портала · grounding в данных" };
    }
    if (tool === "remember_brief") {
      state.session.brief = args.brief || state.session.brief;
      return { ok: true, observe: "Бриф сохранён" };
    }
    if (tool === "advise") {
      return { ok: true, observe: args.topic || "рекомендации", data: args };
    }
    if (tool === "get_snapshot") return toolSnapshot();
    if (tool === "go_tab") return toolGoTab(args);
    if (tool === "filter_off_contract") return toolFilterOff();
    if (tool === "clear_filters") return toolClearFilters();
    if (tool === "search") return toolSearch(args);
    if (tool === "open_action") return toolOpenAction();
    if (tool === "highlight_ui") return toolHighlight(args);
    if (tool === "focus_main") return toolFocusMain();
    if (tool === "open_hero") return toolOpenHero();
    if (tool === "open_first_row") return toolOpenFirstRow();
    return { ok: false, observe: "Неизвестный tool: " + tool };
  }

  /* ─── Fake-LLM Planner: гипотетические UX-задачи директора ─── */
  function RulePlanner(raw) {
    var q = String(raw || "").toLowerCase().replace(/ё/g, "е");
    var steps = [];
    function push(tool, args, why) {
      steps.push({ tool: tool, args: args || {}, why: why || "" });
    }

    push("recall_policy", {}, "Рамки: UX-агент портала закупок");
    push("remember_brief", { brief: raw }, "Зафиксировать запрос пользователя");

    if (/что умеешь|помощь|help|команды|сценари/.test(q) || q === "?") {
      push("advise", { topic: "catalog" }, "Каталог UX-сценариев");
      return {
        id: uid(),
        planner: "llm-sim",
        summary: "Каталог помощи пользователю",
        steps: steps,
        replyHint: "help",
      };
    }

    // Карта расходов / treemap / drill-down
    if (/карт.*расход|treemap|карта spend|каскад.*расход|drill|углуб.*карт|покажи карт|как.*карт/.test(q)) {
      push("get_snapshot", {}, "Контекст spend");
      push("go_tab", { id: "overview", label: "Обзор квартала" }, "Карта на обзоре");
      push("focus_main", {}, "Показать treemap");
      push("highlight_ui", { target: "map" }, "Подсветить карту расходов");
      push("advise", { topic: "map_depth" }, "Объяснить 3 уровня + drawer");
      return { id: uid(), planner: "llm-sim", summary: "UX: карта расходов (глубина)", steps: steps, replyHint: "map" };
    }

    // Покрытие / цель холдинга (раньше общей сводки)
    if (/целев.*покрыт|цель.*96|контролируем.*расход|показатель контрол/.test(q)) {
      push("get_snapshot", {}, "Факт и прогноз покрытия");
      push("go_tab", { id: "overview", label: "Обзор квартала" }, "Панель покрытия");
      push("focus_main", {}, "Обзор");
      push("highlight_ui", { target: "stats" }, "KPI покрытия");
      push("advise", { topic: "coverage" }, "Факт → прогноз → цель");
      return { id: uid(), planner: "llm-sim", summary: "UX: покрытие договорами", steps: steps, replyHint: "coverage" };
    }

    // Владельцы / площадки (breakdown)
    if (/владельц.*заказ|площадк|кто владеет|по площадк/.test(q)) {
      push("go_tab", { id: "overview", label: "Обзор квартала" }, "Breakdown справа");
      push("focus_main", {}, "Списки причин/владельцев/площадок");
      push("highlight_ui", { target: "main" }, "Правая колонка обзора");
      push("advise", { topic: "breakdown" }, "Клик → глобальный фильтр");
      return { id: uid(), planner: "llm-sim", summary: "UX: владельцы и площадки", steps: steps, replyHint: "breakdown" };
    }

    // Канбан / смена статуса действий
    if (/канбан|доск.*действ|перевести в работу|закрыть действ|статус.*act/.test(q)) {
      push("go_tab", { id: "actions", label: "Действия" }, "Канбан / таблица");
      push("focus_main", {}, "Доска статусов");
      push("highlight_ui", { target: "table" }, "Колонки Назначено → В работе → Закрыто");
      push("advise", { topic: "kanban" }, "Как двигать статусы");
      return { id: uid(), planner: "llm-sim", summary: "UX: канбан действий", steps: steps, replyHint: "kanban" };
    }

    // Подготовка к совещанию
    if (/подготов|совещани|agenda|повестк|к встрече|до встречи/.test(q)) {
      push("get_snapshot", {}, "KPI и дедлайн совещания");
      push("go_tab", { id: "overview", label: "Обзор квартала" }, "Картина квартала");
      push("focus_main", {}, "Показать экран обзора");
      push("highlight_ui", { target: "stats" }, "Подсветить KPI");
      push("highlight_ui", { target: "alert" }, "Критический кейс");
      push("advise", { topic: "meeting" }, "Собрать повестку");
      return { id: uid(), planner: "llm-sim", summary: "UX: подготовка к совещанию", steps: steps, replyHint: "meeting" };
    }

    // Что в первую очередь
    if (/первую очередь|приоритет|с чего начать|что делать|что важн|рекоменд/.test(q)) {
      push("get_snapshot", {}, "Оценить разрывы покрытия и цен");
      push("go_tab", { id: "overview", label: "Обзор квартала" }, "Точка входа");
      push("focus_main", {}, "Показать обзор");
      push("highlight_ui", { target: "stats" }, "KPI как ориентир");
      push("highlight_ui", { target: "alert" }, "Главный кейс на экране");
      push("advise", { topic: "priorities" }, "Ранжировать гипотезы");
      return { id: uid(), planner: "llm-sim", summary: "UX: приоритеты на сегодня", steps: steps, replyHint: "priorities" };
    }

    // Прогноз покрытия / эффект действий
    if (/прогноз|покроем|эффект|pipeline|пайплайн|если закроем/.test(q)) {
      push("get_snapshot", {}, "Покрытие now → forecast");
      push("go_tab", { id: "actions", label: "Действия" }, "Пайплайн мер");
      push("focus_main", {}, "Показать список действий");
      push("highlight_ui", { target: "table" }, "Пайплайн на экране");
      push("advise", { topic: "forecast" }, "Связать действия с покрытием");
      return { id: uid(), planner: "llm-sim", summary: "UX: прогноз покрытия", steps: steps, replyHint: "forecast" };
    }

    // Вне контракта
    if (/вне контракт|off.?contract|без контракт|не покрыт|дыры в покрыт/.test(q)) {
      push("get_snapshot", {}, "Цифры вне контракта");
      push("go_tab", { id: "suppliers", label: "Поставщики" }, "Список");
      push("filter_off_contract", {}, "Сузить срез");
      push("focus_main", {}, "Показать таблицу");
      push("highlight_ui", { target: "filter" }, "Активный фильтр");
      push("highlight_ui", { target: "table" }, "Срез вне контракта");
      push("open_first_row", {}, "Открыть первого в списке");
      push("advise", { topic: "off_next" }, "Что сделать дальше");
      return { id: uid(), planner: "llm-sim", summary: "UX: поставщики вне контракта", steps: steps, replyHint: "off" };
    }

    // Причины / почему вне
    if (/почему вне|причин|нет контракт|истёк|аварийн|вне каталог|единственн поставщик|превышен/.test(q)) {
      push("get_snapshot", {}, "Типовые причины отклонения");
      push("go_tab", { id: "suppliers", label: "Поставщики" }, "Срез с причинами");
      push("filter_off_contract", {}, "Фокус на отклонениях");
      push("focus_main", {}, "Показать срез");
      push("highlight_ui", { target: "table" }, "Строки с причинами");
      push("open_first_row", {}, "Карточка с причиной");
      push("advise", { topic: "reasons" }, "Разбор причин");
      return { id: uid(), planner: "llm-sim", summary: "UX: причины вне контракта", steps: steps, replyHint: "reasons" };
    }

    // Переплаты / бенчмарки
    if (/переплат|бенчмарк|рынок|тариф|дорог|выше рынка|цена/.test(q)) {
      push("get_snapshot", {}, "Дельты к рынку");
      push("go_tab", { id: "benchmarks", label: "Бенчмарки" }, "Где переплачиваем");
      push("focus_main", {}, "Экран бенчмарков");
      push("highlight_ui", { target: "benchmarks" }, "Таблица дельт");
      push("open_first_row", {}, "Открыть позицию с дельтой");
      push("advise", { topic: "overpay" }, "Куда бить переговорами");
      return { id: uid(), planner: "llm-sim", summary: "UX: переплаты vs рынок", steps: steps, replyHint: "overpay" };
    }

    // Риски
    if (/риск|опасн|критичн поставщик|высокий риск/.test(q)) {
      push("get_snapshot", {}, "Риск-профиль");
      push("go_tab", { id: "suppliers", label: "Поставщики" }, "Карточки риска");
      push("focus_main", {}, "Список поставщиков");
      push("highlight_ui", { target: "table" }, "Колонка риска");
      push("open_first_row", {}, "Карточка поставщика");
      push("advise", { topic: "risks" }, "Гипотезы по рискам");
      return { id: uid(), planner: "llm-sim", summary: "UX: риски поставщиков", steps: steps, replyHint: "risks" };
    }

    // Открытые действия / статус исполнения
    if (/открыт.*действ|статус действ|мои действ|что в работе|act-/.test(q) || /^открытые действия$/.test(q.trim())) {
      push("get_snapshot", {}, "Пайплайн действий");
      push("go_tab", { id: "actions", label: "Действия" }, "Контроль исполнения");
      push("focus_main", {}, "Показать действия");
      push("highlight_ui", { target: "table" }, "Статусы на экране");
      push("advise", { topic: "actions_status" }, "Что дожать до совещания");
      return { id: uid(), planner: "llm-sim", summary: "UX: открытые действия", steps: steps, replyHint: "actions_status" };
    }

    // Назначить действие
    if (/назнач|создай.*действ|новое действ|заведи действ|^назначь действие$/.test(q)) {
      push("get_snapshot", {}, "Контекст до совещания");
      push("go_tab", { id: "actions", label: "Действия" }, "Раздел исполнения");
      push("focus_main", {}, "Контекст раздела");
      push("open_action", {}, "Форма назначения");
      push("advise", { topic: "action_types" }, "Подсказать тип действия");
      return { id: uid(), planner: "llm-sim", summary: "UX: назначить действие", steps: steps, replyHint: "action" };
    }

    // Блокировка / переговоры как intent → action form
    if (/блокир|отключ.*поставщик|переговор|пересмотр условий|подключ.*контракт|запрос обоснован/.test(q)) {
      push("go_tab", { id: "actions", label: "Действия" }, "Исполнение меры");
      push("focus_main", {}, "Раздел действий");
      push("open_action", {}, "Оформить действие");
      push("advise", { topic: "action_types" }, "Сопоставить тип меры");
      return { id: uid(), planner: "llm-sim", summary: "UX: оформить меру", steps: steps, replyHint: "action" };
    }

    // Аудит / контроль
    if (/аудит|протокол|журнал|кто согласов|история изменени|прозрачн/.test(q)) {
      push("go_tab", { id: "audit", label: "Аудит" }, "Неизменяемый протокол");
      push("focus_main", {}, "Журнал на экране");
      push("highlight_ui", { target: "table" }, "Строки аудита");
      push("advise", { topic: "audit" }, "Что смотреть в журнале");
      return { id: uid(), planner: "llm-sim", summary: "UX: аудит", steps: steps, replyHint: "audit" };
    }

    // Сводка / KPI
    if (/сводк|обзор|квартал|spend|покрыт|kpi|итог|дашборд/.test(q)) {
      push("get_snapshot", {}, "Актуальные KPI");
      push("go_tab", { id: "overview", label: "Обзор квартала" }, "Экран сводки");
      push("focus_main", {}, "Показать обзор");
      push("highlight_ui", { target: "stats" }, "Подсветить KPI");
      push("highlight_ui", { target: "map" }, "Карта spend");
      push("advise", { topic: "summary_next" }, "Следующий UX-шаг");
      return { id: uid(), planner: "llm-sim", summary: "UX: сводка квартала", steps: steps, replyHint: "summary" };
    }

    // Тренд / динамика
    if (/тренд|динамик|к прошл|qoq|как росло|история покрыт/.test(q)) {
      push("get_snapshot", {}, "Тренд покрытия");
      push("go_tab", { id: "overview", label: "Обзор квартала" }, "График кварталов");
      push("focus_main", {}, "Обзор на экране");
      push("highlight_ui", { target: "stats" }, "Динамика покрытия");
      push("advise", { topic: "trend" }, "Интерпретация динамики");
      return { id: uid(), planner: "llm-sim", summary: "UX: тренд покрытия", steps: steps, replyHint: "trend" };
    }

    // Герой / кейс квартала
    if (/герой|кейc|кейс|пример заказ|разбер.*заказ|критическ|hero|промарматур/.test(q)) {
      push("go_tab", { id: "overview", label: "Обзор квартала" }, "Hero-кейс на обзоре");
      push("focus_main", {}, "Показать обзор");
      push("highlight_ui", { target: "alert" }, "Критическая карточка");
      push("open_hero", {}, "Открыть кейс в интерфейсе");
      push("advise", { topic: "hero" }, "Как разобрать показательный заказ");
      return { id: uid(), planner: "llm-sim", summary: "UX: разбор кейса", steps: steps, replyHint: "hero" };
    }

    // Как пользоваться порталом
    if (/как пользов|как работ|обучение|онбординг|с чего начать в портал/.test(q)) {
      push("go_tab", { id: "overview", label: "Обзор квартала" }, "Стартовый экран");
      push("focus_main", {}, "Показать старт");
      push("highlight_ui", { target: "stats" }, "KPI");
      push("highlight_ui", { target: "map" }, "Treemap");
      push("advise", { topic: "howto" }, "Короткий UX-маршрут");
      return { id: uid(), planner: "llm-sim", summary: "UX: как работать в портале", steps: steps, replyHint: "howto" };
    }

    // Сброс
    if (/сброс|очист.*фильтр|сначала|заново/.test(q)) {
      push("clear_filters", {}, "Вернуть полный срез");
      push("go_tab", { id: "overview", label: "Обзор квартала" }, "К обзору");
      push("focus_main", {}, "Полный квартал на экране");
      push("highlight_ui", { target: "stats" }, "Сводка без фильтров");
      return { id: uid(), planner: "llm-sim", summary: "UX: сброс фильтров", steps: steps, replyHint: "clear" };
    }

    // Поиск
    if (/найди|найти|поставщик|инн|po-|заказ\s|владельц|площадк/.test(q)) {
      var term = String(raw)
        .replace(/^(найди|найти|открой|покажи|поставщик|заказ)\s+/i, "")
        .trim();
      push("go_tab", { id: "suppliers", label: "Поставщики" }, "Контекст поиска");
      push("search", { query: term || raw }, "Глобальный поиск портала");
      push("focus_main", {}, "Результат на экране");
      push("highlight_ui", { target: "table" }, "Найденные строки");
      push("advise", { topic: "search_next" }, "Что сделать после нахождения");
      return {
        id: uid(),
        planner: "llm-sim",
        summary: "UX: поиск «" + (term || raw) + "»",
        steps: steps,
        replyHint: "search",
        searchTerm: term || raw,
      };
    }

    // Явная навигация
    for (var i = 0; i < NAV.length; i++) {
      var n = NAV[i];
      var hit = n.keys.some(function (k) {
        return q.indexOf(k) !== -1;
      });
      if (hit && (/открой|перейди|покажи|раздел|вкладк/.test(q) || n.id === "benchmarks" || n.id === "audit")) {
        if (n.id === "actions" && /назнач/.test(q)) continue;
        if (n.id === "suppliers" && /вне контракт/.test(q)) continue;
        push("go_tab", { id: n.id, label: n.label }, "Навигация по запросу");
        push("focus_main", {}, "Показать раздел");
        push("highlight_ui", { target: n.id === "overview" ? "stats" : "table" }, "Подсветка контента");
        return {
          id: uid(),
          planner: "llm-sim",
          summary: "UX: открыть «" + n.label + "»",
          steps: steps,
          replyHint: "nav:" + n.id,
        };
      }
    }

    if (/действ/.test(q) && !/назнач/.test(q)) {
      push("go_tab", { id: "actions", label: "Действия" }, "Раздел действий");
      push("focus_main", {}, "Показать действия");
      push("highlight_ui", { target: "table" }, "Список мер");
      return { id: uid(), planner: "llm-sim", summary: "UX: раздел действий", steps: steps, replyHint: "nav:actions" };
    }

    push("get_snapshot", {}, "Контекст портала");
    push("go_tab", { id: "overview", label: "Обзор квартала" }, "Ориентир на обзоре");
    push("focus_main", {}, "Показать портал");
    push("highlight_ui", { target: "stats" }, "KPI как точка старта");
    push("advise", { topic: "clarify" }, "Предложить сценарии");
    return { id: uid(), planner: "llm-sim", summary: "Уточнение сценария", steps: steps, replyHint: "default" };
  }

  function buildReply(plan, lastSnap) {
    var snap = lastSnap || toolSnapshot().data || {};
    var hint = plan.replyHint || "";
    var P = PLAYBOOK;
    if (plan.reply) return plan.reply;

    if (hint === "help") {
      return (
        "**Playbook UX — чем помогаю**\n\n" +
        P.scenarios
          .map(function (s, i) {
            return (
              i +
              1 +
              ". **" +
              s.want +
              "** → " +
              s.ui +
              (s.depth ? " · глубина: " + s.depth : "")
            );
          })
          .join("\n") +
        "\n\nКарта расходов: **категория → поставщик → PO → строки**.\n" +
        "Совещание **" +
        P.meeting +
        "**. Скажите задачу или чип. Голос — микрофон.\n\n*Planner: llm-sim · playbook*"
      );
    }
    if (hint === "map") {
      return (
        "**Карта расходов за квартал**\n\n" +
        "На экране: **Обзор** · treemap подсвечен.\n\n" +
        "Глубина клика:\n" +
        P.mapDepth.map(function (d, i) {
          return i + 1 + ". " + d;
        }).join("\n") +
        "\n\nРежимы: **Категории / Поставщики / Иерархия** · сумма **Все** или **Вне контракта**.\n" +
        "Подкатегории на карте нет — номенклатура только в карточке PO.\n\n" +
        "Дальше: кликните кубик или скажите «разбери критический кейс» / «кто вне контракта».\n\n*LLM-sim · map depth*"
      );
    }
    if (hint === "coverage") {
      return (
        "**Покрытие договорами**\n\n" +
        "Факт **~" +
        (snap.coverage || P.coverage) +
        "%** → прогноз **~" +
        (snap.coverageForecast || P.coverageForecast) +
        "%** · цель холдинга **" +
        P.targetCoverage +
        "%**.\n\n" +
        "На экране: **Обзор** — KPI и панель «контролируемые расходы».\n" +
        "Рычаги роста: вне контракта + закрытие действий до **" +
        P.meeting +
        "**.\n\n*LLM-sim · coverage*"
      );
    }
    if (hint === "breakdown") {
      return (
        "**Владельцы, площадки, причины**\n\n" +
        "На экране справа на **Обзоре** три списка:\n" +
        "• причины отклонений · владельцы заказов · площадки холдинга\n\n" +
        "Клик по строке → глобальный фильтр → карта и таблицы сузятся.\n" +
        "Типовые причины: " +
        P.topReasons.join(", ") +
        ".\n\n*LLM-sim · breakdown*"
      );
    }
    if (hint === "kanban") {
      return (
        "**Канбан действий**\n\n" +
        "На экране: **Действия**.\n" +
        "Статусы: **Назначено** → «В работу» → **В работе** → «Закрыть» → **Закрыто**.\n" +
        "Каждый переход пишется в **Аудит**. Клик по поставщику открывает карточку.\n\n" +
        "Сейчас в пайплайне ~" +
        (snap.actionsOpen || P.openActions) +
        ", в работе ~" +
        P.actionsInWork +
        ".\n\n*LLM-sim · kanban*"
      );
    }
    if (hint === "meeting") {
      return (
        "**Подготовка к совещанию " + P.meeting + "**\n\n" +
        "Повестка (гипотеза):\n" +
        P.agenda.map(function (a, i) { return i + 1 + ". " + a; }).join("\n") +
        "\n\nНа экране: **Обзор квартала** — KPI и критический кейс подсвечены. Покрытие **" +
        P.coverage + "% → " + P.coverageForecast + "%**.\n\n" +
        "Дальше скажите: «кто вне контракта» или «назначь действие».\n\n*LLM-sim · meeting pack*"
      );
    }
    if (hint === "priorities") {
      return (
        "**Что сделать в первую очередь**\n\n" +
        P.priorities.map(function (p, i) {
          return i + 1 + ". **" + p.title + "** — " + p.why;
        }).join("\n") +
        "\n\nНа экране открыт **Обзор** с KPI и hero-кейсом. Начните с пункта 1 — «кто вне контракта?».\n\n*LLM-sim · triage*"
      );
    }
    if (hint === "forecast") {
      return (
        "**Прогноз покрытия**\n\n" +
        "Сейчас **~" + (snap.coverage || P.coverage) + "%**, после исполнения пайплайна действий — **~" +
        (snap.coverageForecast || P.coverageForecast) + "%**.\n\n" +
        "На экране: раздел **Действия** (в работе **" + P.actionsInWork + "**, открыто **" +
        (snap.actionsOpen || P.openActions) + "**).\n\n" +
        "Чтобы ускорить рост покрытия — закройте внеконтрактный топ или назначьте новое действие.\n\n*LLM-sim · forecast*"
      );
    }
    if (hint === "off") {
      return (
        "**Поставщики вне контракта**\n\n" +
        "• **~" + (snap.offSuppliers || P.offSuppliers) + "** поставщиков · доля **~" + P.offShare + "** spend\n" +
        "• Типовые причины: " + P.topReasons.slice(0, 3).join(", ") + "\n\n" +
        "На экране: **Поставщики** + фильтр «вне контракта» + открыта первая карточка.\n" +
        "Дальше: **назначьте действие** → проверьте **аудит**.\n\n" +
        "До совещания **" + P.meeting + "** это главный рычаг покрытия.\n\n*LLM-sim · filter_off_contract*"
      );
    }
    if (hint === "reasons") {
      return (
        "**Почему возникают отклонения**\n\n" +
        P.topReasons.map(function (r, i) { return i + 1 + ". **" + r + "**"; }).join("\n") +
        "\n\nНа экране: срез вне контракта и карточка — причина видна в интерфейсе.\n" +
        "Для «Нет контракта / истёк» → **Подключение к контракту**.\n" +
        "Для «Аварийная / вне каталога» → **Запрос обоснования**.\n\n*LLM-sim · reasons*"
      );
    }
    if (hint === "overpay") {
      return (
        "**Где переплачиваем**\n\n" +
        "• Позиций выше рынка: **~" + P.overBenchmark + "**\n" +
        "• Средняя дельта: **" + P.avgDelta + "** · макс. **" + P.maxDelta + "**\n\n" +
        "На экране: **Бенчмарки** и открыта позиция с дельтой. Гипотеза: **Пересмотр условий** до **" +
        P.meeting + "**.\n\nСкажите «назначь действие», оформлю меру.\n\n*LLM-sim · benchmarks*"
      );
    }
    if (hint === "risks") {
      return (
        "**Риски поставщиков (гипотеза)**\n\n" +
        "• Высокий риск + вне контракта → кандидат на **блокировку** или жёсткий пересмотр\n" +
        "• Единственный поставщик → диверсификация / рамочный контракт\n" +
        "• Аварийные закупки → контроль обоснований в аудите\n\n" +
        "На экране: **Поставщики** и открыта карточка — смотрите риск и назначьте действие.\n\n*LLM-sim · risks*"
      );
    }
    if (hint === "actions_status") {
      return (
        "**Открытые действия**\n\n" +
        "• В пайплайне: **~" + (snap.actionsOpen || P.openActions) + "**\n" +
        "• В работе: **~" + P.actionsInWork + "** (пример: ACT-2041 подключение к контракту)\n" +
        "• Назначено: ACT-2042 пересмотр условий\n\n" +
        "На экране: раздел **Действия** со статусами. До **" + P.meeting + "** дожмите или заведите новое.\n\n*LLM-sim · actions*"
      );
    }
    if (hint === "action") {
      return (
        "**Назначение действия**\n\n" +
        "На экране открыта **форма действия**. Типы мер:\n" +
        "• Пересмотр условий · Подключение к контракту\n" +
        "• Блокировка поставщика · Запрос обоснования\n\n" +
        "Подтвердите в модалке — попадёт в **Действия** и **Аудит**, учтётся в прогнозе покрытия.\n\n*LLM-sim · open_action*"
      );
    }
    if (hint === "audit") {
      return (
        "**Аудит**\n\n" +
        "Журнал фиксирует загрузку ERP, сверку договоров, назначения действий и комментарии к заказам.\n\n" +
        "На экране: **Аудит** с подсвеченным журналом — контроль перед совещанием **" +
        P.meeting + "**.\n\n*LLM-sim · audit*"
      );
    }
    if (hint === "summary") {
      return (
        "**Сводка Q3 2025**\n\n" +
        "• **" + (snap.spendLabel || ("Q3 2025 · " + P.spend)) + "**\n" +
        "• Покрытие: **~" + (snap.coverage || P.coverage) + "%** → **~" +
        (snap.coverageForecast || P.coverageForecast) + "%**\n" +
        "• Вне контракта: **~" + (snap.offSuppliers || P.offSuppliers) + "** (" + P.offShare + ")\n" +
        "• Бенчмарки: **" + (snap.benchmarks || (P.avgDelta + " / " + P.overBenchmark + " поз.")) + "**\n" +
        "• Совещание: **" + P.meeting + "**\n\n" +
        "На экране: **Обзор** — KPI и карта spend подсвечены. Дальше: «подготовь к совещанию» или «кто вне контракта».\n\n*LLM-sim · overview*"
      );
    }
    if (hint === "trend") {
      return (
        "**Динамика покрытия**\n\n" +
        "Q4’24 **81%** → Q1’25 **84%** → Q2’25 **86%** → Q3’25 **~" + P.coverage + "%**.\n\n" +
        "Тренд положительный; разрыв до цели закрывается действиями по внеконтрактным и переплатам.\n\n" +
        "На экране: **Обзор** с подсвеченными KPI.\n\n*LLM-sim · trend*"
      );
    }
    if (hint === "hero") {
      return (
        "**Разбор показательного кейса**\n\n" +
        "На экране: критический кейс **" +
        P.heroSupplier +
        "** / **" +
        P.heroPO +
        "** (карточка открыта).\n\n" +
        "Внутри PO: строки vs рынок, согласования → **назначьте действие** или скажите «назначь действие».\n" +
        "Это уровень 3 карты + номенклатура.\n\n*LLM-sim · hero*"
      );
    }
    if (hint === "howto") {
      return (
        "**Как работать в портале**\n\n" +
        "1. **Обзор** — KPI + карта расходов ← сейчас на экране\n" +
        "2. Карта: категория → поставщик → PO → строки в карточке\n" +
        "3. **Поставщики** — вне контракта\n" +
        "4. **Бенчмарки** — где дороже рынка\n" +
        "5. **Действия** — канбан до совещания " +
        P.meeting +
        "\n" +
        "6. **Аудит** — след решений\n\n" +
        "Скажите «что умеешь» — полный playbook, или чип «Покажи карту расходов».\n\n*LLM-sim · onboarding*"
      );
    }
    if (hint === "clear") {
      return "**Фильтры сброшены.** На экране снова полный **Обзор квартала**. Можно начать новый разбор.";
    }
    if (hint === "search") {
      return (
        "**Поиск: «" + (plan.searchTerm || "") + "»**\n\n" +
        "На экране: результат поиска (поставщик / ИНН / PO) и таблица.\n" +
        "В карточке можно назначить действие или проверить аудит.\n\n*LLM-sim · search*"
      );
    }
    if (hint.indexOf("nav:") === 0) {
      var id = hint.slice(4);
      var nav = NAV.find(function (n) { return n.id === id; });
      return (
        "На экране открыл **«" + ((nav && nav.label) || id) + "»** и подсветил контент.\n\n" +
        "Могу выполнить следующий шаг (фильтр, действие, аудит).\n\n*LLM-sim · go_tab*"
      );
    }
    return (
      "**Чем заняться дальше?**\n\n" +
      "Запрос «" + (state.session.brief || "") + "» пока общий. На экране — **Обзор** с KPI.\n" +
      "Варианты:\n" +
      "• подготовь к совещанию · кто вне контракта · где переплачиваем\n" +
      "• что сделать в первую очередь · открытые действия · назначь действие\n\n" +
      "Сейчас: " + (snap.spendLabel || P.spend) + ", покрытие ~" + (snap.coverage || P.coverage) + "%.\n\n*LLM-sim*"
    );
  }

  /* ─── UI ─── */
  function formatHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  function ensurePanel() {
    var existing = $("#proc-ai-panel");
    if (existing) return existing;

    var panel = document.createElement("div");
    panel.id = "proc-ai-panel";
    panel.className = "proc-ai-panel";
    panel.innerHTML =
      '<div class="proc-ai-head" data-drag>' +
      '  <div class="proc-ai-badge" data-min title="Свернуть">AI</div>' +
      '  <div class="proc-ai-titles" data-min>' +
      "    <strong>AI-ассистент</strong>" +
      '    <span data-status>Онлайн · LLM-sim · Закупки</span>' +
      "  </div>" +
      '  <button type="button" class="proc-ai-icon-btn" data-clear title="Сбросить" aria-label="Сбросить">' +
      sbIcon("refresh", 16) +
      "</button>" +
      '  <button type="button" class="proc-ai-icon-btn" data-min title="Свернуть" aria-label="Свернуть">' +
      sbIcon("chevron-down", 16) +
      "</button>" +
      "</div>" +
      '<div class="proc-ai-body" data-chat></div>' +
      '<div class="proc-ai-chips" data-chips></div>' +
      '<div class="proc-ai-composer">' +
      '  <button type="button" class="proc-ai-mic" data-mic title="Голосовой ввод" aria-label="Голосовой ввод" aria-pressed="false">' +
      sbIcon("mic", 16) +
      "</button>" +
      '  <input type="text" data-input placeholder="Например: кто вне контракта? открой бенчмарки…" />' +
      '  <button type="button" class="proc-ai-send" data-send aria-label="Отправить">' +
      sbIcon("arrow-right", 16) +
      "</button>" +
      "</div>";
    document.body.appendChild(panel);

    var chips = panel.querySelector("[data-chips]");
    QUICK.forEach(function (q) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "proc-ai-chip";
      b.textContent = q;
      b.addEventListener("click", function () {
        if (state.loading) return;
        runTurn(q);
      });
      chips.appendChild(b);
    });

    var dragging = false;
    var start = { x: 0, y: 0 };
    var head = panel.querySelector("[data-drag]");
    head.addEventListener("mousedown", function (e) {
      if (e.target.closest("button")) return;
      dragging = true;
      start.x = e.clientX - state.pos.x;
      start.y = e.clientY - state.pos.y;
      e.preventDefault();
    });
    document.addEventListener("mousemove", function (e) {
      if (!dragging) return;
      state.pos.x = e.clientX - start.x;
      state.pos.y = e.clientY - start.y;
      panel.style.transform = "translate(" + state.pos.x + "px," + state.pos.y + "px)";
    });
    document.addEventListener("mouseup", function () {
      dragging = false;
    });

    panel.querySelectorAll("[data-min]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        if (e.target.closest("[data-clear]")) return;
        state.minimized = !state.minimized;
        panel.classList.toggle("is-min", state.minimized);
        var minBtn = panel.querySelector(".proc-ai-icon-btn[data-min]");
        if (minBtn) {
          minBtn.innerHTML = sbIcon(state.minimized ? "chevron-up" : "chevron-down", 16);
          minBtn.title = state.minimized ? "Развернуть" : "Свернуть";
        }
      });
    });

    panel.querySelector("[data-clear]").addEventListener("click", function () {
      state.messages = [];
      state.session = { brief: "", turns: 0, lastPlanId: null };
      pushMsg("assistant", "**Сессия очищена.** Я снова UX-агент закупок (LLM-sim): план → tools → экран.");
      renderChat();
    });

    var input = panel.querySelector("[data-input]");
    var sendBtn = panel.querySelector("[data-send]");
    var micBtn = panel.querySelector("[data-mic]");
    function trySend() {
      var v = (input.value || "").trim();
      if (!v || state.loading || state.voiceListening) return;
      input.value = "";
      runTurn(v);
    }
    sendBtn.addEventListener("click", trySend);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        trySend();
      }
    });
    micBtn.addEventListener("click", function (e) {
      e.preventDefault();
      toggleVoice();
    });

    return panel;
  }

  function pushMsg(role, text, meta) {
    state.messages.push({ role: role, text: text, meta: meta || null });
  }

  function renderChat() {
    var panel = ensurePanel();
    var chat = panel.querySelector("[data-chat]");
    chat.innerHTML = "";
    state.messages.forEach(function (msg) {
      if (msg.role === "plan") {
        chat.appendChild(msg.el);
        return;
      }
      var row = document.createElement("div");
      row.className = "proc-ai-msg is-" + msg.role;
      if (msg.role === "assistant") {
        row.innerHTML =
          '<div class="proc-ai-avatar">AI</div><div class="proc-ai-bubble">' +
          formatHtml(msg.text) +
          (msg.meta && msg.meta.tools
            ? '<div class="proc-ai-tools">Сделано · ' + msg.meta.tools.length + " tool" + (msg.meta.tools.length === 1 ? "" : "s") + "</div>"
            : "") +
          "</div>";
      } else if (msg.role === "user") {
        row.innerHTML =
          '<div class="proc-ai-bubble">' +
          formatHtml(msg.text) +
          '</div><div class="proc-ai-avatar">Я</div>';
      } else {
        row.innerHTML = '<div class="proc-ai-bubble">' + formatHtml(msg.text) + "</div>";
      }
      chat.appendChild(row);
    });
    if (state.loading && !chat.querySelector(".proc-ai-thinking")) {
      var think = document.createElement("div");
      think.className = "proc-ai-thinking";
      think.innerHTML =
        '<span class="proc-ai-spinner"></span><span data-think>' + THINK[state.thinkIdx % THINK.length] + "</span>";
      chat.appendChild(think);
    } else if (state.loading) {
      var el = chat.querySelector("[data-think]");
      if (el) el.textContent = THINK[state.thinkIdx % THINK.length];
    }
    chat.scrollTop = chat.scrollHeight;
    var status = panel.querySelector("[data-status]");
    if (status) status.textContent = state.loading ? "Планирую… · LLM-sim" : "Онлайн · LLM-sim · Закупки";
    $all(".proc-ai-chip", panel).forEach(function (c) {
      c.disabled = state.loading || state.voiceListening;
    });
    panel.querySelector("[data-send]").disabled = state.loading || state.voiceListening;
    var mic = panel.querySelector("[data-mic]");
    if (mic) mic.disabled = state.loading;
    syncVoiceUi();
  }

  function pushPlanCard(plan) {
    var wrap = document.createElement("div");
    wrap.className = "proc-ai-msg is-assistant";
    var card = document.createElement("div");
    card.className = "proc-ai-plan";
    card.innerHTML =
      '<div class="proc-ai-plan-head">' +
      '<span class="proc-ai-plan-badge">План · LLM-sim</span>' +
      "<strong>" +
      formatHtml(plan.summary || "Сценарий") +
      "</strong></div>" +
      '<ol class="proc-ai-plan-list"></ol>';
    var list = card.querySelector("ol");
    (plan.steps || []).forEach(function (s) {
      var li = document.createElement("li");
      li.className = "is-pending";
      li.innerHTML =
        '<span class="proc-ai-plan-tool">' +
        (TOOL_LABELS[s.tool] || s.tool) +
        '</span> <span class="proc-ai-plan-why">' +
        formatHtml(s.why || "") +
        "</span>";
      list.appendChild(li);
    });
    wrap.innerHTML = '<div class="proc-ai-avatar">AI</div>';
    wrap.appendChild(card);
    state.messages.push({ role: "plan", el: wrap, card: card });
    renderChat();
    return card;
  }

  function markPlanStep(card, index, observe) {
    if (!card) return;
    var items = card.querySelectorAll("li");
    var li = items[index];
    if (!li) return;
    li.classList.remove("is-pending");
    li.classList.add("is-done");
    if (observe) {
      var why = li.querySelector(".proc-ai-plan-why");
      if (why) why.textContent = (why.textContent ? why.textContent + " · " : "") + observe;
    }
  }

  function finishPlanCard(card) {
    if (!card) return;
    card.classList.add("is-done");
    var strong = card.querySelector(".proc-ai-plan-head strong");
    if (strong && strong.textContent.indexOf("готово") === -1) {
      strong.textContent = strong.textContent + " · готово";
    }
  }

  /* ─── turn: plan → execute tools → reply ─── */
  function runTurn(text) {
    if (state.loading) return;
    pushMsg("user", text);
    state.loading = true;
    state.thinkIdx = 0;
    state.session.turns += 1;
    renderChat();

    var thinkTimer = setInterval(function () {
      state.thinkIdx += 1;
      renderChat();
    }, 700);

    // Simulate LLM latency for planning
    setTimeout(function () {
      clearInterval(thinkTimer);
      var plan = RulePlanner(text);
      state.session.lastPlanId = plan.id;
      state.loading = false;
      renderChat();

      var card = pushPlanCard(plan);
      state.loading = true;
      renderChat();

      var i = 0;
      var lastSnap = null;
      var toolNames = [];

      function next() {
        if (i >= (plan.steps || []).length) {
          finishPlanCard(card);
          var reply = buildReply(plan, lastSnap);
          pushMsg("assistant", reply, { tools: toolNames, planner: plan.planner });
          state.loading = false;
          renderChat();
          return;
        }
        var step = plan.steps[i];
        var out = executeTool(step);
        toolNames.push(step.tool);
        if (step.tool === "get_snapshot" && out.data) lastSnap = out.data;
        markPlanStep(card, i, out.observe);
        i += 1;
        renderChat();
        // Дать React перерисовать раздел до подсветки / открытия карточки
        var uiTools = {
          go_tab: 1,
          filter_off_contract: 1,
          clear_filters: 1,
          search: 1,
          open_action: 1,
          open_hero: 1,
          open_first_row: 1,
          highlight_ui: 1,
          focus_main: 1,
        };
        var wait = uiTools[step.tool] ? 420 + Math.random() * 180 : 220 + Math.random() * 160;
        setTimeout(next, wait);
      }

      setTimeout(next, 200);
    }, 520 + Math.random() * 480);
  }

  function boot() {
    ensurePanel();
    pushMsg(
      "assistant",
      "**Привет!** Я UX-агент портала **«Управление закупками»**.\n\n" +
        "Помогаю с типовыми задачами дирекции: сводка, подготовка к совещанию, вне контракта, переплаты, приоритеты, действия, риски, аудит, поиск PO.\n\n" +
        "Схема: **план → tools → экран портала → ответ** (LLM-sim).\n" +
        "Playbook: карта расходов, вне контракта, бенчмарки, действия, аудит.\n\n" +
        "Чипы ниже или «что умеешь»."
    );
    renderChat();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 700);
    });
  } else {
    setTimeout(boot, 700);
  }
})();
