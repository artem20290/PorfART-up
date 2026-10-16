/* Medium-priority components — appended after components.js */
(function () {
  const removeNames = ['Range Slider'];
  removeNames.forEach(name => {
    const idx = components.findIndex(c => c.name === name);
    if (idx >= 0) components.splice(idx, 1);
  });

  const items = [
    {
      name: 'Rich Text',
      category: 'Form',
      status: 'stable',
      desc: '<strong>Форматированный текст.</strong> Мини-редактор с toolbar: жирный, курсив, список.',
      params: 'value · onChange · placeholder · disabled · toolbar[]',
      states: 'default · focused · disabled',
      aiPrompt: `Создай RichText (React): contenteditable + toolbar bold/italic/list. Пропсы: value, onChange, placeholder, disabled.`,
      variants: [
        { id: 'default', label: 'Default', aiPrompt: `Создай RichText с toolbar bold/italic/list. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-rich-text" data-rich-text>
              <div class="sb-rich-text-toolbar" role="toolbar">
                <button type="button" data-cmd="bold" title="Жирный"><b>B</b></button>
                <button type="button" data-cmd="italic" title="Курсив"><i>I</i></button>
                <button type="button" data-cmd="insertUnorderedList" title="Список">≡</button>
              </div>
              <div class="sb-rich-text-area" contenteditable="true" data-placeholder="Опишите задачу...">Заявка на <b>поставку полипропилена</b> для линии №3.</div>
            </div>
          </div>
        </div>
      </div>
    `
    },
    {
      name: 'Mentions',
      category: 'Form',
      status: 'stable',
      desc: '<strong>Упоминания @.</strong> Текстовое поле с выпадающим списком пользователей при вводе @.',
      params: 'users[] · value · onChange · placeholder',
      states: 'default · open · filled',
      aiPrompt: `Создай Mentions (React): textarea + dropdown при @. Пропсы: users: {id, name}[], value, onChange.`,
      variants: [
        { id: 'default', label: 'Default', aiPrompt: `Создай Mentions interactive: @ открывает dropdown. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-mentions" data-mentions>
              <textarea class="sb-mentions-input" rows="3" placeholder="Комментарий... Напишите @ для упоминания">Согласовано с @Анна Козлова</textarea>
              <ul class="sb-mentions-dropdown" hidden></ul>
            </div>
          </div>
        </div>
      </div>
    `
    },
    {
      name: 'Form Wizard',
      category: 'Form',
      status: 'stable',
      desc: '<strong>Мастер формы.</strong> Пошаговое заполнение: шаги + панели + Назад/Далее.',
      params: 'steps[] · current · onChange · onFinish',
      states: 'default · step-active · completed',
      aiPrompt: `Создай FormWizard (React): steps с title, children panels, next/prev, finish. Интеграция со Steps.`,
      variants: [
        { id: 'default', label: 'Default', aiPrompt: `Создай FormWizard: 3 шага, next/prev. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-form-wizard" data-form-wizard>
              <div class="sb-fw-steps">
                <button type="button" class="sb-fw-step is-active" data-step="0">1. Контакты</button>
                <button type="button" class="sb-fw-step" data-step="1">2. Продукт</button>
                <button type="button" class="sb-fw-step" data-step="2">3. Подтверждение</button>
              </div>
              <div class="sb-fw-panel is-active" data-panel="0"><label class="sb-textfield-label">Email</label><input class="form-input" value="buyer@sb.local" /></div>
              <div class="sb-fw-panel" data-panel="1"><label class="sb-textfield-label">Марка</label><input class="form-input" value="PP-H 1200" /></div>
              <div class="sb-fw-panel" data-panel="2"><p style="margin:0;font-size:14px;color:var(--text-secondary)">Проверьте данные и отправьте заявку.</p></div>
              <div class="sb-fw-actions">
                <button type="button" class="btn btn-secondary btn-s" data-fw-prev disabled>Назад</button>
                <button type="button" class="btn btn-primary btn-s" data-fw-next>Далее</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    },
    {
      name: 'Fieldset',
      category: 'Form',
      status: 'stable',
      desc: '<strong>Секция формы.</strong> Группировка полей с legend, описанием и рамкой.',
      params: 'legend · description · children · disabled',
      states: 'default · disabled',
      aiPrompt: `Создай Fieldset (React): fieldset + legend + optional description. Пропсы: legend, description, disabled, children.`,
      variants: [
        { id: 'default', label: 'Default', aiPrompt: `Создай Fieldset с legend и полями. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <fieldset class="sb-fieldset">
              <legend class="sb-fieldset-legend">Реквизиты поставщика</legend>
              <p class="sb-fieldset-desc">Данные для договора и счёта-фактуры</p>
              <div class="sb-fieldset-body">
                <label class="sb-textfield-label">ИНН</label>
                <input class="form-input" value="7704678901" style="margin-bottom:12px" />
                <label class="sb-textfield-label">КПП</label>
                <input class="form-input" value="770401001" />
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    `
    },
    {
      name: 'FieldGroup',
      category: 'Form',
      status: 'stable',
      desc: '<strong>Группа полей.</strong> Заголовок, описание, required и layout: столбец, строка или сетка. Без семантической рамки fieldset — для секций формы и адресных блоков.',
      params: 'label · description · required · layout · error · disabled · children',
      states: 'default · error · disabled · layout-vertical · layout-horizontal · layout-grid',
      aiPrompt: `Создай FieldGroup (React): div-обёртка с label, description, error. Пропсы: label, description, required, layout: 'vertical'|'horizontal'|'grid', error, disabled, children. Стили SB, gap 12px.`,
      variants: [
        { id: 'interactive', label: 'Interactive', aiPrompt: `Создай FieldGroup interactive с переключением layout. Без внешних библиотек.` },
        { id: 'horizontal', label: 'Horizontal', aiPrompt: `Создай FieldGroup layout=horizontal compact. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-field-group" data-field-group>
              <div class="sb-field-group-switcher">
                <button type="button" class="btn btn-secondary btn-xs is-active" data-fg-layout="vertical">Столбец</button>
                <button type="button" class="btn btn-secondary btn-xs" data-fg-layout="horizontal">Строка</button>
                <button type="button" class="btn btn-secondary btn-xs" data-fg-layout="grid">Сетка 2×</button>
                <button type="button" class="btn btn-ghost btn-xs" data-fg-toggle-error>Ошибка</button>
              </div>
              <div class="sb-field-group-head">
                <span class="sb-field-group-label">Параметры отгрузки <span class="sb-field-group-required" aria-hidden="true">*</span></span>
                <p class="sb-field-group-desc">Данные для логистики и таможенного оформления</p>
              </div>
              <div class="sb-field-group-body sb-field-group-body--vertical" data-fg-body>
                <div class="sb-field-group-item"><label class="sb-textfield-label">Город</label><input class="form-input" value="Москва" data-fg-input /></div>
                <div class="sb-field-group-item"><label class="sb-textfield-label">Индекс</label><input class="form-input" value="115054" data-fg-input /></div>
                <div class="sb-field-group-item"><label class="sb-textfield-label">Склад</label><input class="form-input" value="РЦ «Южный»" data-fg-input /></div>
              </div>
              <p class="sb-field-group-error" data-fg-error hidden>Укажите корректный индекс и город</p>
            </div>
          </div>
        </div>
        <div data-variant-id="horizontal">
          <span class="showcase-label">Horizontal</span>
          <div class="showcase-demo">
            <div class="sb-field-group sb-field-group--compact">
              <div class="sb-field-group-head"><span class="sb-field-group-label">Контакт</span></div>
              <div class="sb-field-group-body sb-field-group-body--horizontal">
                <div class="sb-field-group-item"><label class="sb-textfield-label">Имя</label><input class="form-input" value="Анна" /></div>
                <div class="sb-field-group-item"><label class="sb-textfield-label">Телефон</label><input class="form-input" value="+7 495 123-45-67" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    },
    {
      name: 'Virtual List',
      category: 'Data display',
      status: 'stable',
      desc: '<strong>Виртуальный список.</strong> Подгрузка элементов при прокрутке (infinite scroll).',
      params: 'items[] · itemHeight · loadMore · hasMore · renderItem',
      states: 'default · loading · end',
      aiPrompt: `Создай VirtualList (React): scroll container, loadMore near bottom, loading spinner.`,
      variants: [
        { id: 'interactive', label: 'Interactive', aiPrompt: `Создай VirtualList infinite scroll. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-virtual-list" data-virtual-list data-total="50"><ul class="sb-virtual-list-inner" data-vl-inner></ul><div class="sb-virtual-list-status" data-vl-status>Загрузка...</div></div>
          </div>
        </div>
      </div> `
    },
    {
      name: 'Affix',
      category: 'Navigation',
      status: 'stable',
      desc: '<strong>Липкий блок.</strong> Закрепление при прокрутке. 2 варианта: header · toolbar.',
      params: 'offsetTop · target · children',
      states: 'default · affixed',
      aiPrompt: `Создай Affix (React): sticky positioning within scroll parent, offsetTop. Стили SB.`,
      variants: [
        { id: 'header', label: 'Sticky header', aiPrompt: `Создай Affix sticky header внутри scroll-контейнера: фильтры/заголовок прилипают к top. Без внешних библиотек.` },
        { id: 'toolbar', label: 'Sticky toolbar', aiPrompt: `Создай Affix toolbar: панель действий (кнопки) sticky при скролле таблицы. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="header">
          <span class="showcase-label">Sticky header</span>
          <div class="showcase-demo">
            <div class="sb-affix-demo" data-affix-demo>
              <div class="sb-affix-scroll">
                <div class="sb-affix-sticky" data-affix>Фильтры: все статусы · март 2026</div>
                <div class="sb-affix-content">
                  <p>Строка данных 1</p><p>Строка данных 2</p><p>Строка данных 3</p><p>Строка данных 4</p>
                  <p>Строка данных 5</p><p>Строка данных 6</p><p>Строка данных 7</p><p>Строка данных 8</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="toolbar">
          <span class="showcase-label">Sticky toolbar</span>
          <div class="showcase-demo">
            <div class="sb-affix-demo" data-affix-demo>
              <div class="sb-affix-scroll">
                <div class="sb-affix-sticky sb-affix-sticky--toolbar">
                  <span>Выбрано: 3</span>
                  <span style="display:flex;gap:6px"><button type="button" class="btn btn-ghost btn-xs">Экспорт</button><button type="button" class="btn btn-primary btn-xs">Согласовать</button></span>
                </div>
                <div class="sb-affix-content">
                  <p>Заявка #A-28491</p><p>Заявка #A-28492</p><p>Заявка #A-28493</p><p>Заявка #A-28494</p>
                  <p>Заявка #A-28495</p><p>Заявка #A-28496</p><p>Заявка #A-28497</p><p>Заявка #A-28498</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    },
    {
      name: 'BackTop',
      category: 'Navigation',
      status: 'stable',
      desc: '<strong>Наверх.</strong> Кнопка возврата к началу. 2 варианта: scroll · visible.',
      params: 'visibilityHeight · onClick · target',
      states: 'hidden · visible',
      aiPrompt: `Создай BackTop (React): fixed button, show after scroll threshold, smooth scroll to top. Стили SB.`,
      variants: [
        { id: 'scroll', label: 'On scroll', aiPrompt: `Создай BackTop: кнопка появляется после scroll &gt; 80px, smooth scroll to top. Без внешних библиотек.` },
        { id: 'visible', label: 'Visible', aiPrompt: `Создай BackTop visible state: круглая кнопка primary с иконкой chevron-up, shadow. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="scroll">
          <span class="showcase-label">On scroll</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-backtop-demo" data-backtop-demo>
              <div class="sb-backtop-scroll" data-backtop-scroll>
                <p style="margin:0 0 8px">Прокрутите вниз ${icon("chevron-down", 14)}</p>
                <div style="height:200px;background:var(--neutral-bg);border-radius:8px;margin-bottom:8px"></div>
                <div style="height:200px;background:var(--neutral-bg);border-radius:8px"></div>
              </div>
              <button type="button" class="sb-backtop-btn" data-backtop-btn hidden aria-label="Наверх">${icon("chevron-up", 14)}</button>
            </div>
          </div>
        </div>
        <div data-variant-id="visible">
          <span class="showcase-label">Visible</span>
          <div class="showcase-demo">
            <div class="sb-backtop-demo sb-backtop-demo--static">
              <div class="sb-backtop-scroll" style="height:120px">
                <p style="margin:0;color:var(--text-secondary);font-size:13px">Контент страницы…</p>
              </div>
              <button type="button" class="sb-backtop-btn" aria-label="Наверх">${icon("chevron-up", 14)}</button>
            </div>
          </div>
        </div>
      </div>
    `
    },
    {
      name: 'Lightbox',
      category: 'Overlay',
      status: 'stable',
      desc: '<strong>Галерея.</strong> Просмотр изображений в полноэкранном оверлее с навигацией.',
      params: 'images[] · open · index · onClose',
      states: 'closed · open',
      aiPrompt: `Создай Lightbox (React): thumbnail grid, fullscreen overlay, prev/next, close on Esc.`,
      variants: [
        { id: 'thumbs', label: 'Thumbnails', aiPrompt: `Создай Lightbox thumbnail grid. Без внешних библиотек.` },
        { id: 'open', label: 'Open', aiPrompt: `Создай Lightbox fullscreen open. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="thumbs">
          <span class="showcase-label">Thumbnails</span>
          <div class="showcase-demo">
            <div class="sb-lightbox" data-lightbox>
              <div class="sb-lightbox-thumbs">
                <button type="button" class="sb-lightbox-thumb" data-img="0" style="background:linear-gradient(135deg,#008f95,#006b74)">1</button>
                <button type="button" class="sb-lightbox-thumb" data-img="1" style="background:linear-gradient(135deg,#1f8f53,#0d6b3a)">2</button>
                <button type="button" class="sb-lightbox-thumb" data-img="2" style="background:linear-gradient(135deg,#e67e22,#c45f12)">3</button>
              </div>
              <div class="sb-lightbox-overlay" data-lightbox-overlay hidden></div>
            </div>
          </div>
        </div>
        <div data-variant-id="open">
          <span class="showcase-label">Open</span>
          <div class="showcase-demo">
            <div style="position:relative;height:200px;border-radius:12px;overflow:hidden;background:#0b2a30;display:flex;align-items:center;justify-content:center;color:#fff">
              <span style="position:absolute;top:12px;right:12px;cursor:pointer">${icon("close", 14)}</span>
              <span style="font-size:14px;opacity:0.8">Изображение 2 / 3</span>
            </div>
          </div>
        </div>
      </div>`
    },
    {
      name: 'Tour',
      category: 'Overlay',
      status: 'stable',
      desc: '<strong>Онбординг-тур.</strong> Пошаговые подсказки с подсветкой элементов интерфейса.',
      params: 'steps[] · open · onFinish · onClose',
      states: 'closed · active',
      aiPrompt: `Создай Tour (React): spotlight overlay, tooltip card, next/prev/skip, step counter.`,
      variants: [
        { id: 'interactive', label: 'Interactive', aiPrompt: `Создай Tour onboarding interactive. Без внешних библиотек.` },
        { id: 'active', label: 'Step active', aiPrompt: `Создай Tour active step с spotlight. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div class="sb-tour-demo" data-tour-demo>
              <button type="button" class="btn btn-primary btn-s" data-tour-start>Запустить тур</button>
              <div class="sb-tour-targets">
                <div class="sb-tour-target" data-tour-step="0">Шаг 1 — Обзор</div>
                <div class="sb-tour-target" data-tour-step="1">Шаг 2 — Фильтры</div>
                <div class="sb-tour-target" data-tour-step="2">Шаг 3 — Действия</div>
              </div>
              <div class="sb-tour-overlay" data-tour-overlay hidden>
                <div class="sb-tour-spotlight" data-tour-spotlight></div>
                <div class="sb-tour-card">
                  <strong data-tour-title>Обзор</strong>
                  <p data-tour-text>Краткий обзор интерфейса портала.</p>
                  <div class="sb-tour-card-actions">
                    <button type="button" class="btn btn-ghost btn-s" data-tour-skip>Пропустить</button>
                    <button type="button" class="btn btn-primary btn-s" data-tour-next>Далее</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="active">
          <span class="showcase-label">Step active</span>
          <div class="showcase-demo">
            <div class="sb-tour-demo" style="position:relative;min-height:160px">
              <div class="sb-tour-target" style="outline:2px solid var(--primary);outline-offset:4px">Шаг 1 — Обзор</div>
              <div class="sb-tour-card" style="margin-top:12px;max-width:280px">
                <strong>Добро пожаловать</strong>
                <p style="margin:6px 0 12px;font-size:13px;color:var(--text-secondary)">Краткий обзор интерфейса портала.</p>
                <div class="sb-tour-card-actions"><button type="button" class="btn btn-primary btn-s">Далее</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>`
    },
    {
      name: 'Result',
      category: 'Overlay',
      status: 'stable',
      desc: '<strong>Результат операции.</strong> Экран успеха, ошибки или ожидания после действия.',
      params: 'status: success|error|info|warning · title · subtitle · extra',
      states: 'default',
      aiPrompt: `Создай Result (React): icon + title + subtitle + extra actions. status variants.`,
      variants: [
        { id: 'success', label: 'Success', aiPrompt: `Создай Result status=success. Без внешних библиотек.` },
        { id: 'error', label: 'Error', aiPrompt: `Создай Result status=error. Без внешних библиотек.` },
        { id: 'info', label: 'Info', aiPrompt: `Создай Result status=info/waiting. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="success">
          <span class="showcase-label">Success</span>
          <div class="showcase-demo">
            <div class="sb-result sb-result--success">
              <div class="sb-result-icon">${icon("check-circle", 28)}</div>
              <h3 class="sb-result-title">Заявка отправлена</h3>
              <p class="sb-result-sub">Номер #A-28491. Менеджер свяжется в течение 2 часов.</p>
              <button class="btn btn-primary btn-s">К заявкам</button>
            </div>
          </div>
        </div>
        <div data-variant-id="error">
          <span class="showcase-label">Error</span>
          <div class="showcase-demo">
            <div class="sb-result sb-result--error">
              <div class="sb-result-icon">${icon("x-circle", 28)}</div>
              <h3 class="sb-result-title">Не удалось сохранить</h3>
              <p class="sb-result-sub">Проверьте подключение и повторите.</p>
              <button class="btn btn-secondary btn-s">Повторить</button>
            </div>
          </div>
        </div>
        <div data-variant-id="info">
          <span class="showcase-label">Info</span>
          <div class="showcase-demo">
            <div class="sb-result sb-result--info">
              <div class="sb-result-icon">${icon("clock", 28)}</div>
              <h3 class="sb-result-title">Обработка</h3>
              <p class="sb-result-sub">Документ на согласовании. До 24 часов.</p>
            </div>
          </div>
        </div>
      </div>`
    }
  ];

  items.forEach(c => components.push(c));
})();
