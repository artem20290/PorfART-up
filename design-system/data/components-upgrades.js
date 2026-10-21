/* Live upgrades for static demos + duplicate consolidation */
(function () {
  function removeAllNamed(name) {
    for (let i = components.length - 1; i >= 0; i--) {
      if (components[i].name === name) components.splice(i, 1);
    }
  }

  function removeDuplicatesKeepLast(name) {
    const indices = [];
    components.forEach((c, i) => { if (c.name === name) indices.push(i); });
    indices.slice(0, -1).sort((a, b) => b - a).forEach(i => components.splice(i, 1));
  }

  /* —— 2. Consolidate duplicates —— */
  removeDuplicatesKeepLast('News Tile');
  removeDuplicatesKeepLast('Card');
  removeAllNamed('Input / TextField');
  removeAllNamed('Textarea');
  removeAllNamed('Tag / Chip');
  removeAllNamed('Drawer Menu');

  const cardIdx = components.findIndex(c => c.name === 'Card' && c.category === 'Layout');
  if (cardIdx >= 0) {
    components[cardIdx].desc = '<strong>Универсальная карточка.</strong> Варианты контента (base, news, service, KPI, media) + настраиваемая карточка: status, form, отступы, shadow, header/body/footer.';
    components[cardIdx].params = 'variant · status · form · verticalSpace · horizontalSpace · shadow · children';
    components[cardIdx].demo = `<div class="sb-card-merged-demo"><div class="sb-card-merged-section"><div class="sb-card-merged-label">Контент-варианты</div><div class="card-demo-grid"><div class="card-variant base"><h4 class="cv-title">Базовая карточка</h4><p class="cv-text">Краткое описание модуля.</p></div><div class="card-variant news"><div class="cv-img"></div><div class="cv-body"><div class="cv-date">12 марта 2026</div><h4 class="cv-title">Новая линия ПП</h4></div></div><div class="card-variant service"><div class="cv-icon">${icon("settings", 16)}</div><h4 class="cv-title">Логистика</h4></div><div class="card-variant kpi"><div class="cv-value">24,7%</div><div class="cv-label">ROIC, 2025</div></div></div></div><div class="sb-card-merged-section"><div class="sb-card-merged-label">Настраиваемая карточка</div><div class="sb-new-card-demo"><div class="sb-new-card-row"><div class="sb-card-content"><div class="sb-new-card-label">status: alert</div><div class="sb-card space-md status-alert"><div class="sb-card-header"><h4 style="margin:0;font-size:16px;font-weight:700">Внимание</h4></div><div class="sb-card-body"><p style="margin:0;color:var(--text-secondary)">Опасная карточка с красной обводкой.</p></div></div></div><div class="sb-card-content"><div class="sb-new-card-label">form: round</div><div class="sb-card space-md form-round"><div class="sb-card-body"><p style="margin:0;color:var(--text-secondary)">Скруглённая карточка.</p></div></div></div></div></div></div>`;
  }

  const upgrades = {
    'PasswordInput': {
      status: 'stable',
      desc: '<strong>Пароль.</strong> Toggle показа, live-индикатор сложности.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-password-input" data-password-input><label class="sb-textfield-label">Пароль</label><div class="sb-password-row"><input type="password" class="sb-password-field" value="SB2026!" data-pw-input autocomplete="off" /><button type="button" class="sb-password-toggle" data-pw-toggle aria-label="Показать пароль">${icon("eye", 18)}</button></div><div class="sb-password-strength"><div class="sb-password-strength-bar" data-pw-bar></div></div><span class="sb-password-strength-label" data-pw-label>Средний</span></div>`
    },
    'PhoneInput': {
      status: 'stable',
      desc: '<strong>Телефон.</strong> Маска ввода + выбор кода страны.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-phone-input" data-phone-input><label class="sb-textfield-label">Телефон</label><div class="sb-phone-row"><button type="button" class="sb-phone-code" data-phone-code aria-expanded="false">🇷🇺 +7</button><input type="tel" class="sb-phone-field" value="(912) 345-67-89" data-phone-field inputmode="tel" /><div class="sb-phone-menu" hidden data-phone-menu><button type="button" class="sb-phone-country" data-country="+7">🇷🇺 +7</button><button type="button" class="sb-phone-country" data-country="+375">🇧🇾 +375</button><button type="button" class="sb-phone-country" data-country="+7">🇰🇿 +7</button></div></div></div>`
    },
    'PinInput': {
      status: 'stable',
      desc: '<strong>OTP / PIN.</strong> Автофокус ячеек и поддержка paste.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-pin-input" data-pin-input data-length="4"><input class="sb-pin-cell" type="text" inputmode="numeric" maxlength="1" aria-label="Цифра 1" /><input class="sb-pin-cell" type="text" inputmode="numeric" maxlength="1" aria-label="Цифра 2" /><input class="sb-pin-cell" type="text" inputmode="numeric" maxlength="1" aria-label="Цифра 3" /><input class="sb-pin-cell" type="text" inputmode="numeric" maxlength="1" aria-label="Цифра 4" /></div>`
    },
    'Counter / Stepper': {
      status: 'stable',
      desc: '<strong>Счётчик.</strong> Кнопки +/- с ограничениями min/max.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-counter" data-counter data-min="0" data-max="10" data-value="3" data-step="1"><button type="button" class="sb-counter-btn" data-counter-dec aria-label="Уменьшить">${icon("minus", 16)}</button><span class="sb-counter-val" data-counter-val>3</span><button type="button" class="sb-counter-btn" data-counter-inc aria-label="Увеличить">+</button></div>`
    },
    'Banner': {
      status: 'stable',
      desc: '<strong>Баннер.</strong> Полноширинное уведомление с action и закрытием.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-banner sb-banner--warning" data-banner><span class="sb-banner-icon">${icon("alert-circle", 18)}</span><span class="sb-banner-text">Система обновится в 02:00 МСК. Возможна кратковременная задержка.</span><button type="button" class="btn btn-ghost btn-s sb-banner-action" data-banner-action>Подробнее</button><button type="button" class="sb-banner-close" data-banner-close aria-label="Закрыть">${icon("close", 14)}</button></div>`
    },
    'Empty State': {
      status: 'stable',
      desc: '<strong>Пустое состояние.</strong> Заглушка с кнопкой действия.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-empty-state" data-empty-state><div class="sb-empty-icon">${icon("inbox", 32)}</div><h3 class="sb-empty-title">Нет результатов</h3><p class="sb-empty-text">Попробуйте изменить фильтры или создайте новый элемент</p><button type="button" class="btn btn-primary btn-s" data-empty-action>Создать</button></div>`
    },
    'Error State': {
      status: 'stable',
      desc: '<strong>Ошибка.</strong> Заглушка с кнопкой повтора.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-error-state" data-error-state><div class="sb-error-icon">${icon("x-circle", 18)}</div><h3 class="sb-error-title">Ошибка загрузки</h3><p class="sb-error-text" data-error-text>Не удалось загрузить данные. Проверьте подключение.</p><button type="button" class="btn btn-secondary btn-s" data-error-retry>Повторить</button></div>`
    },
    'Toolbar': {
      status: 'stable',
      desc: '<strong>Панель инструментов.</strong> Фильтры, счётчик, экспорт.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-toolbar" data-toolbar><span class="sb-toolbar-label">Фильтры:</span><button type="button" class="sb-toolbar-filter is-active" data-toolbar-filter="all">Все статусы</button><button type="button" class="sb-toolbar-filter" data-toolbar-filter="work">В работе</button><button type="button" class="sb-toolbar-filter" data-toolbar-filter="done">Готово</button><span class="sb-toolbar-spacer"></span><span class="sb-toolbar-count" data-toolbar-count>Найдено: 24</span><button type="button" class="btn btn-secondary btn-s" data-toolbar-export>Экспорт</button></div>`
    },
    'FilterPanel': {
      status: 'stable',
      desc: '<strong>Панель фильтров.</strong> Чекбоксы, сброс, сворачивание.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-filter-panel" data-filter-panel><div class="sb-fp-head"><span>Фильтры</span><button type="button" class="sb-fp-reset" data-fp-reset>Сбросить</button><button type="button" class="sb-fp-toggle" data-fp-toggle aria-expanded="true">${icon("chevron-down", 14)}</button></div><div class="sb-fp-body" data-fp-body><div class="sb-fp-group"><div class="sb-fp-label">Статус</div><div class="sb-fp-checks"><label class="checkbox size-s"><input type="checkbox" checked data-fp-check /><span>В наличии</span></label><label class="checkbox size-s"><input type="checkbox" data-fp-check /><span>Под заказ</span></label></div></div><div class="sb-fp-group"><div class="sb-fp-label">Категория</div><select class="form-select sb-fp-select" data-fp-select><option>Все категории</option><option>Полипропилен</option><option>Полиэтилен</option></select></div></div></div>`
    },
    'List': {
      status: 'stable',
      desc: '<strong>Список.</strong> Выбор элемента, hover-состояния.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-list" data-list><button type="button" class="sb-list-item is-selected" data-list-item><span class="sb-list-icon">${icon("mail", 16)}</span><span class="sb-list-label">Заявка #1234</span><span class="sb-list-meta">сегодня</span></button><button type="button" class="sb-list-item" data-list-item><span class="sb-list-icon">${icon("file-text", 16)}</span><span class="sb-list-label">Заявка #1233</span><span class="sb-list-meta">вчера</span></button><button type="button" class="sb-list-item" data-list-item><span class="sb-list-icon">${icon("package", 16)}</span><span class="sb-list-label">Отгрузка #891</span><span class="sb-list-meta">12 мар</span></button></div>`
    },
    'Timeline': {
      status: 'stable',
      desc: '<strong>Таймлайн.</strong> Хронология с раскрытием описания.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-timeline" data-timeline><div class="sb-timeline-item is-done" data-timeline-item><div class="sb-timeline-dot"></div><div class="sb-timeline-body"><button type="button" class="sb-timeline-head" data-timeline-toggle><span class="sb-timeline-date">14 марта 2026</span><strong>Заявка создана</strong></button><p class="sb-timeline-desc" hidden>Заявка #A-28491 отправлена в систему.</p></div></div><div class="sb-timeline-item is-done" data-timeline-item><div class="sb-timeline-dot"></div><div class="sb-timeline-body"><button type="button" class="sb-timeline-head" data-timeline-toggle><span class="sb-timeline-date">15 марта 2026</span><strong>Согласование</strong></button><p class="sb-timeline-desc" hidden>Одобрено менеджером.</p></div></div><div class="sb-timeline-item" data-timeline-item><div class="sb-timeline-dot"></div><div class="sb-timeline-body"><button type="button" class="sb-timeline-head" data-timeline-toggle><span class="sb-timeline-date">Ожидается</span><strong>Отгрузка</strong></button><p class="sb-timeline-desc" hidden>Планируется на 20 марта.</p></div></div></div>`
    },
    'Drawer / SidePanel': {
      status: 'stable',
      desc: '<strong>Боковая панель.</strong> Drawer / SidePanel — выезжает с overlay (заменяет Drawer Menu).',
      params: 'open · onClose · title · side · width · children'
    }
  };

  Object.entries(upgrades).forEach(([name, patch]) => {
    const idx = components.findIndex(c => c.name === name);
    if (idx >= 0) Object.assign(components[idx], patch);
  });
})();
