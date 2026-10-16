/* Low-priority components + live upgrades for static demos */
(function () {
  const upgrades = {
    'SearchInput': {
      status: 'stable',
      desc: '<strong>Строка поиска.</strong> Pill-input с иконкой, очисткой и live-фильтрацией.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-search-input" data-search-input><span class="sb-search-input-icon">${icon("search", 16)}</span><input type="search" class="sb-search-input-field" placeholder="Найти продукцию..." value="полипропилен" /><button type="button" class="sb-search-input-clear" aria-label="Очистить" hidden>${icon("close", 14)}</button></div><p class="sb-search-hint" data-search-hint>Найдено: PP-H 1200, PP R003 EX</p>`
    },
    'Rating': {
      status: 'stable',
      desc: '<strong>Оценка.</strong> Интерактивные звёзды с hover и кликом.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-rating" data-rating data-value="4"><div class="sb-rating-stars" role="radiogroup" aria-label="Оценка"><button type="button" class="sb-rating-star is-on" data-star="1" aria-label="1 звезда">★</button><button type="button" class="sb-rating-star is-on" data-star="2" aria-label="2 звезды">★</button><button type="button" class="sb-rating-star is-on" data-star="3" aria-label="3 звезды">★</button><button type="button" class="sb-rating-star is-on" data-star="4" aria-label="4 звезды">★</button><button type="button" class="sb-rating-star" data-star="5" aria-label="5 звёзд">★</button></div><span class="sb-rating-label" data-rating-label>4 из 5</span></div>`
    },
    'Advanced DataTable': {
      status: 'stable',
      desc: '<strong>Расширенная таблица.</strong> Сортировка, выбор строк, поиск и пагинация.',
      demo: `<div class="live-demo-badge">● Live demo</div><div class="sb-adv-table" data-adv-table><div class="sb-adv-table-toolbar"><input type="search" class="form-input sb-adv-table-search" placeholder="Поиск по названию..." data-adv-search /><span class="sb-adv-table-count" data-adv-count>3 записи</span></div><div class="sb-adv-table-wrap"><table class="sb-adv-table-grid"><thead><tr><th class="sb-adv-th-check"><input type="checkbox" data-adv-select-all aria-label="Выбрать все" /></th><th><button type="button" class="sb-adv-sort" data-sort="name">Название <span>${icon("chevrons-up-down", 14)}</span></button></th><th><button type="button" class="sb-adv-sort is-active" data-sort="cat">Категория <span>${icon("chevron-up", 14)}</span></button></th><th>Статус</th></tr></thead><tbody data-adv-body><tr data-row="PP-H 1200"><td><input type="checkbox" data-adv-row /></td><td><strong>PP-H 1200</strong></td><td data-cat="Полипропилен">Полипропилен</td><td><span class="tag tag-success">В наличии</span></td></tr><tr data-row="HDPE PE100"><td><input type="checkbox" data-adv-row /></td><td><strong>HDPE PE100</strong></td><td data-cat="Полиэтилен">Полиэтилен</td><td><span class="tag tag-warning">Под заказ</span></td></tr><tr data-row="SBS L-1205"><td><input type="checkbox" data-adv-row /></td><td><strong>SBS L-1205</strong></td><td data-cat="Эластомеры">Эластомеры</td><td><span class="tag tag-success">В наличии</span></td></tr></tbody></table></div><div class="sb-adv-table-foot"><button type="button" class="btn btn-ghost btn-s" data-adv-prev disabled>${icon("chevron-left", 14)}</button><span data-adv-page>1 / 1</span><button type="button" class="btn btn-ghost btn-s" data-adv-next disabled>${icon("chevron-right", 14)}</button></div></div>`
    }
  };

  Object.entries(upgrades).forEach(([name, patch]) => {
    const idx = components.findIndex(c => c.name === name);
    if (idx >= 0) Object.assign(components[idx], patch);
  });

  const items = [
    {
      name: 'Table',
      category: 'Data display',
      status: 'stable',
      desc: '<strong>Базовая таблица.</strong> Примитив для списков и отчётов: варианты default/striped/bordered, размеры, выбор строки, числовые колонки и sticky header.',
      params: 'columns[] · rows[] · variant · size · selectable · stickyHeader · caption',
      states: 'default · striped · bordered · row-hover · row-selected · compact · comfortable',
      aiPrompt: `Создай Table (React) — базовый примитив SB design systems. Пропсы: columns: {key, label, align?: 'left'|'right', width?}[], rows, variant: 'default'|'striped'|'bordered', size: 'compact'|'default'|'comfortable', selectable, stickyHeader, caption, onRowSelect. Стили: header #f5f9f9, uppercase 11px, border #d7dee1, hover #fafcfc, selected rgba(0,143,149,0.08).`,
      variants: [
        { id: 'interactive', label: 'Interactive', aiPrompt: `Создай Table interactive variants/sizes. Без внешних библиотек.` },
        { id: 'sticky', label: 'Sticky header', aiPrompt: `Создай Table sticky header. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-table" data-sb-table><div class="sb-table-toolbar"><span class="sb-table-toolbar-label">Вид</span><button type="button" class="btn btn-secondary btn-xs is-active" data-table-variant="default">Default</button><button type="button" class="btn btn-secondary btn-xs" data-table-variant="striped">Striped</button><button type="button" class="btn btn-secondary btn-xs" data-table-variant="bordered">Bordered</button></div><div class="sb-table-scroll"><table class="sb-table-grid"><thead><tr><th>Заявка</th><th>Марка</th><th class="is-numeric">Объём, т</th><th>Статус</th></tr></thead><tbody><tr data-table-row tabindex="0"><td><strong>A-28491</strong></td><td>PP-H 1200</td><td class="is-numeric">50</td><td><span class="tag tag-warning">В работе</span></td></tr><tr data-table-row tabindex="0"><td><strong>A-28490</strong></td><td>HDPE PE100</td><td class="is-numeric">120</td><td><span class="tag tag-success">Одобрено</span></td></tr></tbody></table></div></div>
          </div>
        </div>
        <div data-variant-id="sticky">
          <span class="showcase-label">Sticky header</span>
          <div class="showcase-demo">
            <div class="sb-table sb-table--sticky"><div class="sb-table-scroll"><table class="sb-table-grid"><thead><tr><th>SKU</th><th>Склад</th><th class="is-numeric">Остаток</th></tr></thead><tbody><tr><td>PP-H030</td><td>Москва</td><td class="is-numeric">840</td></tr><tr><td>PE-100X</td><td>Казань</td><td class="is-numeric">512</td></tr><tr><td>EC-RPET</td><td>Екатеринбург</td><td class="is-numeric">220</td></tr></tbody></table></div></div>
          </div>
        </div>
      </div> `
    },
    {
      name: 'Document Viewer',
      category: 'Data display',
      status: 'stable',
      desc: '<strong>Просмотр документа.</strong> Навигация по страницам PDF/скана.',
      params: 'pages[] · currentPage · onPageChange · zoom',
      states: 'default · loading',
      aiPrompt: `Создай DocumentViewer (React): page preview, prev/next, page counter, zoom controls.`,
      variants: [
        { id: 'interactive', label: 'Interactive', aiPrompt: `Создай DocumentViewer pages/zoom. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-doc-viewer" data-doc-viewer data-pages="4"><div class="sb-doc-viewer-toolbar"><button type="button" class="btn btn-ghost btn-s" data-doc-prev>${icon("chevron-left", 14)}</button><span data-doc-page>Стр. 1 / 4</span><button type="button" class="btn btn-ghost btn-s" data-doc-next>${icon("chevron-right", 14)}</button><span class="sb-doc-viewer-spacer"></span><button type="button" class="btn btn-ghost btn-s" data-doc-zoom-out>${icon("minus", 16)}</button><span data-doc-zoom>100%</span><button type="button" class="btn btn-ghost btn-s" data-doc-zoom-in>+</button></div><div class="sb-doc-viewer-page" data-doc-stage>Договор поставки №28491 — страница 1</div></div>
          </div>
        </div>
      </div> `
    },
    {
      name: 'QR Code',
      category: 'Data display',
      status: 'stable',
      desc: '<strong>QR-код.</strong> Генерация кода для ссылки или номера заявки.',
      params: 'value · size · onGenerate · download',
      states: 'default · generated',
      aiPrompt: `Создай QRCode (React): value input, generate button, SVG/canvas display, download.`,
      variants: [
        { id: 'interactive', label: 'Interactive', aiPrompt: `Создай QRCode generate. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-qr" data-qr-code><div class="sb-qr-grid" data-qr-grid aria-hidden="true"></div><input class="form-input" value="https://sb.local/order/A-28491" data-qr-input /><button type="button" class="btn btn-secondary btn-s" data-qr-gen>Обновить QR</button></div>
          </div>
        </div>
      </div> `
    },
    {
      name: 'Barcode',
      category: 'Data display',
      status: 'stable',
      desc: '<strong>Штрихкод.</strong> Визуализация EAN/кодов для склада и маркировки.',
      params: 'value · format · width · height',
      states: 'default',
      aiPrompt: `Создай Barcode display (React): bars from value string, label below.`,
      variants: [
        { id: 'default', label: 'Default', aiPrompt: `Создай Barcode EAN display. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-barcode" data-barcode data-value="4601234567890"><div class="sb-barcode-bars" data-barcode-bars></div><code class="sb-barcode-value">4601234567890</code></div>
          </div>
        </div>
      </div> `
    },
    {
      name: 'Permission Matrix',
      category: 'Data display',
      status: 'stable',
      desc: '<strong>Матрица прав.</strong> Роли ${icon("close", 14)} разрешения в админке.',
      params: 'roles[] · permissions[] · value · onChange',
      states: 'default · modified',
      aiPrompt: `Создай PermissionMatrix (React): table with role columns, permission rows, checkboxes.`,
      variants: [
        { id: 'interactive', label: 'Interactive', aiPrompt: `Создай PermissionMatrix checkboxes. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-perm-matrix" data-perm-matrix><table class="sb-perm-table"><thead><tr><th>Разрешение</th><th>Админ</th><th>Менеджер</th><th>Оператор</th></tr></thead><tbody><tr><td>Просмотр заявок</td><td><input type="checkbox" checked disabled /></td><td><input type="checkbox" checked data-perm /></td><td><input type="checkbox" checked data-perm /></td></tr><tr><td>Редактирование</td><td><input type="checkbox" checked disabled /></td><td><input type="checkbox" checked data-perm /></td><td><input type="checkbox" data-perm /></td></tr><tr><td>Удаление</td><td><input type="checkbox" checked disabled /></td><td><input type="checkbox" data-perm /></td><td><input type="checkbox" data-perm /></td></tr></tbody></table></div>
          </div>
        </div>
      </div> `
    },
    {
      name: 'Watermark',
      category: 'Overlay',
      status: 'stable',
      desc: '<strong>Водяной знак.</strong> Наложение «Конфиденциально» на документ.',
      params: 'text · opacity · angle · visible',
      states: 'default · hidden',
      aiPrompt: `Создай Watermark (React): repeating diagonal text overlay on content area.`,
      variants: [
        { id: 'visible', label: 'Visible', aiPrompt: `Создай Watermark visible на документе. Без внешних библиотек.` },
        { id: 'hidden', label: 'Hidden', aiPrompt: `Создай Watermark hidden toggle off. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="visible">
          <span class="showcase-label">Visible</span>
          <div class="showcase-demo">
            <div class="sb-watermark-wrap" data-watermark>
              <div class="sb-watermark-doc">
                <div class="sb-watermark-layer" data-watermark-layer>
                  <div class="sb-watermark-layer-inner">
                    <span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span>
                    <span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span>
                    <span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span>
                  </div>
                </div>
                <p>Спецификация поставки PP-H 1200.<br/>Объём: 120 т.</p>
              </div>
              <label class="checkbox size-s sb-watermark-toggle"><input type="checkbox" checked data-watermark-toggle /><span>Показать водяной знак</span></label>
            </div>
          </div>
        </div>
        <div data-variant-id="hidden">
          <span class="showcase-label">Hidden</span>
          <div class="showcase-demo">
            <div class="sb-watermark-wrap" data-watermark>
              <div class="sb-watermark-doc">
                <div class="sb-watermark-layer is-hidden" data-watermark-layer>
                  <div class="sb-watermark-layer-inner">
                    <span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span>
                    <span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span>
                    <span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span><span>КОНФИДЕНЦИАЛЬНО</span>
                  </div>
                </div>
                <p>Спецификация поставки PP-H 1200.<br/>Объём: 120 т.</p>
              </div>
              <label class="checkbox size-s sb-watermark-toggle"><input type="checkbox" data-watermark-toggle /><span>Показать водяной знак</span></label>
            </div>
          </div>
        </div>
      </div>`
    },
    {
      name: 'Resizable SplitPane',
      category: 'Layout',
      status: 'stable',
      desc: '<strong>Разделитель панелей.</strong> Список ↔ детали с перетаскиваемой границей.',
      params: 'orientation · defaultSize · minSize · onResize',
      states: 'default · dragging',
      aiPrompt: `Создай SplitPane (React): horizontal/vertical resizable panels, drag handle.`,
      variants: [
        { id: 'default', label: 'Default', aiPrompt: `Создай SplitPane resizable list + details. Без внешних библиотек.` }
      ],
      demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-split-pane" data-split-pane>
              <div class="sb-split-pane-left" data-split-left>
                <div class="sb-split-pane-head">Заявки</div>
                <ul class="sb-split-list">
                  <li class="is-active">#A-28491</li>
                  <li>#A-28490</li>
                  <li>#A-28489</li>
                </ul>
              </div>
              <div class="sb-split-divider" data-split-divider role="separator" aria-orientation="vertical" tabindex="0"></div>
              <div class="sb-split-pane-right" data-split-right>
                <div class="sb-split-pane-head">Детали #A-28491</div>
                <p>Марка: PP-H 1200<br/>Объём: 50 т<br/>Статус: В работе</p>
              </div>
            </div>
          </div>
        </div>
      </div>`
    }
  ];

  items.forEach(c => components.push(c));
})();
