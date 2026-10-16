/* Composite page templates — loaded before pages.js */
const templateDefinitions = [
  {
    id: 'template-request',
    iconId: 'file-text',
    label: 'Заявка',
    title: 'Шаблон: Заявка',
    subtitle: 'AppShell · Filter Bar · Advanced DataTable · Activity Feed · Drawer',
    components: ['AppShell', 'Filter Bar', 'Advanced DataTable', 'Activity Feed', 'Drawer / SidePanel'],
    html: `
<div class="tpl-viewport" data-template-page="request">
  <div class="sb-appshell tpl-appshell">
    <header class="sb-appshell-header">
      <span class="sb-appshell-logo">${brandLogo(90, 22)}<span class="sb-appshell-title">Портал заявок</span></span>
      <span class="sb-appshell-spacer"></span>
      <div class="sb-notif-center" data-notif-center>
        <button type="button" class="sb-notif-trigger" aria-expanded="false" title="Уведомления">${icon("bell", 18)}<span class="sb-notif-badge">2</span></button>
        <div class="sb-notif-panel" hidden>
          <div class="sb-notif-head"><strong>Уведомления</strong><button type="button" class="sb-notif-clear" data-notif-clear>Прочитать все</button></div>
          <ul class="sb-notif-list"><li class="sb-notif-item is-unread"><strong>Заявка #A-28491</strong><span>требует согласования</span></li></ul>
        </div>
      </div>
      <div class="sb-appshell-avatar">АК</div>
    </header>
    <div class="sb-appshell-body">
      <aside class="sb-appshell-sidebar">
        <button type="button" class="sb-appshell-nav is-active">${icon("file-text", 16)} Заявки</button>
        <button type="button" class="sb-appshell-nav">${icon("bar-chart", 16)} Аналитика</button>
        <button type="button" class="sb-appshell-nav">${icon("settings", 16)} Настройки</button>
      </aside>
      <main class="sb-appshell-main tpl-request-main">
        <div class="sb-filter-bar" data-filter-bar>
          <span class="sb-filter-bar-label">Фильтры:</span>
          <span class="sb-filter-chip">Статус: В работе <button type="button" data-filter-remove aria-label="Убрать">${icon("close", 14)}</button></span>
          <span class="sb-filter-chip">Марка: ПП <button type="button" data-filter-remove aria-label="Убрать">${icon("close", 14)}</button></span>
          <button type="button" class="sb-filter-reset" data-filter-reset>Сбросить всё</button>
        </div>
        <div class="sb-adv-table tpl-adv-table" data-adv-table data-tpl-table>
          <div class="sb-adv-table-toolbar">
            <input type="search" class="form-input sb-adv-table-search" placeholder="Поиск по номеру..." data-adv-search />
            <span class="sb-adv-table-count" data-adv-count>3 записи</span>
          </div>
          <div class="sb-adv-table-wrap">
            <table class="sb-adv-table-grid">
              <thead><tr>
                <th class="sb-adv-th-check"><input type="checkbox" data-adv-select-all aria-label="Выбрать все" /></th>
                <th><button type="button" class="sb-adv-sort is-active" data-sort="name">Номер <span>${icon("chevron-up", 14)}</span></button></th>
                <th><button type="button" class="sb-adv-sort" data-sort="cat">Марка <span>${icon("chevrons-up-down", 14)}</span></button></th>
                <th>Статус</th>
              </tr></thead>
              <tbody data-adv-body>
                <tr data-row="A-28491" data-tpl-row data-id="A-28491" data-brand="PP-H 1200" data-status="В работе" class="tpl-row-clickable">
                  <td><input type="checkbox" data-adv-row /></td>
                  <td><strong>A-28491</strong></td>
                  <td data-cat="PP-H 1200">PP-H 1200</td>
                  <td><span class="tag tag-warning">В работе</span></td>
                </tr>
                <tr data-row="A-28490" data-tpl-row data-id="A-28490" data-brand="HDPE PE100" data-status="Одобрено" class="tpl-row-clickable">
                  <td><input type="checkbox" data-adv-row /></td>
                  <td><strong>A-28490</strong></td>
                  <td data-cat="HDPE PE100">HDPE PE100</td>
                  <td><span class="tag tag-success">Одобрено</span></td>
                </tr>
                <tr data-row="A-28489" data-tpl-row data-id="A-28489" data-brand="Ecolen" data-status="Черновик" class="tpl-row-clickable">
                  <td><input type="checkbox" data-adv-row /></td>
                  <td><strong>A-28489</strong></td>
                  <td data-cat="Ecolen">Ecolen</td>
                  <td><span class="tag tag-neutral">Черновик</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
  <div class="live-overlay live-overlay--drawer" data-tpl-drawer hidden>
    <div class="live-drawer tpl-drawer" role="dialog" aria-modal="true">
      <div class="live-drawer-head">
        <span data-tpl-drawer-title>Заявка #A-28491</span>
        <button type="button" class="live-drawer-close" data-tpl-drawer-close aria-label="Закрыть">${icon("close", 14)}</button>
      </div>
      <div class="live-drawer-body">
        <dl class="tpl-drawer-meta">
          <dt>Марка</dt><dd data-tpl-drawer-brand>PP-H 1200</dd>
          <dt>Статус</dt><dd data-tpl-drawer-status>В работе</dd>
          <dt>Объём</dt><dd>50 т</dd>
        </dl>
        <h4 class="tpl-drawer-section-title">Лента активности</h4>
        <div class="sb-activity-feed" data-activity-feed>
          <ul class="sb-activity-list">
            <li class="sb-activity-item"><div class="sb-activity-avatar">АК</div><div class="sb-activity-body"><div class="sb-activity-meta"><strong>Анна Козлова</strong><span>сегодня, 14:32</span></div><p>Изменила статус на <span class="tag tag-warning">В работе</span></p></div></li>
            <li class="sb-activity-item"><div class="sb-activity-avatar">ИС</div><div class="sb-activity-body"><div class="sb-activity-meta"><strong>Игорь Смирнов</strong><span>сегодня, 11:05</span></div><p>Добавил комментарий</p></div></li>
          </ul>
          <div class="sb-activity-compose">
            <input class="form-input" placeholder="Комментарий..." data-activity-input />
            <button type="button" class="btn btn-primary btn-s" data-activity-send>Отправить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: 'template-catalog',
    iconId: 'package',
    label: 'Каталог',
    title: 'Шаблон: Каталог',
    subtitle: 'Mega Menu · TreeView · Virtual List',
    components: ['Mega Menu', 'TreeView', 'Virtual List'],
    html: `
<div class="tpl-viewport" data-template-page="catalog">
  <header class="tpl-catalog-header">
    <span class="sb-appshell-logo">${brandLogo(90, 22)}<span class="sb-appshell-title">Каталог</span></span>
    <nav class="sb-mega-menu" data-mega-menu>
      <button type="button" class="sb-mega-trigger" aria-expanded="false">Продукция ${icon("chevron-down", 14)}</button>
      <div class="sb-mega-panel" hidden>
        <div class="sb-mega-col"><strong>Полимеры</strong><a href="#">Полипропилен</a><a href="#">Полиэтилен</a><a href="#">Ecolen</a></div>
        <div class="sb-mega-col"><strong>Катализаторы</strong><a href="#">Цеолиты</a><a href="#">Металлоорганика</a></div>
        <div class="sb-mega-col"><strong>Услуги</strong><a href="#">Логистика</a><a href="#">Техподдержка</a></div>
      </div>
    </nav>
    <span class="sb-appshell-spacer"></span>
    <div class="sb-search-input tpl-catalog-search" data-search-input>
      <span class="sb-search-input-icon">${icon("search", 16)}</span>
      <input type="search" class="sb-search-input-field" placeholder="Поиск в каталоге..." />
      <button type="button" class="sb-search-input-clear" aria-label="Очистить" hidden>${icon("close", 14)}</button>
    </div>
  </header>
  <div class="tpl-catalog-body">
    <aside class="tpl-catalog-tree">
      <div class="live-tree" data-live-tree data-tpl-tree>
        <div class="live-tree-item">
          <div class="live-tree-row is-selected"><button type="button" class="live-tree-toggle" aria-expanded="true">${icon("chevron-down", 14)}</button><span>Полимеры</span></div>
          <div class="live-tree-children">
            <div class="live-tree-item"><div class="live-tree-row" data-tpl-tree-filter="PP"><button type="button" class="live-tree-toggle is-leaf">${icon("chevron-right", 14)}</button><span>PP-H 1200</span></div></div>
            <div class="live-tree-item"><div class="live-tree-row" data-tpl-tree-filter="HDPE"><button type="button" class="live-tree-toggle is-leaf">${icon("chevron-right", 14)}</button><span>HDPE PE100</span></div></div>
            <div class="live-tree-item"><div class="live-tree-row" data-tpl-tree-filter="Ecolen"><button type="button" class="live-tree-toggle is-leaf">${icon("chevron-right", 14)}</button><span>Ecolen</span></div></div>
          </div>
        </div>
        <div class="live-tree-item">
          <div class="live-tree-row"><button type="button" class="live-tree-toggle" aria-expanded="false">${icon("chevron-right", 14)}</button><span>Эластомеры</span></div>
          <div class="live-tree-children" hidden>
            <div class="live-tree-item"><div class="live-tree-row" data-tpl-tree-filter="SBS"><button type="button" class="live-tree-toggle is-leaf">${icon("chevron-right", 14)}</button><span>SBS</span></div></div>
          </div>
        </div>
      </div>
    </aside>
    <div class="tpl-catalog-list">
      <div class="tpl-catalog-list-head"><strong data-tpl-list-title>Полимеры</strong><span class="tpl-catalog-count" data-tpl-list-count>12 позиций</span></div>
      <div class="sb-virtual-list tpl-virtual-list" data-virtual-list data-total="30" data-tpl-vlist>
        <ul class="sb-virtual-list-inner" data-vl-inner></ul>
        <div class="sb-virtual-list-status" data-vl-status>Загрузка...</div>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: 'template-settings',
    iconId: 'settings',
    label: 'Настройки',
    title: 'Шаблон: Настройки',
    subtitle: 'Vertical Tabs · Form Wizard',
    components: ['Vertical Tabs', 'Form Wizard'],
    html: `
<div class="tpl-viewport tpl-settings" data-template-page="settings">
  <header class="tpl-settings-header">
    <span class="sb-appshell-logo">${brandLogo(90, 22)}<span class="sb-appshell-title">Настройки профиля</span></span>
  </header>
  <div class="sb-vtabs tpl-vtabs" data-vtabs>
    <div class="sb-vtabs-nav">
      <button type="button" class="sb-vtabs-tab is-active" data-vtab="0">Профиль</button>
      <button type="button" class="sb-vtabs-tab" data-vtab="1">Безопасность</button>
      <button type="button" class="sb-vtabs-tab" data-vtab="2">Уведомления</button>
      <button type="button" class="sb-vtabs-tab" data-vtab="3">Мастер настройки</button>
    </div>
    <div class="sb-vtabs-panels">
      <div class="sb-vtabs-panel is-active" data-vpanel="0">
        <h4>Профиль</h4>
        <label class="sb-textfield-label">Имя</label>
        <input class="form-input" value="Анна Козлова" style="margin-bottom:12px" />
        <label class="sb-textfield-label">Email</label>
        <input class="form-input" value="anna.kozlova@sb.local" />
      </div>
      <div class="sb-vtabs-panel" data-vpanel="1">
        <h4>Безопасность</h4>
        <p>Пароль, двухфакторная аутентификация, активные сессии.</p>
        <button type="button" class="btn btn-secondary btn-s" style="margin-top:12px">Сменить пароль</button>
      </div>
      <div class="sb-vtabs-panel" data-vpanel="2">
        <h4>Уведомления</h4>
        <div class="tpl-settings-checks">
          <label class="checkbox size-s"><input type="checkbox" checked /><span>Email-оповещения</span></label>
          <label class="checkbox size-s"><input type="checkbox" /><span>SMS</span></label>
        </div>
      </div>
      <div class="sb-vtabs-panel" data-vpanel="3">
        <h4>Мастер первичной настройки</h4>
        <div class="sb-form-wizard" data-form-wizard>
          <div class="sb-fw-steps">
            <button type="button" class="sb-fw-step is-active" data-step="0">1. Организация</button>
            <button type="button" class="sb-fw-step" data-step="1">2. Роли</button>
            <button type="button" class="sb-fw-step" data-step="2">3. Готово</button>
          </div>
          <div class="sb-fw-panel is-active" data-panel="0">
            <label class="sb-textfield-label">Название компании</label>
            <input class="form-input" value="ООО «ПолимерТрейд»" />
          </div>
          <div class="sb-fw-panel" data-panel="1">
            <label class="sb-textfield-label">Роль в системе</label>
            <select class="form-select"><option>Менеджер закупок</option><option>Аналитик</option></select>
          </div>
          <div class="sb-fw-panel" data-panel="2">
            <p style="margin:0;font-size:14px;color:var(--text-secondary)">Настройка завершена. Можно начать работу в портале.</p>
          </div>
          <div class="sb-fw-actions">
            <button type="button" class="btn btn-secondary btn-s" data-fw-prev disabled>Назад</button>
            <button type="button" class="btn btn-primary btn-s" data-fw-next>Далее</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: 'template-dashboard',
    iconId: 'bar-chart',
    label: 'Дашборд',
    title: 'Шаблон: Дашборд',
    subtitle: 'AppShell · Stats · Toolbar · Donut Chart · Line Chart',
    components: ['AppShell', 'Stats', 'Toolbar', 'Donut Chart', 'Line Chart'],
    html: `
<div class="tpl-viewport" data-template-page="dashboard">
  <div class="sb-appshell tpl-appshell">
    <header class="sb-appshell-header">
      <span class="sb-appshell-logo">${brandLogo(90, 22)}<span class="sb-appshell-title">Аналитика продаж</span></span>
      <span class="sb-appshell-spacer"></span>
      <button type="button" class="btn btn-ghost btn-s btn-icon-only" title="Уведомления">${icon("bell", 18)}</button>
      <div class="sb-appshell-avatar">АК</div>
    </header>
    <div class="sb-appshell-body">
      <aside class="sb-appshell-sidebar">
        <button type="button" class="sb-appshell-nav">${icon("file-text", 16)} Заявки</button>
        <button type="button" class="sb-appshell-nav is-active">${icon("bar-chart", 16)} Аналитика</button>
        <button type="button" class="sb-appshell-nav">${icon("package", 16)} Каталог</button>
        <button type="button" class="sb-appshell-nav">${icon("settings", 16)} Настройки</button>
      </aside>
      <main class="sb-appshell-main tpl-dashboard-main">
        <div class="sb-stats size-s layout-grid tpl-dashboard-stats" data-stats>
          <div class="sb-stat">
            <div class="sb-stat-label">Заявки</div>
            <div class="sb-stat-value">384</div>
            <div class="sb-stat-change is-up"><span class="sb-stat-change-icon" aria-hidden="true">${icon("chevron-up", 14)}</span><span class="sb-stat-change-val">+12%</span></div>
          </div>
          <div class="sb-stat">
            <div class="sb-stat-label">SLA</div>
            <div class="sb-stat-value">98%</div>
            <div class="sb-stat-change is-up"><span class="sb-stat-change-icon" aria-hidden="true">${icon("chevron-up", 14)}</span><span class="sb-stat-change-val">+0,4 п.п.</span></div>
          </div>
          <div class="sb-stat">
            <div class="sb-stat-label">В работе</div>
            <div class="sb-stat-value">12</div>
            <div class="sb-stat-change is-neutral"><span class="sb-stat-change-icon" aria-hidden="true">${icon("chevron-right", 14)}</span><span class="sb-stat-change-val">0%</span></div>
          </div>
          <div class="sb-stat">
            <div class="sb-stat-label">Выручка</div>
            <div class="sb-stat-value">12,4 млн ₽</div>
            <div class="sb-stat-change is-up"><span class="sb-stat-change-icon" aria-hidden="true">${icon("chevron-up", 14)}</span><span class="sb-stat-change-val">+8,3%</span></div>
          </div>
        </div>
        <div class="sb-toolbar" data-toolbar>
          <span class="sb-toolbar-label">Период:</span>
          <button type="button" class="sb-toolbar-filter" data-toolbar-filter="all">Квартал</button>
          <button type="button" class="sb-toolbar-filter is-active" data-toolbar-filter="work">Месяц</button>
          <button type="button" class="sb-toolbar-filter" data-toolbar-filter="done">Неделя</button>
          <span class="sb-toolbar-spacer"></span>
          <span class="sb-toolbar-count" data-toolbar-count>Найдено: 12</span>
          <button type="button" class="btn btn-secondary btn-s" data-toolbar-export>Экспорт</button>
        </div>
        <div class="tpl-dashboard-charts">
          <div class="sb-donut-chart size-s tpl-dashboard-donut" data-donut-chart role="img" aria-label="Структура отгрузок">
            <div class="sb-donut-chart-body sb-donut-chart-body--stack">
              <div class="sb-donut-visual">
                <svg class="sb-donut-svg" viewBox="0 0 120 120" aria-hidden="true">
                  <g transform="rotate(-90 60 60)">
                    <circle class="sb-donut-track" cx="60" cy="60" r="40" fill="none" stroke-width="11"/>
                    <circle class="sb-donut-seg" data-seg="0" cx="60" cy="60" r="40" fill="none" stroke="#008f95" stroke-width="11" stroke-dasharray="95.5 251.3" stroke-dashoffset="0"/>
                    <circle class="sb-donut-seg" data-seg="1" cx="60" cy="60" r="40" fill="none" stroke="#4db8bd" stroke-width="11" stroke-dasharray="67.9 251.3" stroke-dashoffset="-95.5"/>
                    <circle class="sb-donut-seg" data-seg="2" cx="60" cy="60" r="40" fill="none" stroke="#1f8f53" stroke-width="11" stroke-dasharray="50.3 251.3" stroke-dashoffset="-163.4"/>
                    <circle class="sb-donut-seg" data-seg="3" cx="60" cy="60" r="40" fill="none" stroke="#e2a326" stroke-width="11" stroke-dasharray="37.7 251.3" stroke-dashoffset="-213.7"/>
                  </g>
                </svg>
                <div class="sb-donut-center">
                  <div class="sb-donut-center-value">2,4 млн т</div>
                  <div class="sb-donut-center-label">Отгрузки</div>
                </div>
              </div>
              <ul class="sb-donut-legend sb-donut-legend--compact">
                <li class="sb-donut-legend-item is-active" data-seg="0"><span class="sb-donut-legend-swatch" style="background:#008f95"></span><span class="sb-donut-legend-text">ПП</span><span class="sb-donut-legend-val">38%</span></li>
                <li class="sb-donut-legend-item" data-seg="1"><span class="sb-donut-legend-swatch" style="background:#4db8bd"></span><span class="sb-donut-legend-text">ПЭ</span><span class="sb-donut-legend-val">27%</span></li>
                <li class="sb-donut-legend-item" data-seg="2"><span class="sb-donut-legend-swatch" style="background:#1f8f53"></span><span class="sb-donut-legend-text">Ecolen</span><span class="sb-donut-legend-val">20%</span></li>
                <li class="sb-donut-legend-item" data-seg="3"><span class="sb-donut-legend-swatch" style="background:#e2a326"></span><span class="sb-donut-legend-text">Прочее</span><span class="sb-donut-legend-val">15%</span></li>
              </ul>
            </div>
          </div>
          <div class="sb-line-chart size-s tpl-dashboard-line" data-line-chart role="img" aria-label="Динамика отгрузок">
            <div class="sb-line-chart-inner">
              <div class="sb-bar-chart-y" aria-hidden="true"><span>700</span><span>550</span><span>400</span><span>0</span></div>
              <div class="sb-line-chart-plot">
                <svg class="sb-line-chart-svg" viewBox="0 0 340 170" preserveAspectRatio="none" aria-hidden="true">
                  <defs><linearGradient id="sb-line-fill-tpl-dash" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#008f95" stop-opacity="0.15"/><stop offset="100%" stop-color="#008f95" stop-opacity="0"/></linearGradient></defs>
                  <line x1="0" y1="42" x2="340" y2="42" class="sb-line-chart-grid-line"/>
                  <line x1="0" y1="85" x2="340" y2="85" class="sb-line-chart-grid-line"/>
                  <line x1="0" y1="128" x2="340" y2="128" class="sb-line-chart-grid-line"/>
                  <polygon class="sb-line-chart-area" points="20,131 80,105 140,121 200,88 260,49 320,62 320,150 20,150" fill="url(#sb-line-fill-tpl-dash)"/>
                  <polyline class="sb-line-chart-line" points="20,131 80,105 140,121 200,88 260,49 320,62"/>
                </svg>
                <div class="sb-line-chart-dots-layer" aria-hidden="true">
                  <div class="sb-line-chart-dot-hit" data-point="0" style="left:5.9%;top:77.1%"><span class="sb-line-chart-tip">420 т</span></div>
                  <div class="sb-line-chart-dot-hit" data-point="4" style="left:76.5%;top:28.8%"><span class="sb-line-chart-tip">610 т</span></div>
                  <div class="sb-line-chart-dot-hit" data-point="5" style="left:94.1%;top:36.5%"><span class="sb-line-chart-tip">580 т</span></div>
                </div>
                <div class="sb-line-chart-x-labels" aria-hidden="true"><span>Янв</span><span>Фев</span><span>Мар</span><span>Апр</span><span>Май</span><span>Июн</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</div>`
  },
  {
    id: 'template-login',
    iconId: 'lock',
    label: 'Вход',
    title: 'Шаблон: Авторизация',
    subtitle: 'TextField · PasswordInput · Button · Checkbox',
    components: ['TextField', 'PasswordInput', 'Button', 'Checkbox'],
    html: `
<div class="tpl-viewport tpl-login" data-template-page="login">
  <div class="tpl-login-card">
    <div class="tpl-login-brand">${brandLogo(110, 28)}</div>
    <h2 class="tpl-login-title">Вход в портал</h2>
    <p class="tpl-login-sub">Используйте корпоративный email и пароль</p>
    <form class="tpl-login-form" data-tpl-login-form novalidate>
      <label class="sb-textfield-label">Email</label>
      <input class="form-input" type="email" value="anna.kozlova@sb.local" autocomplete="username" style="margin-bottom:14px" />
      <div class="sb-password-input" data-password-input>
        <label class="sb-textfield-label">Пароль</label>
        <div class="sb-password-row">
          <input type="password" class="sb-password-field" value="SB2026!" data-pw-input autocomplete="current-password" />
          <button type="button" class="sb-password-toggle" data-pw-toggle aria-label="Показать пароль">${icon("eye", 18)}</button>
        </div>
        <div class="sb-password-strength"><div class="sb-password-strength-bar" data-pw-bar></div></div>
        <span class="sb-password-strength-label" data-pw-label>Средний</span>
      </div>
      <label class="checkbox size-s tpl-login-remember"><input type="checkbox" checked /><span>Запомнить меня</span></label>
      <button type="submit" class="btn btn-primary btn-m tpl-login-submit">Войти</button>
      <button type="button" class="btn btn-ghost btn-s tpl-login-forgot">Забыли пароль?</button>
    </form>
  </div>
</div>`
  },
  {
    id: 'template-orders',
    iconId: 'list',
    label: 'Заказы',
    title: 'Шаблон: Список заказов',
    subtitle: 'FilterPanel · Toolbar · List',
    components: ['FilterPanel', 'Toolbar', 'List'],
    html: `
<div class="tpl-viewport" data-template-page="orders">
  <header class="tpl-orders-header">
    <span class="sb-appshell-logo">${brandLogo(90, 22)}<span class="sb-appshell-title">Заказы и отгрузки</span></span>
    <span class="sb-appshell-spacer"></span>
    <div class="sb-search-input tpl-orders-search" data-search-input>
      <span class="sb-search-input-icon">${icon("search", 16)}</span>
      <input type="search" class="sb-search-input-field" placeholder="Поиск заказа..." />
      <button type="button" class="sb-search-input-clear" aria-label="Очистить" hidden>${icon("close", 14)}</button>
    </div>
  </header>
  <div class="tpl-orders-body">
    <aside class="tpl-orders-filters">
      <div class="sb-filter-panel" data-filter-panel>
        <div class="sb-fp-head"><span>Фильтры</span><button type="button" class="sb-fp-reset" data-fp-reset>Сбросить</button><button type="button" class="sb-fp-toggle" data-fp-toggle aria-expanded="true">${icon("chevron-down", 14)}</button></div>
        <div class="sb-fp-body" data-fp-body>
          <div class="sb-fp-group">
            <div class="sb-fp-label">Статус</div>
            <div class="sb-fp-checks">
              <label class="checkbox size-s"><input type="checkbox" checked data-fp-check /><span>В работе</span></label>
              <label class="checkbox size-s"><input type="checkbox" data-fp-check /><span>Отгружено</span></label>
              <label class="checkbox size-s"><input type="checkbox" data-fp-check /><span>Отменено</span></label>
            </div>
          </div>
          <div class="sb-fp-group">
            <div class="sb-fp-label">Марка</div>
            <select class="form-select sb-fp-select" data-fp-select><option>Все марки</option><option>Полипропилен</option><option>Полиэтилен</option><option>Ecolen</option></select>
          </div>
        </div>
      </div>
    </aside>
    <div class="tpl-orders-main">
      <div class="sb-toolbar" data-toolbar>
        <span class="sb-toolbar-label">Статус:</span>
        <button type="button" class="sb-toolbar-filter is-active" data-toolbar-filter="all">Все</button>
        <button type="button" class="sb-toolbar-filter" data-toolbar-filter="work">В работе</button>
        <button type="button" class="sb-toolbar-filter" data-toolbar-filter="done">Готово</button>
        <span class="sb-toolbar-spacer"></span>
        <span class="sb-toolbar-count" data-toolbar-count>Найдено: 24</span>
        <button type="button" class="btn btn-secondary btn-s" data-toolbar-export>Экспорт</button>
      </div>
      <div class="sb-list tpl-orders-list" data-list>
        <button type="button" class="sb-list-item is-selected" data-list-item><span class="sb-list-icon">${icon("file-text", 16)}</span><span class="sb-list-label">Заявка #A-28491 · PP-H 1200</span><span class="sb-list-meta"><span class="tag tag-warning">В работе</span></span></button>
        <button type="button" class="sb-list-item" data-list-item><span class="sb-list-icon">${icon("truck", 16)}</span><span class="sb-list-label">Отгрузка #S-891 · HDPE PE100</span><span class="sb-list-meta"><span class="tag tag-success">Отгружено</span></span></button>
        <button type="button" class="sb-list-item" data-list-item><span class="sb-list-icon">${icon("package", 16)}</span><span class="sb-list-label">Заявка #A-28488 · Ecolen</span><span class="sb-list-meta"><span class="tag tag-neutral">Черновик</span></span></button>
        <button type="button" class="sb-list-item" data-list-item><span class="sb-list-icon">${icon("file-text", 16)}</span><span class="sb-list-label">Заявка #A-28485 · PP-H 1200</span><span class="sb-list-meta"><span class="tag tag-success">Одобрено</span></span></button>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: 'template-tracking',
    iconId: 'truck',
    label: 'Трекинг',
    title: 'Шаблон: Трекинг отгрузки',
    subtitle: 'Copyable Field · Alert · Timeline',
    components: ['Copyable Field', 'Alert', 'Timeline'],
    html: `
<div class="tpl-viewport tpl-tracking" data-template-page="tracking">
  <header class="tpl-tracking-header">
    <span class="sb-appshell-logo">${brandLogo(90, 22)}<span class="sb-appshell-title">Трекинг отгрузки</span></span>
  </header>
  <div class="tpl-tracking-body">
    <div class="sb-copyable tpl-tracking-copy">
      <label class="sb-textfield-label">Номер отгрузки</label>
      <div class="sb-copyable-row">
        <code class="sb-copyable-value" data-copy-value>S-28491-TOB</code>
        <button type="button" class="btn btn-ghost btn-s btn-icon-only sb-copyable-btn" data-copy-btn title="Копировать"><span class="bi">${icon("copy", 16)}</span></button>
      </div>
    </div>
    <div class="sb-alert sb-alert--info" data-alert>
      <span class="sb-alert-icon">${icon("info", 18)}</span>
      <div class="sb-alert-body"><strong>В пути</strong><p>Ожидаемое прибытие на склад клиента — 20 марта 2026, до 18:00.</p></div>
      <button type="button" class="sb-alert-close" aria-label="Закрыть">${icon("close", 14)}</button>
    </div>
    <div class="sb-timeline" data-timeline>
      <div class="sb-timeline-item is-done" data-timeline-item>
        <div class="sb-timeline-dot"></div>
        <div class="sb-timeline-body">
          <button type="button" class="sb-timeline-head" data-timeline-toggle><span class="sb-timeline-date">14 марта · 09:15</span><strong>Заявка принята</strong></button>
          <p class="sb-timeline-desc" hidden>Заявка #A-28491 зарегистрирована в системе.</p>
        </div>
      </div>
      <div class="sb-timeline-item is-done" data-timeline-item>
        <div class="sb-timeline-dot"></div>
        <div class="sb-timeline-body">
          <button type="button" class="sb-timeline-head" data-timeline-toggle><span class="sb-timeline-date">15 марта · 14:40</span><strong>Отгрузка со склада Екатеринбург</strong></button>
          <p class="sb-timeline-desc" hidden>50 т PP-H 1200. Транспорт: фура, гос. номер А123ВС 72.</p>
        </div>
      </div>
      <div class="sb-timeline-item is-done" data-timeline-item>
        <div class="sb-timeline-dot"></div>
        <div class="sb-timeline-body">
          <button type="button" class="sb-timeline-head" data-timeline-toggle><span class="sb-timeline-date">16 марта · 08:20</span><strong>Промежуточный пункт</strong></button>
          <p class="sb-timeline-desc" hidden>Транспорт прошёл контрольную точку на трассе М-7.</p>
        </div>
      </div>
      <div class="sb-timeline-item" data-timeline-item>
        <div class="sb-timeline-dot"></div>
        <div class="sb-timeline-body">
          <button type="button" class="sb-timeline-head" data-timeline-toggle><span class="sb-timeline-date">Ожидается · 20 марта</span><strong>Доставка клиенту</strong></button>
          <p class="sb-timeline-desc" hidden>ООО «ПолимерТрейд», склад №2, г. Москва.</p>
        </div>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: 'template-product',
    iconId: 'package',
    label: 'Продукт',
    title: 'Шаблон: Страница продукта',
    subtitle: 'ProductTile · KeyValue · Attachment',
    components: ['ProductTile', 'KeyValue', 'Attachment'],
    html: `
<div class="tpl-viewport tpl-product" data-template-page="product">
  <header class="tpl-product-header">
    <span class="sb-appshell-logo">${brandLogo(90, 22)}<span class="sb-appshell-title">Каталог продукции</span></span>
    <span class="sb-appshell-spacer"></span>
    <button type="button" class="btn btn-primary btn-s">Запросить КП</button>
  </header>
  <div class="tpl-product-body">
    <div class="tpl-product-hero">
      <div class="tpl-product-image">
        <span class="tpl-product-image-icon">${icon("package", 48)}</span>
      </div>
      <div class="tpl-product-info">
        <span class="tag tag-promo">Новинка</span>
        <span class="tag tag-success">В наличии</span>
        <div class="tpl-product-brand">Полипропилен</div>
        <h3 class="tpl-product-name">PP-H 1200</h3>
        <p class="tpl-product-desc">Гомополимер для литья под давлением и производства плёнки. Высокая текучесть расплава.</p>
        <div class="tpl-product-price">от <strong>95 000 ₽</strong> / т</div>
        <div class="tpl-product-actions">
          <button type="button" class="btn btn-primary btn-m">В корзину</button>
          <button type="button" class="btn btn-secondary btn-m">${icon("download", 16)} TDS</button>
        </div>
      </div>
    </div>
    <div class="tpl-product-side">
      <h4 class="tpl-product-section-title">Характеристики</h4>
      <div class="tpl-kv">
        <div class="tpl-kv-row"><span class="tpl-kv-key">Марка</span><span class="tpl-kv-val">PP-H 1200</span></div>
        <div class="tpl-kv-row"><span class="tpl-kv-key">МФР (230°C / 2,16 кг)</span><span class="tpl-kv-val">750 000 г/10 мин</span></div>
        <div class="tpl-kv-row"><span class="tpl-kv-key">Плотность</span><span class="tpl-kv-val">0,905 г/см³</span></div>
        <div class="tpl-kv-row"><span class="tpl-kv-key">Упаковка</span><span class="tpl-kv-val">Мешок 25 кг / биг-бэг</span></div>
        <div class="tpl-kv-row"><span class="tpl-kv-key">Склад</span><span class="tpl-kv-val">Екатеринбург, Москва</span></div>
      </div>
      <h4 class="tpl-product-section-title">Документы</h4>
      <div class="tpl-attachments">
        <div class="tpl-attachment">
          <span class="tpl-attachment-icon">${icon("file-text", 18)}</span>
          <div class="tpl-attachment-body"><strong>TDS_PP_H030.pdf</strong><span>1,2 МБ · 12 мар 2026</span></div>
          <button type="button" class="btn btn-ghost btn-xs btn-icon-only" title="Скачать">${icon("download", 14)}</button>
        </div>
        <div class="tpl-attachment">
          <span class="tpl-attachment-icon">${icon("file-text", 18)}</span>
          <div class="tpl-attachment-body"><strong>MSDS_PP_H030.pdf</strong><span>840 КБ · 12 мар 2026</span></div>
          <button type="button" class="btn btn-ghost btn-xs btn-icon-only" title="Скачать">${icon("download", 14)}</button>
        </div>
        <div class="tpl-attachment">
          <span class="tpl-attachment-icon">${icon("file-text", 18)}</span>
          <div class="tpl-attachment-body"><strong>Сертификат_соответствия.pdf</strong><span>520 КБ · 01 фев 2026</span></div>
          <button type="button" class="btn btn-ghost btn-xs btn-icon-only" title="Скачать">${icon("download", 14)}</button>
        </div>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: 'template-kanban',
    iconId: 'grid',
    label: 'Канбан',
    title: 'Шаблон: Канбан-доска',
    subtitle: 'Toolbar · Card · Tag',
    components: ['Toolbar', 'Card', 'Tag / Chip'],
    html: `
<div class="tpl-viewport tpl-kanban" data-template-page="kanban">
  <header class="tpl-kanban-header">
    <span class="sb-appshell-logo">${brandLogo(90, 22)}<span class="sb-appshell-title">Заявки — канбан</span></span>
    <span class="sb-appshell-spacer"></span>
    <button type="button" class="btn btn-primary btn-s">${icon("plus", 14)} Новая заявка</button>
  </header>
  <div class="sb-toolbar" data-toolbar>
    <span class="sb-toolbar-label">Вид:</span>
    <button type="button" class="sb-toolbar-filter is-active" data-toolbar-filter="all">Все</button>
    <button type="button" class="sb-toolbar-filter" data-toolbar-filter="work">Мои</button>
    <button type="button" class="sb-toolbar-filter" data-toolbar-filter="done">Завершённые</button>
    <span class="sb-toolbar-spacer"></span>
    <span class="sb-toolbar-count" data-toolbar-count>Карточек: 6</span>
  </div>
  <div class="tpl-kanban-board" data-kanban>
    <div class="tpl-kanban-col" data-kanban-col="todo">
      <div class="tpl-kanban-col-head"><span>Новые</span><span class="tpl-kanban-count">2</span></div>
      <div class="tpl-kanban-cards">
        <article class="tpl-kanban-card" data-kanban-card draggable="true"><span class="tag tag-neutral">#A-28489</span><strong>Ecolen rPET</strong><span class="tpl-kanban-meta">30 т · Черновик</span><div class="tpl-kanban-card-actions"><button type="button" class="btn btn-ghost btn-xs" data-kanban-move="progress">${icon("chevron-right", 14)}</button></div></article>
        <article class="tpl-kanban-card" data-kanban-card draggable="true"><span class="tag tag-neutral">#A-28487</span><strong>HDPE PE100</strong><span class="tpl-kanban-meta">80 т · Новая</span><div class="tpl-kanban-card-actions"><button type="button" class="btn btn-ghost btn-xs" data-kanban-move="progress">${icon("chevron-right", 14)}</button></div></article>
      </div>
    </div>
    <div class="tpl-kanban-col" data-kanban-col="progress">
      <div class="tpl-kanban-col-head"><span>В работе</span><span class="tpl-kanban-count">2</span></div>
      <div class="tpl-kanban-cards">
        <article class="tpl-kanban-card is-active" data-kanban-card draggable="true"><span class="tag tag-warning">#A-28491</span><strong>PP-H 1200</strong><span class="tpl-kanban-meta">50 т · Согласование</span><div class="tpl-kanban-card-actions"><button type="button" class="btn btn-ghost btn-xs" data-kanban-move="todo">${icon("chevron-left", 14)}</button><button type="button" class="btn btn-ghost btn-xs" data-kanban-move="done">${icon("chevron-right", 14)}</button></div></article>
        <article class="tpl-kanban-card" data-kanban-card draggable="true"><span class="tag tag-warning">#A-28488</span><strong>SBS L-1205</strong><span class="tpl-kanban-meta">15 т · Логистика</span><div class="tpl-kanban-card-actions"><button type="button" class="btn btn-ghost btn-xs" data-kanban-move="todo">${icon("chevron-left", 14)}</button><button type="button" class="btn btn-ghost btn-xs" data-kanban-move="done">${icon("chevron-right", 14)}</button></div></article>
      </div>
    </div>
    <div class="tpl-kanban-col" data-kanban-col="done">
      <div class="tpl-kanban-col-head"><span>Готово</span><span class="tpl-kanban-count">2</span></div>
      <div class="tpl-kanban-cards">
        <article class="tpl-kanban-card" data-kanban-card draggable="true"><span class="tag tag-success">#A-28490</span><strong>HDPE PE100</strong><span class="tpl-kanban-meta">120 т · Одобрено</span><div class="tpl-kanban-card-actions"><button type="button" class="btn btn-ghost btn-xs" data-kanban-move="progress">${icon("chevron-left", 14)}</button></div></article>
        <article class="tpl-kanban-card" data-kanban-card draggable="true"><span class="tag tag-success">#A-28485</span><strong>PP R003 EX</strong><span class="tpl-kanban-meta">40 т · Отгружено</span><div class="tpl-kanban-card-actions"><button type="button" class="btn btn-ghost btn-xs" data-kanban-move="progress">${icon("chevron-left", 14)}</button></div></article>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: 'template-calendar',
    iconId: 'calendar',
    label: 'Календарь',
    title: 'Шаблон: Календарь событий',
    subtitle: 'Calendar · List · Tag',
    components: ['Calendar', 'List', 'Tag / Chip'],
    html: `
<div class="tpl-viewport tpl-calendar" data-template-page="calendar">
  <header class="tpl-calendar-header">
    <span class="sb-appshell-logo">${brandLogo(90, 22)}<span class="sb-appshell-title">Планирование отгрузок</span></span>
  </header>
  <div class="tpl-calendar-body">
    <div class="tpl-calendar-left">
      <div class="sb-calendar" data-calendar>
        <div class="sb-calendar-head">
          <button type="button" class="sb-cal-nav" data-cal-prev aria-label="Предыдущий месяц">${icon("chevron-left", 16)}</button>
          <strong data-cal-title>Июнь 2026</strong>
          <button type="button" class="sb-cal-nav" data-cal-next aria-label="Следующий месяц">${icon("chevron-right", 16)}</button>
        </div>
        <div class="sb-calendar-weekdays"><span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span></div>
        <div class="sb-calendar-grid" data-cal-grid></div>
      </div>
    </div>
    <div class="tpl-calendar-right">
      <div class="tpl-calendar-events-head">
        <strong data-tpl-cal-date>События на сегодня</strong>
        <span class="tag tag-neutral" data-tpl-cal-count>3 события</span>
      </div>
      <div class="sb-list tpl-calendar-list" data-list>
        <button type="button" class="sb-list-item is-selected" data-list-item><span class="sb-list-icon">${icon("truck", 16)}</span><span class="sb-list-label">Отгрузка PP-H 1200 · Екатеринбург</span><span class="sb-list-meta">09:00</span></button>
        <button type="button" class="sb-list-item" data-list-item><span class="sb-list-icon">${icon("calendar", 16)}</span><span class="sb-list-label">Согласование #A-28491</span><span class="sb-list-meta">14:00</span></button>
        <button type="button" class="sb-list-item" data-list-item><span class="sb-list-icon">${icon("users", 16)}</span><span class="sb-list-label">Встреча с клиентом</span><span class="sb-list-meta">16:30</span></button>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: 'template-edo',
    iconId: 'edit',
    label: 'ЭДО',
    title: 'Шаблон: Подписание документа',
    subtitle: 'Document Viewer · Signature Pad · File Preview',
    components: ['Document Viewer', 'Signature Pad', 'File Preview'],
    html: `
<div class="tpl-viewport tpl-edo" data-template-page="edo">
  <header class="tpl-edo-header">
    <span class="sb-appshell-logo">${brandLogo(90, 22)}<span class="sb-appshell-title">Электронный документооборот</span></span>
    <span class="sb-appshell-spacer"></span>
    <span class="tag tag-warning">Ожидает подписи</span>
  </header>
  <div class="tpl-edo-body">
    <div class="tpl-edo-doc">
      <div class="sb-doc-viewer" data-doc-viewer data-pages="3">
        <div class="sb-doc-viewer-toolbar">
          <button type="button" class="btn btn-ghost btn-s" data-doc-prev aria-label="Назад">${icon("chevron-left", 14)}</button>
          <span data-doc-page>Стр. 1 / 3</span>
          <button type="button" class="btn btn-ghost btn-s" data-doc-next aria-label="Вперёд">${icon("chevron-right", 14)}</button>
          <span class="sb-doc-viewer-spacer"></span>
          <div data-file-preview>
            <button type="button" class="btn btn-secondary btn-s" data-fp-open>${icon("eye", 14)} Превью</button>
            <div class="sb-fp-overlay" hidden>
              <div class="sb-fp-modal" role="dialog">
                <div class="sb-fp-head"><span>Договор_поставки_28491.pdf</span><button type="button" class="sb-fp-close" data-fp-close aria-label="Закрыть">${icon("close", 14)}</button></div>
                <div class="sb-fp-body"><div class="sb-fp-preview-page">Страница 1 из 3 — Договор поставки полипропилена PP-H 1200</div></div>
                <div class="sb-fp-foot"><button type="button" class="btn btn-secondary btn-s">${icon("download", 14)} Скачать</button></div>
              </div>
            </div>
          </div>
        </div>
        <div class="sb-doc-viewer-page" data-doc-stage>Договор поставки №28491 — PP-H 1200, 50 т, срок Q2 2026</div>
      </div>
    </div>
    <aside class="tpl-edo-sign">
      <h4 class="tpl-edo-sign-title">Электронная подпись</h4>
      <p class="tpl-edo-sign-hint">Поставьте подпись в поле ниже для завершения согласования</p>
      <div class="sb-signature" data-signature-pad>
        <canvas class="sb-signature-canvas" width="280" height="120"></canvas>
        <div class="sb-signature-actions">
          <button type="button" class="btn btn-ghost btn-s" data-sig-clear>Очистить</button>
          <button type="button" class="btn btn-primary btn-s" data-sig-save>Подписать</button>
        </div>
      </div>
    </aside>
  </div>
</div>`
  }
];
