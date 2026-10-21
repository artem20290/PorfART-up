/* High-priority components — appended after components-medium.js */
(function () {
  ['Menu / Dropdown', 'Alert'].forEach(name => {
    const idx = components.findIndex(c => c.name === name);
    if (idx >= 0) components.splice(idx, 1);
  });

  const items = [
    {
      name: 'Dropdown Menu',
      category: 'Navigation',
      status: 'stable',
      desc: '<strong>Выпадающее меню.</strong> Live-дропдаун с иконками и danger. 2 варианта: default · open.',
      params: 'items[] · trigger · position · onSelect · disabled',
      states: 'closed · open',
      aiPrompt: `Создай DropdownMenu (React) в стиле SB: trigger + menu, items с icon/danger/disabled, divider, click outside close.`,
      variants: [
        { id: 'default', label: 'Default', aiPrompt: `Создай DropdownMenu interactive: trigger «Действия», menu с icon/danger/disabled items. Без внешних библиотек.` },
        { id: 'open', label: 'Open', aiPrompt: `Создай DropdownMenu open state: меню развёрнуто под триггером. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-dropdown" data-dropdown>
              <button type="button" class="btn btn-secondary btn-m sb-dropdown-trigger" aria-expanded="false" aria-haspopup="true">Действия ${icon("chevron-down", 14)}</button>
              <div class="sb-dropdown-menu" hidden>
                <button type="button" class="sb-dropdown-item"><span class="sb-dropdown-icon">${icon("file-text", 16)}</span> Копировать</button>
                <button type="button" class="sb-dropdown-item"><span class="sb-dropdown-icon">${icon("edit", 16)}</span> Редактировать</button>
                <div class="sb-dropdown-divider"></div>
                <button type="button" class="sb-dropdown-item is-danger"><span class="sb-dropdown-icon">${icon("trash", 16)}</span> Удалить</button>
                <button type="button" class="sb-dropdown-item" disabled><span class="sb-dropdown-icon">${icon("lock", 16)}</span> Недоступно</button>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="open">
          <span class="showcase-label">Open</span>
          <div class="showcase-demo">
            <div class="sb-dropdown">
              <button type="button" class="btn btn-secondary btn-m sb-dropdown-trigger" aria-expanded="true">Действия ${icon("chevron-down", 14)}</button>
              <div class="sb-dropdown-menu is-open">
                <button type="button" class="sb-dropdown-item"><span class="sb-dropdown-icon">${icon("file-text", 16)}</span> Копировать</button>
                <button type="button" class="sb-dropdown-item"><span class="sb-dropdown-icon">${icon("edit", 16)}</span> Редактировать</button>
                <div class="sb-dropdown-divider"></div>
                <button type="button" class="sb-dropdown-item is-danger"><span class="sb-dropdown-icon">${icon("trash", 16)}</span> Удалить</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    },
    {
      name: 'Button Group',
      category: 'Action',
      status: 'stable',
      desc: '<strong>Группа кнопок.</strong> Связанные действия + Split Button. 2 варианта: grouped · split.',
      params: 'items[] · split · onSelect · size · disabled',
      states: 'default · open · disabled',
      aiPrompt: `Создай ButtonGroup и SplitButton в стиле SB: grouped buttons, split with dropdown menu.`,
      variants: [
        { id: 'grouped', label: 'Grouped', aiPrompt: `Создай ButtonGroup: 3 связанные кнопки secondary в одном блоке. Без внешних библиотек.` },
        { id: 'split', label: 'Split', aiPrompt: `Создай SplitButton: primary main + dropdown toggle с меню экспорта. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="grouped">
          <span class="showcase-label">Grouped</span>
          <div class="showcase-demo">
            <div class="sb-btn-group" role="group">
              <button type="button" class="btn btn-secondary btn-m">Сохранить</button>
              <button type="button" class="btn btn-secondary btn-m">Черновик</button>
              <button type="button" class="btn btn-secondary btn-m">Отмена</button>
            </div>
          </div>
        </div>
        <div data-variant-id="split">
          <span class="showcase-label">Split</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-split-btn" data-split-btn>
              <button type="button" class="btn btn-primary btn-m sb-split-main">Экспорт</button>
              <button type="button" class="btn btn-primary btn-m sb-split-toggle" aria-expanded="false" aria-label="Ещё">${icon("chevron-down", 14)}</button>
              <div class="sb-dropdown-menu sb-split-menu" hidden>
                <button type="button" class="sb-dropdown-item">Excel (.xlsx)</button>
                <button type="button" class="sb-dropdown-item">CSV</button>
                <button type="button" class="sb-dropdown-item">PDF</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    },
    {
      name: 'MultiSelect',
      category: 'Form',
      status: 'stable',
      desc: '<strong>Множественный выбор.</strong> Поле с тегами выбранных значений и выпадающим списком.',
      params: 'options[] · value[] · onChange · placeholder · searchable',
      states: 'default · open · filled · disabled',
      aiPrompt: `Создай MultiSelect (React): tags input, dropdown checkboxes, remove tag, search filter.`,
      variants: [
        { id: 'default', label: 'Default', aiPrompt: `Создай MultiSelect interactive с тегами и dropdown. Без внешних библиотек.` },
        { id: 'open', label: 'Open', aiPrompt: `Создай MultiSelect open state: меню развёрнуто. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-multiselect" data-multiselect>
              <div class="sb-multiselect-control" tabindex="0">
                <span class="sb-multiselect-tag">Полипропилен <button type="button" data-remove="Полипропилен" aria-label="Убрать">${icon("close", 14)}</button></span>
                <span class="sb-multiselect-tag">Ecolen <button type="button" data-remove="Ecolen" aria-label="Убрать">${icon("close", 14)}</button></span>
                <input class="sb-multiselect-input" placeholder="Добавить марку..." />
              </div>
              <div class="sb-multiselect-menu" hidden>
                <label class="sb-multiselect-opt"><input type="checkbox" checked /> Полипропилен</label>
                <label class="sb-multiselect-opt"><input type="checkbox" /> Полиэтилен</label>
                <label class="sb-multiselect-opt"><input type="checkbox" checked /> Ecolen</label>
                <label class="sb-multiselect-opt"><input type="checkbox" /> СБС</label>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="open">
          <span class="showcase-label">Open</span>
          <div class="showcase-demo">
            <div class="sb-multiselect">
              <div class="sb-multiselect-control" tabindex="0">
                <span class="sb-multiselect-tag">Полипропилен <button type="button" aria-label="Убрать">${icon("close", 14)}</button></span>
                <input class="sb-multiselect-input" placeholder="Добавить марку..." />
              </div>
              <div class="sb-multiselect-menu is-open">
                <label class="sb-multiselect-opt"><input type="checkbox" checked /> Полипропилен</label>
                <label class="sb-multiselect-opt"><input type="checkbox" /> Полиэтилен</label>
                <label class="sb-multiselect-opt"><input type="checkbox" checked /> Ecolen</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    },
    {
      name: 'TreeSelect',
      category: 'Form',
      status: 'stable',
      desc: '<strong>Иерархический выбор.</strong> Cascader: подразделение ${icon("chevron-right", 14)} склад ${icon("chevron-right", 14)} линия.',
      params: 'treeData[] · value · onChange · placeholder · expandTrigger',
      states: 'default · open · filled',
      aiPrompt: `Создай TreeSelect/Cascader (React): multi-level panel selection, breadcrumb path display.`,
      variants: [
        { id: 'default', label: 'Default', aiPrompt: `Создай TreeSelect interactive cascader 3 уровня. Без внешних библиотек.` },
        { id: 'open', label: 'Open', aiPrompt: `Создай TreeSelect open state: панели развёрнуты. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-treeselect" data-treeselect>
              <button type="button" class="sb-treeselect-trigger" aria-expanded="false"><span data-ts-value>Екатеринбург / Склад А / Линия 3</span><span class="sb-treeselect-arrow">${icon("chevron-down", 14)}</span></button>
              <div class="sb-treeselect-panels" hidden>
                <div class="sb-treeselect-panel"><button type="button" class="sb-treeselect-item is-active" data-level="0">Екатеринбург</button><button type="button" class="sb-treeselect-item" data-level="0">Казань</button><button type="button" class="sb-treeselect-item" data-level="0">Новосибирск</button></div>
                <div class="sb-treeselect-panel"><button type="button" class="sb-treeselect-item is-active" data-level="1">Склад А</button><button type="button" class="sb-treeselect-item" data-level="1">Склад Б</button></div>
                <div class="sb-treeselect-panel"><button type="button" class="sb-treeselect-item is-active" data-level="2">Линия 3</button><button type="button" class="sb-treeselect-item" data-level="2">Линия 5</button></div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="open">
          <span class="showcase-label">Open</span>
          <div class="showcase-demo">
            <div class="sb-treeselect">
              <button type="button" class="sb-treeselect-trigger" aria-expanded="true"><span>Екатеринбург / Склад А / Линия 3</span><span class="sb-treeselect-arrow">${icon("chevron-down", 14)}</span></button>
              <div class="sb-treeselect-panels is-open">
                <div class="sb-treeselect-panel"><button type="button" class="sb-treeselect-item is-active">Екатеринбург</button><button type="button" class="sb-treeselect-item">Казань</button></div>
                <div class="sb-treeselect-panel"><button type="button" class="sb-treeselect-item is-active">Склад А</button><button type="button" class="sb-treeselect-item">Склад Б</button></div>
                <div class="sb-treeselect-panel"><button type="button" class="sb-treeselect-item is-active">Линия 3</button><button type="button" class="sb-treeselect-item">Линия 5</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    },
    {
      name: 'Alert',
      category: 'Overlay',
      status: 'stable',
      desc: '<strong>Инлайн-предупреждение.</strong> 4 типа: info, success, warning, error. Закрываемый баннер.',
      params: 'type · title · text · closable · onClose',
      states: 'default · closed',
      aiPrompt: `Создай Alert (React): type info|success|warning|error, icon, title, text, closable onClose.`,
    variants: [
      { id: 'info', label: 'Info', aiPrompt: `Создай Alert type=info closable. Без внешних библиотек.` },
      { id: 'success', label: 'Success', aiPrompt: `Создай Alert type=success. Без внешних библиотек.` },
      { id: 'warning', label: 'Warning', aiPrompt: `Создай Alert type=warning. Без внешних библиотек.` },
      { id: 'error', label: 'Error', aiPrompt: `Создай Alert type=error. Без внешних библиотек.` }
    ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="info">
          <span class="showcase-label">Info</span>
          <div class="showcase-demo">
            <div class="sb-alert sb-alert--info" data-alert>
              <span class="sb-alert-icon">${icon("info", 18)}</span>
              <div class="sb-alert-body"><strong>Информация</strong><p>Обновление каталога запланировано на 02:00 МСК.</p></div>
              <button type="button" class="sb-alert-close" aria-label="Закрыть">${icon("close", 14)}</button>
            </div>
          </div>
        </div>
        <div data-variant-id="success">
          <span class="showcase-label">Success</span>
          <div class="showcase-demo">
            <div class="sb-alert sb-alert--success" data-alert>
              <span class="sb-alert-icon">${icon("check-circle", 18)}</span>
              <div class="sb-alert-body"><strong>Успешно</strong><p>Данные сохранены.</p></div>
              <button type="button" class="sb-alert-close" aria-label="Закрыть">${icon("close", 14)}</button>
            </div>
          </div>
        </div>
        <div data-variant-id="warning">
          <span class="showcase-label">Warning</span>
          <div class="showcase-demo">
            <div class="sb-alert sb-alert--warning" data-alert>
              <span class="sb-alert-icon">${icon("alert-circle", 18)}</span>
              <div class="sb-alert-body"><strong>Внимание</strong><p>Остаток ниже минимального порога.</p></div>
              <button type="button" class="sb-alert-close" aria-label="Закрыть">${icon("close", 14)}</button>
            </div>
          </div>
        </div>
        <div data-variant-id="error">
          <span class="showcase-label">Error</span>
          <div class="showcase-demo">
            <div class="sb-alert sb-alert--error" data-alert>
              <span class="sb-alert-icon">${icon("x-circle", 18)}</span>
              <div class="sb-alert-body"><strong>Ошибка</strong><p>Не удалось отправить заявку.</p></div>
              <button type="button" class="sb-alert-close" aria-label="Закрыть">${icon("close", 14)}</button>
            </div>
          </div>
        </div>
      </div> `
    },
    {
      name: 'Vertical Tabs',
      category: 'Navigation',
      status: 'stable',
      desc: '<strong>Вертикальные табы.</strong> Боковая навигация по секциям. 2 варианта: left · right.',
      params: 'items[] · activeKey · onChange · position: left|right',
      states: 'default · active',
      aiPrompt: `Создай VerticalTabs (React): side tab list + content panel, active state primary.`,
      variants: [
        { id: 'left', label: 'Tabs left', aiPrompt: `Создай VerticalTabs position=left: nav слева, panel справа. Без внешних библиотек.` },
        { id: 'right', label: 'Tabs right', aiPrompt: `Создай VerticalTabs position=right: nav справа, panel слева. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="left">
          <span class="showcase-label">Tabs left</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-vtabs" data-vtabs>
              <div class="sb-vtabs-nav">
                <button type="button" class="sb-vtabs-tab is-active" data-vtab="0">Профиль</button>
                <button type="button" class="sb-vtabs-tab" data-vtab="1">Безопасность</button>
                <button type="button" class="sb-vtabs-tab" data-vtab="2">Уведомления</button>
                <button type="button" class="sb-vtabs-tab" data-vtab="3">Интеграции</button>
              </div>
              <div class="sb-vtabs-panels">
                <div class="sb-vtabs-panel is-active" data-vpanel="0"><h4>Профиль</h4><p>Имя, email, должность и контактные данные.</p></div>
                <div class="sb-vtabs-panel" data-vpanel="1"><h4>Безопасность</h4><p>Пароль, двухфакторная аутентификация.</p></div>
                <div class="sb-vtabs-panel" data-vpanel="2"><h4>Уведомления</h4><p>Email, push и SMS-оповещения.</p></div>
                <div class="sb-vtabs-panel" data-vpanel="3"><h4>Интеграции</h4><p>API-ключи и вебхуки.</p></div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="right">
          <span class="showcase-label">Tabs right</span>
          <div class="showcase-demo">
            <div class="sb-vtabs sb-vtabs--right" data-vtabs>
              <div class="sb-vtabs-nav">
                <button type="button" class="sb-vtabs-tab is-active" data-vtab="0">Обзор</button>
                <button type="button" class="sb-vtabs-tab" data-vtab="1">Аналитика</button>
                <button type="button" class="sb-vtabs-tab" data-vtab="2">Отчёты</button>
              </div>
              <div class="sb-vtabs-panels">
                <div class="sb-vtabs-panel is-active" data-vpanel="0"><h4>Обзор</h4><p>Сводка показателей за текущий период.</p></div>
                <div class="sb-vtabs-panel" data-vpanel="1"><h4>Аналитика</h4><p>Графики и динамика ключевых метрик.</p></div>
                <div class="sb-vtabs-panel" data-vpanel="2"><h4>Отчёты</h4><p>Экспорт и расписание отчётов.</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    },
    {
      name: 'AppShell',
      category: 'Layout',
      status: 'stable',
      desc: '<strong>Каркас приложения.</strong> Шапка + боковое меню + область контента для портала.',
      params: 'header · sidebar · children · collapsed',
      states: 'default · sidebar-collapsed',
      aiPrompt: `Создай AppShell (React): header bar, collapsible sidebar, main content area. SB colors.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай AppShell: header + sidebar + main. Без внешних библиотек.` },
      { id: 'collapsed', label: 'Sidebar collapsed', aiPrompt: `Создай AppShell с collapsed sidebar (только иконки). Без внешних библиотек.` }
    ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-appshell">
              <header class="sb-appshell-header">
                <span class="sb-appshell-logo">${brandLogo(90, 22)}<span class="sb-appshell-title">Портал заявок</span></span>
                <span class="sb-appshell-spacer"></span>
                <button type="button" class="btn btn-ghost btn-s btn-icon-only" title="Уведомления">${icon("bell", 18)}</button>
                <div class="sb-appshell-avatar">АК</div>
              </header>
              <div class="sb-appshell-body">
                <aside class="sb-appshell-sidebar">
                  <button type="button" class="sb-appshell-nav is-active">${icon("file-text", 16)} Заявки</button>
                  <button type="button" class="sb-appshell-nav">${icon("bar-chart", 16)} Аналитика</button>
                  <button type="button" class="sb-appshell-nav">${icon("package", 16)} Каталог</button>
                </aside>
                <main class="sb-appshell-main"><div class="sb-appshell-content">Контент страницы</div></main>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="collapsed">
          <span class="showcase-label">Sidebar collapsed</span>
          <div class="showcase-demo">
            <div class="sb-appshell is-sidebar-collapsed">
              <header class="sb-appshell-header">
                <span class="sb-appshell-logo">${brandLogo(90, 22)}</span>
                <span class="sb-appshell-spacer"></span>
                <div class="sb-appshell-avatar">АК</div>
              </header>
              <div class="sb-appshell-body">
                <aside class="sb-appshell-sidebar">
                  <button type="button" class="sb-appshell-nav is-active" title="Заявки">${icon("file-text", 16)}</button>
                  <button type="button" class="sb-appshell-nav" title="Аналитика">${icon("bar-chart", 16)}</button>
                  <button type="button" class="sb-appshell-nav" title="Каталог">${icon("package", 16)}</button>
                </aside>
                <main class="sb-appshell-main"><div class="sb-appshell-content">Контент</div></main>
              </div>
            </div>
          </div>
        </div>
      </div> `
    },
    {
      name: 'Filter Bar',
      category: 'Layout',
      status: 'stable',
      desc: '<strong>Панель фильтров.</strong> Активные фильтры чипами + кнопка «Сбросить всё».',
      params: 'filters[] · onRemove · onReset · onAdd',
      states: 'default · empty',
      aiPrompt: `Создай FilterBar (React): active filter chips, remove per chip, reset all button.`,
      variants: [
        { id: 'default', label: 'Default', aiPrompt: `Создай FilterBar: chips + reset. Без внешних библиотек.` },
        { id: 'empty', label: 'Empty', aiPrompt: `Создай FilterBar empty state. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-filter-bar" data-filter-bar>
              <span class="sb-filter-bar-label">Фильтры:</span>
              <span class="sb-filter-chip">Статус: В работе <button type="button" data-filter-remove aria-label="Убрать">${icon("close", 14)}</button></span>
              <span class="sb-filter-chip">Марка: ПП <button type="button" data-filter-remove aria-label="Убрать">${icon("close", 14)}</button></span>
              <button type="button" class="sb-filter-reset" data-filter-reset>Сбросить всё</button>
            </div>
          </div>
        </div>
        <div data-variant-id="empty">
          <span class="showcase-label">Empty</span>
          <div class="showcase-demo">
            <div class="sb-filter-bar is-empty" data-filter-bar>
              <span class="sb-filter-bar-label">Фильтры:</span>
              <span style="font-size:13px;color:var(--text-secondary)">Нет активных фильтров</span>
            </div>
          </div>
        </div>
      </div>`
    },
    {
      name: 'Notification Center',
      category: 'Overlay',
      status: 'stable',
      desc: '<strong>Центр уведомлений.</strong> Колокольчик со счётчиком и выпадающим списком.',
      params: 'items[] · unreadCount · onRead · onClear',
      states: 'closed · open · empty',
      aiPrompt: `Создай NotificationCenter (React): bell icon, badge count, dropdown list, mark read, clear all.`,
      variants: [
        { id: 'closed', label: 'Closed', aiPrompt: `Создай NotificationCenter closed с badge count. Без внешних библиотек.` },
        { id: 'open', label: 'Open', aiPrompt: `Создай NotificationCenter open dropdown. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="closed">
          <span class="showcase-label">Closed</span>
          <div class="showcase-demo">
            <div class="sb-notif-center" data-notif-center>
              <button type="button" class="sb-notif-trigger" aria-expanded="false" title="Уведомления">${icon("bell", 18)}<span class="sb-notif-badge">3</span></button>
              <div class="sb-notif-panel" hidden></div>
            </div>
          </div>
        </div>
        <div data-variant-id="open">
          <span class="showcase-label">Open</span>
          <div class="showcase-demo">
            <div class="sb-notif-center">
              <button type="button" class="sb-notif-trigger is-open" aria-expanded="true">${icon("bell", 18)}<span class="sb-notif-badge">3</span></button>
              <div class="sb-notif-panel" style="display:block;position:relative;box-shadow:var(--shadow-card)">
                <div class="sb-notif-head"><strong>Уведомления</strong><button type="button" class="sb-notif-clear">Прочитать все</button></div>
                <ul class="sb-notif-list">
                  <li class="sb-notif-item is-unread"><strong>Заявка одобрена</strong><span>#A-28491 · 5 мин</span></li>
                  <li class="sb-notif-item is-unread"><strong>Новый прайс-лист</strong><span>Каталог ПП · 1 ч</span></li>
                  <li class="sb-notif-item"><strong>Обновление системы</strong><span>Вчера</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>`
    },
    {
      name: 'File Preview',
      category: 'Overlay',
      status: 'stable',
      desc: '<strong>Превью файла.</strong> Просмотр документа или изображения в модальном окне.',
      params: 'file · type · open · onClose · title',
      states: 'closed · open · loading',
      aiPrompt: `Создай FilePreview (React): modal with image/PDF placeholder, toolbar download/close.`,
      variants: [
        { id: 'interactive', label: 'Interactive', aiPrompt: `Создай FilePreview modal interactive. Без внешних библиотек.` },
        { id: 'open', label: 'Open', aiPrompt: `Создай FilePreview open state. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div data-file-preview>
              <button type="button" class="btn btn-secondary btn-s" data-fp-open>Открыть превью</button>
              <div class="sb-fp-overlay" hidden>
                <div class="sb-fp-modal" role="dialog">
                  <div class="sb-fp-head"><span>Спецификация_PP_H030.pdf</span><button type="button" class="sb-fp-close" data-fp-close aria-label="Закрыть">${icon("close", 14)}</button></div>
                  <div class="sb-fp-body"><div class="sb-fp-preview-page">Страница 1 из 4</div></div>
                  <div class="sb-fp-foot"><button type="button" class="btn btn-secondary btn-s">Скачать</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="open">
          <span class="showcase-label">Open</span>
          <div class="showcase-demo">
            <div style="position:relative;min-height:200px;border-radius:12px;overflow:hidden;border:1px solid var(--border)">
              <div class="sb-fp-overlay sb-fp-overlay--scoped" style="display:flex;align-items:center;justify-content:center;background:rgba(11,42,48,0.6)">
                <div class="sb-fp-modal" role="dialog" style="position:relative">
                  <div class="sb-fp-head"><span>Спецификация_PP_H030.pdf</span><span>${icon("close", 14)}</span></div>
                  <div class="sb-fp-body"><div class="sb-fp-preview-page">Страница 1 из 4 — превью</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`
    },
    {
      name: 'Activity Feed',
      category: 'Data display',
      status: 'stable',
      desc: '<strong>Лента активности.</strong> Комментарии и действия по заявке: кто, когда, что изменил.',
      params: 'items[] · onComment · showInput',
      states: 'default',
      aiPrompt: `Создай ActivityFeed (React): avatar, author, time, action text, optional comment input.`,
      variants: [
        { id: 'interactive', label: 'Interactive', aiPrompt: `Создай ActivityFeed с комментариями. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-activity-feed" data-activity-feed><ul class="sb-activity-list"><li class="sb-activity-item"><div class="sb-activity-avatar">АК</div><div class="sb-activity-body"><div class="sb-activity-meta"><strong>Анна Козлова</strong><span>сегодня, 14:32</span></div><p>Изменила статус на <span class="tag tag-success">Одобрено</span></p></div></li><li class="sb-activity-item"><div class="sb-activity-avatar">ИС</div><div class="sb-activity-body"><div class="sb-activity-meta"><strong>Игорь Смирнов</strong><span>сегодня, 11:05</span></div><p>Добавил комментарий</p></div></li></ul><div class="sb-activity-compose"><input class="form-input" placeholder="Добавить комментарий..." data-activity-input /><button type="button" class="btn btn-primary btn-s" data-activity-send>Отправить</button></div></div>
          </div>
        </div>
      </div> `
    }
  ];

  items.forEach(c => components.push(c));
})();
