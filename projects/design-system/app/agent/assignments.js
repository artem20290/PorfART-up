/* Assignments portal — mock data + HTML builders + iframe runtime (B+C) */
(function (global) {
  const STATUSES = [
    { id: "work", label: "В работе", tag: "tag-warning" },
    { id: "late", label: "Просрочено", tag: "tag-danger" },
    { id: "done", label: "Завершено", tag: "tag-success" },
    { id: "cancel", label: "Отменено", tag: "tag-neutral" },
  ];

  const TASKS = [
    {
      id: "P-1042",
      title: "Согласовать CAPEX Q2",
      assignee: "Иванов А.С.",
      enterprise: "СИБУР Тобольск",
      status: "В работе",
      priority: "Высокий",
      due: "2026-10-28",
      daysOverdue: 0,
    },
    {
      id: "P-1038",
      title: "Отчёт по простою линии",
      assignee: "Петрова М.И.",
      enterprise: "ЗСК",
      status: "В работе",
      priority: "Средний",
      due: "2026-11-02",
      daysOverdue: 0,
    },
    {
      id: "P-1035",
      title: "Обновить регламент ОТиПБ",
      assignee: "Козлов Д.В.",
      enterprise: "УК Холдинг",
      status: "В работе",
      priority: "Средний",
      due: "2026-11-05",
      daysOverdue: 0,
    },
    {
      id: "P-1021",
      title: "Закрыть акт расследования",
      assignee: "Сидоров Е.Н.",
      enterprise: "НХЗ",
      status: "Просрочено",
      priority: "Высокий",
      due: "2026-10-14",
      daysOverdue: 4,
    },
    {
      id: "P-1019",
      title: "Согласовать подрядчика",
      assignee: "Орлова К.А.",
      enterprise: "ЗСК",
      status: "Просрочено",
      priority: "Высокий",
      due: "2026-10-16",
      daysOverdue: 2,
    },
    {
      id: "P-1011",
      title: "Выгрузить пакет аудита закупок",
      assignee: "Соколова Е.В.",
      enterprise: "УК Холдинг",
      status: "Просрочено",
      priority: "Средний",
      due: "2026-10-12",
      daysOverdue: 6,
    },
    {
      id: "P-1008",
      title: "План останова цеха",
      assignee: "Иванов А.С.",
      enterprise: "СИБУР Тобольск",
      status: "Завершено",
      priority: "Высокий",
      due: "2026-10-01",
      daysOverdue: 0,
    },
    {
      id: "P-1002",
      title: "Инвентаризация ТМЦ",
      assignee: "Петрова М.И.",
      enterprise: "ЗСК",
      status: "Завершено",
      priority: "Низкий",
      due: "2026-09-28",
      daysOverdue: 0,
    },
    {
      id: "P-0991",
      title: "Пилот мобильного обхода",
      assignee: "—",
      enterprise: "УК Холдинг",
      status: "Отменено",
      priority: "Низкий",
      due: "2026-09-15",
      daysOverdue: 0,
    },
  ];

  function ic(name, size) {
    return typeof icon === "function" ? icon(name, size || 14) : "";
  }
  function logo() {
    return typeof brandLogo === "function" ? brandLogo(90, 22) : "SB";
  }
  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }
  function statusMeta(label) {
    return STATUSES.find((s) => s.label === label) || STATUSES[0];
  }
  function priShort(p) {
    if (p === "Высокий") return "выс.";
    if (p === "Средний") return "ср.";
    return "низ.";
  }
  function dueLabel(t) {
    if (t.status === "Просрочено" && t.daysOverdue) return "−" + t.daysOverdue + " дн";
    if (t.status === "Завершено" || t.status === "Отменено") return "";
    const parts = String(t.due || "").split("-");
    if (parts.length === 3) return "до " + parts[2] + "." + parts[1];
    return t.due || "";
  }
  function cloneTasks(list) {
    return JSON.parse(JSON.stringify(list || TASKS));
  }

  function cardHtml(t) {
    const st = statusMeta(t.status);
    const meta = [t.assignee, t.enterprise, dueLabel(t), priShort(t.priority)].filter(Boolean).join(" · ");
    return (
      `<article class="tpl-kanban-card" data-kanban-card data-task-id="${esc(t.id)}" data-status="${esc(t.status)}" data-priority="${esc(t.priority)}" data-assignee="${esc(t.assignee)}" data-enterprise="${esc(t.enterprise)}" data-title="${esc(t.title)}" role="button" tabindex="0">` +
      `<span class="tag ${st.tag}">#${esc(t.id)}</span>` +
      `<strong>${esc(t.title)}</strong>` +
      `<span class="tpl-kanban-meta">${esc(meta)}</span>` +
      `</article>`
    );
  }

  function buildBoardHtml(title, tasks) {
    const list = tasks && tasks.length ? tasks : TASKS;
    const t = title || "Платформа поручений";
    const cols = STATUSES.map((st) => {
      const cards = list.filter((x) => x.status === st.label);
      return (
        `<div class="tpl-kanban-col" data-kanban-col="${st.id}" data-status-label="${esc(st.label)}">` +
        `<div class="tpl-kanban-col-head"><span>${esc(st.label)}</span><span class="tpl-kanban-count" data-col-count>${cards.length}</span></div>` +
        `<div class="tpl-kanban-cards" data-col-cards>${cards.map(cardHtml).join("")}</div>` +
        `</div>`
      );
    }).join("");

    return `
<div class="tpl-viewport tpl-kanban sb-assign-live" data-template-page="assignments-board" data-assign-screen="board" style="position:relative;min-height:100%">
  <header class="tpl-kanban-header">
    <span class="sb-appshell-logo">${logo()}<span class="sb-appshell-title">${esc(t)}</span></span>
    <span class="sb-appshell-spacer"></span>
    <button type="button" class="btn btn-ghost btn-s" data-nav-screen="admin" title="Администратор">${ic("settings", 14)} Админ</button>
    <button type="button" class="btn btn-primary btn-s" data-assign-new>${ic("plus", 14)} Поручение</button>
  </header>
  <div class="sb-toolbar" data-toolbar data-assign-filters>
    <span class="sb-toolbar-label">Статус:</span>
    <button type="button" class="sb-toolbar-filter is-active" data-status-filter="all">Все</button>
    <button type="button" class="sb-toolbar-filter" data-status-filter="В работе">В работе</button>
    <button type="button" class="sb-toolbar-filter" data-status-filter="Просрочено">Просрочено</button>
    <button type="button" class="sb-toolbar-filter" data-status-filter="Завершено">Завершено</button>
    <button type="button" class="sb-toolbar-filter" data-status-filter="Отменено">Отменено</button>
    <span class="sb-toolbar-spacer"></span>
    <label class="sb-assign-search">
      <span class="visually-hidden">Поиск</span>
      <input type="search" data-assign-search placeholder="Поиск: №, ФИО, предприятие…" autocomplete="off" />
    </label>
    <span class="sb-toolbar-count" data-assign-count>Найдено: ${list.length}</span>
  </div>
  <div class="tpl-kanban-board" data-kanban style="grid-template-columns:repeat(4,minmax(140px,1fr))">${cols}</div>

  <div class="live-overlay live-overlay--drawer" data-tpl-drawer hidden>
    <div class="live-drawer tpl-drawer" role="dialog" aria-modal="true">
      <div class="live-drawer-head">
        <span data-tpl-drawer-title>Поручение</span>
        <button type="button" class="live-drawer-close" data-tpl-drawer-close aria-label="Закрыть">${ic("close", 14)}</button>
      </div>
      <div class="live-drawer-body">
        <dl class="tpl-drawer-meta">
          <dt>Тема</dt><dd data-d-title>—</dd>
          <dt>Исполнитель</dt><dd data-d-assignee>—</dd>
          <dt>Предприятие</dt><dd data-d-enterprise>—</dd>
          <dt>Статус</dt><dd data-d-status>—</dd>
          <dt>Приоритет</dt><dd data-d-priority>—</dd>
          <dt>Срок</dt><dd data-d-due>—</dd>
        </dl>
      </div>
    </div>
  </div>

  <aside class="sb-assign-ai" aria-label="AI на доске">
    <div class="sb-assign-ai-head">
      <strong>AI · поручения</strong>
      <button type="button" class="sb-assign-ai-gear" data-nav-screen="admin" title="Админ / настройки">${ic("settings", 14)}</button>
    </div>
    <div class="sb-assign-ai-log" data-ai-log>Спросите: просрочки, высокий приоритет, номер или ФИО</div>
    <div class="sb-assign-ai-row">
      <button type="button" class="sb-assign-ai-mic" data-ai-mic title="Голос">${ic("mic", 14)}</button>
      <input type="text" data-ai-input placeholder="Найти #P-1042 или ФИО…" />
      <button type="button" class="btn btn-primary btn-xs" data-ai-send>→</button>
    </div>
    <div class="sb-assign-ai-chips">
      <button type="button" class="tag tag-neutral" data-ai-chip="overdue">Просрочки</button>
      <button type="button" class="tag tag-neutral" data-ai-chip="high">Высокий приоритет</button>
      <button type="button" class="tag tag-neutral" data-ai-chip="ivanov">Иванов</button>
    </div>
  </aside>
  <div class="sb-assign-toast" data-assign-toast hidden></div>
</div>`;
  }

  function statsFrom(tasks) {
    const list = tasks || TASKS;
    const late = list.filter((t) => t.status === "Просрочено").length;
    const high = list.filter((t) => t.priority === "Высокий" && t.status !== "Завершено" && t.status !== "Отменено").length;
    const open = list.filter((t) => t.status === "В работе" || t.status === "Просрочено").length;
    const sla = list.length ? Math.round(((list.length - late) / list.length) * 100) : 100;
    return { total: list.length, late, high, open, sla };
  }

  function agendaRows(tasks) {
    const list = tasks || TASKS;
    return list
      .filter((t) => t.status === "Просрочено" || (t.priority === "Высокий" && t.status === "В работе"))
      .sort((a, b) => (b.daysOverdue || 0) - (a.daysOverdue || 0) || (a.due < b.due ? -1 : 1));
  }

  function buildAdminHtml(title, tasks) {
    const list = tasks && tasks.length ? tasks : TASKS;
    const st = statsFrom(list);
    const agenda = agendaRows(list);
    const t = (title || "Платформа поручений") + " · Админ";
    const rows = agenda
      .map((x) => {
        const sm = statusMeta(x.status);
        return `<tr data-task-id="${esc(x.id)}" data-admin-row role="button" tabindex="0"><td style="padding:10px">${esc(x.id)}</td><td>${esc(x.title)}</td><td>${esc(x.assignee)}</td><td>${esc(x.enterprise)}</td><td><span class="tag ${sm.tag}">${esc(x.status)}</span></td></tr>`;
      })
      .join("");

    const byAssignee = {};
    const byEnt = {};
    list.forEach((x) => {
      if (x.status === "Просрочено" || x.status === "В работе") {
        byAssignee[x.assignee] = (byAssignee[x.assignee] || 0) + 1;
        byEnt[x.enterprise] = (byEnt[x.enterprise] || 0) + 1;
      }
    });

    return `
<div class="tpl-viewport sb-assign-live" data-template-page="assignments-admin" data-assign-screen="admin">
  <div class="sb-appshell tpl-appshell">
    <header class="sb-appshell-header">
      <span class="sb-appshell-logo">${logo()}<span class="sb-appshell-title">${esc(t)}</span></span>
      <span class="sb-appshell-spacer"></span>
      <button type="button" class="btn btn-ghost btn-s" data-nav-screen="board">${ic("arrow-left", 14)} К доске</button>
      <button type="button" class="btn btn-ghost btn-s btn-icon-only" data-nav-screen="board" title="Настройки / доска">${ic("settings", 18)}</button>
      <div class="sb-appshell-avatar">АК</div>
    </header>
    <div class="sb-appshell-body">
      <aside class="sb-appshell-sidebar">
        <button type="button" class="sb-appshell-nav" data-nav-screen="board">${ic("grid", 16)} Доска</button>
        <button type="button" class="sb-appshell-nav is-active">${ic("bar-chart", 16)} Администратор</button>
      </aside>
      <main class="sb-appshell-main tpl-dashboard-main">
        <div class="sb-stats size-s layout-grid tpl-dashboard-stats" data-stats>
          <div class="sb-stat"><div class="sb-stat-label">Всего</div><div class="sb-stat-value" data-stat="total">${st.total}</div></div>
          <div class="sb-stat"><div class="sb-stat-label">SLA</div><div class="sb-stat-value" data-stat="sla">${st.sla}%</div></div>
          <div class="sb-stat"><div class="sb-stat-label">Просрочено</div><div class="sb-stat-value" data-stat="late">${st.late}</div></div>
          <div class="sb-stat"><div class="sb-stat-label">Высокий приоритет</div><div class="sb-stat-value" data-stat="high">${st.high}</div></div>
        </div>
        <div class="sb-toolbar" data-toolbar data-admin-slice>
          <span class="sb-toolbar-label">Срез:</span>
          <button type="button" class="sb-toolbar-filter is-active" data-slice="assignee">По исполнителю</button>
          <button type="button" class="sb-toolbar-filter" data-slice="enterprise">По предприятию</button>
          <span class="sb-toolbar-spacer"></span>
          <span class="sb-toolbar-count" data-agenda-count>Повестка к совещанию · ${agenda.length}</span>
        </div>
        <div class="sb-assign-slice" data-slice-panel>
          ${Object.keys(byAssignee)
            .map((k) => `<span class="tag tag-neutral" data-slice-chip data-slice-key="${esc(k)}">${esc(k)} · ${byAssignee[k]}</span>`)
            .join(" ")}
        </div>
        <div class="sb-table-wrap" style="background:var(--bg-elevated,#fff);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-top:10px">
          <table class="sb-table" style="width:100%;border-collapse:collapse;font-size:12px">
            <thead><tr style="text-align:left;background:rgba(0,143,149,.06)"><th style="padding:10px">#</th><th>Тема</th><th>Исполнитель</th><th>Предприятие</th><th>Статус</th></tr></thead>
            <tbody data-agenda-body>${rows}</tbody>
          </table>
        </div>
        <p style="margin:12px 0 0;font-size:11px;color:var(--text-secondary)">Живые данные mock · срез и повестка из реестра · RAG/LLM — в ⚙ агента SB</p>
      </main>
    </div>
  </div>
  <div class="sb-assign-toast" data-assign-toast hidden></div>
</div>`;
  }

  /** CSS injected into preview for assignments live UI */
  function runtimeCss() {
    return `
.sb-assign-search input{min-width:200px;height:28px;border:1px solid var(--border);border-radius:8px;padding:0 8px;font:inherit;font-size:12px;background:#fff;color:var(--text-main)}
.sb-assign-ai{position:absolute;right:16px;bottom:16px;width:300px;border:1px solid var(--border);border-radius:12px;background:var(--bg-elevated,#fff);box-shadow:0 8px 24px rgba(11,42,48,.14);padding:10px;z-index:20}
.sb-assign-ai-head{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.sb-assign-ai-head strong{font-size:12px;color:var(--text-main)}
.sb-assign-ai-gear{margin-left:auto;border:0;background:transparent;cursor:pointer;opacity:.7;padding:2px;color:var(--text-secondary)}
.sb-assign-ai-log{margin:0 0 8px;font-size:11px;color:var(--text-secondary);line-height:1.35;min-height:2.6em}
.sb-assign-ai-row{display:flex;gap:6px;align-items:center;margin-bottom:8px}
.sb-assign-ai-mic{width:30px;height:30px;border-radius:8px;border:1px solid var(--border);background:#fff;cursor:pointer;display:inline-grid;place-items:center;color:var(--text-secondary)}
.sb-assign-ai-mic.is-listening{background:#e11d48;border-color:#e11d48;color:#fff}
.sb-assign-ai-row input{flex:1;height:30px;border:1px solid var(--border);border-radius:8px;padding:0 8px;font:inherit;font-size:11px}
.sb-assign-ai-chips{display:flex;flex-wrap:wrap;gap:4px}
.sb-assign-ai-chips .tag{cursor:pointer;border:0}
.sb-assign-ai-chips .tag:hover,.sb-assign-ai-chips .tag.is-on{background:rgba(0,143,149,.15);color:var(--primary)}
.tpl-kanban-card.is-flash{outline:2px solid var(--primary);box-shadow:0 0 0 3px rgba(0,143,149,.2)}
.tpl-kanban-card.is-dim{opacity:.28}
.tpl-kanban-card.is-selected{border-color:var(--primary)}
.sb-assign-toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#0b2a30;color:#fff;padding:8px 14px;border-radius:999px;font-size:12px;z-index:40;max-width:90%}
.sb-assign-slice{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.sb-assign-slice .tag{cursor:pointer}
.visually-hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
.btn-xs{padding:4px 8px;font-size:11px;border-radius:8px}
`;
  }

  /**
   * Runtime for iframe — filters, drawer, AI bridge, nav postMessage.
   * Expects window.__SB_ASSIGN__ = { tasks: [...] }
   */
  function runtimeScript() {
    return `(function(){
  var DATA = (window.__SB_ASSIGN__ && window.__SB_ASSIGN__.tasks) || [];
  var root = document.querySelector('.sb-assign-live');
  if (!root) return;
  var screen = root.getAttribute('data-assign-screen') || 'board';
  var state = { status: 'all', query: '', highlightIds: null, slice: 'assignee' };

  function $(sel, el){ return (el||document).querySelector(sel); }
  function $all(sel, el){ return Array.prototype.slice.call((el||document).querySelectorAll(sel)); }
  function toast(msg){
    var el = $('[data-assign-toast]', root);
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
    clearTimeout(toast._t);
    toast._t = setTimeout(function(){ el.hidden = true; }, 2200);
  }
  function postNav(id){
    try { window.parent.postMessage({ type: 'sb-agent-screen', screenId: id }, '*'); } catch(e) {}
  }
  function norm(s){ return String(s||'').toLowerCase().replace(/ё/g,'е'); }
  function findTask(id){ return DATA.find(function(t){ return t.id === id; }); }

  function openDrawer(task){
    if (!task) return;
    var drawer = $('[data-tpl-drawer]', root);
    if (!drawer) return;
    drawer.hidden = false;
    var set = function(sel, v){ var n=$(sel, root); if(n) n.textContent = v || '—'; };
    set('[data-tpl-drawer-title]', 'Поручение #' + task.id);
    set('[data-d-title]', task.title);
    set('[data-d-assignee]', task.assignee);
    set('[data-d-enterprise]', task.enterprise);
    set('[data-d-status]', task.status);
    set('[data-d-priority]', task.priority);
    set('[data-d-due]', task.due + (task.daysOverdue ? ' (−' + task.daysOverdue + ' дн)' : ''));
    $all('[data-task-id]', root).forEach(function(c){ c.classList.toggle('is-selected', c.getAttribute('data-task-id')===task.id); });
  }
  function closeDrawer(){
    var drawer = $('[data-tpl-drawer]', root);
    if (drawer) drawer.hidden = true;
  }

  function applyBoardFilter(){
    if (screen !== 'board') return;
    var q = norm(state.query);
    var cards = $all('[data-kanban-card]', root);
    var visible = 0;
    cards.forEach(function(card){
      var id = card.getAttribute('data-task-id');
      var st = card.getAttribute('data-status') || '';
      var hay = norm([id, card.getAttribute('data-title'), card.getAttribute('data-assignee'), card.getAttribute('data-enterprise')].join(' '));
      var okStatus = state.status === 'all' || st === state.status;
      var okQuery = !q || hay.indexOf(q) !== -1;
      var okHi = !state.highlightIds || state.highlightIds.indexOf(id) !== -1;
      var show = okStatus && okQuery && (state.highlightIds ? okHi : true);
      card.style.display = show ? '' : 'none';
      card.classList.toggle('is-dim', !!(state.highlightIds && !okHi));
      card.classList.toggle('is-flash', !!(state.highlightIds && okHi));
      if (show) visible++;
    });
    $all('[data-kanban-col]', root).forEach(function(col){
      var n = $all('[data-kanban-card]', col).filter(function(c){ return c.style.display !== 'none'; }).length;
      var counter = $('[data-col-count]', col);
      if (counter) counter.textContent = String(n);
    });
    var countEl = $('[data-assign-count]', root);
    if (countEl) countEl.textContent = 'Найдено: ' + visible;
  }

  function flashTasks(tasks, msg){
    state.highlightIds = (tasks || []).map(function(t){ return t.id; });
    if (screen === 'board') {
      applyBoardFilter();
      if (tasks && tasks[0]) {
        var card = root.querySelector('[data-task-id="'+tasks[0].id+'"]');
        if (card) card.scrollIntoView({ behavior:'smooth', block:'nearest' });
      }
    }
    logAi(msg || ('Найдено: ' + (tasks||[]).length));
    toast(msg || ('Найдено ' + (tasks||[]).length));
  }

  function logAi(text){
    var el = $('[data-ai-log]', root);
    if (el) el.textContent = text;
  }

  function runAi(raw){
    var q = norm(raw).trim();
    if (!q) return;
    if (/просроч/.test(q)) {
      var late = DATA.filter(function(t){ return t.status === 'Просрочено'; });
      flashTasks(late, 'Просрочено: ' + late.length);
      if (late[0]) openDrawer(late[0]);
      return;
    }
    if (/высок|приоритет/.test(q)) {
      var hi = DATA.filter(function(t){ return t.priority === 'Высокий' && t.status !== 'Завершено' && t.status !== 'Отменено'; });
      flashTasks(hi, 'Высокий приоритет: ' + hi.length);
      if (hi[0]) openDrawer(hi[0]);
      return;
    }
    if (/админ|настройк/.test(q)) { postNav('admin'); return; }
    if (/доск|канбан/.test(q)) { postNav('board'); return; }
    if (/сброс|все поручен|очист/.test(q)) {
      state.highlightIds = null;
      state.status = 'all';
      state.query = '';
      var search = $('[data-assign-search]', root);
      if (search) search.value = '';
      $all('[data-status-filter]', root).forEach(function(b){ b.classList.toggle('is-active', b.getAttribute('data-status-filter')==='all'); });
      applyBoardFilter();
      closeDrawer();
      logAi('Сбросил фильтры');
      return;
    }
    var idMatch = q.match(/p[-–]?\\s*(\\d{3,5})/i) || q.match(/#\\s*p?-?(\\d{3,5})/i);
    if (idMatch) {
      var id = 'P-' + idMatch[1];
      var hit = findTask(id) || DATA.find(function(t){ return norm(t.id).indexOf(norm(idMatch[1])) !== -1; });
      if (hit) {
        flashTasks([hit], 'Открыл ' + hit.id);
        openDrawer(hit);
        return;
      }
    }
    var hits = DATA.filter(function(t){
      return norm([t.id,t.title,t.assignee,t.enterprise].join(' ')).indexOf(q) !== -1;
    });
    if (hits.length) {
      flashTasks(hits, 'По запросу «' + raw.trim() + '»: ' + hits.length);
      openDrawer(hits[0]);
    } else {
      logAi('Ничего не нашёл по «' + raw.trim() + '»');
      toast('Не найдено');
    }
  }

  /* board filters */
  $all('[data-status-filter]', root).forEach(function(btn){
    btn.addEventListener('click', function(){
      state.status = btn.getAttribute('data-status-filter') || 'all';
      state.highlightIds = null;
      $all('[data-status-filter]', root).forEach(function(b){ b.classList.toggle('is-active', b===btn); });
      applyBoardFilter();
    });
  });
  var search = $('[data-assign-search]', root);
  if (search) {
    search.addEventListener('input', function(){
      state.query = search.value;
      state.highlightIds = null;
      applyBoardFilter();
    });
  }

  /* cards / rows */
  root.addEventListener('click', function(e){
    var nav = e.target.closest('[data-nav-screen]');
    if (nav) { e.preventDefault(); postNav(nav.getAttribute('data-nav-screen')); return; }
    var card = e.target.closest('[data-task-id]');
    if (card && (card.hasAttribute('data-kanban-card') || card.hasAttribute('data-admin-row'))) {
      var task = findTask(card.getAttribute('data-task-id'));
      if (task) {
        if (screen === 'admin') {
          try { window.parent.postMessage({ type:'sb-agent-open-task', taskId: task.id }, '*'); } catch(err) {}
        } else openDrawer(task);
      }
    }
    var chip = e.target.closest('[data-ai-chip]');
    if (chip) {
      var kind = chip.getAttribute('data-ai-chip');
      if (kind === 'overdue') runAi('просрочки');
      else if (kind === 'high') runAi('высокий приоритет');
      else if (kind === 'ivanov') runAi('Иванов');
    }
    if (e.target.closest('[data-tpl-drawer-close]') || (e.target.matches && e.target.matches('[data-tpl-drawer]'))) {
      if (e.target.closest('[data-tpl-drawer-close]') || e.target === $('[data-tpl-drawer]', root)) closeDrawer();
    }
    if (e.target.closest('[data-assign-new]')) toast('Демо: создание поручения не подключено');
  });

  /* AI send */
  var aiInput = $('[data-ai-input]', root);
  var aiSend = $('[data-ai-send]', root);
  function submitAi(){ if (!aiInput) return; runAi(aiInput.value); aiInput.value=''; }
  if (aiSend) aiSend.addEventListener('click', submitAi);
  if (aiInput) aiInput.addEventListener('keydown', function(e){ if (e.key==='Enter'){ e.preventDefault(); submitAi(); } });

  /* voice */
  var mic = $('[data-ai-mic]', root);
  var rec = null;
  var listening = false;
  if (mic) {
    mic.addEventListener('click', function(){
      var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { toast('Голос: нужен Chrome'); return; }
      if (!rec) {
        rec = new SR();
        rec.lang = 'ru-RU';
        rec.interimResults = false;
        rec.onresult = function(ev){
          var text = (ev.results[0] && ev.results[0][0] && ev.results[0][0].transcript) || '';
          listening = false;
          mic.classList.remove('is-listening');
          if (text) runAi(text);
        };
        rec.onerror = rec.onend = function(){ listening=false; mic.classList.remove('is-listening'); };
      }
      if (listening) { try{ rec.stop(); }catch(e){} listening=false; mic.classList.remove('is-listening'); return; }
      try { rec.start(); listening=true; mic.classList.add('is-listening'); } catch(e) {}
    });
  }

  /* admin slice */
  var byAssignee = {}, byEnt = {};
  DATA.forEach(function(t){
    if (t.status==='Просрочено' || t.status==='В работе') {
      byAssignee[t.assignee]=(byAssignee[t.assignee]||0)+1;
      byEnt[t.enterprise]=(byEnt[t.enterprise]||0)+1;
    }
  });
  function renderSlice(){
    var panel = $('[data-slice-panel]', root);
    if (!panel) return;
    var map = state.slice === 'enterprise' ? byEnt : byAssignee;
    panel.innerHTML = Object.keys(map).map(function(k){
      return '<button type="button" class="tag tag-neutral" data-slice-chip data-slice-key="'+k.replace(/"/g,'&quot;')+'">'+k+' · '+map[k]+'</button>';
    }).join(' ');
  }
  $all('[data-slice]', root).forEach(function(btn){
    btn.addEventListener('click', function(){
      state.slice = btn.getAttribute('data-slice') || 'assignee';
      $all('[data-slice]', root).forEach(function(b){ b.classList.toggle('is-active', b===btn); });
      renderSlice();
    });
  });
  root.addEventListener('click', function(e){
    var chip = e.target.closest('[data-slice-chip]');
    if (!chip || screen !== 'admin') return;
    var key = chip.getAttribute('data-slice-key');
    var field = state.slice === 'enterprise' ? 'enterprise' : 'assignee';
    var hits = DATA.filter(function(t){ return t[field] === key && (t.status==='Просрочено'||t.status==='В работе'); });
    toast(key + ': ' + hits.length + ' · открываю доску');
    try { window.parent.postMessage({ type:'sb-agent-ai', prompt: key }, '*'); } catch(err) {}
  });

  if (screen === 'board') applyBoardFilter();
  if (screen === 'admin') renderSlice();

  window.__SB_ASSIGN_API__ = {
    runAi: runAi,
    openTask: function(id){ var t=findTask(id); if(t){ flashTasks([t],'Открыл '+id); openDrawer(t);} },
    getTasks: function(){ return DATA.slice(); }
  };
})();`;
  }

  function embedPayload(tasks) {
    const list = cloneTasks(tasks);
    return (
      `<script>window.__SB_ASSIGN__=${JSON.stringify({ tasks: list })};<\/script>` +
      `<style>${runtimeCss()}</style>` +
      `<script>${runtimeScript()}<\/script>`
    );
  }

  global.SbAssignments = {
    TASKS,
    STATUSES,
    cloneTasks,
    statsFrom,
    agendaRows,
    buildBoardHtml,
    buildAdminHtml,
    embedPayload,
    runtimeCss,
  };
})(window);
